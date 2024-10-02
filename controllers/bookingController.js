const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);
const { Tour, User, Booking } = require('./../models/associations.js');
const catchAsync = require('../utils/catchAsync');
const Email = require('./../utils/email');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findByPk(req.params.tourId);
  console.log(tour);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.image_cover}`]
          },
          unit_amount: tour.price * 100 // Stripe expects amount in cents
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    //* Enables invoice creation For Creating Invoice
    invoice_creation: {
      enabled: true
    }
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createBookingCheckout = async session => {
  const tourId = session.client_reference_id;
  const userId = (
    await User.findOne({ where: { email: session.customer_email } })
  ).id;
  const price = session.amount_total / 100;
  const invoice_id = session.invoice;
  const newBooking = await Booking.create({
    tourId,
    userId,
    price,
    invoice_id
  });
};

const handleInvoicePaymentSuccess = async invoice => {
  const updateBok = await Booking.update(
    { invoice_url: invoice.hosted_invoice_url },
    {
      where: { invoice_id: invoice.id },
      returning: true
    }
  );

  const booking = await Booking.findOne({
    where: {
      invoice_id: invoice.id
    },
    include: [
      { model: User }, // Include the User model
      { model: Tour, attributes: ['name'] } // Include the Tour model with only the 'name' field
    ]
  });
  const url = invoice.hosted_invoice_url;
  const newUser = booking.user;
  const tour = booking.tour.name;

  await new Email(newUser, url, tour).paymentComplite();
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('event', event.type);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle the event types you care about
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful Checkout session
      createBookingCheckout(session);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      // Handle successful invoice payment
      handleInvoicePaymentSuccess(invoice);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

exports.createBooking = catchAsync(async (req, res, next) => {
  const newBooking = Booking.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      booking: newBooking
    }
  });
});
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.id);
  // Tour.findOne({ id: req.params.id })

  if (!booking) {
    return next(new AppError('No tour booking with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Booking, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Await The Query
  const booking = await features.execute();
  // const booking = await Booking.findAll();

  if (!booking) {
    return next(new AppError('No tour booking with found', 404));
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: booking.length,
    data: {
      booking
    }
  });
});

exports.getAllBookingsById = catchAsync(async (req, res, next) => {
  console.log('req', req.user.id);

  const allBooking = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    attributes: ['invoice_url', 'price'],
    include: [
      {
        model: Tour,
        attributes: ['name', 'start_dates', 'image_cover']
      }
    ]
  });
  console.log('allbooking', allBooking);

  res.status(200).json({
    status: 'success',
    results: allBooking.length,
    data: allBooking
  });
});

exports.deleteBooking = factory.deleteOne(Booking);

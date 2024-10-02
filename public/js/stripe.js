/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(`${process.env.STRIPE_PUBLIC_KEY}`);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log('seession', session.data.session.id);

    // 2) Create checkout form + chanre credit card
    window.location.replace(session.data.session.url);
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};

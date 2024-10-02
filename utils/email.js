const nodemailer = require('nodemailer');
const { renderFile } = require('ejs');
const { join } = require('path');

module.exports = class Email {
  constructor(user, url, tour = null) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.tour = tour;
    this.from = `Way Crafter <${process.env.SMTP_FROM}>`;
  }
  // 1) Create a transporter
  newTransport() {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  // 2) Actually send the email
  // Send the actual email
  async send(template, subject) {
    let html;
    // 1) Render HTML based on a pug template
    if (template == 'invoice') {
      html = await renderFile(
        join(`${__dirname}/../views/email/${template}.ejs`),
        {
          firstName: this.firstName,
          url: this.url,
          product_name: this.tour,
          subject
        }
      );
    } else {
      html = await renderFile(
        join(`${__dirname}/../views/email/${template}.ejs`),
        {
          firstName: this.firstName,
          url: this.url,
          subject
        }
      );
    }

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
      // text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome To The TourMate Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
  async paymentComplite() {
    await this.send('invoice', 'Payment Successfully Processed');
  }
};

# TourMate - Tour Booking Web Application

Welcome to **TourMate**, a comprehensive tour booking web application that allows users to book, review, and manage tours seamlessly. This project aims to provide a robust solution for travel enthusiasts to explore various tours and make bookings conveniently.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Project Overview

**TourMate** is built using modern web technologies like Node.js, PostgreSQL, and Stripe for payment integration. It provides a full-fledged booking platform for travel enthusiasts with secure authentication and booking capabilities.

## Features

- 🌟 **User Authentication:** Secure signup and login using JWT.
- 📅 **Tour Booking:** Browse and book tours with detailed tour information.
- 💬 **Review System:** Write reviews for tours and read reviews from other users.
- 💳 **Stripe Payment Integration:** Pay securely using Stripe.
- 🗺️ **Map Integration:** View tour locations on an interactive map.
- 🔍 **Search & Filter:** Find tours by name, location, and other criteria.

## Installation

Follow these instructions to set up the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/OmHirapara/TourMate-Node.js
   cd tourmate
   ```
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Create the config.env file:**

   ```
   Create a config.env file in the root directory and copy the following variables:

    NODE_ENV=development
    PORT=3000
    HOST=localhost
    CONNECTION_STRING=postgres://postgres:<YourPass>@localhost:5432/tourmate

    JWT_SECRET=hola-bola-bola-hola
    JWT_EXPIRES_IN=90d
    JWT_COOKIE_EXPIRES_IN=30

    SMTP_SERVICE=gmail
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_FROM=your-email@example.com
    SMTP_USER=your-email@example.com
    SMTP_PASS=your-smtp-password

    STRIPE_SECRET_KEY=your-stripe-secret-key
    STRIPE_PUBLIC_KEY=your-stripe-public-key
    STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

    Replace your-smtp-password, your-stripe-secret-key, etc., with your actual credentials.
   ```

4. **Create the database:**

- Open your PostgreSQL client and create a database named `tourmate`

## Getting Started

1.  **Start the development server:**

```
npm start
```

2.  **Server will start running at:**

```
http://localhost:3000
```

## Environment Variables

The environment variables used in this project are:

- **`NODE_ENV`**: Environment of the application (development/production).
- **`PORT`**: Port number for the server.
- **`HOST`**: Host address.
- **`CONNECTION_STRING`**: Connection string for PostgreSQL database.
- **`JWT_SECRET`**: Secret key for signing JWT.
- **`JWT_EXPIRES_IN`**: JWT expiration duration.
- **`JWT_COOKIE_EXPIRES_IN`**: Cookie expiration duration.
- **`SMTP_SERVICE`**: SMTP service provider (e.g., gmail).
- **`SMTP_HOST`**: SMTP host address.
- **`SMTP_PORT`**: SMTP port number.
- **`SMTP_FROM`**: Email address from which emails are sent.
- **`SMTP_USER`**: Email address used for SMTP authentication.
- **`SMTP_PASS`**: SMTP authentication password.
- **`STRIPE_SECRET_KEY`**: Secret key for Stripe API.
- **`STRIPE_PUBLIC_KEY`**: Public key for Stripe API.
- **`STRIPE_WEBHOOK_SECRET`**: Webhook secret for Stripe events.

## Technologies Used

The project utilizes a variety of technologies for different functionalities, as outlined below:

- **Backend**:

  - [Node.js](https://nodejs.org/): A JavaScript runtime built on Chrome's V8 JavaScript engine.
  - [Express](https://expressjs.com/): A web framework for Node.js, designed for building web applications and APIs.
  - [PostgreSQL](https://www.postgresql.org/): A powerful, open-source relational database system.
  - [Sequelize](https://sequelize.org/): A promise-based Node.js ORM for PostgreSQL, providing a straightforward API for database operations.

- **Frontend**:

  - [EJS (Embedded JavaScript)](https://ejs.co/): A simple templating language that lets you generate HTML markup with plain JavaScript.
  - [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML): Standard markup language for creating web pages.
  - [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS): Style sheet language for describing the presentation of the document.
  - [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript): A programming language that adds interactivity to websites.

- **Authentication**:

  - [JWT (JSON Web Tokens)](https://jwt.io/): A compact, URL-safe means of representing claims to be transferred between two parties, used for secure authentication.

- **Payments**:

  - [Stripe API](https://stripe.com/docs/api): A set of APIs for handling online payments and managing customer subscriptions.

- **Email**:

  - [Nodemailer](https://nodemailer.com/about/): A module for Node.js applications to send emails using SMTP.

- **Map Services**:
  - [Leaflet](https://leafletjs.com/): An open-source JavaScript library for mobile-friendly interactive maps.

## Contributing

We welcome contributions from the community! Please feel free to raise an issue or submit a pull request. Make sure to follow the project's coding standards and document your changes. Here’s how you can contribute:

1. **Fork the repository.**
2. **Clone your forked repository** to your local machine:
   ```bash
   git clone https://github.com/OmHirapara/TourMate-Node.js
   ```
3. **Create a feature branch** for your new feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
4. **Make your changes** and commit them:
   ```bash
   git commit -m 'Add feature'
   ```
5. **Push to the branch**:
   ```bash
   git push origin feature-name
   ```
6. **Open a Pull Request** on the main repository:
   - Go to the original repository on GitHub.
   - Click on `Pull Requests`.
   - Click on `New Pull Request`.
   - Select your branch and provide a detailed description of your changes.

### Guidelines

- Ensure that your code follows the project's coding standards.
- Write clear, concise commit messages.
- Document your changes in the relevant files.
- If you're adding a new feature, include tests if applicable.

Happy contributing! 🎉

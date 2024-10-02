import '@babel/polyfill';
import { displayMap } from './leaflet.js';
import { login, logout } from './login';
import { signup } from './signup.js';
import { updateSettings } from './updateSetting.js';
import { passwordReset } from './passwordReset.js';
import { forgotPassword } from './forgotPassword.js';
import { bookTour } from './stripe';
import { DeleteReview, PostReview, UpdateReview } from './review.js';

import { showAlert } from './alerts';

const map = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const passwordResetForm = document.querySelector('.form--passwordReset');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const bookBtn = document.getElementById('book-tour');

// Get modal element
const modal = document.querySelectorAll('.reviewModal');
// Get modal element
const modalUpdate = document.querySelectorAll('.updateModal');

const modalDelete = document.querySelectorAll('.deleteModal');
// Review Card Before Post
const reviewBefore = document.getElementById('reviewBefore');
// After
const reviewAfter = document.getElementById('reviewAfter');

// Get the button that opens the modal
// const openModalBtn = document.getElementById('openModalBtn');
const openModalBtns = document.querySelectorAll('.openModalBtn');

const openUpdateModalBtns = document.querySelectorAll('.openUpdateModalBtn');

const openDeleteModalBtns = document.querySelectorAll('.openDeleteModalBtn');

// Get the cancel button inside modal
const cancelBtn = document.querySelectorAll('.cancelBtn');

const cancelUpdateBtn = document.querySelectorAll('.cancelUpdateBtn');

const cancelDeleteBtn = document.querySelectorAll('.cancelDeleteBtn');

// Get all star elements
// const stars = document.querySelectorAll('.star');

// Get post button inside modal
const postBtn = document.querySelectorAll('.postBtn');
const updateBtn = document.querySelectorAll('.updateBtn');
const deleteBtn = document.querySelectorAll('.deleteBtn');

let ratingValue = 0;

// Function to update the stars display
function updateStars(stars, rating) {
  stars.forEach(function(star, index) {
    if (index < rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

// ------For Review
if (openModalBtns) {
  openModalBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      // console.log('index', index);
      modal[index].style.display = 'block';
      const stars = modal[index].querySelectorAll('.star');
      ratingValue = 0; // Reset the rating value when opening a new modal

      // Add event listeners to stars inside the opened modal
      stars.forEach(function(star) {
        star.addEventListener('click', function() {
          ratingValue = parseInt(this.getAttribute('data-value')); // Convert to integer
          updateStars(stars, ratingValue); // Update stars display for current modal
        });

        star.addEventListener('mouseover', function() {
          updateStars(stars, parseInt(this.getAttribute('data-value'))); // Convert to integer
        });

        star.addEventListener('mouseout', function() {
          updateStars(stars, ratingValue); // Reset to the clicked rating when mouse leaves
        });
      });
    });
  });
}
// Close the modal when "CANCEL" button is clicked
if (cancelBtn) {
  cancelBtn.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      modal[index].style.display = 'none';
    });
  });
}

if (postBtn) {
  postBtn.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
      e.target.textContent = 'Posting...';

      // Disable the POST button
      e.target.disabled = true;

      // Disable the corresponding Cancel button
      const modalContent = e.target.closest('.modal-content');
      const cancelButton = modalContent.querySelector('.btn-cancel');
      cancelButton.disabled = true;

      const rating = ratingValue;
      const tourId = this.getAttribute('data-tour-id');
      const textarea = document.querySelector(
        `textarea[data-tour-id="${tourId}"]`
      );
      const review = textarea.value;
      console.log('reviewewfd', rating, tourId, review);

      PostReview(rating, review, tourId);

      // modal[index].style.display = 'none';
    });
  });
}

if (openUpdateModalBtns) {
  openUpdateModalBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      modalUpdate[index].style.display = 'block';
      const stars = modalUpdate[index].querySelectorAll('.star');
      const rating = parseInt(this.getAttribute('data-rating'));
      console.log('rating', rating, typeof rating);

      ratingValue = rating; // Reset the rating value when opening a new modal
      // Add event listeners to stars inside the opened modal
      updateStars(stars, ratingValue);
      stars.forEach(function(star) {
        star.addEventListener('click', function() {
          ratingValue = parseInt(this.getAttribute('data-value')); // Convert to integer
          updateStars(stars, ratingValue); // Update stars display for current modal
        });

        star.addEventListener('mouseover', function() {
          updateStars(stars, parseInt(this.getAttribute('data-value'))); // Convert to integer
        });

        star.addEventListener('mouseout', function() {
          updateStars(stars, ratingValue); // Reset to the clicked rating when mouse leaves
        });
      });
    });
  });
}

if (updateBtn) {
  updateBtn.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
      e.target.textContent = 'Updating...';

      // Disable the POST button
      e.target.disabled = true;

      // Disable the corresponding Cancel button
      const modalContent = e.target.closest('.modal-content');
      const cancelButton = modalContent.querySelector('.btn-cancel');
      cancelButton.disabled = true;
      const reviewId = parseInt(this.getAttribute('data-review-id'));
      const rating = ratingValue;
      const review = modalContent.querySelector('.review').value;
      // console.log('reviewewfd', rating, review, reviewId);

      UpdateReview(rating, review, reviewId);
    });
  });
}

if (cancelUpdateBtn) {
  cancelUpdateBtn.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      modalUpdate[index].style.display = 'none';
    });
  });
}

if (window) {
  // Close modal when clicking outside the modal content
  window.onclick = function(event) {
    modalUpdate.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    modal.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    modalDelete.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  };
}

if (openDeleteModalBtns) {
  openDeleteModalBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      modalDelete[index].style.display = 'block';
    });
  });
}

if (cancelDeleteBtn) {
  cancelDeleteBtn.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      modalDelete[index].style.display = 'none';
    });
  });
}
if (deleteBtn) {
  deleteBtn.forEach((btn, index) => {
    btn.addEventListener('click', function(e) {
      e.target.textContent = 'Deleting...';

      // Disable the POST button
      e.target.disabled = true;

      // Disable the corresponding Cancel button
      const modalContent = e.target.closest('.modal-content-delete');
      console.log('model', modalContent);

      const cancelButton = modalContent.querySelector('.btn-cancel');
      cancelButton.disabled = true;
      const reviewId = parseInt(this.getAttribute('data-review-id'));

      DeleteReview(reviewId);
    });
  });
}

// ----- Other
if (passwordResetForm) {
  passwordResetForm.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password_confirm').value;
    // Extract token from URL
    const path = window.location.pathname;
    console.log('window', window, window.location, path);
    const token = path.split('/').pop();
    console.log('token', token);
    passwordReset(password, password_confirm, token);
  });
}
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log('in');

    forgotPassword(email);
  });
}

if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const loginButton = document.querySelector('.btn--login');
    loginButton.textContent = 'Logging in...'; // Update button text
    loginButton.disabled = true; // Disable the button
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    document.querySelector('.btn--register').textContent = 'SignUp...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const password_confirm = document.getElementById('password_confirm').value;
    signup(email, password, name, password_confirm);
  });
}
if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.btn--update').textContent = 'Updating...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const password_current = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password_confirm').value;
    await updateSettings(
      { password_current, password, password_confirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password_confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

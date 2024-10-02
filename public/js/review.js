/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const PostReview = async (rating, review, tourId) => {
  // showAlert(email);
  try {
    const res = await axios.post('http://localhost:3000/api/v1/reviews', {
      rating,
      review,
      tourId
    });
    // console.log('res', response);
    console.log('dsdfsfsd', res.data.status === 'success');

    if (res.data.status === 'success') {
      showAlert('success', 'Thank You For Your FeedBack!');
      window.setTimeout(() => {
        location.assign('/my-review');
      }, 1500);
    }
    // res.redirect('/login');
  } catch (err) {
    console.log('err', err.response);
    window.setTimeout(() => {
      location.assign('/my-review');
    }, 2500);
    showAlert('error', err.response.data.message);
  }
};

export const UpdateReview = async (rating, review, reviewId) => {
  // showAlert(email);
  try {
    const res = await axios.patch(
      `http://localhost:3000/api/v1/reviews/${reviewId}`,
      {
        rating,
        review
      }
    );

    if (res.data.status === 'success') {
      showAlert('success', 'Update Successful');
      window.setTimeout(() => {
        location.assign('/my-review');
      }, 1500);
    }
    // res.redirect('/login');
  } catch (err) {
    console.log('err', err.response);
    window.setTimeout(() => {
      location.assign('/my-review');
    }, 2500);
    showAlert('error', err.response.data.message);
  }
};

export const DeleteReview = async reviewId => {
  // showAlert(email);
  try {
    const res = await axios.delete(
      `http://localhost:3000/api/v1/reviews/${reviewId}`
    );
    console.log('res', res.data.status);

    if (res.data.status === 'success') {
      showAlert('success', 'Delete Successful');
      window.setTimeout(() => {
        location.assign('/my-review');
      }, 1500);
    }
    // res.redirect('/login');
  } catch (err) {
    console.log('err', err.response);
    window.setTimeout(() => {
      location.assign('/my-review');
    }, 2500);
    showAlert('error', err.response.data.message);
  }
};

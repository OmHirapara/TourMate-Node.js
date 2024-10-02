/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async email => {
  try {
    const res = await axios.post(
      `http://localhost:3000/api/v1/users/forgotPassword`,
      {
        email
      }
    );
    // console.log('res', response);
    console.log('res', res);

    if (res.data.status === 'success') {
      showAlert('success', 'Email Send Successfully TO Your Email');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
    // res.redirect('/login');
  } catch (err) {
    console.log('err', err.response);
    showAlert('error', err.response.data.message);
  }
};

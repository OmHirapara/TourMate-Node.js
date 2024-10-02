/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const passwordReset = async (password, password_confirm, token) => {
  showAlert('token', token);
  try {
    if (!token || token === undefined) {
      showAlert(
        'failure',
        'There Is Some Issue With Token So Please Try Again Later!'
      );
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
      return;
    }
    const res = await axios.patch(
      `http://localhost:3000/api/v1/users/conf/resetPassword/${token}`,
      {
        password,
        password_confirm
      }
    );
    console.log('res', res);

    if (res.data.status === 'success') {
      showAlert('success', 'Password Reset Successfully!');
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

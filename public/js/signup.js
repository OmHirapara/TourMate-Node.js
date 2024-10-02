/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (email, password, name, password_confirm) => {
  // showAlert(email);
  try {
    const res = await axios.post('http://localhost:3000/api/v1/users/signup', {
      name,
      email,
      password,
      password_confirm
    });
    // console.log('res', response);
    
    if (res.data.status === 'success') {
      showAlert('success', 'Sign Up Successfully!');
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

/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success' && type === 'password') {
      showAlert('success', `${type.toUpperCase()} Updated Successfully!`);
      await axios({
        method: 'GET',
        url: 'http://localhost:3000/api/v1/users/logout'
      });
      window.setTimeout(() => location.assign('/'), 1000);
      window.setTimeout(showAlert('success', 'Logged Out successfully!'), 1500);

      //   window.setTimeout(async () => {
      //     const res =

      //     if (res.data.status === 'success') {
      //       showAlert('success', 'Logged Out successfully!');
      //       window.setTimeout(() => {
      //         location.assign('/');
      //         // location.reload('/');
      //       }, 1500);
      //       return;
      //     }
      //   }, 2000);
    }
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Successfully!`);
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

/* eslint-disable */
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  let icon;
  // console.log('type', type === 'success', type);

  if (type === 'success') {
    icon =
      '  <div class="success-symbol" style="width: 20px;height: 20px; margin-right: 10px; "><img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Eo_circle_green_checkmark.svg" alt="Success" /></div> ';
  } else {
    icon =
      '  <div class="success-symbol" style="width: 20px;height: 20px; margin-right: 10px; "><img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Cross_red_circle.svg" alt="Success" /></div> ';
  }
  // console.log('icon', icon);

  const markup = `<div class="alert alert--${type}">${icon} ${msg} </div>`;
  // console.log('msg', type, msg);

  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 2500);
};

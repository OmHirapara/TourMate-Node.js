document.addEventListener('DOMContentLoaded', function() {
  const passwordInput = document.getElementById('password');
  const passwordHint = document.querySelector('.password-hint');
  const confirmPassword = document.getElementById('password_confirm');
  const errorMessage = document.querySelector('.error-message');
  const resetBtn = document.getElementById('resetBtn');

  if (!passwordInput || !passwordHint) {
    // console.error('Password input or password hint not found.');
    return;
  }

  passwordInput.addEventListener('input', function() {
    const value = passwordInput.value;
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
      value
    );

    if (isValid) {
      passwordInput.style.borderBottom = '3px solid #55c57a'; // Green for valid
      passwordHint.style.display = 'none'; // Hide error message
    } else {
      passwordInput.style.borderBottom = '3px solid #ff7730'; // Orange for invalid
      passwordHint.style.display = 'block'; // Show error message
    }
  });

  passwordInput.addEventListener('blur', function() {
    // Reset border style when input loses focus if invalid
    // if (!passwordInput.value || passwordInput.checkValidity()) {
    //   passwordInput.style.borderBottom = ''; // Reset to original style
    // }
    // passwordHint.style.display = 'none'; // Hide error message
  });

  confirmPassword.addEventListener('input', function() {
    // Check if passwords match
    if (passwordInput.value !== confirmPassword.value) {
      confirmPassword.style.borderBottom = '3px solid #ff7730'; // Orange for invalid
      errorMessage.style.display = 'block';
      resetBtn.disabled = true; // Disable button
    } else {
      confirmPassword.style.borderBottom = '3px solid #55c57a'; // Green for valid
      errorMessage.style.display = 'none';
      resetBtn.disabled = false; // Enable button
    }
  });

  confirmPassword.addEventListener('blur', function() {
    // Reset border style when input loses focus if invalid
    // confirmPassword.style.borderBottom = ''; // Reset to original style
  });
});

function validateForm() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('password_confirm').value;
  const errorMessage = document.querySelector('.error-message');

  // Regular expression for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  // Check if password meets the criteria
  if (!passwordRegex.test(password)) {
    alert(
      'Password must contain a minimum of 8 and a maximum of 20 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
    return false;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    errorMessage.style.display = 'block';
    return false;
  } else {
    errorMessage.style.display = 'none';
  }

  return true; // Allow form submission
}

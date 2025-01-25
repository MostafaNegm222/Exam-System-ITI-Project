document.getElementById('firstName').addEventListener('blur', function () {
    const error = document.getElementById('firstNameError');
    if (this.value.trim() === '') {
      error.textContent = 'Filed is required.';
    } else if (!isNaN(this.value)) {
      error.textContent = 'it is must be characters only.';
    }
    else {
      error.textContent = '';
    }
  });
  
  document.getElementById('lastName').addEventListener('blur', function () {
    const error = document.getElementById('lastNameError');
    if (this.value.trim() === '') {
      error.textContent = 'Filed is required.';
    } else if (!isNaN(this.value)) {
      error.textContent = 'it is must be characters only.';
    }
    else {
      error.textContent = '';
    }
  });

  document.getElementById('email').addEventListener('blur', function () {
    const error = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value.trim() === ''){
      error.textContent = 'Filed is required.';
    }
    else if (!emailRegex.test(this.value.trim())) {
      error.textContent = 'Please enter a valid email.';
    } else {
      error.textContent = '';
    }
  });
  
  document.getElementById('password').addEventListener('blur', function () {
    const error = document.getElementById('passwordError');
    if (this.value.length < 8) {
      error.textContent = 'Password must be at least 8 characters.';
    } else {
      error.textContent = '';
    }
  });
  
  document.getElementById('confirmPassword').addEventListener('blur', function () {
    const password = document.getElementById('password').value;
    const error = document.getElementById('confirmPasswordError');
    if (this.value !== password) {
      error.textContent = 'Passwords do not match.';
    } else {
      error.textContent = '';
    }
  });
  
  document.getElementById('signUpForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const message = document.getElementById('signUpMessage');
  
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      message.textContent = 'All fields are required.';
      message.className = 'error';
      return;
    }
  
    if (password !== confirmPassword) {
      message.textContent = 'Passwords do not match.';
      message.className = 'error';
      return;
    }
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
      message.textContent = 'User with this email already exists.';
      message.className = 'error';
      return;
    }
  
    users.push({ firstName,lastName, email, password });
    localStorage.setItem('users', JSON.stringify(users));
  
    message.textContent = 'User registered successfully!';
    message.className = 'success';
    this.reset();
    window.location.replace(`/pages/login.html`)
  });

  document.querySelector('.login').addEventListener('click' , function () {
    window.location.href = `/pages/login.html`
  })
  
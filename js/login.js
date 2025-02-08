document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const message = document.getElementById('loginMessage');
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);
  
    if (!user) {
      message.textContent = 'Invalid Email or password.';
      message.className = 'error';
    } else if (user.password !== password) {
      message.textContent = 'Invalid Email or password.';
      message.className = 'error';
    } else {
        window.location.replace(`chooseExam.html`)
        sessionStorage.setItem('currentUser' , `${user.firstName} ${user.lastName}`)
    }
  });

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
      // message.textContent = 'Login successful!';
      // message.className = 'success';
      // window.location.replace(`startExam.html`)
      Swal.fire({
        title: "Success",
        text: "Successful Register",
        icon: "success",
        confirmButtonColor: "rgba(165, 56, 53, 1)"
      });
      setTimeout(() => {
        window.location.replace(`chooseExam.html`)
      }, 3000);
      sessionStorage.setItem('currentUser' , `${user.firstName} ${user.lastName}`)
    }
  });

  document.querySelector('.signup').addEventListener('click' , function () {
    window.location.href = `../index.html`
  })
  
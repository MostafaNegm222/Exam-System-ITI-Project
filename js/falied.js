document.querySelector('.logout').addEventListener('click' , function () {
    sessionStorage.clear()
    window.location.replace("login.html")
})
document.querySelector('.back').addEventListener('click' , function () {
    sessionStorage.removeItem("category")
    window.location.replace('chooseExam.html')
})
document.querySelector('.result-container h4').innerHTML = `Sorry ${sessionStorage.getItem('currentUser')}! <span>you failed in the exam</span>`;
document.querySelector('.grad span').innerHTML = `${sessionStorage.getItem('percentage')}%`
switch (sessionStorage.getItem('percentage')) {
case '10' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star-half"></i>`
    break;
    case '20' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>`
    break;
    case '30' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                 <i class="fa-solid fa-star-half"></i>`
    break;
    case '40' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>`
    break;
}
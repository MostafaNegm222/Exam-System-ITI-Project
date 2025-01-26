document.querySelector('.logout').addEventListener('click' , function () {
    sessionStorage.clear()
    window.location.replace("login.html")
})
document.querySelector('.back').addEventListener('click' , function () {
    sessionStorage.removeItem("category")
    window.location.replace('chooseExam.html')
})
document.querySelector('.result-container h4').innerHTML = `Congratulations ${sessionStorage.getItem('currentUser')}! <span>you pass the exam</span>`;
document.querySelector('.grad span').innerHTML = `${sessionStorage.getItem('percentage')}%`
switch (sessionStorage.getItem('percentage')) {
    case '50' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star-half"></i>`
    break;
    case '60' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>`
    break;
    case '70' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star-half"></i>`
    break;
    case '80' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>`
    break;
    case '90' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star-half"></i>`
    break;
    case '100' :
    document.querySelector('.stars').innerHTML = `<i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>
                                                <i class="fa-solid fa-star"></i>`
    break;
}
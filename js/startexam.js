document.querySelector('.start-exam').addEventListener('click' , function () {
    window.location.replace("./exam.html")
})
document.querySelector('.back').addEventListener('click' , function () {
    window.location.replace("./chooseExam.html")
})
document.querySelector('.logout').addEventListener('click' , function () {
    sessionStorage.clear()
    window.location.replace("./login.html")
})

document.querySelector(".header-container + h2").innerHTML = `${sessionStorage.getItem("category")} Exam`

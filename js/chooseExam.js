document.querySelector('.html').addEventListener('click' , function () {
    sessionStorage.setItem('category' , 'html')
    window.location.replace('./startexam.html')
})
document.querySelector('.css').addEventListener('click' , function () {
    sessionStorage.setItem('category' , 'css')
    window.location.replace('./startexam.html')
})
document.querySelector('.js').addEventListener('click' , function () {
    sessionStorage.setItem('category' , 'js')
    window.location.replace('./startexam.html')
})
document.querySelector('.logout').addEventListener('click' , function () {
    sessionStorage.clear()
    window.location.replace("./login.html")
})

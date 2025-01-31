function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.style.setProperty("--main-background", "rgba(27, 27, 27, 1)");
        document.documentElement.style.setProperty("--input-color", "rgba(27, 27, 27, 1)");
        document.documentElement.style.setProperty("--main-text", "rgb(255, 255, 255)");
        document.documentElement.style.setProperty("--section-background", "rgba(19, 19, 19, 1)");
        document.documentElement.style.setProperty("--alt-text", "rgb(176, 176, 176)");
        document.documentElement.style.setProperty("--button", "rgb(255, 255, 255)");

        document.querySelectorAll("input:not([type='submit'])").forEach(ele => ele.style.color = "#fff");
        document.querySelectorAll("a:not(.login)").forEach(ele => ele.style.color = "#fff");

        const themeButton = document.querySelector(".theme-toggle");
        themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        themeButton.style.backgroundColor = "#fff";
        themeButton.style.color = "rgba(184, 63, 59, 1)";
        themeButton.classList.remove("light");
        themeButton.classList.add("dark");

        document.querySelector(".container img").src = '../images/dark logo.png';
    } else {
        document.documentElement.style.setProperty("--main-background", "rgba(241, 241, 241, 1)");
        document.documentElement.style.setProperty("--input-color", "#fff");
        document.documentElement.style.setProperty("--main-text", "#000");
        document.documentElement.style.setProperty("--section-background", "#fff");
        document.documentElement.style.setProperty("--button", "rgb(255, 255, 255)");

        document.querySelectorAll("input:not([type='submit'])").forEach(ele => ele.style.color = "#000");

       
        document.querySelectorAll("a:not(.login)").forEach(ele => ele.style.color = "#000");
        const themeButton = document.querySelector(".theme-toggle");
        themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        themeButton.style.backgroundColor = "#fff";
        themeButton.style.color = "rgba(184, 63, 59, 1)";
        themeButton.classList.remove("dark");
        themeButton.classList.add("light");

        document.querySelector(".container img").src = '../images/ColoredLogo 1.png';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
        savedTheme = "light"; 
        localStorage.setItem("theme", savedTheme);
    }
    applyTheme(savedTheme);
});

document.addEventListener("click", function (e) {
    const themeToggleBtn = e.target.closest(".theme-toggle");
    if (themeToggleBtn) {
        let newTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    }
});
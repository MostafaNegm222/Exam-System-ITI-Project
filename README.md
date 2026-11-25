# Online Exam System (ITI Project)

## 1. Description

A browser-based exam platform built with plain HTML, CSS and JavaScript, with no framework and no backend. Users create an account, pick an exam (HTML, CSS or JavaScript), answer timed multiple-choice questions and get a pass or fail result with a score. Built as an ITI front-end training project.

## 2. Technologies and Versions

- HTML5, CSS3 and vanilla JavaScript (ES6 classes, `fetch`, `localStorage`, `sessionStorage`)
- Font Awesome (icons)
- Node.js built-in test runner for the question-bank tests (no external test dependencies)

## 3. Requirements and Dependencies

- A modern web browser
- Any static web server to run it (pages use root-relative paths), e.g. `npx serve` or `python3 -m http.server`
- No package dependencies for the app itself

## 4. Installation and Run Steps

```bash
git clone https://github.com/MostafaNegm222/Exam-System-ITI-Project.git
cd Exam-System-ITI-Project
npx serve .
# or: python3 -m http.server 8000
```

Open the address it prints (for example `http://localhost:8000`), sign up, log in and pick an exam.

## 5. Environment Variables

None required. All data lives in the browser (`localStorage`), so accounts exist only on that browser.

## 6. Usage and Main Features

- **Sign up and log in** with full form validation (required fields, names cannot be only numbers, valid email, password of at least 8 characters, matching confirmation).
- **Choose an exam:** HTML, CSS or JavaScript, each with 10 multiple-choice questions loaded from `questions/*.json`.
- **Take the exam:** questions in random order with a countdown timer (2 minutes, the timer changes style in the last 30 seconds); move between questions, answers are kept when going back; flag questions for review and jump back to them from the flagged list.
- **Result:** 50% or more opens the success page (percentage, star rating, sound); below 50% opens the failure page; running out of time has its own page.
- **Light and dark theme**, remembered in `localStorage`.
- Error page when the questions cannot be loaded.

## 7. Screenshots / Demo

No live demo; serve the folder locally (section 4).

## 8. Running Tests

```bash
npm test
```

`node --test tests/questions.test.js` checks the three question banks: every question has a title, at least two distinct answers, exactly one correct answer, and no repeated titles. The page scripts talk to the DOM directly, so they are not unit tested.

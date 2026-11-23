# Online Exam System (ITI Project)

A browser-based exam platform built with plain HTML, CSS and JavaScript, with no framework and no backend. Users create an account, pick an exam (HTML, CSS or JavaScript), answer timed multiple-choice questions and get a pass or fail result with a score.

## What it does

- **Sign up and log in.** Form validation on every field (required, names cannot be only numbers, valid email, password of at least 8 characters, matching confirmation). Accounts are stored in the browser's `localStorage`, so they exist only on that browser.
- **Choose an exam.** HTML, CSS or JavaScript, each with 10 multiple-choice questions loaded from `questions/*.json`.
- **Take the exam.** Questions appear in random order with a countdown timer (2 minutes in total, the timer changes style in the last 30 seconds). You can move to the next and previous question, and your answers are kept when you go back.
- **Flag questions.** Mark a question for review and jump back to it from the flagged list.
- **Result.** A score of 50% or more opens the success page (percentage, star rating and a success sound). Below 50% opens the failure page (with its own sound). Running out of time has its own page.
- **Light and dark theme**, remembered in `localStorage`.
- Error page when the questions cannot be loaded.

## Tech stack

HTML5, CSS3 and vanilla JavaScript (ES6 classes, `fetch`, `localStorage`, `sessionStorage`). Font Awesome icons. Tests use the Node.js built-in test runner.

## Project structure

```
├── index.html        # Sign-up page (entry point)
├── pages/            # login, chooseExam, startexam, exam, success, failed, timeout, error
├── js/               # One script per page (+ theme.js)
├── styles/           # One stylesheet per page (+ global.css)
├── questions/        # htmlQuestion.json, cssQuestion.json, jsQuestion.json
├── audios/  images/  # Sound effects and artwork
└── tests/            # Question data tests
```

## Run it

The pages link to each other with root-relative paths, so serve the folder from a web server instead of opening the file directly:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open the address it prints (for example `http://localhost:8000`), sign up, log in and pick an exam.

## Tests

```bash
npm test
```

6 tests with the built-in Node runner check the three question banks: every question has a title, at least two distinct answers, exactly one correct answer, and titles are not repeated. The page scripts talk to the DOM directly, so they are not unit tested.

## Limits

This is a front-end training project. Passwords are saved in plain text in `localStorage`, and there is no server, so it is not meant for real users.

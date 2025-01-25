// Selectors
let countSpan = document.querySelector(".quiz-info .count span");
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let previousButton = document.querySelector('.previous-button');
let nextButton = document.querySelector('.next-button');
let submitButton = document.querySelector('.submit-button');
let resultsContainer = document.querySelector('.results');
let countdownElements = document.querySelector('.countdown');
let flaggedContainer = document.querySelector('.flagged-questions');

// Variables
let currentIndex = 0;
let rightAnswers = 0;
let totalDuration = 120; // Total duration in seconds
let countdownInterval;
let flaggedQuestions = []; // Array to store indices of flagged questions
let questionsArray = [];   // Array to store Question instances
let userAnswers = [];      // Array to store user's answers

// Question Class
class Question {
    constructor(data) {
        this.title = data.title;
        this.answers = data.answers; // Array of answer objects
    }

    // Method to get the correct answer
    getCorrectAnswer() {
        let correctAnswerObj = this.answers.find(answer => answer.is_true_answer);
        return correctAnswerObj ? correctAnswerObj.answer : null;
    }
}

// Main function to get questions
function getQuestion() {
    // Show loading state
    resultsContainer.innerHTML = '<span class="loading">Loading questions...</span>';

    fetch("/questions/htmlQuestion.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            // Clear loading message
            resultsContainer.innerHTML = '';

            // Check if data is empty
            if (!data || data.length === 0) {
                resultsContainer.innerHTML = `<span class='error'>No questions available at the moment. Please check back later.</span>`;
                return; // Stop execution
            }

            // Create Question instances and store in questionsArray
            data.forEach(item => {
                let question = new Question(item);
                questionsArray.push(question);
            });
            let questionCount = questionsArray.length;

            // Update question count
            countSpan.innerHTML = questionCount;

            // Shuffle questions
            shuffle(questionsArray);

            // Display the first question
            addQuestionData(questionsArray[currentIndex], questionCount);

            // Start the countdown
            countdown(totalDuration);

            // Handle Next button click
            nextButton.onclick = () => {
                // Save the user's answer
                saveUserAnswer();

                if (currentIndex < questionCount - 1) {
                    currentIndex++;
                    displayQuestion(questionCount);
                }
            };

            // Handle Previous button click
            previousButton.onclick = () => {
                // Save the user's answer
                saveUserAnswer();

                if (currentIndex > 0) {
                    currentIndex--;
                    displayQuestion(questionCount);
                }
            };

            // Handle Submit button click
            submitButton.onclick = () => {
                // Save the user's answer
                saveUserAnswer();

                // Check all answers
                checkAllAnswers();

                // Calculate percentage score
                let percentage = (rightAnswers / questionsArray.length) * 100;

                // Save percentage in sessionStorage
                sessionStorage.setItem('percentage', percentage);

                // Clear the countdown
                clearInterval(countdownInterval);

                // Redirect to the appropriate page based on the score
                if (percentage >= 50) {
                    window.location.replace(`success.html`);
                } else {
                    window.location.replace(`failed.html`);
                }
            };
        })
        .catch(error => {
            // Clear loading message
            resultsContainer.innerHTML = '';

            console.error('There was a problem with the fetch operation:', error);
            // Handle error state
            window.location.replace(`error.html`)
        });
}
getQuestion();

// Function to display a question
function addQuestionData(questionObj, count) {
    // Clear previous content
    quizArea.innerHTML = "";
    answersArea.innerHTML = "";

    // Create question title
    let questionTitle = document.createElement('h2');
    let questionText = document.createTextNode(questionObj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    // Create answers
    questionObj.answers.forEach((answerObj, index) => {
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";

        let radioInput = document.createElement("input");
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${index + 1}`;
        radioInput.dataset.answer = answerObj.answer;

        // Check if this answer was previously selected by the user
        if (userAnswers[currentIndex] === answerObj.answer) {
            radioInput.checked = true;
        }

        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${index + 1}`;
        let labelText = document.createTextNode(answerObj.answer);
        theLabel.appendChild(labelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        answersArea.appendChild(mainDiv);
    });

    // Add Flag Question button
    let flagButton = document.createElement('button');
    flagButton.textContent = 'Flag Question';
    flagButton.className = 'flag-button';
    quizArea.appendChild(flagButton);

    // Check if this question is already flagged
    if (flaggedQuestions.includes(currentIndex)) {
        // Change button text to 'Unflag Question'
        flagButton.textContent = 'Unflag Question';
    }

    // Handle flag button click
    flagButton.onclick = () => {
        // Toggle flag
        if (flaggedQuestions.includes(currentIndex)) {
            // Unflag
            unflagQuestion(currentIndex);
            flagButton.textContent = 'Flag Question';
        } else {
            // Flag
            flagQuestion(currentIndex);
            flagButton.textContent = 'Unflag Question';
        }
    };

    // Update buttons visibility
    updateNavigationButtons(count);
}

// Function to display the current question
function displayQuestion(count) {
    addQuestionData(questionsArray[currentIndex], count);
}

// Function to save user's answer
function saveUserAnswer() {
    let answers = document.getElementsByName('question');
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            userAnswers[currentIndex] = answers[i].dataset.answer;
            break;
        }
    }
}

// Function to flag a question
function flagQuestion(index) {
    if (!flaggedQuestions.includes(index)) {
        flaggedQuestions.push(index);
        updateFlaggedQuestionsUI();
    }
}

// Function to unflag a question
function unflagQuestion(index) {
    let idx = flaggedQuestions.indexOf(index);
    if (idx !== -1) {
        flaggedQuestions.splice(idx, 1);
        updateFlaggedQuestionsUI();
    }
}

// Function to update the flagged questions container UI
function updateFlaggedQuestionsUI() {
    // Clear current content
    flaggedContainer.innerHTML = '';

    // Loop over flaggedQuestions and create elements
    flaggedQuestions.forEach((questionIndex) => {
        let flaggedItem = document.createElement('div');
        flaggedItem.className = 'flagged-item';

        // Create question title link
        let questionLink = document.createElement('a');
        questionLink.href = '#';
        questionLink.textContent = `Question ${questionIndex + 1}`;
        questionLink.onclick = (e) => {
            e.preventDefault();
            // Navigate to the question
            navigateToQuestion(questionIndex);
        };

        // Create delete button
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            // Unflag the question
            unflagQuestion(questionIndex);
            // If we are currently viewing this question, update the flag button
            if (currentIndex === questionIndex) {
                let flagButton = document.querySelector('.flag-button');
                if (flagButton) {
                    flagButton.textContent = 'Flag Question';
                }
            }
        };

        // Append to flaggedItem
        flaggedItem.appendChild(questionLink);
        flaggedItem.appendChild(deleteButton);

        // Append to flaggedContainer
        flaggedContainer.appendChild(flaggedItem);
    });
}

// Function to navigate to a specific question
function navigateToQuestion(index) {
    if (index >= 0 && index < questionsArray.length) {
        // Save current answer before navigating
        saveUserAnswer();

        // Set currentIndex
        currentIndex = index;
        displayQuestion(questionsArray.length);
    }
}

// Function to update navigation buttons visibility
function updateNavigationButtons(count) {
    // Show or hide Previous button
    if (currentIndex > 0) {
        previousButton.style.display = 'inline-block';
    } else {
        previousButton.style.display = 'none';
    }

    // Show or hide Next button
    if (currentIndex < count - 1) {
        nextButton.style.display = 'inline-block';
    } else {
        nextButton.style.display = 'none';
    }

    // Always display Submit button
    submitButton.style.display = 'inline-block';
}

// Function to check all answers
function checkAllAnswers() {
    rightAnswers = 0; // Reset right answers count

    // Loop through each question
    questionsArray.forEach((questionObj, index) => {
        let correctAnswer = questionObj.getCorrectAnswer();
        let userAnswer = userAnswers[index];

        // Check if the answer is correct
        if (userAnswer === correctAnswer) {
            rightAnswers++;
        }
    });
}

// Function to show results
function showResults(count) {
    // Remove quiz elements
    quizArea.remove();
    answersArea.remove();
    previousButton.remove();
    nextButton.remove();
    submitButton.remove();

    // Calculate percentage score
    let percentage = (rightAnswers / count) * 100;

    // Save percentage in sessionStorage
    sessionStorage.setItem('percentage', percentage);

    // Redirect to the appropriate page based on the score
    if (percentage >= 50) {
        window.location.replace(`success.html`);
    } else {
        window.location.replace(`failed.html`);
    }

    // Remove flagged questions container
    flaggedContainer.remove();
}

// Countdown function
function countdown(duration) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        countdownElements.innerHTML = `${minutes}:${seconds}`;

        if (--duration < 0) {
            clearInterval(countdownInterval);

            // Time is up, save the user's answer
            saveUserAnswer();

            // Check all answers
            checkAllAnswers();

            // Calculate percentage score
            let percentage = (rightAnswers / questionsArray.length) * 100;

            // Save percentage in sessionStorage
            sessionStorage.setItem('percentage', percentage);

            // Redirect to timeout page
            window.location.replace(`timeout.html`);
        }

    }, 1000);
}

// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
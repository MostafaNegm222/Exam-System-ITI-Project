// Selectors
let countSpan = document.querySelector(".quiz-info .count span");
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let previousButton = document.querySelector('.previous-button');
let nextButton = document.querySelector('.next-button');
let submitButton = document.querySelector('.submit-button');
let countdownElements = document.querySelector('.countdown');
let flaggedContainer = document.querySelector('.flagged-questions');
let categorySpan = document.querySelector('.category span')

// Variables
let currentIndex = 0;
let rightAnswers = 0;
let totalDuration = 120; // Total duration in seconds
let countdownInterval;
let flaggedQuestions = []; // Array to store indices of flagged questions
let questionsArray = [];   // Array to store Question instances
let userAnswers = [];      // Array to store user's answers
let questionsFile = sessionStorage.getItem('category')

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
    quizArea.innerHTML = '<span class="loading">Loading questions...</span>';

    fetch(`../questions/${questionsFile}Question.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            // Clear loading message
            quizArea.innerHTML = '';

            // Check if data is empty
            if (!data || data.length === 0) {
                quizArea.innerHTML = `<span class='error'>No questions available at the moment. Please check back later.</span>`;
                return; 
            }

            // Create Question instances and store in questionsArray
            data.forEach(item => {
                let question = new Question(item);
                questionsArray.push(question);
            });
            let questionCount = questionsArray.length;
            
            shuffle(questionsArray);

            // Display the first question
            addQuestionData(questionsArray[currentIndex], questionCount);

            // Start the countdown
            countdown(totalDuration);

            nextButton.onclick = () => {
                saveUserAnswer();
                if (currentIndex < questionCount - 1) {
                    currentIndex++;
                    displayQuestion(questionCount);
                }
            };

            previousButton.onclick = () => {
                saveUserAnswer();
                if (currentIndex > 0) {
                    currentIndex--;
                    displayQuestion(questionCount);
                }
            };

            submitButton.onclick = () => {
                saveUserAnswer();
                checkAllAnswers();

                // Calculate percentage score
                let percentage = (rightAnswers / questionsArray.length) * 100;
                sessionStorage.setItem('percentage', percentage);

                // Clear the countdown
                clearInterval(countdownInterval);

                // Redirect to the appropriate page based on the score
                if (percentage >= 50) {
                    window.location.replace(`./success.html`);
                } else {
                    window.location.replace(`./failed.html`);
                }
            };
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            // Handle error state
            window.location.replace(`./error.html`)
        });

        categorySpan.innerHTML = questionsFile.toUpperCase()
}
getQuestion();

// Function to display a question
function addQuestionData(questionObj, count) {
    // Clear previous content
    quizArea.innerHTML = "";
    answersArea.innerHTML = "";

    // show the number of question
    countSpan.innerHTML = `${currentIndex + 1} / ${count}`;

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

    // Add Flag Question icon
    let flagButton = document.createElement('i');
    flagButton.className = 'flag-button fa-regular fa-flag';
    quizArea.appendChild(flagButton);

    // Check if this question is already flagged
    if (flaggedQuestions.includes(currentIndex)) {
        // Change button text to 'Unflag icon'
        flagButton.className = 'flag-button fa-solid fa-flag';
    }

    // Handle flag button click
    flagButton.onclick = () => {
        // Toggle flag
        if (flaggedQuestions.includes(currentIndex)) {
            // Unflag
            unflagQuestion(currentIndex);
            flagButton.className = 'flag-button fa-regular fa-flag';
            if (flaggedQuestions.length == 0) {  // ---> fix bug to show empty container
                flaggedContainer.innerHTML = 'No Flagged Questions'
            }
            
        } else {
            // Flag
            flagQuestion(currentIndex);
            flagButton.className = 'flag-button fa-solid fa-flag';
        }
    };

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
        let questionLink = document.createElement('span');
        if (localStorage.getItem("theme") == "dark") {
        } else {
            questionLink.classList.remove("link-dark")
        }
        questionLink.textContent = `Question ${questionIndex + 1}`;
        questionLink.onclick = (e) => {
            e.preventDefault();
            // Navigate to the question
            navigateToQuestion(questionIndex);
        };

        // Create delete icon
        let deleteButton = document.createElement('i');
        deleteButton.className = 'delete-button fa-solid fa-trash';
        deleteButton.onclick = () => {
            // Unflag the question
            unflagQuestion(questionIndex);
            // If we are currently viewing this question, update the flag button
            if (currentIndex === questionIndex) {
                let flagButton = document.querySelector('.flag-button');
                if (flagButton) {
                    flagButton.className = 'flag-button fa-regular fa-flag';
                }
            }
            if (flaggedQuestions.length == 0) {
                flaggedContainer.innerHTML = 'No Flagged Questions'
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
        previousButton.disabled = false;
    } else {
        previousButton.disabled = true;
    }
    
    // Show or hide Next button
    if (currentIndex < count - 1) {
        nextButton.disabled = false;
    } else {
        nextButton.disabled = true;
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

// Countdown function
function countdown(duration) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        countdownElements.innerHTML = `${minutes}:${seconds}`;
        if (duration <= 30) {
            countdownElements.classList.add('timed')
        }
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
            window.location.replace(`./timeout.html`);
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

document.querySelector('.logout').addEventListener('click' , function () {
    sessionStorage.clear()
    window.location.replace("./login.html")
})

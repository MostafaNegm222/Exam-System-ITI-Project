// Selectors
let countSpan = document.querySelector(".quiz-info .count span");
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let previousButton = document.querySelector('.previous-button'); // New selector for Previous button
let nextButton = document.querySelector('.next-button');         // New selector for Next button
let submitButton = document.querySelector('.submit-button');
let resultsContainer = document.querySelector('.results');
let countdownElements = document.querySelector('.countdown');
let flaggedContainer = document.querySelector('.flagged-questions'); // Selector for flagged questions container

// Variables
let currentIndex = 0;
let rightAnswers = 0;
let totalDuration = 120; // 3 minutes in seconds
let countdownInterval;
let flaggedQuestions = []; // Array to store indices of flagged questions
let questionObject = [];  // Store questions after getting from server
let userAnswers = [];    // Array to store user's answers

// Main function to get questions
function getQuestion() {
    // Show loading state
    resultsContainer.innerHTML = '<span class="loading">Loading questions...</span>';

    fetch("/questions/htmlQuestion.json")
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`Network response was not ok (status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            // Clear loading message
            resultsContainer.innerHTML = '';

            // Check if data is empty
            if (!data || data.length === 0) {
                // Handle empty data state
                resultsContainer.innerHTML = `<span class='error'>No questions available at the moment. Please check back later.</span>`;
                return; // Stop execution
            }

            // Full data state with shuffle
            questionObject = data;
            let questionCount = questionObject.length;

            // Update question count
            countSpan.innerHTML = questionCount;

            //shuffle questions 
            shuffle(questionObject)

            // Display the first question
            addQuestionData(questionObject[currentIndex], questionCount);

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

            // Handle Submit button click (only appears on the last question)
            submitButton.onclick = () => {
                // Save the user's answer
                saveUserAnswer();

                // Check all answers
                checkAllAnswers();

                // Clear the countdown
                clearInterval(countdownInterval);

                // Show results
                showResults(questionCount);
            };
        })
        .catch(error => {
            // Clear loading message
            resultsContainer.innerHTML = '';

            console.error('There was a problem with the fetch operation:', error);
            // Handle error state
            // window.location.replace(`error.html`)
        });
}
getQuestion();

// Function to display a question
function addQuestionData(obj, count) {
    // Clear previous content
    quizArea.innerHTML = "";
    answersArea.innerHTML = "";

    // Create question title
    let questionTitle = document.createElement('h2');
    let questionText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    // Create answers
    for (let i = 1; i <= 4; i++) {
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";

        let radioInput = document.createElement("input");
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];
        if (i == 1) {
            radioInput.checked = true;
        }
        // Check if this answer was previously selected by the user
        if (userAnswers[currentIndex] === obj[`answer_${i}`]) {
            radioInput.checked = true;
        }

        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${i}`;
        let labelText = document.createTextNode(obj[`answer_${i}`]);
        theLabel.appendChild(labelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        answersArea.appendChild(mainDiv);
    }

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
    addQuestionData(questionObject[currentIndex], count);
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
    // Add index to flaggedQuestions if not already there
    if (!flaggedQuestions.includes(index)) {
        flaggedQuestions.push(index);
        console.log(flaggedQuestions);
        updateFlaggedQuestionsUI();
    }
}

// Function to unflag a question
function unflagQuestion(index) {
    // Remove index from flaggedQuestions
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
    flaggedQuestions.forEach((ques,questionIndex) => {
        let question = questionObject[questionIndex];
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
            // If we are currently viewing this question, update the flag button ----> bug of create flag in next question
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
    if (index >= 0 && index < questionObject.length) {
        // Save current answer before navigating
        saveUserAnswer();

        // Set currentIndex
        currentIndex = index;
        displayQuestion(questionObject.length);
    }
}

// Function to update navigation buttons visibility and submit button
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
        submitButton.style.display = 'none'; // Hide submit button
    } else {
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block'; // Show submit button on last question
    }
}

// Function to check all answers
function checkAllAnswers() {
    rightAnswers = 0; // Reset right answers count

    // Loop through each question
    questionObject.forEach((q, index) => {
        let correctAnswer = q.right_answer;
        let userAnswer = userAnswers[index];

        // Check if the answer is correct
        if (userAnswer === correctAnswer) {
            rightAnswers++;
        }
    });
}

// Function to show results
function showResults(count) {
    let theResults;

    // Remove quiz elements
    quizArea.remove();
    answersArea.remove();
    previousButton.remove();
    nextButton.remove();
    submitButton.remove();

    // Determine result message
    if (rightAnswers > (count / 2) && rightAnswers < count) {
        window.location.replace(`success.html`)
    } else if (rightAnswers === count) {
        window.location.replace(`success.html`)
    } else {
        window.location.replace(`failed.html`)
    }

    // Display results
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "20px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
    resultsContainer.style.textAlign = "center";
    resultsContainer.style.fontSize = "24px";

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
            // Time is up, submit the quiz
            window.location.replace(`timeout.html`)
        }

    }, 1000);
}

//shuffle function 
function shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
      }
}
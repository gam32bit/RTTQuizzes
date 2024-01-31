document.addEventListener('DOMContentLoaded', function () {
    let correctAnswersCount = 0;
    let answeredQuestionsCount = 0;
    let quizContainer;
    let quizData;

    function initializeQuiz() {
        let answerSelected = false;

        fetch('quizzes/Jan24.json')
            .then(response => response.json())
            .then(data => {
                quizData = data;
                initializeQuizUI();
            })
            .catch(error => console.error('Error fetching JSON:', error));

        function initializeQuizUI() {
            document.querySelector('.quiz-title').textContent = quizData.month;
            quizContainer = document.querySelector('.quiz-container');

            quizData.questions.forEach((question, index) => {
                const questionElement = createQuestionElement(question, index);
                const additionalContextElement = createAdditionalContextElement();

                quizContainer.appendChild(questionElement);
                quizContainer.appendChild(additionalContextElement);

                const options = questionElement.querySelectorAll('li');

                options.forEach(option => {
                    option.addEventListener('click', function () {
                        handleOptionClick(this, question.correctOption, question.context, additionalContextElement, options);
                    });
                });
            });
        }

        function createQuestionElement(question, index) {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <p>${index + 1}. ${question.question}</p>
                <ul>
                    ${question.options.map((option, i) => `<li data-index="${i}">${String.fromCharCode(65 + i)}. ${option}</li>`).join('')}
                </ul>
            `;
            return questionElement;
        }

        function createAdditionalContextElement() {
            const additionalContextElement = document.createElement('div');
            additionalContextElement.classList.add('additionalcontext');
            return additionalContextElement;
        }

        function handleOptionClick(selectedOption, correctOption, context, additionalContextElement, options) {
            if (!answerSelected) {
                answerSelected = true;
                answeredQuestionsCount++;
        
                const selectedOptionIndex = parseInt(selectedOption.getAttribute('data-index'), 10);
        
                if (selectedOptionIndex === correctOption) {
                    // Correct option chosen
                    selectedOption.style.color = 'green';
                    additionalContextElement.textContent = context;
                    correctAnswersCount++;
                } else {
                    // Incorrect option chosen
                    selectedOption.style.color = 'red';
        
                    // Highlight the correct option in green
                    const correctOptionElement = selectedOption.parentNode.querySelector(`li[data-index="${correctOption}"]`);
                    correctOptionElement.style.color = 'green';
        
                    additionalContextElement.textContent = context;
                }
        
                if (answeredQuestionsCount === quizData.questions.length) {
                    displayResultMessage(correctAnswersCount, quizData.questions.length);
                }
        
                // Reset the answerSelected flag for the next question
                answerSelected = false;
            }
        }

        function resetQuiz() {
            // Reset the quiz by removing the result message, resetting counters, and clearing styles
            const resultMessage = quizContainer.querySelector('.result-message');
            if (resultMessage) {
                quizContainer.removeChild(resultMessage);
            }

            correctAnswersCount = 0;
            answeredQuestionsCount = 0;

            const options = quizContainer.querySelectorAll('.question li');
            options.forEach(option => {
                option.style.color = ''; // Reset text color
            });

            // Reset the answerSelected flag
            answerSelected = false;

            // Clear additional context for each question
            const additionalContextElements = quizContainer.querySelectorAll('.additionalcontext');
            additionalContextElements.forEach(element => {
                element.textContent = '';
            });
        }

        function displayResultMessage(correctCount, totalCount) {
            const resultMessage = document.createElement('div');
            resultMessage.classList.add('result-message');
            resultMessage.textContent = `You got ${correctCount} out of ${totalCount} correct!`;

            // Create and append the reset button
            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reset Quiz';
            resetButton.addEventListener('click', resetQuiz);
            resultMessage.appendChild(resetButton);

            quizContainer.appendChild(resultMessage);
        }
    }

    // Kickstart the quiz initialization
    initializeQuiz();
});

document.addEventListener('DOMContentLoaded', function () {
    let correctAnswersCount = 0;
    let answeredQuestionsCount = 0; // Track the number of questions answered
    let quizContainer; // Declare quizContainer in the global scope

    fetch('quizzes/Jan24.json')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.quiz-title').textContent = data.month;

            quizContainer = document.querySelector('.quiz-container'); // Set the global quizContainer

            data.questions.forEach((question, index) => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerHTML = `
                    <p>${index + 1}. ${question.question}</p>
                    <ul>
                        ${question.options.map((option, i) => `<li data-index="${i}">${String.fromCharCode(65 + i)}. ${option}</li>`).join('')}
                    </ul>
                `;
                quizContainer.appendChild(questionElement);

                const additionalContextElement = document.createElement('div');
                additionalContextElement.classList.add('additionalcontext');
                quizContainer.appendChild(additionalContextElement);

                const options = questionElement.querySelectorAll('li');
                let answerSelected = false;

                options.forEach(option => {
                    option.addEventListener('click', function () {
                        if (!answerSelected) {
                            answerSelected = true;
                            answeredQuestionsCount++; // Increment the answered questions count
                            handleOptionClick(this, question.correctOption, question.context, additionalContextElement, options);

                            if (parseInt(this.getAttribute('data-index'), 10) === question.correctOption) {
                                correctAnswersCount++;
                            }

                            if (answeredQuestionsCount === data.questions.length) {
                                displayResultMessage(correctAnswersCount, data.questions.length);
                            }
                        }
                    });
                });
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));

    function displayResultMessage(correctCount, totalCount) {
        const resultMessage = document.createElement('div');
        resultMessage.classList.add('result-message');
        resultMessage.textContent = `You got ${correctCount} out of ${totalCount} correct!`;
        quizContainer.appendChild(resultMessage); // Use the global quizContainer
    }

    function handleOptionClick(selectedOption, correctOption, context, additionalContextElement, options) {
        const selectedOptionIndex = parseInt(selectedOption.getAttribute('data-index'), 10);

        if (selectedOptionIndex === correctOption) {
            // Correct option chosen
            selectedOption.style.color = 'green';
            additionalContextElement.textContent = context;
        } else {
            // Incorrect option chosen
            selectedOption.style.color = 'red';

            // Highlight the correct option in green
            const correctOptionElement = selectedOption.parentNode.querySelector(`li[data-index="${correctOption}"]`);
            correctOptionElement.style.color = 'green';

            additionalContextElement.textContent = context;
        }
    }
});

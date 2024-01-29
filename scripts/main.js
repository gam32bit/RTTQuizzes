document.addEventListener('DOMContentLoaded', function () {
    fetch('quizzes/Jan24.json')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.quiz-title').innerHTML = `<a href="quiz.html">${data.month}</a>`;

            const quizContainer = document.querySelector('.quiz-container');

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

                const options = questionElement.querySelectorAll('li');
                let answerSelected = false;

                options.forEach(option => {
                    option.addEventListener('click', function () {
                        if (!answerSelected) {
                            answerSelected = true;
                            handleOptionClick(this, question.correctOption, question.context, options);
                        }
                    });
                });
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));

    function handleOptionClick(selectedOption, correctOption, context, options) {
        const selectedOptionIndex = parseInt(selectedOption.getAttribute('data-index'), 10);
        const additionalContextElement = document.querySelector('.additionalcontext');

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

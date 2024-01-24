document.addEventListener('DOMContentLoaded', function () {
    fetch('quizzes/Jan24.json')
        .then(response => response.json())
        .then(data => {
            // Populate the title with a hyperlink
            document.querySelector('.quiz-title').innerHTML = `<a href="quiz.html">${data.month}</a>`;

            // Populate the questions
            const quizContainer = document.querySelector('.quiz-container');
            data.questions.forEach((question, index) => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerHTML = `
                    <p>${index + 1}. ${question.question}</p>
                    <ul>
                        ${question.options.map((option, i) => `<li>${String.fromCharCode(65 + i)}. ${option}</li>`).join('')}
                    </ul>
                `;
                quizContainer.appendChild(questionElement);
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
});


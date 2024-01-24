document.addEventListener('DOMContentLoaded', function () {
    // Fetch the JSON file for the current month (example: quiz-jan-2024.json)
    const currentMonth = new Date().toLocaleString('en-us', { month: 'short', year: 'numeric' });
    const jsonFile = `quizzes/quiz-${currentMonth.toLowerCase()}.json`;

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            // Populate the title
            document.querySelector('.quiz-title').innerText = data.month;

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

document.addEventListener('DOMContentLoaded', async function () {
    let correctAnswersCount = 0;
    let answeredQuestionsCount = 0;
    let quizContainer;
    let quizData;

    async function fetchQuizList() {
        try {
            const response = await fetch('quizzes/quiz_list.json');
            return await response.json();
        } catch (error) {
            console.error('Error fetching quiz list:', error);
        }
    }

    function updateQuizGallery(quizList) {
        const quizGallery = document.querySelector('.quiz-gallery');
        if (quizGallery) {
            quizGallery.innerHTML = ''; // Clear existing quiz cards

            quizList.forEach(quiz => {
                const quizCard = createQuizCardElement(quiz);
                quizGallery.appendChild(quizCard);
            });
        }
    }

    function createQuizCardElement(quiz) {
        const quizCard = document.createElement('div');
        quizCard.classList.add('quiz-card');
        quizCard.innerHTML = ` 
            <img src="img/${quiz.image}" alt="${quiz.title} Quiz"> 
            <div class="quiz-info">
                <h3>${quiz.title}</h3> 
                <a href="quiz.html?quiz=${quiz.filename}" class="take-quiz-btn">Take Quiz</a>
            </div>
        `;
        return quizCard;
    }

    async function initializeQuiz(quizFilename) {
        try {
            const response = await fetch(`quizzes/${quizFilename}`);
            if (!response.ok) {
                throw new Error(`Error fetching quiz data: ${response.status}`);
            }
            quizData = await response.json();
            initializeQuizUI();

            // Automatically select the first question's option if specified in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const selectedOptionId = urlParams.get('option');
            if (selectedOptionId) {
                selectOptionForFirstQuestion(selectedOptionId);
            }
        } catch (error) {
            console.error('Error loading quiz:', error);
            displayErrorMessage('There was a problem loading the quiz. Please try again later.');
        }
    }

    function initializeQuizUI() {
        document.querySelector('.quiz-title').textContent = quizData.title;
        quizContainer = document.querySelector('.quiz-container');
        quizContainer.innerHTML = ''; // Clear existing content

        quizData.questions.forEach((question, index) => {
            const questionElement = createQuestionElement(question, index);
            quizContainer.appendChild(questionElement);
        });
    }

    function createQuestionElement(question, index) {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            <ul>
                ${question.options.map((option, i) => `<li data-index="${i}" data-id="${option.id}">${String.fromCharCode(65 + i)}. ${option.text}</li>`).join('')}
            </ul>
        `;
        const additionalContextElement = createAdditionalContextElement();
        questionElement.appendChild(additionalContextElement);
        addOptionClickHandlers(question, questionElement, additionalContextElement);
        return questionElement;
    }

    function createAdditionalContextElement() {
        const additionalContextElement = document.createElement('div');
        additionalContextElement.classList.add('additionalcontext');
        return additionalContextElement;
    }

    function addOptionClickHandlers(question, questionElement, additionalContextElement) {
        const options = questionElement.querySelectorAll('li');

        options.forEach(option => {
            option.addEventListener('click', function () {
                handleOptionClick(this, question.correctOption, question.context, additionalContextElement, options, questionElement);
            });
        });
    }

    function handleOptionClick(selectedOption, correctOption, context, additionalContextElement, options, questionElement) {
        if (questionElement.classList.contains('answered')) {
            return;
        }

        const selectedOptionIndex = parseInt(selectedOption.getAttribute('data-index'), 10);

        if (selectedOptionIndex === correctOption) {
            selectedOption.style.color = 'green';
            correctAnswersCount++;
        } else {
            selectedOption.style.color = 'red';
            const correctOptionElement = questionElement.querySelector(`li[data-index="${correctOption}"]`);
            correctOptionElement.style.color = 'green';
        }

        additionalContextElement.textContent = context;
        answeredQuestionsCount++;
        questionElement.classList.add('answered');

        if (answeredQuestionsCount === quizData.questions.length) {
            displayResultMessage(correctAnswersCount, quizData.questions.length);
        }
    }

    function displayResultMessage(correctCount, totalCount) {
        const resultMessage = document.createElement('div');
        resultMessage.classList.add('result-message');
        resultMessage.textContent = `You got ${correctCount} out of ${totalCount} correct!`;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Quiz';
        resetButton.addEventListener('click', () => {
            resetQuiz();
        });
        resultMessage.appendChild(resetButton);

        quizContainer.appendChild(resultMessage);
    }

    function resetQuiz() {
        correctAnswersCount = 0;
        answeredQuestionsCount = 0;
        initializeQuizUI();
    }

    function selectOptionForFirstQuestion(optionId) {
        const firstQuestionElement = document.querySelector('.question');
        const optionElement = firstQuestionElement.querySelector(`li[data-id="${optionId}"]`);
        if (optionElement) {
            optionElement.click();
        }
    }

    // Logic to handle quiz selection
    const urlParams = new URLSearchParams(window.location.search);
    const selectedQuiz = urlParams.get('quiz');

    if (selectedQuiz) {
        await initializeQuiz(selectedQuiz);
    } else {
        const quizList = await fetchQuizList();
        updateQuizGallery(quizList);
    }
});

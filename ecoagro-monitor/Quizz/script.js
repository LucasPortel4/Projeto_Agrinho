const questions = [
    {
        question: "Qual é a capital do Brasil?",
        answers: [
            { id: 1, text: "Rio de Janeiro", correct: false },
            { id: 2, text: "São Paulo", correct: false },
            { id: 3, text: "Brasília", correct: true },
            { id: 4, text: "Salvador", correct: false },
        ],
    },
    {
        question: "Qual é a maior floresta tropical do mundo?",
        answers: [
            { id: 1, text: "Floresta Amazônica", correct: true },
            { id: 2, text: "Floresta Congo", correct: false },
            { id: 3, text: "Floresta Andina", correct: false },
            { id: 4, text: "Floresta do Pantanal", correct: false },
        ],
    },
    {
        question: "Qual é o maior país do mundo em extensão territorial?",
        answers: [
            { id: 1, text: "Rússia", correct: true },
            { id: 2, text: "Canadá", correct: false },
            { id: 3, text: "Estados Unidos", correct: false },
            { id: 4, text: "China", correct: false },
        ],
    },
    {
        question: "Qual é o maior oceano do mundo?",
        answers: [
            { id: 1, text: "Oceano Atlântico", correct: false },
            { id: 2, text: "Oceano Índico", correct: false },
            { id: 3, text: "Oceano Ártico", correct: false },
            { id: 4, text: "Oceano Pacífico", correct: true },
        ],
    },
];

const questionElement = document.getElementById("question");
const answersButtons = document.getElementById("answers-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Próxima";
    showQuestion();
}

function resetState() {
    nextButton.style.display = "none";
    while (answersButtons.firstChild) {
        answersButtons.removeChild(answersButtons.firstChild);
    }
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.dataset.id = String(answer.id);
        button.classList.add("btn");
        button.addEventListener("click", selectAnswer);
        answersButtons.appendChild(button);
    });
}

function selectAnswer(e) {
    const answers = questions[currentQuestionIndex].answers;
    const correctAnswer = answers.find((answer) => answer.correct === true);

    const selectedButton = e.target;
    const selectedId = Number(selectedButton.dataset.id);
    const isCorrect = selectedId === correctAnswer.id;

    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("incorrect");
    }

    Array.from(answersButtons.children).forEach((button) => {
        const buttonId = Number(button.dataset.id);
        if (buttonId === correctAnswer.id) {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `Você acertou ${score} de ${questions.length}!`;
    nextButton.innerHTML = "Jogar Novamente";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();

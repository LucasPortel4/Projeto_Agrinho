const questions = [
    {
        question: "Qual tecnologia ajuda a medir a umidade do solo no agronegócio?",
        answers: [
            { id: 1, text: "Sensor de umidade", correct: true },
            { id: 2, text: "Máquina de lavar", correct: false },
            { id: 3, text: "Impressora 3D", correct: false },
            { id: 4, text: "Ventilador de teto", correct: false },
        ],
    },
    {
        question: "Qual prática representa um uso inteligente da tecnologia no campo?",
        answers: [
            { id: 1, text: "Irrigação automatizada", correct: true },
            { id: 2, text: "Queima de resíduos", correct: false },
            { id: 3, text: "Plantio sem planejamento", correct: false },
            { id: 4, text: "Uso excessivo de agrotóxicos", correct: false },
        ],
    },
    {
        question: "Qual benefício a inteligência artificial pode trazer para o agronegócio?",
        answers: [
            { id: 1, text: "Prever safras e reduzir desperdícios", correct: true },
            { id: 2, text: "Aumentar o consumo de água sem controle", correct: false },
            { id: 3, text: "Substituir totalmente os agricultores", correct: false },
            { id: 4, text: "Parar a produção rural", correct: false },
        ],
    },
    {
        question: "Qual ferramenta digital ajuda a organizar vendas e produção na agricultura?",
        answers: [
            { id: 1, text: "Software de gestão agrícola", correct: true },
            { id: 2, text: "Radio antigo", correct: false },
            { id: 3, text: "Calculadora simples", correct: false },
            { id: 4, text: "Mapa desenhado à mão", correct: false },
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

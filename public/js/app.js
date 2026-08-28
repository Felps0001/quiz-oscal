const questions = [
  { question: "Qual percentual de mulheres no Brasil não consome a quantidade diária recomendada de cálcio?", options: ["46%", "76%", "96%"], answer: "96%" },
  { question: "Você sabia que uma mulher pode perder até quanto de sua densidade óssea nos primeiros 5 anos após a menopausa?", options: ["1%", "2%", "6%"], answer: "6%" },
  { question: "Quanto da recomendação diária de suplementação de cálcio um comprimido de Oscal fornece?", options: ["50%", "75%", "100%"], answer: "100%", claim: "100% da suplementação diária de cálcio*", note: "*1 comprimido tem a quantidade recomendada de suplementação diária de cálcio.", references: "1. Reinwald S, Weaver CM, Kester JJ. The health benefits of calcium citrate malate: a review of the supporting science. Adv Food Nutr Res. 2008; 54:219-346. 2. van der Velde RY, Brouwers JR, Geusens PP et al. Calcium and vitamin D supplementation: state of the art for daily practice. Food Nutr Res. 2014;58." }
];

const screen = document.querySelector("#screen");
const usageCounterEndpoint = "https://script.google.com/macros/s/AKfycbw2yr_4uEaxiC4kCzdNBm5mPeooEMGtE589GDWR9NuA_eExzuqDRqf7LDwEX-Xm264__Q/exec";
let round = [];
let currentIndex = 0;
let selectedOption = null;

function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }

function registerQuizCompletion() {
  const counterUrl = new URL(usageCounterEndpoint);
  counterUrl.searchParams.set("event", "quiz_concluido");
  counterUrl.searchParams.set("timestamp", Date.now().toString());

  const tracker = document.createElement("iframe");
  tracker.hidden = true;
  tracker.setAttribute("aria-hidden", "true");
  tracker.src = counterUrl.toString();
  document.body.append(tracker);
  window.setTimeout(() => tracker.remove(), 10000);
}

function startRound() {
  round = shuffle(questions).map((question) => ({ ...question, options: shuffle(question.options) }));
  currentIndex = 0;
  renderQuestion();
}

function renderHome() {
  screen.innerHTML = `<section class="home-content" aria-labelledby="main-title"><div class="eyebrow"><span></span> SUA SAÚDE EM MOVIMENTO</div><h1 id="main-title">O quanto você<br>sabe sobre seus<br><em>ossos?</em></h1><p class="intro">Descubra, em poucos minutos, curiosidades e cuidados para viver cada movimento do seu jeito.</p><div class="home-action"><span>3 perguntas rápidas</span><button class="start-button" type="button" id="start-quiz"><span>COMEÇAR QUIZ</span><span class="arrow" aria-hidden="true">→</span></button></div></section><footer class="bottom-area"><p class="disclaimer">Conteúdo informativo. Para orientações, consulte um profissional de saúde.</p></footer>`;
  document.querySelector("#start-quiz").addEventListener("click", startRound);
}

function renderQuestion() {
  const question = round[currentIndex];
  selectedOption = null;
  screen.innerHTML = `<section class="question-screen" aria-labelledby="question-title"><div class="progress"><span>PERGUNTA ${currentIndex + 1} DE ${round.length}</span><div class="progress-track"><i style="width: ${((currentIndex + 1) / round.length) * 100}%"></i></div></div><div class="question-number">0${currentIndex + 1}</div><h1 id="question-title">${question.question}</h1><div class="options" role="radiogroup" aria-label="Alternativas">${question.options.map((option, index) => `<button class="option" type="button" data-option="${option}" role="radio" aria-checked="false"><b>${String.fromCharCode(65 + index)}</b><span>${option}</span></button>`).join("")}</div></section><footer class="bottom-area"><button class="start-button confirm-button" type="button" id="confirm-answer" disabled><span>CONFIRMAR RESPOSTA</span><span class="arrow" aria-hidden="true">→</span></button></footer>`;
  document.querySelectorAll(".option").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".option").forEach((option) => { option.classList.remove("selected"); option.setAttribute("aria-checked", "false"); });
    button.classList.add("selected");
    button.setAttribute("aria-checked", "true");
    selectedOption = button.dataset.option;
    document.querySelector("#confirm-answer").disabled = false;
  }));
  document.querySelector("#confirm-answer").addEventListener("click", renderFeedback);
}

function renderFeedback() {
  const question = round[currentIndex];
  const isCorrect = selectedOption === question.answer;
  const extra = question.claim ? `<div class="claim"><span>CLAIM APROVADO</span><strong>${question.claim}</strong><p>${question.note}</p></div>` : "";
  const references = question.references ? `<p class="references"><strong>Referências:</strong> ${question.references}</p>` : "";
  const buttonText = currentIndex === round.length - 1 ? "CONCLUIR" : "PRÓXIMA PERGUNTA";
  screen.innerHTML = `<section class="feedback-screen ${isCorrect ? "correct" : "incorrect"}" aria-labelledby="feedback-title"><div class="feedback-icon" aria-hidden="true">${isCorrect ? "✓" : "!"}</div><div class="eyebrow"><span></span> ${isCorrect ? "BOA!" : "TENTE A PRÓXIMA"}</div><h1 id="feedback-title">${isCorrect ? "Você acertou!" : "Quase lá!"}</h1><p class="feedback-copy">A resposta correta é <strong>${question.answer}</strong>${isCorrect ? "." : ". Agora você já sabe!"}</p>${extra}${references}</section><footer class="bottom-area"><button class="start-button" type="button" id="next-question"><span>${buttonText}</span><span class="arrow" aria-hidden="true">→</span></button></footer>`;
  document.querySelector("#next-question").addEventListener("click", () => { currentIndex += 1; currentIndex < round.length ? renderQuestion() : renderFinal(); });
}

function renderFinal() {
  registerQuizCompletion();
  screen.innerHTML = `<section class="final-screen" aria-labelledby="final-title"><div class="final-sparkles" aria-hidden="true">✦ <span>+</span> ✦</div><div class="eyebrow"><span></span> QUIZ CONCLUÍDO</div><h1 id="final-title">Cuidar dos seus<br>ossos é cuidar<br>da sua <em>história.</em></h1><p class="intro">Faça escolhas que acompanhem todos os seus movimentos.</p></section><footer class="bottom-area"><button class="start-button" type="button" id="finish-quiz"><span>CONCLUIR</span><span class="arrow" aria-hidden="true">→</span></button><p class="disclaimer">Oscal® auxilia na manutenção de ossos e dentes e na absorção do cálcio.</p></footer>`;
  document.querySelector("#finish-quiz").addEventListener("click", renderHome);
}

renderHome();
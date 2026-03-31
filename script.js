let startTime = 0;
let elapsedTime = 0;
let timerInterval;

const display = document.getElementById('display');
const goalInput = document.getElementById('goalInput');
const weeklyLog = document.getElementById('weeklyLog');

// Nomes dos dias da semana para o registro
const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

// Inicializa o registro de estudos buscando do localStorage (ou cria um vazio)
let studyLog = JSON.parse(localStorage.getItem('studyLog')) || {};

// Função para renderizar o histórico na tela
function renderLog() {
    weeklyLog.innerHTML = '';
    for (const [dia, tempoMs] of Object.entries(studyLog)) {
        let hrs = Math.floor(tempoMs / 3600000);
        let mins = Math.floor((tempoMs % 3600000) / 60000);
        
        let li = document.createElement('li');
        li.textContent = `${dia}: ${hrs}h e ${mins}m estudados`;
        weeklyLog.appendChild(li);
    }
}

// Renderiza o histórico assim que a página carrega
renderLog();

function updateDisplay(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    display.innerHTML = `${formattedHH}:${formattedMM}:${formattedSS}<span id="milliseconds">.${formattedMS}</span>`;

    // --- LÓGICA DO ALERTA VISUAL (Ideia 5) ---
    const goalMs = goalInput.value * 60000; // Converte os minutos da meta em milissegundos
    if (time >= goalMs && goalMs > 0) {
        display.classList.add('goal-reached'); // Adiciona a cor verde
    } else {
        display.classList.remove('goal-reached'); // Mantém/volta para o laranja
    }
}

document.getElementById('startBtn').addEventListener('click', () => {
    if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay(elapsedTime);
        }, 10);
    }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// --- LÓGICA DO REGISTRO DE SESSÕES (Ideia 2) ---
document.getElementById('resetBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Se o cronômetro rodou mais de 1 minuto, salva no histórico antes de zerar
    if (elapsedTime > 60000) { 
        // Pega o dia de hoje (ex: 2 para Terça-feira) e busca o nome no array
        const hoje = new Date().getDay(); 
        const nomeDoDia = diasDaSemana[hoje];

        // Soma o tempo atual ao tempo que já estava salvo naquele dia (se houver)
        if (studyLog[nomeDoDia]) {
            studyLog[nomeDoDia] += elapsedTime;
        } else {
            studyLog[nomeDoDia] = elapsedTime;
        }

        // Salva de volta no navegador
        localStorage.setItem('studyLog', JSON.stringify(studyLog));
        renderLog(); // Atualiza a lista na tela
    }

    elapsedTime = 0;
    updateDisplay(elapsedTime);
});
const timeElement = document.getElementById("time");
const msElement = document.getElementById("milliseconds");

// Puxa os dados salvos no navegador (ou começa do zero se for a primeira vez)
let startTime = parseInt(localStorage.getItem('timerStartTime')) || 0;
let elapsedTime = parseInt(localStorage.getItem('timerElapsedTime')) || 0;
let isRunning = localStorage.getItem('timerIsRunning') === 'true';
let timerInterval;

// Função para salvar o estado atual no navegador
function saveState() {
    localStorage.setItem('timerStartTime', startTime);
    localStorage.setItem('timerElapsedTime', elapsedTime);
    localStorage.setItem('timerIsRunning', isRunning);
}

function updateDisplay(time) {
    let totalSeconds = Math.floor(time / 1000);
    
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    
    let milliseconds = Math.floor((time % 1000) / 10); 
    
    let formattedHH = hours.toString().padStart(2, "0");
    let formattedMM = minutes.toString().padStart(2, "0");
    let formattedSS = seconds.toString().padStart(2, "0");
    let formattedMS = milliseconds.toString().padStart(2, "0");

    timeElement.textContent = `${formattedHH}:${formattedMM}:${formattedSS}`;
    msElement.textContent = `.${formattedMS}`;
}

function updateTime() {
    let currentTotal = elapsedTime + (Date.now() - startTime);
    updateDisplay(currentTotal);
}

function start() {
    if (isRunning) return; // Evita bugar se apertar várias vezes
    isRunning = true;
    startTime = Date.now();
    saveState();
    timerInterval = setInterval(updateTime, 10);
    showButton("PAUSE");
}

function pause() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime += Date.now() - startTime; // Acumula o tempo que passou
    saveState();
    updateDisplay(elapsedTime); // Crava o display no tempo exato da pausa
    showButton("START");
}

function reset() {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime = 0;
    startTime = Date.now();
    saveState();
    updateDisplay(0);
    showButton("START");
}

function showButton(buttonKey) {
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    
    if (buttonKey === "PAUSE") {
        startBtn.style.display = "none";
        pauseBtn.style.display = "inline-flex"; 
    } else {
        startBtn.style.display = "inline-flex";
        pauseBtn.style.display = "none";
    }
}

// --- ATALHOS DO TECLADO ---
document.addEventListener('keydown', function(event) {
    // Tecla Espaço (Pausar/Iniciar)
    if (event.code === 'Space') {
        event.preventDefault(); // Impede a página de rolar para baixo
        // Tira o foco do botão se estiver selecionado para não ativar 2x
        if (document.activeElement) document.activeElement.blur(); 
        
        if (isRunning) {
            pause();
        } else {
            start();
        }
    } 
    // Tecla Delete (Resetar)
    else if (event.code === 'Delete') {
        reset();
    }
});

// --- INICIALIZAÇÃO QUANDO A PÁGINA CARREGA ---
if (isRunning) {
    // Se a página foi fechada/atualizada enquanto rodava, ele continua calculando a diferença
    timerInterval = setInterval(updateTime, 10);
    showButton("PAUSE");
} else {
    // Se estava pausado, só mostra o tempo salvo
    updateDisplay(elapsedTime);
    showButton("START");
}
const timeElement = document.getElementById("time");
const msElement = document.getElementById("milliseconds");

let startTime;
let elapsedTime = 0;
let timerInterval;

function updateDisplay(time) {
    let totalSeconds = Math.floor(time / 1000);
    
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    
    // Pegando apenas 2 dígitos para os milissegundos
    let milliseconds = Math.floor((time % 1000) / 10); 
    
    let formattedHH = hours.toString().padStart(2, "0");
    let formattedMM = minutes.toString().padStart(2, "0");
    let formattedSS = seconds.toString().padStart(2, "0");
    let formattedMS = milliseconds.toString().padStart(2, "0");

    timeElement.textContent = `${formattedHH}:${formattedMM}:${formattedSS}`;
    msElement.textContent = `.${formattedMS}`;
}

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function() {
        elapsedTime = Date.now() - startTime;
        updateDisplay(elapsedTime);
    }, 10); // Atualiza a cada 10ms para rodar liso
    showButton("PAUSE");
}

function pause() {
    clearInterval(timerInterval);
    showButton("START");
}

function reset() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    timeElement.textContent = "00:00:00";
    msElement.textContent = ".00";
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
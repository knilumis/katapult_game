let commands = [];
let userInputs = [];
let currentStep = 0;

const commandText = document.getElementById('command-text');
const greenButton = document.getElementById('green-button');
const redButton = document.getElementById('red-button');
const fireButton = document.getElementById('fire-button');
const startButton = document.getElementById('start-button');
const resultDiv = document.getElementById('result');

greenButton.disabled = true;
redButton.disabled = true;
fireButton.disabled = true;

// Arka plan müziğini yükle
const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true; // Müziğin sürekli çalması için döngüye al

// Başarısızlık ses efektini yükle
const failSound = new Audio('fail.mp3');

// Başarı ses efektini yükle
const successSound = new Audio('succ.mp3');

startButton.addEventListener('click', startGame);
greenButton.addEventListener('click', () => handleUserInput('green'));
redButton.addEventListener('click', () => handleUserInput('red'));
fireButton.addEventListener('click', handleFire);

function startGame() {
    commands = [];
    userInputs = [];
    currentStep = 0;
    resultDiv.textContent = '';
    commandText.textContent = '';
    startButton.disabled = true;
    startButton.textContent = "ARM MISSION"; // Başlatma tuşunun ismini başlangıçta ayarla
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
            console.error('Otomatik oynatma hatası:', error);
        });
    }
    generateCommands();
    enableColorButtons(); // Yeşil ve kırmızı tuşları etkinleştir
}

function generateCommands() {
    for (let i = 0; i < 9; i++) {
        commands.push(Math.random() < 0.5 ? 'green' : 'red');
    }
    executeCommands();
}

function executeCommands() {
    if (currentStep < commands.length) {
        if (commands[currentStep] === 'green') {
            commandText.textContent = 'Yeşile bas';
        } else {
            commandText.textContent = 'Kırmızıya bas';
        }
        commandText.style.color = 'black';
        setTimeout(() => {
            commandText.textContent = '';
            currentStep++;
            setTimeout(executeCommands, 300); // 0.3 saniye
        }, 300); // 0.3 saniye
    } else {
        startCountdown();
    }
}

function startCountdown() {
    let countdown = 3;
    commandText.textContent = "3'ten geriye sayıp atıyoruz 3 !!!!";
    setTimeout(() => {
        const countdownInterval = setInterval(() => {
            if (countdown > 1) {
                countdown--;
                commandText.textContent = countdown.toString();
            } else {
                clearInterval(countdownInterval);
                commandText.textContent = 'Hamit: FIRLAT!!!';
                enableFireButton(); // Fire tuşunu etkinleştir
            }
        }, 1000);
    }, 1000);
}

function enableColorButtons() {
    greenButton.disabled = false;
    redButton.disabled = false;
}

function enableFireButton() {
    fireButton.disabled = false;
}

function handleUserInput(color) {
    userInputs.push(color);
}

function handleFire() {
    greenButton.disabled = true;
    redButton.disabled = true;
    fireButton.disabled = true;

    let correctSteps = 0; // correctSteps'i sıfırla

    // Kullanıcının basışlarını doğru sırayla kontrol et
    for (let i = 0; i < commands.length; i++) {
        if (commands[i] === userInputs[i]) {
            correctSteps++;
        }
    }

    if (correctSteps >= 8) { // En az 8 doğru basış gerekli
        resultDiv.textContent = `ATIŞ BAŞARILI DELİ KALKTI !!!!`;
        successSound.play(); // Başarı ses efektini çal
    } else {
        resultDiv.textContent = `ATIŞ BAŞARISIZ KATAPULT PATLADI :(`;
        failSound.play(); // Başarısızlık ses efektini çal
    }

    startButton.disabled = false;
    startButton.textContent = "TEKRAR ARM ET"; // Oyun bitince tuş ismini değiştir
}

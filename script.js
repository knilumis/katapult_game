let commands = [];
let userInputs = [];
let currentStep = 0;
let currentLevel = 1; // LEVEL 3'ü doğrudan başlatmak için başlangıç değeri 3 olarak ayarlandı
let success = false;
let cactusCount = 0;

const commandText = document.getElementById('command-text');
const greenButton = document.getElementById('green-button');
const redButton = document.getElementById('red-button');
const fireButton = document.getElementById('fire-button');
const startButton = document.getElementById('start-button');
const resultDiv = document.getElementById('result');
const levelText = document.getElementById('level-text');
const levelDescription = document.getElementById('level-description');
const slidersContainer = document.getElementById('sliders-container');
const dinoGameContainer = document.getElementById('dino-game-container');

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

// Başarısızlık mesajları
const failureMessages = [
    "ATIŞ BAŞARISIZ! KATAPULT PATLADI :(",
    "ATIŞ BAŞARISIZ! DİL BIRAKMADI :(",
    "ATIŞ BAŞARISIZ! YAY KOPTU !! :(",
    "ATIŞ BAŞARISIZ! MOTOR YANDI :("
];

startButton.addEventListener('click', startGame);
greenButton.addEventListener('click', () => handleUserInput('green'));
redButton.addEventListener('click', () => handleUserInput('red'));
fireButton.addEventListener('click', handleFire);
dinoGameContainer.addEventListener('click', jump);

function startGame() {
    if (success) {
        currentLevel++; // Bir sonraki seviyeye geç
        success = false;
    }
    commands = [];
    userInputs = [];
    currentStep = 0;
    cactusCount = 0;
    clearCacti(); // Kaktüsleri sıfırla
    resultDiv.textContent = '';
    commandText.textContent = '';
    if (currentLevel === 1) {
        levelText.textContent = "LEVEL 1";
        levelDescription.textContent = "Hamit'in söylediği konumlara sırasıyla bas!";
    } else if (currentLevel === 2) {
        levelText.textContent = "LEVEL 2";
        levelDescription.textContent = "Hamit'in söylediği konumları takip et ve bas!";
    } else if (currentLevel === 3) {
        levelText.textContent = "LEVEL 3";
        levelDescription.textContent = "Pervane'nin ayaklara çarpmasını engelle!";
    }
    startButton.disabled = true;
    startButton.textContent = "ARM MISSION"; // Başlatma tuşunun ismini başlangıçta ayarla
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
            console.error('Otomatik oynatma hatası:', error);
        });
    }
    if (currentLevel === 3) {
        startLevel3();
    } else {
        slidersContainer.style.display = 'none';
        dinoGameContainer.style.display = 'none';
        greenButton.style.display = 'inline-block';
        redButton.style.display = 'inline-block';
        generateCommands();
        enableColorButtons(); // Yeşil ve kırmızı tuşları etkinleştir
    }
}

function generateCommands() {
    let numCommands = 9 + (currentLevel - 1) * 2; // Her seviyede komut sayısını artır
    for (let i = 0; i < numCommands; i++) {
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

        if (currentLevel === 2) {
            // LEVEL 2 için rastgele pozisyon belirleme
            commandText.style.position = 'absolute';
            commandText.style.left = `${Math.random() * 80}%`;
            commandText.style.top = `${Math.random() * 80}%`;
        } else {
            // LEVEL 1 için sabit pozisyon
            commandText.style.position = 'static';
        }

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

    if (correctSteps >= Math.floor(commands.length * 0.9)) { // En az %90 doğru basış gerekli
        resultDiv.textContent = `ATIŞ BAŞARILI DELİ KALKTI !!!!`;
        successSound.play(); // Başarı ses efektini çal
        success = true; // Başarı durumunu ayarla
        startButton.textContent = "SONRAKİ SEVİYE"; // Başarı durumunda tuş ismini değiştir
    } else {
        const randomFailureMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        resultDiv.textContent = randomFailureMessage;
        failSound.play(); // Başarısızlık ses efektini çal
        success = false; // Başarısızlık durumunu ayarla
        startButton.textContent = "TEKRAR DENEME"; // Başarısızlık durumunda tuş ismini değiştir
    }

    fireButton.disabled = true; // Fire tuşunu devre dışı bırak
    startButton.disabled = false;
}

function startLevel3() {
    greenButton.style.display = 'none';
    redButton.style.display = 'none';
    slidersContainer.style.display = 'none';
    dinoGameContainer.style.display = 'block'; // Dino game için konteyneri görünür yap
    initializeDinoGame();
}

function initializeDinoGame() {
    const dino = document.getElementById('dino');
    let isJumping = false;

    function jump() {
        if (isJumping) return;
        isJumping = true;
        let position = 0;

        let upInterval = setInterval(() => {
            if (position >= 120) {
                clearInterval(upInterval);
                let downInterval = setInterval(() => {
                    if (position <= 0) {
                        clearInterval(downInterval);
                        isJumping = false;
                    } else {
                        position -= 20;
                        dino.style.bottom = position + 'px';
                    }
                }, 60); // Daha uzun süre havada kalma
            } else {
                position += 20;
                dino.style.bottom = position + 'px';
            }
        }, 60); // Daha uzun süre havada kalma
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            jump();
        }
    });

    dinoGameContainer.addEventListener('click', jump);

    let isGameOver = false;

    function createCactus() {
        let cactusPosition = 1000;
        let randomTime = Math.random() * 2100;

        const cactus = document.createElement('div');
        cactus.classList.add('cactus');
        cactus.style.left = cactusPosition + 'px';
        dinoGameContainer.appendChild(cactus);

        let leftInterval = setInterval(() => {
            if (cactusPosition < -40) {
                clearInterval(leftInterval);
                cactus.remove();
                cactusCount++;
                if (cactusCount >= 10) {
                    resultDiv.textContent = `LEVEL 3 BAŞARILI!`;
                    successSound.play(); // Başarı ses efektini çal
                    success = true; // Başarı durumunu ayarla
                    startButton.textContent = "SONRAKİ SEVİYE"; // Başarı durumunda tuş ismini değiştir
                    startButton.disabled = false; // Level 4'e geçiş
                    return;
                }
            } else if (cactusPosition > 0 && cactusPosition < 40 && !isJumping) {
                clearInterval(leftInterval);
                isGameOver = true;
                resultDiv.textContent = "ATIŞ BAŞARISIZ! PERVANE AYAKLARA ÇARPTI :(";
                failSound.play(); // Başarısızlık ses efektini çal
                success = false; // Başarısızlık durumunu ayarla
                startButton.textContent = "TEKRAR DENEME"; // Başarısızlık durumunda tuş ismini değiştir
                startButton.disabled = false;
            } else {
                cactusPosition -= 10; // Hızı artır
                cactus.style.left = cactusPosition + 'px';
            }
        }, 15);

        if (!isGameOver && cactusCount < 10) setTimeout(createCactus, randomTime);
    }

    createCactus();
}

function clearCacti() {
    const cacti = document.querySelectorAll('.cactus');
    cacti.forEach(cactus => cactus.remove());
}

// Sayfa yüklendiğinde doğrudan LEVEL 3'ü başlat
window.onload = function() {
    levelText.textContent = "LEVEL 3";
    levelDescription.textContent = "Pervane'nin ayaklara çarpmasını engelle!";
    startLevel3();
}

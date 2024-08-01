let commands = [];
let userInputs = [];
let currentStep = 0;
let currentLevel = 1;
let success = false;

const commandText = document.getElementById('command-text');
const greenButton = document.getElementById('green-button');
const redButton = document.getElementById('red-button');
const fireButton = document.getElementById('fire-button');
const startButton = document.getElementById('start-button');
const resultDiv = document.getElementById('result');
const levelText = document.getElementById('level-text');
const slidersContainer = document.getElementById('sliders-container');

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

function startGame() {
    if (success) {
        currentLevel++; // Bir sonraki seviyeye geç
        success = false;
    }
    commands = [];
    userInputs = [];
    currentStep = 0;
    resultDiv.textContent = '';
    commandText.textContent = '';
    if (currentLevel === 3) {
        levelText.textContent = "Katapult Ayaklarını Gerekli Sıkılığa Ayarla";
    } else {
        levelText.textContent = `LEVEL ${currentLevel}`;
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
    if (currentLevel === 3) {
        checkLevel3();
    } else {
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
}

function startLevel3() {
    greenButton.style.display = 'none';
    redButton.style.display = 'none';
    slidersContainer.innerHTML = ''; // Mevcut sliderları temizle
    slidersContainer.style.display = 'block'; // Sliderlar için konteyneri görünür yap

    for (let i = 0; i < 4; i++) {
        const targetValue = Math.floor(Math.random() * 101);
        const sliderWrapper = document.createElement('div');
        sliderWrapper.style.display = 'flex';
        sliderWrapper.style.alignItems = 'center';
        sliderWrapper.style.flexDirection = 'column';
        sliderWrapper.style.marginBottom = '20px';
        sliderWrapper.style.width = '100%';

        const targetText = document.createElement('span');
        targetText.textContent = `Hedef: %${targetValue}`;
        targetText.style.marginBottom = '10px';

        const ruler = document.createElement('div');
        ruler.style.display = 'flex';
        ruler.style.justifyContent = 'space-between';
        ruler.style.width = '100%';
        for (let j = 0; j <= 100; j += 20) {
            const mark = document.createElement('span');
            mark.textContent = `%${j}`;
            ruler.appendChild(mark);
        }

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 100;
        slider.value = 50; // Başlangıçta ortada başlat
        slider.style.width = '100%';

        sliderWrapper.appendChild(targetText);
        sliderWrapper.appendChild(ruler);
        sliderWrapper.appendChild(slider);
        slidersContainer.appendChild(sliderWrapper);

        commands.push(targetValue);
        userInputs.push(slider);
    }

    let countdown = 13;
    commandText.textContent = `ATIŞA SON: ${countdown} saniye`;
    fireButton.disabled = false; // Fire tuşunu etkinleştir

    const countdownInterval = setInterval(() => {
        countdown--;
        commandText.textContent = `ATIŞA SON: ${countdown} saniye`;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            fireButton.disabled = true; // Süre dolduğunda fire tuşunu devre dışı bırak
            checkLevel3(true); // Süre dolduğunda otomatik olarak başarısız say
        }
    }, 1000);
}

function checkLevel3(timeUp = false) {
    fireButton.disabled = true; // Fire tuşunu devre dışı bırak

    if (timeUp) {
        resultDiv.textContent = "ATIŞ BAŞARISIZ! PERVANE AYAKLARA ÇARPTI :(";
        failSound.play(); // Başarısızlık ses efektini çal
        success = false; // Başarısızlık durumunu ayarla
        startButton.textContent = "TEKRAR DENEME"; // Başarısızlık durumunda tuş ismini değiştir
        startButton.disabled = false;
        return;
    }

    let allCorrect = true;
    const tolerance = 5; // Hata payı

    for (let i = 0; i < userInputs.length; i++) {
        const userValue = parseInt(userInputs[i].value);
        const targetValue = commands[i];
        if (userValue < targetValue - tolerance || userValue > targetValue + tolerance) {
            allCorrect = false;
            break;
        }
    }

    if (allCorrect) {
        resultDiv.textContent = `LEVEL 3 BAŞARILI!`;
        successSound.play(); // Başarı ses efektini çal
        success = true; // Başarı durumunu ayarla
        startButton.textContent = "OYUN BİTTİ"; // Başarı durumunda tuş ismini değiştir
        startButton.disabled = true; // Oyun bittikten sonra startButton devre dışı bırakılır
    } else {
        resultDiv.textContent = "ATIŞ BAŞARISIZ! PERVANE AYAKLARA ÇARPTI :(";
        failSound.play(); // Başarısızlık ses efektini çal
        success = false; // Başarısızlık durumunu ayarla
        startButton.textContent = "TEKRAR DENEME"; // Başarısızlık durumunda tuş ismini değiştir
        startButton.disabled = false;
    }
}

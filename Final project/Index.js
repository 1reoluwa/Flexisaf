const music = document.getElementById("bg-music");
music.volume = 0.5;

document.addEventListener("click", () => {
    if (music.paused) {
        music.play().catch(err => console.log("Autoplay blocked:", err));
    }
}, { once: true });

const cardImages = {
    Alphabets: [
        'Images/a.png', 'Images/b.png', 'Images/c.png', 'Images/d.png',
        'Images/e.png', 'Images/f.png', 'Images/g.png', 'Images/h.png'
    ],
    Vegetables: [
        'Images/pepper.png', 'Images/mushroom.png', 'Images/okoro.png', 'Images/ginger.png',
        'Images/galic.png', 'Images/corn.png', 'Images/cabbege.png', 'Images/carrot.png'
    ],
    Animals: [
        'Images/cat.png', 'Images/rat.png', 'Images/pig.png', 'Images/fish.png',
        'Images/frog.png', 'Images/cow.png', 'Images/ele.png', 'Images/lion.png'
    ],
    Nature: [
        'Images/rainbow.png', 'Images/earth.png', 'Images/cloud.png', 'Images/lava.png',
        'Images/moon.png', 'Images/rain.png', 'Images/rose.png', 'Images/sun.png'
    ],
    "Social Media": [
        'Images/atw.png', 'Images/ayt.png', 'Images/ali.png', 'Images/afb.png',
        'Images/aig.png', 'Images/awh.png', 'Images/asp.png', 'Images/asc.png'
    ],
    Flags: [
        'Images/usa.png', 'Images/cd.png', 'Images/sa.png', 'Images/am.png',
        'Images/china.png', 'Images/ar.png', 'Images/in.png', 'Images/k.png'
    ]
};

let flippedCards = [];
let lockBoard = false;
let matchesFound = 0;
let wrongTries = 0;
const maxWrongTries = 10;

let timeLimit = 60;
let timeLeft = timeLimit;
let timerInterval = null;
let isPaused = false;


let attempts = 0;

const timeElement = document.getElementById("time");
const attemptsElement = document.getElementById("attempts");
const pauseButton = document.getElementById("pauseBtn");
const restartButton = document.getElementById("restartBtn");
const messageEl = document.getElementById("messageBox");


function showMessage(text) {
    messageEl.textContent = text;
    messageEl.classList.add("show");

    setTimeout(() => {
        messageEl.classList.remove("show");
    }, 2500);
}

function updateScoreBoard() {
    attemptsElement.textContent = `Attempts: ${attempts}`;
    timeElement.textContent = `Time: ${timeLeft}s`;
}

function startCountdown() {
    document.getElementById('categoryContainer').style.display = 'none';
    const countdownDiv = document.getElementById('countdown');
    countdownDiv.style.display = 'block';

    let count = 3;
    countdownDiv.textContent = count;

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDiv.textContent = count;
        } else {
            clearInterval(interval);
            countdownDiv.style.display = 'none';
            document.getElementById('gameContainer').style.display = 'grid';
            startGame();
        }
    }, 1000);
}

function startGame() {
    clearInterval(timerInterval);
    timeLeft = timeLimit;
    isPaused = false;
    matchesFound = 0;
    wrongTries = 0;
    flippedCards = [];
    lockBoard = false;

    

    updateScoreBoard();
    startTimer();

    const category = document.getElementById('categorySelect').value;
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = '';

    const images = cardImages[category];
    const cards = [...images, ...images].sort(() => Math.random() - 0.5);

    cards.forEach((imgSrc) => {
        const card = document.createElement('div');
        card.classList.add('card', 'face-up');
        card.dataset.image = imgSrc;

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = imgSrc.split('/').pop().split('.')[0];
        card.appendChild(img);

        card.addEventListener('click', () => flipCard(card));
        gameContainer.appendChild(card);
    });

    setTimeout(() => {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.innerHTML = '';
            card.classList.remove('face-up');
            card.classList.add('face-down');
        });
    }, 3000);
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('face-up') || isPaused) return;

    const img = document.createElement('img');
    img.src = card.dataset.image;
    img.alt = card.dataset.image.split('/').pop().split('.')[0];
    card.appendChild(img);

    card.classList.remove('face-down');
    card.classList.add('face-up');

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    lockBoard = true;
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        matchesFound++;

        if (matchesFound === 2) showMessage("Amazing!");
        if (matchesFound === 4) showMessage("Wonderful!");
        if (matchesFound === 6) showMessage("Keep Going!");
        if (matchesFound === 8) showMessage("Champion!");

        flippedCards = [];
        lockBoard = false;

        
        if (matchesFound === cardImages[document.getElementById('categorySelect').value].length) {
            attempts++;                 
            updateScoreBoard();
            alert('You won!');
            startCountdown();
        }
    } else {
        wrongTries++;
        setTimeout(() => {
            card1.innerHTML = '';
            card1.classList.remove('face-up');
            card1.classList.add('face-down');

            card2.innerHTML = '';
            card2.classList.remove('face-up');
            card2.classList.add('face-down');

            flippedCards = [];
            lockBoard = false;
        }, 1000);

       
        if (wrongTries >= maxWrongTries) {
            attempts++;                 
            updateScoreBoard();
            alert('You lost!');
            startCountdown();
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateScoreBoard();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                attempts++;             
                updateScoreBoard();
                alert('Time’s up! You lost.');
                startCountdown();
            }
        }
    }, 1000);
}

pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';

    if (isPaused) {
        music.pause();
    } else {
        music.play();
    }
});

restartButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    window.location.href = "index.html";
});

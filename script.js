const timerDurations = {
    work: 25 * 60,  // 25 minutes
    rest: 5 * 60,   // 5 minutes
    break: 15 * 60  // 15 minutes
};

let currentMode = 'work';
let timeLeft = timerDurations.work;
let timerId = null;
const timerDisplay = document.querySelector('.timer');
const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');
const modeButtons = document.querySelectorAll('.mode-btn');
const hpBar = document.querySelector('.hp-bar');
const animationMessage = document.querySelector('.animation-message');
const workTally = document.querySelector('.work-tally');
const restTally = document.querySelector('.rest-tally');
const breakTally = document.querySelector('.break-tally');

let sessionCounts = {
    work: 0,
    rest: 0,
    break: 0
};

function updateHPBar() {
    const percent = (timeLeft / timerDurations[currentMode]) * 100;
    hpBar.style.width = percent + '%';
    hpBar.className = `hp-bar ${currentMode}`;
}

function showAnimationMessage(type) {
    if (type === 'levelup') {
        animationMessage.textContent = 'Level Up!';
        animationMessage.className = 'animation-message levelup';
    } else if (type === 'faint') {
        animationMessage.textContent = 'Fainted!';
        animationMessage.className = 'animation-message faint';
    }
    setTimeout(() => {
        animationMessage.className = 'animation-message';
        animationMessage.textContent = '';
    }, 1800);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateHPBar();
    renderTally();
}

function setMode(mode) {
    currentMode = mode;
    timeLeft = timerDurations[mode];
    updateDisplay();
    
    // Update active button
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    // Reset timer state
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    toggleBtn.textContent = 'Start';
    toggleBtn.classList.remove('stopped');
    animationMessage.className = 'animation-message';
    animationMessage.textContent = '';
}

function toggleTimer() {
    if (timerId === null) {
        // Start the timer
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                toggleBtn.textContent = 'Start';
                toggleBtn.classList.remove('stopped');
                incrementTally(currentMode);
                if (currentMode === 'work') {
                    showAnimationMessage('levelup');
                } else {
                    showAnimationMessage('faint');
                }
            }
        }, 1000);
        toggleBtn.textContent = 'Stop';
        toggleBtn.classList.add('stopped');
    } else {
        // Stop the timer
        clearInterval(timerId);
        timerId = null;
        toggleBtn.textContent = 'Start';
        toggleBtn.classList.remove('stopped');
    }
}

function resetTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    timeLeft = timerDurations[currentMode];
    updateDisplay();
    toggleBtn.textContent = 'Start';
    toggleBtn.classList.remove('stopped');
    animationMessage.className = 'animation-message';
    animationMessage.textContent = '';
}

function renderTally() {
    // Poké Ball SVG
    const pokeballSVG = `
        <svg class="pokeball" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="15" fill="#fff" stroke="#222" stroke-width="2"/>
            <path d="M1 16h30" stroke="#222" stroke-width="2"/>
            <path d="M1 16a15 15 0 0 1 30 0" fill="#f00"/>
            <circle cx="16" cy="16" r="5" fill="#fff" stroke="#222" stroke-width="2"/>
            <circle cx="16" cy="16" r="2" fill="#fff" stroke="#222" stroke-width="2"/>
        </svg>
    `;
    workTally.innerHTML = '<span class="tally-label">Work</span>' +
        Array(sessionCounts.work).fill(pokeballSVG).join('');
    restTally.innerHTML = '<span class="tally-label">Rest</span>' +
        Array(sessionCounts.rest).fill('<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" alt="Snorlax" title="Snorlax">').join('');
    breakTally.innerHTML = '<span class="tally-label">Break</span>' +
        Array(sessionCounts.break).fill('<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png" alt="Cubone" title="Cubone">').join('');
}

function incrementTally(mode) {
    sessionCounts[mode]++;
    renderTally();
}

// Add event listeners for mode buttons
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        setMode(button.dataset.mode);
    });
});

toggleBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial display
updateDisplay(); 
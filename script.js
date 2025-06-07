// Game state
let secretCode = [];
let currentAttempt = 1;
const MAX_ATTEMPTS = 10;

// DOM Elements
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-guess');
const currentAttemptDisplay = document.getElementById('current-attempt');
const currentFeedback = document.getElementById('current-feedback');
const historyEntries = document.getElementById('history-entries');
const memeContainer = document.getElementById('meme-container');
const resultModal = document.getElementById('result-modal');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultImage = document.getElementById('result-image');
const playAgainButton = document.getElementById('play-again');

// Initialize the game
function initGame() {
    // Generate a new secret code
    secretCode = generateSecretCode();
    
    // Reset game state
    currentAttempt = 1;
    currentAttemptDisplay.textContent = currentAttempt;
    currentFeedback.innerHTML = '';
    historyEntries.innerHTML = '';
    
    // Clear meme container
    memeContainer.innerHTML = '';
    
    // Reset input
    guessInput.value = '';
    guessInput.disabled = false;
    submitButton.disabled = false;
    guessInput.focus();
    
    // Hide result modal if it's open
    resultModal.style.display = 'none';
}

// Generate a random 4-digit secret code with unique digits
function generateSecretCode() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle the array
    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    // Take first 4 digits
    return digits.slice(0, 4);
}

// Calculate bulls and cows for a guess
function calculateFeedback(guess) {
    let bulls = 0;
    let cows = 0;
    const unmatchedSecret = [];
    const unmatchedGuess = [];

    // First pass: count bulls
    for (let i = 0; i < 4; i++) {
        if (secretCode[i] === parseInt(guess[i])) {
            bulls++;
        } else {
            unmatchedSecret.push(secretCode[i]);
            unmatchedGuess.push(parseInt(guess[i]));
        }
    }

    // Second pass: count cows
    const secretCounts = {};
    unmatchedSecret.forEach(num => {
        secretCounts[num] = (secretCounts[num] || 0) + 1;
    });

    unmatchedGuess.forEach(num => {
        if (secretCounts[num] > 0) {
            cows++;
            secretCounts[num]--;
        }
    });

    return { bulls, cows };
}

// Handle guess submission
function handleGuess() {
    const guess = guessInput.value;
    
    // Validate input
    if (!/^\d{4}$/.test(guess)) {
        alert('Please enter exactly 4 digits');
        return;
    }
    
    // Check for duplicate digits
    const uniqueDigits = new Set(guess.split(''));
    if (uniqueDigits.size !== 4) {
        alert('All digits must be unique');
        return;
    }
    
    // Calculate feedback
    const { bulls, cows } = calculateFeedback(guess);
    
    // Add to history
    addToHistory(guess, bulls, cows);
    
    // Show current feedback
    showFeedback(bulls, cows);
    
    // Check for win
    if (bulls === 4) {
        endGame(true);
        return;
    }
    
    // Check for game over
    if (currentAttempt >= MAX_ATTEMPTS) {
        endGame(false);
        return;
    }
    
    // Prepare for next attempt
    currentAttempt++;
    currentAttemptDisplay.textContent = currentAttempt;
    guessInput.value = '';
    guessInput.focus();
    
    // Show meme on specific attempts (3, 5, 7, 9)
    if ([3, 5, 7, 9].includes(currentAttempt - 1)) {
        showMeme(currentAttempt - 1);
    }
}

// Add entry to history
function addToHistory(guess, bulls, cows) {
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    
    // Create feedback dots
    const feedbackDots = document.createElement('div');
    feedbackDots.className = 'feedback-dots';
    
    // Add bull dots
    for (let i = 0; i < bulls; i++) {
        const bullDot = document.createElement('div');
        bullDot.className = 'dot bull';
        feedbackDots.appendChild(bullDot);
    }
    
    // Add cow dots
    for (let i = 0; i < cows; i++) {
        const cowDot = document.createElement('div');
        cowDot.className = 'dot cow';
        feedbackDots.appendChild(cowDot);
    }
    
    // Add empty dots for remaining spaces
    const remainingDots = 4 - (bulls + cows);
    for (let i = 0; i < remainingDots; i++) {
        const emptyDot = document.createElement('div');
        emptyDot.className = 'dot';
        feedbackDots.appendChild(emptyDot);
    }
    
    entry.innerHTML = `
        <span>${currentAttempt}</span>
        <span>${guess}</span>
    `;
    
    const feedbackCell = document.createElement('span');
    feedbackCell.appendChild(feedbackDots);
    entry.appendChild(feedbackCell);
    
    // Add to the top of the history
    if (historyEntries.firstChild) {
        historyEntries.insertBefore(entry, historyEntries.firstChild);
    } else {
        historyEntries.appendChild(entry);
    }
}

// Show feedback for current guess
function showFeedback(bulls, cows) {
    currentFeedback.innerHTML = '';
    
    // Add bull dots
    for (let i = 0; i < bulls; i++) {
        const bullDot = document.createElement('div');
        bullDot.className = 'dot bull';
        currentFeedback.appendChild(bullDot);
    }
    
    // Add cow dots
    for (let i = 0; i < cows; i++) {
        const cowDot = document.createElement('div');
        cowDot.className = 'dot cow';
        currentFeedback.appendChild(cowDot);
    }
    
    // Add empty dots for remaining spaces
    const remainingDots = 4 - (bulls + cows);
    for (let i = 0; i < remainingDots; i++) {
        const emptyDot = document.createElement('div');
        emptyDot.className = 'dot';
        currentFeedback.appendChild(emptyDot);
    }
}

// Show meme based on attempt number
function showMeme(attempt) {
    // Clear previous meme
    memeContainer.innerHTML = '';
    
    // Create image element
    const img = document.createElement('img');
    img.src = `memepics/Pic${String(attempt).padStart(2, '0')}.png`;
    img.alt = `Meme for attempt ${attempt}`;
    
    // Add to container
    memeContainer.appendChild(img);
}

// End the game
function endGame(isWin) {
    // Disable input
    guessInput.disabled = true;
    submitButton.disabled = true;
    
    // Set result modal content
    if (isWin) {
        resultTitle.textContent = 'Congratulations!';
        resultMessage.textContent = `You've cracked the code in ${currentAttempt} attempts!`;
        resultImage.style.backgroundImage = 'url("memepics/WinPic.png")';
    } else {
        resultTitle.textContent = 'Game Over!';
        resultMessage.textContent = `The secret code was: ${secretCode.join('')}`;
        resultImage.style.backgroundImage = 'url("memepics/LosePic.png")';
    }
    
    // Show modal
    resultModal.style.display = 'flex';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    initGame();
    
    // Handle guess submission
    submitButton.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    
    // Handle play again
    playAgainButton.addEventListener('click', () => {
        resultModal.style.display = 'none';
        initGame();
    });
    
    // Prevent non-numeric input
    guessInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    
    // Limit to 4 digits
    guessInput.addEventListener('input', (e) => {
        if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
        }
    });
});

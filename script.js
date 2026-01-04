// Select DOM elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-operation="delete"]');
const allClearButton = document.querySelector('[data-all-clear]');
const squareButton = document.querySelector('[data-square]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Variables to store the state of the calculator
let currentOperand = '';
let previousOperand = '';
let operation = undefined;

// Function to clear the calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
}

// Function to delete the last digit
function deleteNumber() {
    if (currentOperand === '0') return; // Don't delete if it's just 0
    currentOperand = currentOperand.toString().slice(0, -1);
    if (currentOperand === '') {
        currentOperand = '0';
    }
}

// Function to append a number to the screen
function appendNumber(number) {
    // Prevent multiple decimals
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Prevent multiple leading zeros (e.g. 0000)
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number.toString();
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
}

// Function to choose an operation (+, -, *, /, %)
function chooseOperation(op) {
    if (currentOperand === '') return;
    
    // If we already have a previous operand, compute the result first
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

// Function to calculate the square of the current number
function squareNumber() {
    if (currentOperand === '') return;
    
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    
    // Calculate square
    const result = current * current;
    currentOperand = result.toString();
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

// Function to compute the result based on the operation
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // If either is not a number, stop
    if (isNaN(prev) || isNaN(current)) return;
    
    // Switch or If/Else to handle operations
    if (operation === '+') {
        computation = prev + current;
    } else if (operation === '-') {
        computation = prev - current;
    } else if (operation === '*') {
        computation = prev * current;
    } else if (operation === '÷' || operation === '/') {
        if (current === 0) {
            alert("Cannot divide by zero!");
            return;
        }
        computation = prev / current;
    } else if (operation === '%') {
        computation = prev % current;
    } else {
        return;
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
}

// Function to format the number for display (add commas)
function getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

// Function to update the UI
function updateDisplay() {
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand);
    
    if (operation != null) {
        previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

// --- Event Listeners ---

// Number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.innerText);
        updateDisplay();
    });
});

// Operation buttons (+, -, *, /, %)
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.innerText === 'DEL') {
            deleteNumber();
            updateDisplay();
            return;
        }
        chooseOperation(button.innerText);
        updateDisplay();
    });
});

// Equals button
equalsButton.addEventListener('click', button => {
    compute();
    updateDisplay();
});

// All Clear button
allClearButton.addEventListener('click', button => {
    clear();
    updateDisplay();
});

// Square button (x²)
squareButton.addEventListener('click', button => {
    squareNumber();
});

// Keyboard support (Bonus functionality)
document.addEventListener('keydown', function(event) {
    if ((event.key >= 0 && event.key <= 9) || event.key === '.') {
        appendNumber(event.key);
        updateDisplay();
    }
    if (event.key === 'Backspace') {
        deleteNumber();
        updateDisplay();
    }
    if (event.key === 'Escape') {
        clear();
        updateDisplay();
    }
    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/' || event.key === '%') {
        let op = event.key;
        if (op === '/') op = '÷'; // Map slash to our division symbol
        chooseOperation(op);
        updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault(); // Prevent default enter behavior on buttons
        compute();
        updateDisplay();
    }
});

// Initialize display
clear();
updateDisplay();

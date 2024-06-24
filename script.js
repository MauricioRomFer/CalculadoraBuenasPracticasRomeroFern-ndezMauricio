// Objeto calculator para almacenar el estado de la calculadora
const calculator = {
    displayValue: '0', // El valor que se muestra en la pantalla de la calculadora
    operationValue: '', // La operación actual que se muestra en la pantalla
    firstOperand: null, // El primer operando en una operación
    waitingForSecondOperand: false, // Indica si estamos esperando el segundo operando
    operator: null, // El operador actual seleccionado
};

// Función para manejar la entrada de dígitos
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    // Si estamos esperando el segundo operando, el valor de la pantalla se reemplaza con el dígito ingresado
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        // Si no estamos esperando el segundo operando, concatenamos el dígito al valor actual de la pantalla
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    calculator.operationValue += digit; // Actualizamos la operación actual con el dígito ingresado
}

// Función para manejar la entrada de decimales
function inputDecimal(dot) {
    // Si estamos esperando el segundo operando, el valor de la pantalla se reemplaza con '0.'
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    // Si el valor actual de la pantalla no incluye un punto decimal, agregamos el punto
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
    calculator.operationValue += dot; // Actualizamos la operación actual con el punto decimal
}

// Función para manejar la selección de operadores
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator, operationValue } = calculator;
    const inputValue = parseFloat(displayValue);

    // Si hay un operador y estamos esperando el segundo operando, actualizamos el operador y la operación actual
    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        calculator.operationValue = operationValue.slice(0, -1) + nextOperator;
        return;
    }

    // Si el primer operando es nulo y el valor de entrada no es un número, asignamos el valor de entrada como el primer operando
    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        // Si hay un operador, realizamos el cálculo utilizando el operador actual y el primer operando
        const result = performCalculation[operator](firstOperand, inputValue);

        // Mostramos el resultado en la pantalla de la calculadora
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result; // Actualizamos el primer operando con el resultado
    }

    calculator.waitingForSecondOperand = true; // Indicamos que estamos esperando el segundo operando
    calculator.operator = nextOperator; // Actualizamos el operador
    calculator.operationValue += nextOperator; // Actualizamos la operación actual con el nuevo operador
}

// Objeto que contiene las funciones de cálculo para cada operador
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand,
};

// Función para restablecer la calculadora
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.operationValue = '';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Función para actualizar la pantalla de la calculadora
function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    const operation = document.querySelector('.calculator-operation');
    display.value = calculator.displayValue; // Actualizamos el valor de la pantalla con el valor actual de la calculadora
    operation.value = calculator.operationValue; // Actualizamos la operación con la operación actual de la calculadora
}

updateDisplay(); // Llamamos a la función para actualizar la pantalla al cargar la calculadora

// EventListener para los botones de la calculadora
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    // Si el botón es un operador, manejamos la operación correspondiente
    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay(); // Actualizamos la pantalla después de cada operación
        return;
    }

    // Si el botón es un decimal, manejamos la entrada del decimal
    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay(); // Actualizamos la pantalla después de cada entrada de decimal
        return;
    }

    // Si el botón es 'all-clear', restablecemos la calculadora
    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay(); // Actualizamos la pantalla después de restablecer la calculadora
        return;
    }

    // Para cualquier otro botón, manejamos la entrada del dígito
    inputDigit(target.value);
    updateDisplay(); // Actualizamos la pantalla después de cada entrada de dígito
});
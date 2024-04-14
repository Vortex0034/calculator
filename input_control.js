// отвечает за основные переменные и ввод
let numberButtons = document.querySelectorAll('.calculator_button');
let controlButtonsOperators = document.querySelectorAll('.control-calculator_button-operator');
let calculatorDisplay = document.querySelector('.calculator_display');
let eqButton = document.getElementById('eq_id');
let clsButton = document.getElementById('cls_id');
let clsOneButton = document.getElementById('cls_one_id');
let calculateMode = 'v1'; // текущий способ вычисления: v1 - через __lr, v2- свой вариант
let evaluated = false; // true, если вычисления закончились (для очистки поля)

inputValue = function(event) //контроль ввода цифры
{
    numberText = '';
    let inputString = calculatorDisplay.getAttribute('value');
    if (inputString == null || evaluated)
    {
        inputString = '';
        evaluated = false;
    }
    let countSymbols = inputString.length;
    if (event.key === undefined)
    {
        numberText = this.textContent;
    } else {
        numberText = event.key;
    
    } 

    if (inputString == '0' || (['-', '+', '*', '/'].includes(inputString[countSymbols - 2]) && inputString[countSymbols - 1] == '0'))
    {
        inputString = inputString.slice(0, countSymbols - 1); // для устрарения незначащих нулей
    }
    calculatorDisplay.setAttribute('value', inputString + numberText);
}


inputOperator = function(event) // контроль ввода оператора
{
    let operatorText = '';
    let inputString = calculatorDisplay.getAttribute('value');
    if (evaluated || inputString === null || inputString === '')
    {
        inputString = '0';
        evaluated = false;
    }
    inputString = checkParenthesisCount(inputString);
    let countSymbols = inputString.length;
    if (event.key === undefined)
    {
        operatorText = this.textContent;
    } else {
        operatorText = event.key;
    }

    if (['-', '+', '*', '/'].includes(inputString[countSymbols - 1]) && ['/', '*', '+'].includes(operatorText) ||
        ['-', '+'].includes(inputString[countSymbols - 1]) && ['-', '+'].includes(operatorText)) 
    {
        inputString = inputString.slice(0, countSymbols - 1); // устранение предыдущего оператора при вводе нового
        if (inputString[inputString.length - 1] == '(') 
        {
            inputString = inputString.slice(0, countSymbols - 3); // устранение сразу двух символов при нажатии "с", если была открыта скобка с минусом
        }
    } else if (['*', '/'].includes(inputString[countSymbols - 1]) && operatorText === '-')
    {
        inputString += '('; // открытие скобки, если после * или / введён минус
    }
    calculatorDisplay.setAttribute('value', inputString + operatorText);
}


checkParenthesisCount = function(inputString) // закрытие скобки, если она открывалась
{
    let openParenthesisCount = inputString.split('(').length - 1;
    let closeParenthesisCount = inputString.split(')').length - 1;
    if (openParenthesisCount > closeParenthesisCount && inputString[inputString.length - 1] != '-') // закрытие скобки, если она открывалась
    {
        inputString += ')';
    }
    return inputString;
}


clearOneSymbol = function(event) //очистка одного символа
{
    let current = calculatorDisplay.getAttribute('value');
    let currentLen = current.length;
    if (current.slice(currentLen-2, currentLen) === '(-')
    {
        current = current.slice(0, current.length - 2);
    } else {
        current = current.slice(0, current.length - 1);
    }
    
    calculatorDisplay.setAttribute('value', current);
}


clearDisplay = function(event) //очистить окно ввода
{
    calculatorDisplay.setAttribute('value', '');
}


symbolsControl = function(event)
{
    event.preventDefault();
    let allowedSymbols = [];
    for (let i = 0; i < 10; i++)
    {
        allowedSymbols.push(String(i));
    }
    if (allowedSymbols.includes(event.key))
    {
        inputValue(event);
    }

    if (['-', '+', '/', '*'].includes(event.key))
    {
        inputOperator(event);
    }

    if (event.key === '=')
    {
        if (calculateMode === 'v1')
        {
            calculate(event);
        } else if (calculateMode === 'v2')
        {
            calculateWithParse(event);
        }
    }

    if (event.key === 'Backspace')
    {
        clearOneSymbol(event);
    }
}


for (let num = 0; num < numberButtons.length; num++) 
{
    numberButtons[num].addEventListener('click', inputValue);
}


for (let num = 0; num < controlButtonsOperators.length; num++) 
{
    controlButtonsOperators[num].addEventListener('click', inputOperator);
}

eqButton.onclick = calculate;
clsButton.onclick = clearDisplay;
clsOneButton.onclick = clearOneSymbol;
calculatorDisplay.onkeydown = symbolsControl;
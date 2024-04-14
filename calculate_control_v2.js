// вторая версия файла вычисления (со своим решением)

findOperand = function(expressionString, operator, poitionOfOperand) // нахождение одного из операндов умножения или сложения
{
    let currentOperand = ''
    let operatorIndex = expressionString.indexOf(operator);

    if (poitionOfOperand == 'second')
    {
        for (let symbol of expressionString.slice(operatorIndex + 1))
        {
            currentOperand += symbol;
        }
    } else if (poitionOfOperand == 'first')
    {
        for (let symbol of expressionString.slice(0, operatorIndex))
        {
            currentOperand += symbol;
        }
    }
    currentOperand = currentOperand.replace('(', '');
    currentOperand = currentOperand.replace(')', '');

    return Number(currentOperand);
}

switchMultDivOperator = function(fstElement, scndElement, operator)
{
    switch (operator)
    {
        case '*':
            fstElement *= scndElement;
            break;
        case '/':
            fstElement /= scndElement;
            break;
    }
    
    return fstElement;
}


replaceAt = function(currentString, index, replacement) // замена символа в строке по индекс
{
    return currentString.slice(0, index) + replacement + currentString.slice(index + 1, currentString.length);
}


simplifyExp = function(inputString) //упрощение выражения до содержания только + или - (раскрытие приоритетов операций)
{// принимает исходное выражение - возвращает выражение только с + и -
    let operator = '';
    let secondNumber = null;
    let fstNumber = null;
    let result = null;
    let searchRes = null;
    let currentExpression = '';
    let regexp = '';
    let prevSymbol = '';
    let prevSymbolIndex = 0;
    while (inputString.includes('*') || inputString.includes('/'))
    {
        if ((inputString.indexOf('*') > inputString.indexOf('/') || inputString.indexOf('*') < 0) && inputString.indexOf('/') >= 0)
        {
            searchRes = inputString.indexOf('/');
        } else {
            searchRes = inputString.indexOf('*');
        }
        operator = inputString[searchRes];

        
        regexp = /[0-9.]*[\*/][\(-]*[0-9.]*[\)]?/;

        currentExpression = inputString.match(regexp)[0]; // выделяем приоритетные операции * и /
        
        fstNumber = findOperand(currentExpression, operator, 'first');
        secondNumber = findOperand(currentExpression, operator, 'second');
        result = switchMultDivOperator(fstNumber, secondNumber, operator);

        if (result >= 0)
        {
            inputString = inputString.replace(currentExpression, String(result))
        } else {
            prevSymbolIndex = inputString.indexOf(currentExpression) - 1;
            prevSymbol = inputString[prevSymbolIndex];
            if (prevSymbol == '-')
            {
                inputString = replaceAt(inputString, prevSymbolIndex, '+'); // если перед заменяемым выражением стоял минус - меняем на плюс
            } else if (prevSymbol == '+')
            {
                inputString = replaceAt(inputString, prevSymbolIndex, '-');
            }
            result = String(result);
            if (prevSymbol !== undefined) // если предыдущий знак вообще существует (и он был изменён выше)
            {
                inputString = inputString.replace(currentExpression, result.slice(1, result.length)); // от вычисленного выражения убераем знак
            } else {
                inputString = inputString.replace(currentExpression, result);
            }
            if (inputString[0] == '+') // от бессмысленного плюса в начале (вылезает, если идут несколько выражений с */ подряд (иногда))
            {
                inputString = inputString.replace('+', '');
            }
        }
    }
    return inputString;
}


switchAddSubOperator = function(fstElement, scndElement, operator)
{
    switch (operator)
    {
        case '-':
            fstElement -= scndElement;
            break;
        case '+':
            fstElement += scndElement;
            break;
    }
    
    return fstElement;
}


calculateSubAddExpression = function(inputString) //вычисляет выражение, содержащее только сложение и вычитание
{
    let currentWord = '';
    let lastNumder = '';
    let currentOperator = '';

    for (let symbol of inputString)
    {
        if (!['-', '+'].includes(symbol) || (['-', '+'].includes(symbol) && currentWord == ''))
        {
            currentWord += symbol;
        } else {
            if (lastNumder === '')
            {
                lastNumder = Number(currentWord);
                currentWord = '';
                currentOperator = symbol;
            } else {
                lastNumder = switchAddSubOperator(lastNumder, Number(currentWord), currentOperator);
                currentWord = '';
                currentOperator = symbol;
            }
        }
    }

    if (lastNumder !== '')
    {
        lastNumder = switchAddSubOperator(lastNumder, Number(currentWord), currentOperator);
    } else {
        lastNumder = currentWord;
    }

    return lastNumder;

}


calculateWithParse = function(event) //вычислить выражение в окне
{
    let inputString = calculatorDisplay.getAttribute('value');

    if (!['-', '+', '/', '*'].includes(inputString[inputString.length - 1]))
    {
        console.log(`v2: исходная: ${inputString}`)
        inputString = simplifyExp(inputString);
        console.log(`v2: упрощённая: ${inputString}`)
        inputString = calculateSubAddExpression(inputString);
        console.log(`v2: результат: ${inputString}`)
        
        calculatorDisplay.setAttribute('value', inputString);
        evaluated = true;
    }
}
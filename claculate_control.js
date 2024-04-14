calculate = function(event) //вычислить выражение в окне
{
    let inputString = calculatorDisplay.getAttribute('value');
    if (!['-', '+', '/', '*'].includes(inputString[inputString.length - 1]))
    {
        console.log(`v1: исходная: ${inputString}`)
        inputString = checkParenthesisCount(inputString);

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.text = "window.__lr = " + inputString;
        document.body.appendChild(script);
        document.body.removeChild(script);

        var r = window.__lr;
        
        console.log(`v1: результат: ${r}`)
        calculatorDisplay.setAttribute('value', r);
        evaluated = true;
    }
}



// переключение режимов вычисления

const firstVButton = document.getElementById('v1_id');
const secondVButton = document.getElementById('v2_id');

chooseFirstVersion = function(event)
{
    firstVButton.style.backgroundColor = '#561666';
    secondVButton.style.backgroundColor = '#1a3a6b';
    eqButton.onclick = calculate;
    calculateMode = 'v1';
}

chooseSecondVersion = function(event)
{
    secondVButton.style.backgroundColor = '#561666';
    firstVButton.style.backgroundColor = '#1a3a6b';
    eqButton.onclick = calculateWithParse;
    calculateMode = 'v2';
}

firstVButton.onclick = chooseFirstVersion;
secondVButton.onclick = chooseSecondVersion;
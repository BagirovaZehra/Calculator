let buttons = document.querySelectorAll("button");
let input = document.querySelector("input");
let fullClean = document.querySelector(".full-clean");
let cleanOne = document.querySelector(".clean-one");
let equal = document.querySelector(".equal");

let isResultShown = false;

buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (button.classList.contains("equal")) return;

        let val = button.value;

        if (isResultShown) {
            if (/[0-9.]/.test(val)) {
                input.value = val;
            } else if (/[\+\-\*\/]/.test(val)) {
                input.value += val;
            }
            isResultShown = false;
        } else {
            input.value += val;
        }
    });
});

fullClean.addEventListener("click",deleteAll);
cleanOne.addEventListener("click", oneCharDelete);
equal.addEventListener("click", calculate);


function calculate() {
    isResultShown = true;
    let expression = input.value;

    let tokens = [];
    let numberBuffer = "";

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];

        if ("0123456789.".includes(char)) {
            numberBuffer += char;
        } else if ("+-*/".includes(char)) {
            if (char === '-' && (i === 0 || "+-*/".includes(expression[i - 1]))) {
                numberBuffer = '-';
            } else {
                if (numberBuffer) tokens.push(numberBuffer);
                tokens.push(char);
                numberBuffer = "";
            }
        }
    }

    if (numberBuffer) {
        tokens.push(numberBuffer);
    }

    let numbers = [parseFloat(tokens[0])];
    let operators = [];

    for (let i = 1; i < tokens.length; i += 2) {
        operators.push(tokens[i]);
        numbers.push(parseFloat(tokens[i + 1]));
    }

    for (let i = 0; i < operators.length;) {
        if (operators[i] === "*" || operators[i] === "/") {
            let res = operators[i] === "*"
                ? numbers[i] * numbers[i + 1]
                : numbers[i] / numbers[i + 1];
            numbers.splice(i, 2, res);
            operators.splice(i, 1);
        } else {
            i++;
        }
    }
    let finalResult = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === "+") {
            finalResult += numbers[i + 1];
        } else if (operators[i] === "-") {
            finalResult -= numbers[i + 1];
        }
    }

    input.value = finalResult;
}


function oneCharDelete(){
    input.value = input.value.slice(0,input.value.length-1)
}

function deleteAll(){
    input.value=""
}

document.addEventListener("keydown", function(e) {
    let key = e.key;

    if (isResultShown) {
        if (/[0-9.]/.test(key)) {
            input.value = key; 
            isResultShown = false;
            return;
        } else if (/[\+\-\*\/]/.test(key)) {
            input.value += key; 
            isResultShown = false;
            return;
        }
    }

    if (/[0-9+\-*/.]/.test(key)) {
        input.value += key;
    }

    if (key === "Enter") {
        e.preventDefault();
        calculate();
    }

    if (key === "Backspace") {
        e.preventDefault();
        oneCharDelete();
    }

    if (key === "Escape") {
        deleteAll();
    }
});

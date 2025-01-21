const buttonValues = [
    "AC", "+/-", "%", "\u00f7",
    "7", "8", "9", "\u00d7",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "="
];
const rightSymbols = ["\u00f7", "\u00d7", "-", "+", "="];
const topSymbols = ["AC", "+/-", "%"];

const display = document.getElementById("display");
const errorDisplay = document.getElementById("error");

let currentExpression = "";
let fontSize = 50;

function clearAll() {
    currentExpression = "";
    errorDisplay.innerText = "";
    display.style.fontSize = "50px"; 
    updateDisplay();
}

function adjustFontSize() {
    if (display.scrollWidth > display.clientWidth) {
        fontSize -= 5;
        display.style.fontSize = fontSize + "px";
    }
}

function calculateExpression(expression) {
    const tokens = expression.match(/(\d+\.?\d*|[+\-\u00d7\u00f7])/g);
    if (!tokens) return "Error";

    const stack = [];
    let currentOperator = null;

    for (const token of tokens) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else if (rightSymbols.includes(token)) {
            currentOperator = token;
        } else {
            return "Error";
        }

        if (stack.length >= 2 && currentOperator) {
            const b = stack.pop();
            const a = stack.pop();

            let result;
            switch (currentOperator) {
                case "+":
                    result = a + b;
                    break;
                case "-":
                    result = a - b;
                    break;
                case "\u00d7":
                    result = a * b;
                    break;
                case "\u00f7":
                    if (b === 0) return "Error: Division by zero";
                    result = a / b;
                    break;
                default:
                    return "Error";
            }
            stack.push(result);
            currentOperator = null;
        }
    }

    return stack.length === 1 ? stack[0].toString() : "Error";
}

function updateDisplay() {
    display.value = currentExpression || "0";
}

buttonValues.forEach(value => {
    const button = document.createElement("button");
    button.innerText = value;

    if (value === "0") {
        button.style.width = "180px";
        button.style.gridColumn = "span 2";
    } else if (rightSymbols.includes(value)) {
        button.style.backgroundColor = "#FF9500";
    } else if (topSymbols.includes(value)) {
        button.style.backgroundColor = "#D4D4D2";
        button.style.color = "#1C1C1C";
    }

    button.addEventListener("click", () => {
        if (rightSymbols.includes(value)) {
            if (value === "=") {
                currentExpression = calculateExpression(currentExpression);
            } else {
                currentExpression += value;
            }
        } else if (topSymbols.includes(value)) {
            if (value === "AC") {
                clearAll();
            } else if (value === "+/-") {
                if (currentExpression) {
                    currentExpression = currentExpression[0] === "-" ?
                        currentExpression.slice(1) :
                        "-" + currentExpression;
                }
            } else if (value === "%") {
                if (currentExpression) {
                    currentExpression = (parseFloat(currentExpression) / 100).toString();
                }
            }
        } else {
            if (value === ".") {
                if (!currentExpression.includes(".")) {
                    currentExpression += value;
                }
            } else {
                if (currentExpression.length < 15) {
                    currentExpression += value;
                } else {
                    errorDisplay.innerText = "Error: Maximum input length exceeded";
                }
            }
        }

        updateDisplay();
        adjustFontSize();
    });

    document.getElementById("buttons").appendChild(button);
});

updateDisplay();

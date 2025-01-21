const singleDigits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const teenNumbers = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const thousands = ["", "thousand", "million"];

function numberToWords(num) {
    if (num === 0) return "zero";

    let words = "";

    if (Math.floor(num / 1000000) > 0) {
        words += `${numberToWords(Math.floor(num / 1000000))} million `;
        num %= 1000000;
    }

    if (Math.floor(num / 1000) > 0) {
        words += `${numberToWords(Math.floor(num / 1000))} thousand `;
        num %= 1000;
    }

    if (Math.floor(num / 100) > 0) {
        words += `${numberToWords(Math.floor(num / 100))} hundred `;
        num %= 100;
    }

    if (num > 0) {
        if (words !== "") words += "and ";
        if (num < 10) words += singleDigits[num];
        else if (num < 20) words += teenNumbers[num - 10];
        else {
            words += tens[Math.floor(num / 10)];
            if (num % 10 > 0) words += `-${singleDigits[num % 10]}`;
        }
    }

    return words.trim();
}

document.getElementById("numberInput").addEventListener("input", function () {
    const input = this.value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const wordOutput = document.getElementById("wordOutput");

    wordOutput.value = "";
    errorMessage.textContent = "";

    if (!/^\d+$/.test(input)) {
        if (input !== "") errorMessage.textContent = "Please enter a valid number.";
        return;
    }

    const number = parseInt(input, 10);

    
    if (number === 1000000) {
        wordOutput.value = "one million";
    } else {
        wordOutput.value = numberToWords(number);
    }
});

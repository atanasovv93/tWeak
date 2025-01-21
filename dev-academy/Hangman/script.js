const container = document.getElementById("alphabetButtons");
let answerDisplay = document.getElementById("hold");
let answer = "";
let hint = "";
let life = 6;
let wordDisplay = [];
let winningCheck = "";
const containerHint = document.getElementById("clue");
const buttonHint = document.getElementById("hint");
const buttonReset = document.getElementById("reset");
const livesDisplay = document.getElementById("mylives");
let myStickman = document.getElementById("stickman");
let context = myStickman.getContext("2d");
const guessedLetters = new Set();

// Function to disable all alphabet buttons
function disableButtons() {
  const buttons = document.querySelectorAll(".alphabetButtonJS");
  buttons.forEach(button => {
    button.disabled = true;
  });
}

// Function to enable all alphabet buttons
function enableButtons() {
  const buttons = document.querySelectorAll(".alphabetButtonJS");
  buttons.forEach(button => {
    button.disabled = false;
    button.classList.remove("selected");
  });
}

function generateButton() {
  let buttonsHTML = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map(
      (letter) =>
        `<button class="alphabetButtonJS" id="${letter}">
          ${letter}
        </button>`
    )
    .join("");

  return buttonsHTML;
}

function handleClick(event) {
  const isButton = event.target.nodeName === "BUTTON";
  if (isButton) {
    const button = event.target;
    const guessedLetter = button.id;

    if (!guessedLetters.has(guessedLetter)) {
      guessedLetters.add(guessedLetter);
      button.disabled = true; 
      button.classList.add("selected");
      guess(guessedLetter);
    }
  }
}

const question = [
  "The Chosen Category Is Premier League Football Teams",
  "The Chosen Category Is Films",
  "The Chosen Category Is Cities"
];

const categories = [
  [
    "everton",
    "liverpool",
    "swansea",
    "chelsea",
    "hull",
    "manchester-city",
    "newcastle-united"
  ],
  [
    "alien", 
    "dirty-harry", 
    "gladiator", 
    "finding-nemo", 
    "jaws"
  ],
  [
    "manchester", 
    "milan", 
    "madrid", 
    "amsterdam", 
    "prague"
  ]
];

const hints = [
  [
    "Nicknamed 'The Toffees,' based in Merseyside",
    "Nicknamed 'The Reds,' famous anthem 'You'll Never Walk Alone'",
    "First Welsh club to play in the Premier League, nicknamed 'The Swans'",
    "Nicknamed 'The Blues,' based in London",
    "Nicknamed 'The Tigers,' known for their black-and-amber colors",
    "Nicknamed 'The Citizens,' known for recent Premier League dominance",
    "Nicknamed 'The Magpies,' based in the North East of England"
  ],
  [
    "A science-fiction horror film directed by Ridley Scott, featuring a deadly extraterrestrial creature",
    "A 1971 American action film starring Clint Eastwood as a tough San Francisco cop",
    "A historical drama set in ancient Rome, starring Russell Crowe as a gladiator",
    "A heartwarming animated film about a clownfish searching for his son",
    "A thriller featuring a giant great white shark, directed by Steven Spielberg"
  ],
  [
    "A northern city in the UK, known for its two famous football clubs and music scene",
    "An Italian city famous for its fashion, culture, and being home to AC and Inter Milan",
    "The capital of Spain, known for its royal palace and vibrant nightlife",
    "The capital of the Netherlands, famous for its canals and artistic heritage",
    "The capital of the Czech Republic, known for its historic Old Town and Charles Bridge"
  ]
];

function setAnswer() {
  const categoryOrder = Math.floor(Math.random() * categories.length);
  const chosenCategory = categories[categoryOrder];
  const wordOrder = Math.floor(Math.random() * chosenCategory.length);
  const chosenWord = chosenCategory[wordOrder];

  document.getElementById("categoryName").innerHTML = question[categoryOrder];
  answer = chosenWord;
  hint = hints[categoryOrder][wordOrder];
  wordDisplay = Array.from(chosenWord, (char) => (char === "-" ? "-" : "_"));
  answerDisplay.innerHTML = wordDisplay.join(" ");
}

function showHint() {
  containerHint.innerHTML = `Clue - ${hint}`;
}

function init() {
  answer = "";
  hint = "";
  life = 6;
  wordDisplay = [];
  winningCheck = "";
  guessedLetters.clear(); 
  context.clearRect(0, 0, myStickman.width, myStickman.height); 
  context.beginPath();
  canvas();
  containerHint.innerHTML = "";
  livesDisplay.innerHTML = `You have ${life} lives!`;
  setAnswer();
  container.innerHTML = generateButton();
  container.addEventListener("click", handleClick);
  enableButtons(); // Enable the buttons at the start of a new game
}

function guess(guessedLetter) {
  let correctGuess = false;

  answer.split("").forEach((letter, index) => {
    if (letter === guessedLetter) {
      wordDisplay[index] = guessedLetter;
      correctGuess = true;
    }
  });

  if (correctGuess) {
    answerDisplay.innerHTML = wordDisplay.join(" ");
    if (wordDisplay.join("") === answer) {
      livesDisplay.innerHTML = "YOU WIN!";
      disableButtons(); // Disable buttons when the game is won
    }
  } else {
    life--;
    livesDisplay.innerHTML = life > 1 ? `You have ${life} lives!` : life === 1 ? `You have 1 life!` : `GAME OVER! The word was: ${answer}`;
    animate();

    if (life === 0) {
      disableButtons(); // Disable buttons when the game is lost
    }
  }
}

function animate() {
  drawArray[6 - life]();
}

function canvas() {
  context.strokeStyle = "#fff";
  context.lineWidth = 2;

  frame1();
  frame2();
  frame3();
  frame4();
}

function draw($pathFromx, $pathFromy, $pathTox, $pathToy) {
  context.moveTo($pathFromx, $pathFromy);
  context.lineTo($pathTox, $pathToy);
  context.stroke();
}

function frame1() {
  draw(0, 150, 150, 150); // base
}

function frame2() {
  draw(10, 0, 10, 600); // vertical pole
}

function frame3() {
  draw(0, 5, 70, 5); // top bar
}

function frame4() {
  draw(60, 5, 60, 15); // rope
}

function head() {
  context.beginPath();
  context.arc(60, 25, 10, 0, Math.PI * 2, true);
  context.stroke();
}

function torso() {
  draw(60, 36, 60, 70);
}

function rightArm() {
  draw(60, 46, 100, 50);
}

function leftArm() {
  draw(60, 46, 20, 50);
}

function rightLeg() {
  draw(60, 70, 100, 100);
}

function leftLeg() {
  draw(60, 70, 20, 100);
}

let drawArray = [
  frame4, // rope
  head,   // head
  torso,  // torso
  leftArm, // left arm
  rightArm, // right arm
  leftLeg, // left leg
  rightLeg // right leg
];

buttonHint.addEventListener("click", showHint);
buttonReset.addEventListener("click", init);

window.onload = init;

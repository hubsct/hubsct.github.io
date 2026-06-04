const challengeType = document.getElementById("challenge-type");
const challengePrompt = document.getElementById("challenge-prompt");
const challengeVisual = document.getElementById("challenge-visual");
const challengeHint = document.getElementById("challenge-hint");
const challengeAnswer = document.getElementById("challenge-answer");
const newChallengeButton = document.getElementById("new-challenge");
const showAnswerButton = document.getElementById("show-answer");

function buildBarMarkup(numerator, denominator, label) {
  const segments = Array.from({ length: denominator }, (_, index) => {
    const filledClass = index < numerator ? "filled" : "";
    return `<span class="bar-segment ${filledClass}"></span>`;
  }).join("");

  return `
    <div class="challenge-set">
      <span class="challenge-label">${label}</span>
      <div class="bar-track" style="grid-template-columns: repeat(${denominator}, minmax(0, 1fr));">
        ${segments}
      </div>
    </div>
  `;
}

function buildCompareMarkup(left, right) {
  return `
    <div class="compare-row">
      <div class="compare-card">
        <strong>${left.n}/${left.d}</strong>
        ${buildBarMarkup(left.n, left.d, "Fraction A")}
      </div>
      <div class="compare-card">
        <strong>${right.n}/${right.d}</strong>
        ${buildBarMarkup(right.n, right.d, "Fraction B")}
      </div>
    </div>
  `;
}

const challengeBank = [
  {
    type: "Fraction basics",
    prompt: "A granola bar is split into 5 equal pieces. You eat 3 pieces. What fraction of the bar did you eat?",
    visual: buildBarMarkup(3, 5, "3 out of 5 pieces are gone"),
    hint: "Write the parts used on top and the total equal parts on the bottom.",
    answer: "<strong>3/5</strong>. The numerator is 3 because 3 pieces were eaten, and the denominator is 5 because the whole bar had 5 equal pieces.",
  },
  {
    type: "Simplify",
    prompt: "What is 4/8 in simplest form?",
    visual: buildBarMarkup(4, 8, "4 out of 8 pieces are shaded"),
    hint: "Divide the top and bottom by the same number.",
    answer: "<strong>1/2</strong>. Divide 4 and 8 by 4 to get 1/2.",
  },
  {
    type: "Add fractions",
    prompt: "What is 1/6 + 4/6?",
    visual: `
      ${buildBarMarkup(1, 6, "First fraction: 1/6")}
      ${buildBarMarkup(4, 6, "Second fraction: 4/6")}
    `,
    hint: "The denominators already match, so add only the numerators.",
    answer: "<strong>5/6</strong>. Keep the denominator 6 and add the numerators: 1 + 4 = 5.",
  },
  {
    type: "Add with a common denominator",
    prompt: "What is 1/2 + 1/4?",
    visual: `
      ${buildBarMarkup(1, 2, "Start with 1/2")}
      ${buildBarMarkup(1, 4, "Then add 1/4")}
    `,
    hint: "Rename 1/2 using fourths before you add.",
    answer: "<strong>3/4</strong>. Rewrite 1/2 as 2/4, then 2/4 + 1/4 = 3/4.",
  },
  {
    type: "Subtract fractions",
    prompt: "What is 7/8 - 3/8?",
    visual: `
      ${buildBarMarkup(7, 8, "Start with 7/8")}
      ${buildBarMarkup(3, 8, "Take away 3/8")}
    `,
    hint: "Keep the denominator 8 and subtract the numerators.",
    answer: "<strong>4/8</strong>, which simplifies to <strong>1/2</strong>.",
  },
  {
    type: "Multiply fractions",
    prompt: "What is 2/3 x 3/5?",
    visual: `
      <div class="challenge-set">
        <span class="challenge-label">Multiply across the top and across the bottom.</span>
      </div>
    `,
    hint: "2 x 3 goes on top and 3 x 5 goes on the bottom.",
    answer: "<strong>6/15</strong>, which simplifies to <strong>2/5</strong>.",
  },
  {
    type: "Compare fractions",
    prompt: "Which fraction is larger: 3/4 or 2/3?",
    visual: buildCompareMarkup({ n: 3, d: 4 }, { n: 2, d: 3 }),
    hint: "Look at how much of each whole is shaded, not just the top numbers.",
    answer: "<strong>3/4</strong> is larger. Three fourths covers more of a whole than two thirds.",
  },
];

let currentChallengeIndex = -1;

function renderChallenge(index) {
  const challenge = challengeBank[index];
  challengeType.textContent = challenge.type;
  challengePrompt.textContent = challenge.prompt;
  challengeVisual.innerHTML = challenge.visual;
  challengeHint.textContent = challenge.hint;
  challengeAnswer.innerHTML = challenge.answer;
  challengeAnswer.hidden = true;
}

function pickNewChallenge() {
  let nextIndex = Math.floor(Math.random() * challengeBank.length);

  if (challengeBank.length > 1) {
    while (nextIndex === currentChallengeIndex) {
      nextIndex = Math.floor(Math.random() * challengeBank.length);
    }
  }

  currentChallengeIndex = nextIndex;
  renderChallenge(currentChallengeIndex);
}

newChallengeButton.addEventListener("click", pickNewChallenge);

showAnswerButton.addEventListener("click", () => {
  challengeAnswer.hidden = false;
});

pickNewChallenge();

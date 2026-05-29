const explorerPanel = document.querySelector(".explorer-panel");
const sceneButtons = document.querySelectorAll("[data-scene]");
const denominatorButtons = document.querySelectorAll("[data-denominator]");
const numeratorValue = document.getElementById("numerator-value");
const denominatorValue = document.getElementById("denominator-value");
const numeratorSlider = document.getElementById("numerator-slider");
const numeratorDown = document.getElementById("numerator-down");
const numeratorUp = document.getElementById("numerator-up");
const sceneStory = document.getElementById("scene-story");
const fractionReadout = document.getElementById("fraction-readout");
const fractionWheel = document.getElementById("fraction-wheel");
const wheelValue = document.getElementById("wheel-value");
const wheelWord = document.getElementById("wheel-word");
const fractionBar = document.getElementById("fraction-bar");
const equivalentList = document.getElementById("equivalent-list");
const simplifiedText = document.getElementById("simplified-text");
const lineFill = document.getElementById("line-fill");
const lineMarker = document.getElementById("line-marker");

const quizType = document.getElementById("quiz-type");
const starMeter = document.getElementById("star-meter");
const quizQuestion = document.getElementById("quiz-question");
const quizVisual = document.getElementById("quiz-visual");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const quizScore = document.getElementById("quiz-score");
const quizTotal = document.getElementById("quiz-total");
const quizStreak = document.getElementById("quiz-streak");
const quizTip = document.getElementById("quiz-tip");
const checkAnswerButton = document.getElementById("check-answer");
const nextQuestionButton = document.getElementById("next-question");

const scenes = {
  pizza: {
    label: "Pizza Party",
    accent: "#ff8a5b",
    accentSoft: "#ffd3c0",
    unitSingular: "slice",
    unitPlural: "slices",
    story: "Imagine sharing one pizza equally with friends.",
  },
  chocolate: {
    label: "Chocolate Bar",
    accent: "#a47148",
    accentSoft: "#e6c7ad",
    unitSingular: "square",
    unitPlural: "squares",
    story: "Think of snapping a chocolate bar into equal pieces.",
  },
  garden: {
    label: "Garden Patch",
    accent: "#5fbf7a",
    accentSoft: "#c9f2d4",
    unitSingular: "patch",
    unitPlural: "patches",
    story: "Picture a garden split into equal planting spots.",
  },
  treasure: {
    label: "Treasure Map",
    accent: "#ffbf36",
    accentSoft: "#fff0b7",
    unitSingular: "zone",
    unitPlural: "zones",
    story: "Pretend the map is divided into equal treasure zones.",
  },
};

const numberWords = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
};

const denominatorWords = {
  2: { singular: "half", plural: "halves" },
  3: { singular: "third", plural: "thirds" },
  4: { singular: "quarter", plural: "quarters" },
  5: { singular: "fifth", plural: "fifths" },
  6: { singular: "sixth", plural: "sixths" },
  8: { singular: "eighth", plural: "eighths" },
  10: { singular: "tenth", plural: "tenths" },
  12: { singular: "twelfth", plural: "twelfths" },
};

const explorerState = {
  scene: "pizza",
  numerator: 3,
  denominator: 4,
};

const quizState = {
  score: 0,
  total: 0,
  streak: 0,
  current: null,
  selectedId: null,
  answered: false,
};

function formatFraction(fraction) {
  return `${fraction.n}/${fraction.d}`;
}

function gcd(first, second) {
  let a = Math.abs(first);
  let b = Math.abs(second);

  while (b !== 0) {
    const next = a % b;
    a = b;
    b = next;
  }

  return a || 1;
}

function simplifyFraction(fraction) {
  const divisor = gcd(fraction.n, fraction.d);
  return {
    n: fraction.n / divisor,
    d: fraction.d / divisor,
  };
}

function fractionValue(fraction) {
  return fraction.n / fraction.d;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = current;
  }

  return copy;
}

function randomFraction(options = {}) {
  const denominators = options.denominators || [2, 3, 4, 5, 6, 8];
  const denominator = randomFrom(denominators);
  const minNumerator = options.allowZero ? 0 : 1;
  const maxNumerator = options.allowWhole ? denominator : denominator - 1;
  const numerator = randomInt(minNumerator, maxNumerator);

  return { n: numerator, d: denominator };
}

function fractionName(numerator, denominator) {
  if (numerator === 0) {
    return "zero";
  }

  if (numerator === denominator) {
    return "one whole";
  }

  const denominatorWord =
    denominatorWords[denominator] || {
      singular: `${denominator}th`,
      plural: `${denominator}ths`,
    };
  const numberWord = numberWords[numerator] || String(numerator);

  return numerator === 1
    ? `${numberWord} ${denominatorWord.singular}`
    : `${numberWord} ${denominatorWord.plural}`;
}

function unitLabel(sceneKey, count) {
  const scene = scenes[sceneKey];
  return count === 1 ? scene.unitSingular : scene.unitPlural;
}

function buildBarMarkup(fraction, className = "") {
  const segments = Array.from({ length: fraction.d }, (_, index) => {
    const filledClass = index < fraction.n ? "filled" : "";
    return `<span class="bar-segment ${filledClass}"></span>`;
  }).join("");

  return `<div class="bar-track ${className}" style="grid-template-columns: repeat(${fraction.d}, minmax(0, 1fr));">${segments}</div>`;
}

function updateExplorerTheme() {
  const scene = scenes[explorerState.scene];

  explorerPanel.style.setProperty("--accent", scene.accent);
  explorerPanel.style.setProperty("--accent-soft", scene.accentSoft);
  fractionWheel.style.setProperty("--accent", scene.accent);
  fractionWheel.style.setProperty("--accent-soft", scene.accentSoft);

  sceneStory.textContent = scene.story;

  sceneButtons.forEach((button) => {
    const active = button.dataset.scene === explorerState.scene;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function updateExplorerControls() {
  if (explorerState.numerator > explorerState.denominator) {
    explorerState.numerator = explorerState.denominator;
  }

  numeratorSlider.max = String(explorerState.denominator);
  numeratorSlider.value = String(explorerState.numerator);
  numeratorValue.textContent = String(explorerState.numerator);
  denominatorValue.textContent = String(explorerState.denominator);

  denominatorButtons.forEach((button) => {
    const active = Number(button.dataset.denominator) === explorerState.denominator;
    button.classList.toggle("is-active", active);
  });
}

function updateExplorerVisuals() {
  const { numerator, denominator, scene } = explorerState;
  const fraction = { n: numerator, d: denominator };
  const ratio = denominator === 0 ? 0 : numerator / denominator;
  const angle = ratio * 360;
  const sliceAngle = 360 / denominator;
  const simplified = simplifyFraction(fraction);

  fractionWheel.style.setProperty("--filled-angle", `${angle}deg`);
  fractionWheel.style.setProperty("--slice-angle", `${sliceAngle}deg`);

  wheelValue.textContent = `${numerator}/${denominator}`;
  wheelWord.textContent = fractionName(numerator, denominator);
  fractionBar.innerHTML = buildBarMarkup(fraction);

  const partsLabel = unitLabel(scene, denominator);
  if (numerator === 0) {
    fractionReadout.textContent = `${numerator}/${denominator} means no ${partsLabel} are shaded yet.`;
  } else if (numerator === denominator) {
    fractionReadout.textContent = `${numerator}/${denominator} means all ${denominator} ${partsLabel} are shaded, so the whole is full.`;
  } else {
    fractionReadout.textContent = `${numerator}/${denominator} means ${numerator} of ${denominator} equal ${partsLabel} are shaded. That is ${fractionName(numerator, denominator)}.`;
  }

  const multipliers = [1, 2, 3, 4];
  equivalentList.innerHTML = multipliers
    .map((multiplier) => {
      const value = `${numerator * multiplier}/${denominator * multiplier}`;
      const label = multiplier === 1 ? "starting fraction" : `x${multiplier}`;
      const baseClass = multiplier === 1 ? "base" : "";
      return `<div class="equivalent-chip ${baseClass}"><strong>${value}</strong><span>${label}</span></div>`;
    })
    .join("");

  if (numerator === 0) {
    simplifiedText.textContent = `${numerator}/${denominator} means zero parts are chosen.`;
  } else if (numerator === denominator) {
    simplifiedText.textContent = `${numerator}/${denominator} equals 1 whole.`;
  } else if (simplified.n !== numerator || simplified.d !== denominator) {
    simplifiedText.textContent = `${numerator}/${denominator} can also be simplified to ${simplified.n}/${simplified.d}.`;
  } else {
    simplifiedText.textContent = `${numerator}/${denominator} is already in simplest form.`;
  }

  const linePercent = ratio * 100;
  const markerPosition = Math.max(2, Math.min(98, linePercent));
  lineFill.style.width = `${linePercent}%`;
  lineMarker.style.left = `${markerPosition}%`;
}

function renderExplorer() {
  updateExplorerTheme();
  updateExplorerControls();
  updateExplorerVisuals();
}

function buildCompareQuestion() {
  let left = randomFraction();
  let right = randomFraction();

  while (formatFraction(left) === formatFraction(right) || fractionValue(left) === fractionValue(right)) {
    left = randomFraction();
    right = randomFraction();
  }

  const correctId = fractionValue(left) > fractionValue(right) ? "left" : "right";

  return {
    typeLabel: "Compare challenge",
    prompt: "Which fraction is larger?",
    visual: `
      <div class="compare-visual">
        <div class="quiz-swatch">
          <strong>${formatFraction(left)}</strong>
          ${buildBarMarkup(left, "small")}
        </div>
        <div class="quiz-swatch">
          <strong>${formatFraction(right)}</strong>
          ${buildBarMarkup(right, "small")}
        </div>
      </div>
    `,
    options: [
      { id: "left", label: formatFraction(left) },
      { id: "right", label: formatFraction(right) },
    ],
    correctId,
    tip: "Look at how much of each whole is shaded, not just the top number.",
    explanation: `The larger fraction covers more of one whole.`,
  };
}

function buildEquivalentQuestion() {
  let base = randomFraction({ denominators: [2, 3, 4, 5, 6] });
  while (gcd(base.n, base.d) !== 1) {
    base = randomFraction({ denominators: [2, 3, 4, 5, 6] });
  }

  const multiplier = randomFrom([2, 3, 4]);
  const correct = { n: base.n * multiplier, d: base.d * multiplier };
  const baseSimple = simplifyFraction(base);

  const optionPool = [
    correct,
    { n: correct.n, d: correct.d + 1 },
    { n: correct.n + 1, d: correct.d },
    { n: base.n + 1, d: base.d },
    { n: correct.n - 1 || 1, d: correct.d },
    { n: correct.n, d: Math.max(2, correct.d - 1) },
  ];

  const options = [];
  const seen = new Set();
  function addEquivalentOption(option) {
    if (option.n <= 0 || option.d <= 0) {
      return false;
    }

    const key = formatFraction(option);
    if (seen.has(key)) {
      return false;
    }

    const simple = simplifyFraction(option);
    const isEquivalent = simple.n === baseSimple.n && simple.d === baseSimple.d;

    if (key !== formatFraction(correct) && isEquivalent) {
      return false;
    }

    options.push({ id: key, label: key });
    seen.add(key);
    return true;
  }

  optionPool.forEach(addEquivalentOption);

  while (options.length < 4) {
    const extra = randomFraction({
      allowWhole: true,
      denominators: [2, 3, 4, 5, 6, 8, 10, 12],
    });
    addEquivalentOption(extra);
  }

  const uniqueOptions = shuffleArray(options.slice(0, 4));

  return {
    typeLabel: "Equivalent challenge",
    prompt: `Which fraction is equal to ${formatFraction(base)}?`,
    visual: `
      <div class="identify-visual">
        <div class="quiz-swatch">
          <strong>${formatFraction(base)}</strong>
          ${buildBarMarkup(base, "small")}
        </div>
      </div>
    `,
    options: uniqueOptions,
    correctId: formatFraction(correct),
    tip: "Multiply the top and bottom by the same number to keep the amount the same.",
    explanation: `${formatFraction(correct)} matches ${formatFraction(base)} because both numbers were multiplied by ${multiplier}.`,
  };
}

function buildIdentifyQuestion() {
  const fraction = randomFraction({ allowWhole: true, denominators: [2, 3, 4, 5, 6, 8] });
  const candidates = [
    fraction,
    { n: Math.max(0, fraction.n - 1), d: fraction.d },
    { n: Math.min(fraction.d, fraction.n + 1), d: fraction.d },
    { n: fraction.n, d: fraction.d + 1 },
  ];

  const options = [];
  const seen = new Set();

  candidates.forEach((candidate) => {
    if (candidate.n < 0 || candidate.n > candidate.d) {
      return;
    }

    const key = formatFraction(candidate);
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    options.push({ id: key, label: key });
  });

  while (options.length < 4) {
    const extra = randomFraction({ allowWhole: true, denominators: [2, 3, 4, 5, 6, 8] });
    const key = formatFraction(extra);
    if (!seen.has(key)) {
      seen.add(key);
      options.push({ id: key, label: key });
    }
  }

  return {
    typeLabel: "Picture match",
    prompt: "Which fraction matches the picture?",
    visual: `
      <div class="identify-visual">
        <div class="quiz-swatch">
          <strong>Shaded bar</strong>
          ${buildBarMarkup(fraction, "small")}
        </div>
      </div>
    `,
    options: shuffleArray(options),
    correctId: formatFraction(fraction),
    tip: "Count the shaded parts first, then count the total equal parts.",
    explanation: `${formatFraction(fraction)} matches the picture because ${fraction.n} out of ${fraction.d} equal parts are shaded.`,
  };
}

function generateQuestion() {
  const builders = [buildCompareQuestion, buildEquivalentQuestion, buildIdentifyQuestion];
  return randomFrom(builders)();
}

function renderStars() {
  const streak = Math.min(quizState.streak, 5);
  starMeter.innerHTML = Array.from({ length: 5 }, (_, index) => {
    const litClass = index < streak ? "lit" : "";
    return `<span class="${litClass}">&#9733;</span>`;
  }).join("");
}

function renderScoreboard() {
  quizScore.textContent = String(quizState.score);
  quizTotal.textContent = String(quizState.total);
  quizStreak.textContent = String(quizState.streak);
  renderStars();
}

function renderQuestion() {
  quizState.current = generateQuestion();
  quizState.selectedId = null;
  quizState.answered = false;

  quizType.textContent = quizState.current.typeLabel;
  quizQuestion.textContent = quizState.current.prompt;
  quizVisual.innerHTML = quizState.current.visual;
  quizOptions.innerHTML = quizState.current.options
    .map((option) => `<button type="button" class="option-button" data-option-id="${option.id}">${option.label}</button>`)
    .join("");
  quizTip.textContent = quizState.current.tip;
  quizFeedback.textContent = "Pick an answer and hit check.";
  quizFeedback.className = "quiz-feedback";
  checkAnswerButton.disabled = true;
  nextQuestionButton.textContent = "New Challenge";
}

function selectOption(optionId) {
  if (quizState.answered) {
    return;
  }

  quizState.selectedId = optionId;
  checkAnswerButton.disabled = false;

  document.querySelectorAll(".option-button").forEach((button) => {
    const selected = button.dataset.optionId === optionId;
    button.classList.toggle("is-selected", selected);
  });
}

function checkAnswer() {
  if (quizState.answered || !quizState.selectedId) {
    return;
  }

  quizState.answered = true;
  quizState.total += 1;

  const correct = quizState.selectedId === quizState.current.correctId;
  if (correct) {
    quizState.score += 1;
    quizState.streak += 1;
    quizFeedback.textContent = `Nice job. ${quizState.current.explanation}`;
    quizFeedback.className = "quiz-feedback is-correct";
  } else {
    quizState.streak = 0;
    quizFeedback.textContent = `Not quite. ${quizState.current.explanation}`;
    quizFeedback.className = "quiz-feedback is-wrong";
  }

  document.querySelectorAll(".option-button").forEach((button) => {
    const optionId = button.dataset.optionId;
    button.classList.remove("is-selected");
    if (optionId === quizState.current.correctId) {
      button.classList.add("is-correct");
    } else if (optionId === quizState.selectedId) {
      button.classList.add("is-wrong");
    }
    button.disabled = true;
  });

  checkAnswerButton.disabled = true;
  nextQuestionButton.textContent = "Next Challenge";
  renderScoreboard();
}

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    explorerState.scene = button.dataset.scene;
    renderExplorer();
  });
});

denominatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    explorerState.denominator = Number(button.dataset.denominator);
    if (explorerState.numerator > explorerState.denominator) {
      explorerState.numerator = explorerState.denominator;
    }
    renderExplorer();
  });
});

numeratorSlider.addEventListener("input", () => {
  explorerState.numerator = Number(numeratorSlider.value);
  renderExplorer();
});

numeratorDown.addEventListener("click", () => {
  explorerState.numerator = Math.max(0, explorerState.numerator - 1);
  renderExplorer();
});

numeratorUp.addEventListener("click", () => {
  explorerState.numerator = Math.min(explorerState.denominator, explorerState.numerator + 1);
  renderExplorer();
});

quizOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option-id]");
  if (!button) {
    return;
  }
  selectOption(button.dataset.optionId);
});

checkAnswerButton.addEventListener("click", checkAnswer);
nextQuestionButton.addEventListener("click", renderQuestion);

renderExplorer();
renderScoreboard();
renderQuestion();

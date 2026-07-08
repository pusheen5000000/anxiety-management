/* ===== Help Kitty Think — game logic =====
   Drop your own art into games/thinking-errors/images/ named:
     cat-0.png ... cat-5.png   (6 cat sprites, sad -> happy)
     locked.png, unlocked.png (thought-bubble lock icons)
*/

(() => {
  // The 6 thinking errors, adapted from the reference sheet.
  // Each has a short kid-friendly description used as the "correct" quiz answer.
  const THINKING_ERRORS = [
    {
      name: 'Negative Glasses',
      description: 'Only seeing the things that go wrong, while anything good gets overlooked or ignored.',
    },
    {
      name: 'Blowing Things Up',
      description: 'Taking something negative and making it seem much bigger and worse than it really is.',
    },
    {
      name: 'Blame Me!',
      description: 'Feeling responsible for bad things that happen, even when you had little or no control over them.',
    },
    {
      name: '"Should" and "Must" Statements',
      description: 'Setting standards or expectations for yourself that are so high they are almost impossible to reach.',
    },
    {
      name: 'Mind Reading and Fortune Telling',
      description: 'Assuming you know what other people are thinking, or deciding something bad will happen before it does.',
    },
    {
      name: 'All-or-Nothing Thinking',
      description: 'Seeing everything as either perfect or a total failure, with nothing in between.',
    },
  ];

  const TOTAL = THINKING_ERRORS.length;
  const CAT_SPRITE_COUNT = 6; // cat-0.png (sad) ... cat-5.png (happy)

  const bubbleRow = document.getElementById('bubble-row');
  const catSprite = document.getElementById('cat-sprite');
  const progressText = document.getElementById('progress-text');

  const quizOverlay = document.getElementById('quiz-overlay');
  const quizTitle = document.getElementById('quiz-title');
  const optionA = document.getElementById('option-a');
  const optionB = document.getElementById('option-b');
  const quizFeedback = document.getElementById('quiz-feedback');

  const finishOverlay = document.getElementById('finish-overlay');

  let currentIndex = 0; // index of the active (unlocked, unsolved) bubble
  let bubbles = [];

  function buildBubbles() {
    THINKING_ERRORS.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'thought-bubble';

      const icon = document.createElement('img');
      icon.className = 'bubble-icon';
      icon.alt = i === 0 ? 'Unlocked thought bubble' : 'Locked thought bubble';
      btn.appendChild(icon);

      btn.addEventListener('click', () => {
        if (btn.classList.contains('locked') || btn.classList.contains('solved')) return;
        openQuiz(i);
      });

      bubbleRow.appendChild(btn);
      bubbles.push(btn);
    });

    updateBubbles();
  }

  function updateBubbles() {
    bubbles.forEach((btn, i) => {
      const icon = btn.querySelector('.bubble-icon');

      if (i < currentIndex) {
        btn.classList.add('solved');
        btn.classList.remove('active', 'locked');
      } else if (i === currentIndex) {
        btn.classList.remove('locked');
        btn.classList.add('active');
        icon.src = 'images/unlocked.png';
        icon.alt = 'Unlocked thought bubble';
      } else {
        btn.classList.add('locked');
        btn.classList.remove('active');
        icon.src = 'images/locked.png';
        icon.alt = 'Locked thought bubble';
      }
    });

    progressText.textContent = `Thought bubbles solved: ${currentIndex} / ${TOTAL}`;
  }

  function updateCatSprite() {
    const spriteIndex = Math.min(currentIndex, CAT_SPRITE_COUNT - 1);
    catSprite.src = `images/cat-${spriteIndex}.png`;
  }

  let activeQuestionIndex = null;

  function openQuiz(index) {
    activeQuestionIndex = index;
    const errorData = THINKING_ERRORS[index];

    // Pick a distractor description from a different thinking error.
    let wrongPoolIndex;
    do {
      wrongPoolIndex = Math.floor(Math.random() * TOTAL);
    } while (wrongPoolIndex === index);
    const wrongDescription = THINKING_ERRORS[wrongPoolIndex].description;

    quizTitle.textContent = `What is "${errorData.name}"?`;

    const correctFirst = Math.random() < 0.5;
    const optionAData = correctFirst
      ? { text: errorData.description, correct: true }
      : { text: wrongDescription, correct: false };
    const optionBData = correctFirst
      ? { text: wrongDescription, correct: false }
      : { text: errorData.description, correct: true };

    optionA.textContent = optionAData.text;
    optionA.dataset.correct = optionAData.correct;
    optionB.textContent = optionBData.text;
    optionB.dataset.correct = optionBData.correct;

    [optionA, optionB].forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove('incorrect');
    });
    quizFeedback.hidden = true;

    quizOverlay.hidden = false;
  }

  function handleOptionClick(btn) {
    const isCorrect = btn.dataset.correct === 'true';

    if (isCorrect) {
      quizOverlay.hidden = true;
      currentIndex += 1;
      updateBubbles();
      updateCatSprite();

      if (currentIndex >= TOTAL) {
        setTimeout(() => {
          finishOverlay.hidden = false;
        }, 300);
      }
    } else {
      btn.classList.add('incorrect');
      btn.disabled = true;
      quizFeedback.hidden = false;
    }
  }

  optionA.addEventListener('click', () => handleOptionClick(optionA));
  optionB.addEventListener('click', () => handleOptionClick(optionB));

  buildBubbles();
  updateCatSprite();
})();

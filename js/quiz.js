// =========================================
// DATA 10 SOAL (ARRAY BERISI OBJECT)
// =========================================
const questions = [
  {
    question:
      "1. Tag HTML5 semantik mana yang paling tepat untuk membungkus konten utama halaman?",
    options: ["<section>", "<main>", "<header>", "<aside>"],
    correctIndex: 1,
  },
  {
    question:
      "2. Di CSS3 murni, di mana biasanya kita menyimpan CSS Variables agar bisa dipakai ulang?",
    options: [":root", ".container", "* { }", "@media"],
    correctIndex: 0,
  },
  {
    question:
      "3. Method JavaScript mana yang digunakan untuk menyimpan data secara permanen di browser?",
    options: ["sessionStorage", "console.log", "localStorage", "alert"],
    correctIndex: 2,
  },
  {
    question:
      "4. Apa fungsi utama dari addEventListener('click', ...) pada sebuah tombol?",
    options: [
      "Menghapus elemen dari HTML",
      "Menjalankan fungsi saat tombol diklik pengguna",
      "Mengubah warna latar belakang otomatis",
      "Memuat ulang seluruh halaman",
    ],
    correctIndex: 1,
  },
  {
    question:
      "5. Aturan CSS mana yang dipakai agar tata letak menyesuaikan ukuran layar HP dan laptop?",
    options: ["@keyframes", "@import", "@font-face", "@media"],
    correctIndex: 3,
  },
  {
    question:
      "6. Mengapa validasi form penting sebelum data dikirim atau diproses?",
    options: [
      "Agar ukuran file CSS menjadi lebih kecil",
      "Mencegah input kosong atau data yang tidak sesuai format",
      "Agar halaman tidak membutuhkan tag <footer>",
      "Menggantikan fungsi tag <nav>",
    ],
    correctIndex: 1,
  },
  {
    question:
      "7. Properti CSS mana yang paling pas untuk mengatur susunan kartu secara 2 dimensi (baris & kolom)?",
    options: [
      "display: grid",
      "float: left",
      "position: fixed",
      "text-align: center",
    ],
    correctIndex: 0,
  },
  {
    question:
      "8. Method JavaScript mana yang dipakai untuk menghapus spasi di awal dan akhir teks input?",
    options: ["split()", "trim()", "push()", "parseInt()"],
    correctIndex: 1,
  },
  {
    question:
      "9. Tag HTML5 semantik mana yang biasa digunakan untuk bagian navigasi utama?",
    options: ["<nav>", "<article>", "<span>", "<hr>"],
    correctIndex: 0,
  },
  {
    question:
      "10. Mengapa kita mengubah array/object menjadi string dengan JSON.stringify() sebelum masuk localStorage?",
    options: [
      "Agar data otomatis terhapus saat browser ditutup",
      "Karena localStorage menyimpan data dalam bentuk string",
      "Agar CSS bisa membaca isi array langsung",
      "Untuk mempercepat koneksi internet",
    ],
    correctIndex: 1,
  },
];

const BEST_SCORE_KEY = "eduspace_quiz_best_score_v1";
const CHECK_DELAY_MS = 650;
const SLIDE_DURATION_MS = 220;

// =========================================
// VARIABEL STATE & ELEMEN DOM
// =========================================
let currentQuestionIndex = 0;
let score = 0;
let isLocked = false;
let bestScore = 0;

const questionCounterEl = document.getElementById("question-counter");
const bestScoreBadgeEl = document.getElementById("best-score-badge");
const progressFillEl = document.getElementById("progress-fill");
const quizAreaEl = document.getElementById("quiz-area");
const questionTextEl = document.getElementById("question-text");
const optionsContainerEl = document.getElementById("options-container");
const checkingLoaderEl = document.getElementById("checking-loader");
const feedbackEl = document.getElementById("quiz-feedback");
const nextBtnEl = document.getElementById("next-btn");
const quizTopBarEl = document.getElementById("quiz-top-bar");
const progressTrackEl = document.getElementById("progress-track");
const resultAreaEl = document.getElementById("result-area");
const finalScoreEl = document.getElementById("final-score");
const scoreDetailEl = document.getElementById("score-detail");
const evaluationMessageEl = document.getElementById("evaluation-message");
const restartBtnEl = document.getElementById("restart-btn");

function loadBestScore() {
  const savedBest = localStorage.getItem(BEST_SCORE_KEY);
  if (savedBest) {
    bestScore = Number(savedBest);
  } else {
    bestScore = 0;
  }
  updateBestScoreBadge();
}

function updateBestScoreBadge() {
  if (bestScoreBadgeEl) {
    bestScoreBadgeEl.textContent = "Skor Terbaik: " + bestScore;
  }
}

function updateProgressBar() {
  if (!progressFillEl) {
    return;
  }
  const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressFillEl.style.width = percent + "%";
}

function renderQuestion() {
  if (!questionTextEl || !optionsContainerEl || !nextBtnEl) {
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  isLocked = false;
  nextBtnEl.disabled = true;

  if (checkingLoaderEl) {
    checkingLoaderEl.classList.add("hidden");
  }

  if (feedbackEl) {
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback-text";
  }

  if (questionCounterEl) {
    questionCounterEl.textContent =
      "Soal " + (currentQuestionIndex + 1) + " dari " + questions.length;
  }

  updateProgressBar();
  questionTextEl.textContent = currentQuestion.question;
  optionsContainerEl.innerHTML = "";

  for (let i = 0; i < currentQuestion.options.length; i++) {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "option-btn";
    optionBtn.textContent = currentQuestion.options[i];

    optionBtn.addEventListener("click", function () {
      handleSelectOption(i, optionBtn);
    });

    optionsContainerEl.appendChild(optionBtn);
  }

  if (currentQuestionIndex === questions.length - 1) {
    nextBtnEl.textContent = "Lihat Hasil Akhir";
  } else {
    nextBtnEl.textContent = "Soal Berikutnya";
  }
}

function handleSelectOption(selectedIndex, clickedBtn) {
  if (isLocked) {
    return;
  }

  isLocked = true;
  const allOptionBtns = optionsContainerEl.querySelectorAll(".option-btn");

  for (let i = 0; i < allOptionBtns.length; i++) {
    allOptionBtns[i].disabled = true;
  }

  clickedBtn.classList.add("selected");

  if (checkingLoaderEl) {
    checkingLoaderEl.classList.remove("hidden");
  }

  setTimeout(function () {
    if (checkingLoaderEl) {
      checkingLoaderEl.classList.add("hidden");
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      score = score + 1;
      clickedBtn.classList.remove("selected");
      clickedBtn.classList.add("correct", "anim-correct");

      if (feedbackEl) {
        feedbackEl.textContent = "Benar! Jawaban kamu tepat.";
        feedbackEl.className = "feedback-text feedback-correct anim-pop";
      }
    } else {
      clickedBtn.classList.remove("selected");
      clickedBtn.classList.add("wrong", "anim-wrong");

      if (allOptionBtns[currentQuestion.correctIndex]) {
        allOptionBtns[currentQuestion.correctIndex].classList.add("correct");
      }

      if (feedbackEl) {
        feedbackEl.textContent =
          "Kurang tepat. Jawaban yang benar: " +
          currentQuestion.options[currentQuestion.correctIndex];
        feedbackEl.className = "feedback-text feedback-wrong anim-pop";
      }
    }

    isLocked = false;
    nextBtnEl.disabled = false;
  }, CHECK_DELAY_MS);
}

function slideToNextStep(callback) {
  if (!quizAreaEl) {
    callback();
    return;
  }

  quizAreaEl.classList.add("slide-out");

  setTimeout(function () {
    callback();
    quizAreaEl.classList.remove("slide-out");
    quizAreaEl.classList.add("slide-in");

    setTimeout(function () {
      quizAreaEl.classList.remove("slide-in");
    }, SLIDE_DURATION_MS);
  }, SLIDE_DURATION_MS);
}

function showResult() {
  if (quizTopBarEl) {
    quizTopBarEl.classList.add("hidden");
  }
  if (progressTrackEl) {
    progressTrackEl.classList.add("hidden");
  }
  if (quizAreaEl) {
    quizAreaEl.classList.add("hidden");
  }
  if (resultAreaEl) {
    resultAreaEl.classList.remove("hidden");
    resultAreaEl.classList.add("anim-pop");
  }

  const finalPoints = Math.round((score / questions.length) * 100);

  if (finalPoints > bestScore) {
    bestScore = finalPoints;
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
    updateBestScoreBadge();
  }

  if (finalScoreEl) {
    finalScoreEl.textContent = String(finalPoints);
  }
  if (scoreDetailEl) {
    scoreDetailEl.textContent =
      "Benar " +
      score +
      " dari " +
      questions.length +
      " soal (Skor Terbaik: " +
      bestScore +
      ")";
  }

  let gradeCategory = "rendah";
  if (finalPoints >= 80) {
    gradeCategory = "tinggi";
  } else if (finalPoints >= 50) {
    gradeCategory = "menengah";
  }

  if (!evaluationMessageEl) {
    return;
  }

  switch (gradeCategory) {
    case "tinggi":
      evaluationMessageEl.textContent =
        "Mantap banget! Pemahamanmu di atas rata-rata, siap buat presentasi dan Q&A!";
      evaluationMessageEl.className = "eval-message feedback-correct";
      break;
    case "menengah":
      evaluationMessageEl.textContent =
        "Bagus! Sudah cukup paham, tinggal review lagi bagian yang tadi sempat salah.";
      evaluationMessageEl.className = "eval-message";
      evaluationMessageEl.style.color = "#ffe28a";
      break;
    default:
      evaluationMessageEl.textContent =
        "Jangan menyerah! Ulas lagi materinya lalu coba ulangi kuis 10 soal ini.";
      evaluationMessageEl.className = "eval-message feedback-wrong";
      break;
  }
}

if (nextBtnEl) {
  nextBtnEl.addEventListener("click", function () {
    if (isLocked) {
      return;
    }

    isLocked = true;
    nextBtnEl.disabled = true;

    slideToNextStep(function () {
      currentQuestionIndex = currentQuestionIndex + 1;

      if (currentQuestionIndex < questions.length) {
        renderQuestion();
      } else {
        showResult();
      }
      isLocked = false;
    });
  });
}

if (restartBtnEl) {
  restartBtnEl.addEventListener("click", function () {
    currentQuestionIndex = 0;
    score = 0;
    isLocked = false;

    if (resultAreaEl) {
      resultAreaEl.classList.add("hidden");
      resultAreaEl.classList.remove("anim-pop");
    }
    if (quizTopBarEl) {
      quizTopBarEl.classList.remove("hidden");
    }
    if (progressTrackEl) {
      progressTrackEl.classList.remove("hidden");
    }
    if (quizAreaEl) {
      quizAreaEl.classList.remove("hidden");
      quizAreaEl.classList.add("slide-in");
      setTimeout(function () {
        quizAreaEl.classList.remove("slide-in");
      }, SLIDE_DURATION_MS);
    }

    renderQuestion();
  });
}

loadBestScore();
renderQuestion();

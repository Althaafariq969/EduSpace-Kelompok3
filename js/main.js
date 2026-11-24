// =========================================
// 1. NAVBAR RESPONSIF (MENU HAMBURGER)
// =========================================
const hamburgerBtn = document.getElementById("hamburger-btn");
const navMenu = document.getElementById("nav-menu");

if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });
}

// =========================================
// 2. TAB NAVIGATION & SEARCH KATALOG MODUL
// =========================================
const tabButtons = document.querySelectorAll(".tab-btn");
const courseCards = document.querySelectorAll(".course-card");
const searchInput = document.getElementById("catalog-search");
const emptyCatalogMsg = document.getElementById("empty-catalog-msg");

let activeCategory = "semua";

function filterCatalog() {
  if (courseCards.length === 0) {
    return;
  }

  let keyword = "";
  if (searchInput) {
    keyword = searchInput.value.trim().toLowerCase();
  }

  let visibleCount = 0;

  for (let i = 0; i < courseCards.length; i++) {
    const card = courseCards[i];
    const cardCategory = card.getAttribute("data-category");
    const cardText = card.textContent.toLowerCase();

    const matchCategory =
      activeCategory === "semua" || cardCategory === activeCategory;
    const matchKeyword = keyword === "" || cardText.includes(keyword);

    if (matchCategory && matchKeyword) {
      card.classList.remove("hidden");
      visibleCount = visibleCount + 1;
    } else {
      card.classList.add("hidden");
    }
  }

  if (emptyCatalogMsg) {
    if (visibleCount === 0) {
      emptyCatalogMsg.classList.remove("hidden");
    } else {
      emptyCatalogMsg.classList.add("hidden");
    }
  }
}

if (tabButtons.length > 0) {
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
      activeCategory = tabButtons[i].getAttribute("data-category");

      for (let j = 0; j < tabButtons.length; j++) {
        tabButtons[j].classList.remove("active");
      }
      tabButtons[i].classList.add("active");

      filterCatalog();
    });
  }
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    filterCatalog();
  });
}

// =========================================
// 3. DATA MODUL BELAJAR & JAWABAN QUIZ
// =========================================
const learningModules = {
  "html-css": {
    category: "Pemrograman",
    title: "Modul 1: HTML5 Semantik & CSS3 Murni",
    summary:
      "HTML5 semantik membantu memperjelas struktur halaman bagi browser dan pengembang, seperti <header>, <nav>, <main>, <section>, dan <footer>. Sementara CSS3 murni menggunakan :root untuk variabel warna/ukuran, CSS Grid untuk tata letak 2 dimensi, dan @media query agar tampilan nyaman di HP maupun laptop.",
    quizPoints: [
      "Konten utama halaman dibungkus dengan tag semantik: <main>.",
      "Penyimpanan CSS Variables global di CSS3 murni: :root.",
      "Aturan CSS untuk responsif HP & laptop: @media.",
      "Pengaturan tata letak baris & kolom 2 dimensi: display: grid.",
    ],
  },
  "js-dom": {
    category: "Pemrograman",
    title: "Modul 2: JavaScript DOM, Array & LocalStorage",
    summary:
      "Vanilla JavaScript menghubungkan logika program dengan elemen HTML melalui DOM Manipulation dan Event Listener. Data seperti daftar soal kuis atau target belajar dapat disimpan di localStorage menggunakan JSON.stringify() dan dibaca kembali dengan JSON.parse().",
    quizPoints: [
      "Fungsi addEventListener('click', ...): menjalankan fungsi saat tombol diklik.",
      "Penyimpanan data permanen di browser: localStorage.",
      "Mengapa pakai JSON.stringify()? Karena localStorage menyimpan data dalam bentuk string.",
      "Menghapus spasi berlebih di awal & akhir teks input: method trim().",
    ],
  },
  arab: {
    category: "Bahasa & Literasi",
    title: "Modul 3: Tata Bahasa Arab Dasar (Nahwu)",
    summary:
      "Dalam kaidah dasar bahasa Arab, setiap kata terbagi menjadi Ism (kata benda/nama), Fi'il (kata kerja), dan Harf (huruf penghubung). Memahami struktur kata membantu membaca teks dengan makna yang tepat.",
    quizPoints: [
      "Tiga pembagian utama kata dalam bahasa Arab: Ism, Fi'il, dan Harf.",
      "Ism menunjukkan nama orang, hewan, tempat, atau benda tanpa terikat waktu.",
      "Fi'il menunjukkan pekerjaan/peristiwa yang berkaitan dengan waktu.",
    ],
  },
  sunda: {
    category: "Bahasa & Literasi",
    title: "Modul 4: Sastra & Undak Usuk Basa Sunda",
    summary:
      "Undak Usuk Basa Sunda mengatur ragam bahasa sesuai situasi dan lawan bicara, seperti Basa Loma (akrab/sebaya) dan Basa Lemes (lebih hormat/sopan). Membiasakan ragam bahasa yang pas melatih komunikasi yang santun.",
    quizPoints: [
      "Ragam bahasa Sunda yang umum dipakai untuk teman sebaya/akrab: Basa Loma.",
      "Ragam bahasa Sunda yang digunakan untuk berbicara sopan/hormat: Basa Lemes.",
    ],
  },
  jaringan: {
    category: "Ekskul & Soft Skill",
    title: "Modul 5: Jaringan Komputer & Router",
    summary:
      "Router bertugas mengatur lalu lintas paket data antar jaringan, membagi bandwidth, serta mengelola jalur koneksi. Setiap pengaturan perlu dicek validitasnya agar tidak terjadi konflik IP atau salah konfigurasi.",
    quizPoints: [
      "Router menghubungkan dan mengarahkan trafik antar jaringan.",
      "Pengecekan input/konfigurasi mencegah kesalahan data atau konflik jaringan.",
    ],
  },
  presentasi: {
    category: "Ekskul & Soft Skill",
    title: "Modul 6: Produktivitas & Presentasi Q&A",
    summary:
      "Belajar efektif dimulai dari memecah materi menjadi target kecil di Study Tracker, menguji ingatan lewat latihan soal, lalu melatih penjelasan alur kerja supaya siap saat sesi tanya jawab.",
    quizPoints: [
      "Validasi form mencegah input kosong atau format yang tidak sesuai.",
      "Mengulang latihan soal membantu memperkuat ingatan sebelum evaluasi akhir.",
    ],
  },
};

const openModuleButtons = document.querySelectorAll(".open-module-btn");
const moduleReaderEl = document.getElementById("module-reader");
const closeModuleBtnEl = document.getElementById("close-module-btn");
const readerCategoryEl = document.getElementById("reader-category");
const readerTitleEl = document.getElementById("reader-title");
const readerSummaryEl = document.getElementById("reader-summary");
const readerQuizAnswersEl = document.getElementById("reader-quiz-answers");

function openModule(moduleId) {
  const selectedModule = learningModules[moduleId];
  if (!selectedModule || !moduleReaderEl) {
    return;
  }

  if (readerCategoryEl) {
    readerCategoryEl.textContent = selectedModule.category;
  }
  if (readerTitleEl) {
    readerTitleEl.textContent = selectedModule.title;
  }
  if (readerSummaryEl) {
    readerSummaryEl.textContent = selectedModule.summary;
  }

  if (readerQuizAnswersEl) {
    readerQuizAnswersEl.innerHTML = "";
    for (let i = 0; i < selectedModule.quizPoints.length; i++) {
      const li = document.createElement("li");
      li.textContent = selectedModule.quizPoints[i];
      readerQuizAnswersEl.appendChild(li);
    }
  }

  moduleReaderEl.classList.remove("hidden");
  moduleReaderEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

if (openModuleButtons.length > 0) {
  for (let i = 0; i < openModuleButtons.length; i++) {
    openModuleButtons[i].addEventListener("click", function () {
      const targetId = openModuleButtons[i].getAttribute("data-module");
      openModule(targetId);
    });
  }
}

if (closeModuleBtnEl && moduleReaderEl) {
  closeModuleBtnEl.addEventListener("click", function () {
    moduleReaderEl.classList.add("hidden");
  });
}

// =========================================
// KONFIGURASI STORAGE & AKUN DEMO BAWAAN
// =========================================
const USERS_KEY = "eduspace_users_v1";
const SESSION_KEY = "eduspace_active_user_v1";

function initDefaultUsers() {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const defaultUsers = [
      {
        fullname: "Althafariq",
        username: "althaf",
        password: "12345",
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
}

function getUsers() {
  initDefaultUsers();
  return JSON.parse(localStorage.getItem(USERS_KEY));
}

function getActiveUser() {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (sessionData) {
    return JSON.parse(sessionData);
  }
  return null;
}

const authGateEl = document.getElementById("auth-gate");
const loginCardEl = document.getElementById("login-card");
const registerCardEl = document.getElementById("register-card");
const navListEl = document.querySelector(".nav-list");

let currentActiveCard = "login";
let isSwappingCard = false;

function getVisibleCardElement() {
  if (registerCardEl && !registerCardEl.classList.contains("hidden")) {
    return registerCardEl;
  }
  return loginCardEl;
}

function triggerCardShake() {
  const activeCard = getVisibleCardElement();
  if (!activeCard) {
    return;
  }
  activeCard.classList.remove("shake-error");
  void activeCard.offsetWidth;
  activeCard.classList.add("shake-error");
}

function showGateWithAnim() {
  if (!authGateEl) {
    return;
  }
  authGateEl.classList.remove("hidden", "gate-leaving");

  if (loginCardEl && registerCardEl) {
    if (currentActiveCard === "register") {
      loginCardEl.classList.add("hidden");
      registerCardEl.classList.remove(
        "hidden",
        "card-swap-out-left",
        "card-swap-out-right",
      );
    } else {
      registerCardEl.classList.add("hidden");
      loginCardEl.classList.remove(
        "hidden",
        "card-swap-out-left",
        "card-swap-out-right",
      );
    }
  }
}

function hideGateWithAnim(onDone) {
  if (!authGateEl) {
    if (onDone) {
      onDone();
    }
    return;
  }

  authGateEl.classList.add("gate-leaving");
  setTimeout(function () {
    authGateEl.classList.add("hidden");
    authGateEl.classList.remove("gate-leaving");
    if (onDone) {
      onDone();
    }
  }, 440);
}

function syncAuthState() {
  const activeUser = getActiveUser();

  if (activeUser) {
    if (authGateEl && !authGateEl.classList.contains("hidden")) {
      hideGateWithAnim(function () {
        renderNavbarUser(activeUser);
      });
    } else if (authGateEl) {
      authGateEl.classList.add("hidden");
      renderNavbarUser(activeUser);
    }
  } else {
    renderNavbarUser(null);
    showGateWithAnim();
  }
}

function renderNavbarUser(activeUser) {
  if (!navListEl) {
    return;
  }

  const oldUserBox = navListEl.querySelector(".nav-user-box");
  if (oldUserBox) {
    oldUserBox.remove();
  }

  if (!activeUser) {
    return;
  }

  const userLi = document.createElement("li");
  userLi.className = "nav-user-box";

  const userNameSpan = document.createElement("span");
  userNameSpan.className = "nav-username";
  userNameSpan.textContent = "Halo, " + activeUser.fullname;

  const logoutBtn = document.createElement("button");
  logoutBtn.type = "button";
  logoutBtn.className = "logout-btn";
  logoutBtn.textContent = "Keluar";

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem(SESSION_KEY);
    syncAuthState();
  });

  userLi.appendChild(userNameSpan);
  userLi.appendChild(logoutBtn);
  navListEl.appendChild(userLi);
}

// =========================================
// PERPINDAHAN ANTAR CARD (LOGIN <-> REGISTER)
// =========================================
function switchAuthCard(targetCard) {
  if (isSwappingCard || currentActiveCard === targetCard) {
    return;
  }
  if (!loginCardEl || !registerCardEl) {
    return;
  }

  isSwappingCard = true;

  if (targetCard === "register") {
    loginCardEl.classList.remove("card-swap-out-left", "card-swap-out-right");
    loginCardEl.classList.add("card-swap-out-left");

    setTimeout(function () {
      loginCardEl.classList.add("hidden");
      loginCardEl.classList.remove("card-swap-out-left");

      registerCardEl.classList.remove(
        "hidden",
        "card-swap-out-left",
        "card-swap-out-right",
      );
      currentActiveCard = "register";
      isSwappingCard = false;
    }, 230);
  } else {
    registerCardEl.classList.remove(
      "card-swap-out-left",
      "card-swap-out-right",
    );
    registerCardEl.classList.add("card-swap-out-right");

    setTimeout(function () {
      registerCardEl.classList.add("hidden");
      registerCardEl.classList.remove("card-swap-out-right");

      loginCardEl.classList.remove(
        "hidden",
        "card-swap-out-left",
        "card-swap-out-right",
      );
      currentActiveCard = "login";
      isSwappingCard = false;
    }, 230);
  }
}

const allAuthTabBtns = document.querySelectorAll(".auth-tab");
for (let i = 0; i < allAuthTabBtns.length; i++) {
  allAuthTabBtns[i].addEventListener("click", function () {
    const targetCard = allAuthTabBtns[i].getAttribute("data-target");
    switchAuthCard(targetCard);
  });
}

// =========================================
// ISI AKUN DEMO CEPAT
// =========================================
const fillDemoBtn = document.getElementById("fill-demo-btn");
if (fillDemoBtn) {
  fillDemoBtn.addEventListener("click", function () {
    const userInput = document.getElementById("login-username");
    const passInput = document.getElementById("login-password");
    if (userInput && passInput) {
      userInput.value = "althaf";
      passInput.value = "12345";
    }
  });
}

// =========================================
// SUBMIT LOGIN
// =========================================
const loginFormEl = document.getElementById("login-form");
if (loginFormEl) {
  loginFormEl.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameVal = document
      .getElementById("login-username")
      .value.trim()
      .toLowerCase();
    const passwordVal = document.getElementById("login-password").value.trim();
    const statusEl = document.getElementById("login-status");

    if (usernameVal === "" || passwordVal === "") {
      statusEl.textContent = "Username dan password wajib diisi!";
      statusEl.className = "form-status status-error";
      triggerCardShake();
      return;
    }

    const users = getUsers();
    let matchedUser = null;

    for (let i = 0; i < users.length; i++) {
      if (
        users[i].username.toLowerCase() === usernameVal &&
        users[i].password === passwordVal
      ) {
        matchedUser = users[i];
        break;
      }
    }

    if (!matchedUser) {
      statusEl.textContent =
        "Username atau password salah. Coba lagi atau pakai akun demo.";
      statusEl.className = "form-status status-error";
      triggerCardShake();
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(matchedUser));
    statusEl.textContent = "Akses diterima! Membuka portal...";
    statusEl.className = "form-status status-success";

    setTimeout(function () {
      statusEl.textContent = "";
      loginFormEl.reset();
      syncAuthState();
    }, 400);
  });
}

// =========================================
// SUBMIT REGISTER
// =========================================
const registerFormEl = document.getElementById("register-form");
if (registerFormEl) {
  registerFormEl.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullnameVal = document.getElementById("reg-fullname").value.trim();
    const usernameVal = document
      .getElementById("reg-username")
      .value.trim()
      .toLowerCase();
    const passwordVal = document.getElementById("reg-password").value.trim();
    const statusEl = document.getElementById("register-status");

    if (fullnameVal === "" || usernameVal === "" || passwordVal === "") {
      statusEl.textContent = "Semua kolom pendaftaran wajib diisi!";
      statusEl.className = "form-status status-error";
      triggerCardShake();
      return;
    }

    if (usernameVal.includes(" ")) {
      statusEl.textContent = "Username tidak boleh mengandung spasi.";
      statusEl.className = "form-status status-error";
      triggerCardShake();
      return;
    }

    if (passwordVal.length < 4) {
      statusEl.textContent = "Password minimal 4 karakter.";
      statusEl.className = "form-status status-error";
      triggerCardShake();
      return;
    }

    const users = getUsers();
    for (let i = 0; i < users.length; i++) {
      if (users[i].username.toLowerCase() === usernameVal) {
        statusEl.textContent = "Username sudah terdaftar, pilih username lain.";
        statusEl.className = "form-status status-error";
        triggerCardShake();
        return;
      }
    }

    const newUser = {
      fullname: fullnameVal,
      username: usernameVal,
      password: passwordVal,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

    statusEl.textContent = "Akun dibuat! Membuka portal...";
    statusEl.className = "form-status status-success";

    setTimeout(function () {
      statusEl.textContent = "";
      registerFormEl.reset();
      syncAuthState();
    }, 400);
  });
}

// Awal buka halaman
if (getActiveUser()) {
  if (authGateEl) {
    authGateEl.classList.add("hidden");
  }
  renderNavbarUser(getActiveUser());
} else {
  showGateWithAnim();
}

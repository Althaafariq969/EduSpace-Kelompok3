// =========================================
// BAGIAN 1: STUDY TRACKER (LOCALSTORAGE)
// =========================================
const STORAGE_KEY = "eduspace_study_tasks_v1";
let tasks = [];
let activeFilter = "all";

const todoFormEl = document.getElementById("todo-form");
const todoInputEl = document.getElementById("todo-input");
const todoErrorEl = document.getElementById("todo-error");
const todoListEl = document.getElementById("todo-list");
const taskCounterEl = document.getElementById("task-counter");
const clearCompletedBtnEl = document.getElementById("clear-completed-btn");
const filterPills = document.querySelectorAll(".filter-pill");

function loadTasks() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    tasks = JSON.parse(savedData);
  } else {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  if (!todoListEl || !taskCounterEl) {
    return;
  }

  todoListEl.innerHTML = "";

  const filteredTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    const item = tasks[i];
    if (activeFilter === "active" && !item.completed) {
      filteredTasks.push({ data: item, originalIndex: i });
    } else if (activeFilter === "completed" && item.completed) {
      filteredTasks.push({ data: item, originalIndex: i });
    } else if (activeFilter === "all") {
      filteredTasks.push({ data: item, originalIndex: i });
    }
  }

  if (filteredTasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-todo";
    if (activeFilter === "all") {
      emptyItem.textContent =
        "Belum ada target belajar. Tambahkan tugas pertamamu di atas!";
    } else {
      emptyItem.textContent = "Tidak ada tugas pada filter ini.";
    }
    todoListEl.appendChild(emptyItem);
  } else {
    for (let i = 0; i < filteredTasks.length; i++) {
      const task = filteredTasks[i].data;
      const realIndex = filteredTasks[i].originalIndex;

      const li = document.createElement("li");
      li.className = task.completed ? "todo-item completed" : "todo-item";

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = task.text;
      span.addEventListener("click", function () {
        toggleTask(realIndex);
      });

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "delete-btn";
      delBtn.textContent = "Hapus";
      delBtn.addEventListener("click", function () {
        deleteTask(realIndex);
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      todoListEl.appendChild(li);
    }
  }

  let completedCount = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed) {
      completedCount = completedCount + 1;
    }
  }

  taskCounterEl.textContent =
    completedCount + " dari " + tasks.length + " tugas selesai";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

if (filterPills.length > 0) {
  for (let i = 0; i < filterPills.length; i++) {
    filterPills[i].addEventListener("click", function () {
      activeFilter = filterPills[i].getAttribute("data-filter");
      for (let j = 0; j < filterPills.length; j++) {
        filterPills[j].classList.remove("active");
      }
      filterPills[i].classList.add("active");
      renderTasks();
    });
  }
}

if (todoFormEl && todoInputEl) {
  todoFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    const inputText = todoInputEl.value.trim();

    if (inputText === "") {
      if (todoErrorEl) {
        todoErrorEl.textContent = "Target belajar tidak boleh kosong!";
      }
      return;
    }

    if (todoErrorEl) {
      todoErrorEl.textContent = "";
    }

    const newTask = {
      text: inputText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    todoInputEl.value = "";
  });

  todoInputEl.addEventListener("input", function () {
    if (todoInputEl.value.trim() !== "" && todoErrorEl) {
      todoErrorEl.textContent = "";
    }
  });
}

if (clearCompletedBtnEl) {
  clearCompletedBtnEl.addEventListener("click", function () {
    const remainingTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].completed) {
        remainingTasks.push(tasks[i]);
      }
    }
    tasks = remainingTasks;
    saveTasks();
    renderTasks();
  });
}

loadTasks();
renderTasks();

// =========================================
// BAGIAN 2: VALIDASI FORM KONTAK & COUNTER
// =========================================
const contactFormEl = document.getElementById("contact-form");
const senderNameEl = document.getElementById("sender-name");
const senderEmailEl = document.getElementById("sender-email");
const senderMessageEl = document.getElementById("sender-message");
const charCounterEl = document.getElementById("char-counter");
const contactStatusEl = document.getElementById("contact-status");

function updateCharCounter() {
  if (senderMessageEl && charCounterEl) {
    charCounterEl.textContent = senderMessageEl.value.length + " / 250";
  }
}

if (senderMessageEl) {
  senderMessageEl.addEventListener("input", function () {
    updateCharCounter();
  });
}

if (contactFormEl) {
  contactFormEl.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameValue = senderNameEl ? senderNameEl.value.trim() : "";
    const emailValue = senderEmailEl ? senderEmailEl.value.trim() : "";
    const messageValue = senderMessageEl ? senderMessageEl.value.trim() : "";

    if (nameValue === "" || emailValue === "" || messageValue === "") {
      if (contactStatusEl) {
        contactStatusEl.textContent =
          "Semua kolom wajib diisi sebelum mengirim pesan!";
        contactStatusEl.className = "form-status status-error";
      }
      return;
    }

    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      if (contactStatusEl) {
        contactStatusEl.textContent =
          "Format email belum valid (contoh: nama@email.com).";
        contactStatusEl.className = "form-status status-error";
      }
      return;
    }

    if (contactStatusEl) {
      contactStatusEl.textContent =
        "Pesan dari " +
        nameValue +
        " berhasil divalidasi dan siap dikirim ke tim EduSpace!";
      contactStatusEl.className = "form-status status-success";
    }

    contactFormEl.reset();
    updateCharCounter();
  });
}

updateCharCounter();

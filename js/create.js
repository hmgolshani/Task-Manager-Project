let tasks = [];
let nextTaskId = 1;

// Use the  storage
function showTaskMessage(message) {
  document.getElementById("task-message").textContent = message;
}
function saveCurrentTasks() {
  try {
    saveTasks(tasks);
    return true;
  } catch (error) {
    showTaskMessage(
      "تغییر انجام شد؛ ذخیره در مرورگر ممکن نیست و با رفرش از دست می‌رود.",
    );
    return false;
  }
}

// selecting the priority
let selectedPriority = "medium";

function selectTaskPriority(priority) {
  selectedPriority = priority;
  let buttons = document.querySelectorAll(
    '#create-task-form [data-action="select-priority"]',
  );
  for (let i = 0; i < buttons.length; i++) {
    let selected = buttons[i].dataset.priority === priority;
    buttons[i].dataset.selected = String(selected);
    buttons[i].setAttribute("aria-pressed", String(selected));
  }
}

// Open or close the existing task form.
function toggleCreateTaskDropdown() {
  let form = document.getElementById("create-task-form");
  let button = document.getElementById("create-task-toggle");
  let open = form.hidden;

  form.hidden = !open;
  button.hidden = open;

  button.style.display = open ? "none" : "";

  form.dataset.open = String(open);
  button.dataset.open = String(open);
  button.setAttribute("aria-expanded", String(open));

  if (open) {
    document.getElementById("task-title").focus();
  } else {
    button.focus();
  }
}

function closeCreateTaskDropdown() {
  if (!document.getElementById("create-task-form").hidden) {
    toggleCreateTaskDropdown();
  }
}

// Read inputs, validate them, and add a task.
function createTask(event) {
  event.preventDefault();
  let titleInput = document.getElementById("task-title");
  let title = titleInput.value.trim(); // Removes extra spaces from start and end
  let description = document.getElementById("task-description").value.trim();
  let error = document.getElementById("create-task-error");
  error.textContent = "";
  if (title === "") {
    error.textContent = "لطفاً نام تسک را وارد کن.";
    titleInput.focus();
    return;
  }
  let task = {
    id: nextTaskId,
    title: title,
    description: description,
    priority: selectedPriority,
    completed: false,
  };
  tasks.push(task);
  nextTaskId = nextTaskId + 1;
  let saved = saveCurrentTasks();
  renderTasks();
  document.getElementById("create-task-form").reset();
  selectTaskPriority("medium");
  closeCreateTaskDropdown();
}
//Event Listeners.
function setupCreateForm() {
  let form = document.getElementById("create-task-form");
  form.noValidate = true;

  //displaying error messages
  let error = document.createElement("p");
  error.id = "create-task-error";
  error.className = "px-4 py-2 text-xs text-error";
  error.setAttribute("role", "alert");
  form.insertBefore(error, form.lastElementChild);
  document
    .getElementById("task-title")
    .setAttribute("aria-describedby", error.id);

  //toggle (open/close)
  document
    .getElementById("create-task-toggle")
    .addEventListener("click", toggleCreateTaskDropdown);
  document
    .getElementById("create-task-cancel")
    .addEventListener("click", closeCreateTaskDropdown);
  //submit
  form.addEventListener("submit", createTask);
  //Clear existing error message
  form.addEventListener("input", function () {
    error.textContent = "";
  });

  //Connect the existing priority buttons.
  let buttons = form.querySelectorAll('[data-action="select-priority"]');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      selectTaskPriority(this.dataset.priority);
    });
  }
  selectTaskPriority("medium");
}

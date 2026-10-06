//Sort by priority
function sortTasks() {
  let high = tasks.filter((task) => task.priority === "high");
  let medium = tasks.filter((task) => task.priority === "medium");
  let low = tasks.filter((task) => task.priority === "low");

  return [...high, ...medium, ...low];
}

//total, incomplete, and completed counts.
function updateTaskCount() {
  let done = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed === true) done = done + 1;
  }
  let pending = tasks.length - done;

  document.getElementById("task-count").textContent = pending;
  document.getElementById("completed-count").textContent = done;
  document.getElementById("completed-tasks").dataset.empty = String(done === 0);

  let empty = document.getElementById("task-empty-state");
  if (empty) {
    let hasNoPendingTasks = pending === 0;

    empty.hidden = !hasNoPendingTasks;
    empty.style.display = hasNoPendingTasks ? "" : "none";
    empty.dataset.visible = String(hasNoPendingTasks);
  }
}

//creating card template
function createTaskCard(task) {
  let templateId = "task-card-template";
  if (task.completed === true) templateId = "completed-task-card-template";
  let template = document.getElementById(templateId);
  let card = template.content.firstElementChild.cloneNode(true);
  card.dataset.taskId = task.id;
  card.dataset.priority = task.priority;
  card.dataset.done = String(task.completed);
  card.querySelector('[data-field="title"]').textContent = task.title;
  let description = card.querySelector('[data-field="description"]');
  if (description) {
    description.textContent = task.description;
    description.hidden = task.description === "";
    description.style.overflowWrap = "anywhere";
    description.style.lineHeight = "1.7";
  }
  let label = card.querySelector("[data-priority-label]");
  if (label) {
    label.classList.remove("hidden");
    label.classList.add("inline-flex");
    label.dataset.priority = task.priority;
    label.dataset.priorityLabel = task.priority;
    if (task.priority === "high") label.textContent = "بالا";
    else if (task.priority === "medium") label.textContent = "متوسط";
    else label.textContent = "پایین";
  }
  let checkbox = card.querySelector('[data-action="toggle-task-completion"]');
  checkbox.checked = task.completed;
  checkbox.dataset.done = String(task.completed);

  //  task-21 Toggle Task Completion
  checkbox.addEventListener("change", function () {
    task.completed = checkbox.checked;
    let saved = saveCurrentTasks();
    renderTasks();
    let cards = document.querySelectorAll("[data-task-card][data-task-id]");
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].dataset.taskId === String(task.id)) {
        cards[i].querySelector("input").focus();
      }
    }
  });

  return card;
}

//Render lists from the task data.
function renderTasks() {
  let incomplete = document.querySelector('[data-task-list="incomplete"]');
  let completed = document.getElementById("completed-task-list");
  incomplete.textContent = "";
  completed.textContent = "";
  let sorted = sortTasks();
  for (let i = 0; i < sorted.length; i++) {
    let card = createTaskCard(sorted[i]);
    if (sorted[i].completed === true) completed.appendChild(card);
    else incomplete.appendChild(card);
  }
  updateTaskCount();
}
// task 34:Update Task Count After Changes
function startTaskApp() {
  // 1. Create header UI elements required by other functions
  let heading = document.getElementById("task-page-heading");
  let message = document.createElement("p");
  message.id = "task-message";
  message.className = "mt-3 text-xs text-muted";
  message.setAttribute("role", "status");
  heading.appendChild(message);

  // 2. Load saved tasks safely without over-complicated validations
  let saved = loadTasks();
  if (Array.isArray(saved)) {
    tasks = saved;

    // Keep nextTaskId higher than any existing task ID to avoid conflicts
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id >= nextTaskId) {
        nextTaskId = tasks[i].id + 1;
      }
    }
  }

  // 3. Initialize form event listeners and render the UI
  setupCreateForm();
  renderTasks();
}

// Boot application
startTaskApp();

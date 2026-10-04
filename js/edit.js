let editingTaskId = null;
let deletingTaskId = null;

let title = document.querySelector("#edit-task-title")
let description = document.querySelector("#edit-task-description")


// get task ID
function getTaskId(element) {
    const card = element.closest("[data-task-card]");
    if (!card) return null;

    return Number(card.dataset.taskId);
}

//toggle
document.addEventListener("change", (e) => {
    const taskCompletion = e.target.matches('[data-action="toggle-task-completion"]'); //true & false

    if (!taskCompletion) return;

    const taskId = getTaskId(e.target);
    if (taskId === null) return;

    toggleTaskCompletion(taskId);
});

function toggleTaskCompletion(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;

    task.completed = !task.completed;

    saveTasks(tasks);
    renderTasks();

}


//open delete & edit menu

document.addEventListener("click", (e) => {
    const menuButton = e.target.closest('[data-action="open-task-menu"]');
    if (!menuButton) return

    const taskId = getTaskId(menuButton);
    if (taskId === null) return;

    toggleTaskMenu(taskId);
})

function toggleTaskMenu(taskId) {
    const card = document.querySelector(`[data-task-id = "${taskId}"]`);
    if (!card) return;

    const menu = card.querySelector('[data-region="task-actions"]')
    if (!menu) return;

    menu.classList.toggle("hidden");
}

//Edit button
document.addEventListener("click", (e) => {
    const editButton = e.target.closest('[data-action="open-edit-task"]');
    if (!editButton) return;

    const taskId = getTaskId(editButton);
    if (taskId === null) return;

    openEditTask(taskId);
})

//edit
function openEditTask(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;

    editingTaskId = taskId;

    title.value = task.title;
    description.value = task.description || "";

    document.querySelector("#edit-task-region").hidden = false;
    selectEditPriority(task.priority);
}

// select priority
function selectEditPriority(priority) {
    const buttons = document.querySelectorAll(
        '#edit-task-form [data-action="select-priority"]'
    );

    buttons.forEach((button) => {
        const isSelected = button.dataset.priority === priority;

        button.dataset.selected = String(isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
    });
}

//change select priority
document.addEventListener("click", (e) => {
    const priorityButton = e.target.closest(
        '#edit-task-form [data-action="select-priority"]'
    );

    if (!priorityButton) return;

    selectEditPriority(priorityButton.dataset.priority);
});

//update
document.querySelector("#edit-task-form").addEventListener("submit", (e) => {
    e.preventDefault();
    updateTask(editingTaskId);
});

function updateTask(taskId) {
    const task = getTaskById(taskId);
    if (!task) return;


    const newTitle = title.value;
    const newDescription = description.value;

    const selectedPriority = document.querySelector('#edit-task-form [data-selected="true"]');

    const newPriority = selectedPriority.dataset.priority;

    task.title = newTitle;
    task.description = newDescription;
    task.priority = newPriority;

    saveTasks(tasks);
    renderTasks();
    closeEditTask();
}

//close

document.addEventListener("click", (e) => {
    const closeButton = e.target.closest('[data-action="close-edit-task"]');
    if (!closeButton) return;

    closeEditTask();

})

function closeEditTask() {
    document.querySelector("#edit-task-region").hidden = true;
    editingTaskId = null;
}


//delete
document.addEventListener("click", (e) => {
    const deleteButton = e.target.closest('[data-action="open-delete-action"]');
    if (!deleteButton) return;

    const taskId = getTaskId(deleteButton);
    if (!taskId) return;
    openDeleteAction(taskId);

})

function openDeleteAction(taskId) {
    deletingTaskId = taskId;

    const dialog = document.querySelector("#delete-confirmation-dialog");
    dialog.hidden = false;
    dialog.classList.remove("!hidden");
    dialog.dataset.open = "true";
}

document.addEventListener("click", (e) => {
    const cancelButton = e.target.closest('[data-action="cancel-delete"]');
    if (cancelButton) {
        cancelDeleteTask();
    }

    const confirmButton = e.target.closest('[data-action="confirm-delete"]');
    if (confirmButton) {
        confirmDeleteTask();
    }
});

function confirmDeleteTask() {
    if (deletingTaskId === null) return;

    tasks = tasks.filter(task => task.id !== deletingTaskId);

    saveTasks(tasks);
    renderTasks();

    cancelDeleteTask();
}

function cancelDeleteTask() {
    const dialog = document.querySelector("#delete-confirmation-dialog");

    dialog.hidden = true;
    dialog.classList.add("!hidden");
    dialog.dataset.open = "false";

    deletingTaskId = null;
}

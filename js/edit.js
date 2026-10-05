let editingTaskId = null;
let deletingTaskId = null;

const editTitleInput = document.querySelector("#edit-task-title");
const editDescriptionInput = document.querySelector("#edit-task-description");

// get the edit task form container
const editRegion = document.querySelector("#edit-task-region");

// find a task by ID
function getTaskById(taskId) {
    return tasks.find((task) => task.id === taskId);
}

// get task ID
function getTaskId(element) {
    const card = element.closest("[data-task-card]");
    if (!card) return null;

    return Number(card.dataset.taskId);
}


// open delete & edit menu
document.addEventListener("click", (e) => {
    const menuButton = e.target.closest('[data-action="open-task-menu"]');
    if (!menuButton) return;

    const card = menuButton.closest("[data-task-card]");
    if (!card) return;

    toggleTaskMenu(card);
});

function toggleTaskMenu(card) {
    const menu = card.querySelector('[data-region="task-actions"]');
    if (!menu) return;

    menu.classList.toggle("hidden");
}

//Edit button
document.addEventListener("click", (e) => {
    const editButton = e.target.closest('[data-action="open-edit-task"]');
    if (!editButton) return;

    const taskId = getTaskId(editButton);
    if (taskId === null) return;

    const card = editButton.closest("[data-task-card]");
    if (!card) return;

    openEditTask(taskId, card);
});

//edit
function openEditTask(taskId, card) {
    const task = getTaskById(taskId);
    if (!task) return;

    editingTaskId = taskId;

    editTitleInput.value = task.title;
    editDescriptionInput.value = task.description || "";

    selectEditPriority(task.priority);

    card.after(editRegion);

    editRegion.hidden = false;
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


    const newTitle = editTitleInput.value.trim();
    if (newTitle === "") return;

    const newDescription = editDescriptionInput.value.trim();

    const selectedPriority = document.querySelector('#edit-task-form [data-selected="true"]');

    const newPriority = selectedPriority.dataset.priority;

    task.title = newTitle;
    task.description = newDescription;
    task.priority = newPriority;

    saveCurrentTasks();
    renderTasks();
    closeEditTask();

}

//close

document.addEventListener("click", (e) => {
    const closeButton = e.target.closest('[data-action="close-edit-task"]');
    if (!closeButton) return;

    closeEditTask();

});

function closeEditTask() {
    editRegion.hidden = true;
    editingTaskId = null;
}


//delete
document.addEventListener("click", (e) => {
    const deleteButton = e.target.closest('[data-action="open-delete-action"]');
    if (!deleteButton) return;

    const taskId = getTaskId(deleteButton);
    if (!taskId) return;
    openDeleteAction(taskId);

});


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
    if (!deletingTaskId) return;

    tasks = tasks.filter(task => task.id !== deletingTaskId);

    saveCurrentTasks();
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

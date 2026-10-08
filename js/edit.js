let editingTaskId = null;
let deletingTaskId = null;
let editingCard = null ;

const editTitleInput = document.querySelector("#edit-task-title");
const editDescriptionInput = document.querySelector("#edit-task-description");

// get the edit task form container
const editRegion = document.querySelector("#edit-task-region");
const editSubmitButton = document.querySelector("#edit-task-submit");


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

function setupEditForm() {
    const editForm = document.querySelector("#edit-task-form");

    editForm.noValidate = true;

    const editError = document.createElement("p");
    editError.id = "edit-task-error";
    editError.className = "px-4 py-2 text-xs text-error";
    editError.setAttribute("role", "alert");

    editForm.insertBefore(editError, editForm.lastElementChild);

    editTitleInput.setAttribute("aria-describedby", editError.id);

    editForm.addEventListener("input", () => {
        editError.textContent = "";
        checkEditChanges();
    });

    return editError;
}

const editError = setupEditForm();
// open delete & edit menu
document.addEventListener("click", (e) => {
    const menuButton = e.target.closest('[data-action="open-task-menu"]');

    if (menuButton) {
        const card = menuButton.closest("[data-task-card]");
        if (!card) return;

        toggleTaskMenu(card);
        return;
    }

    const menus = document.querySelectorAll(
        '[data-region="task-actions"]'
    );

    menus.forEach((menu) => {
        menu.classList.add("hidden");
    });
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
    editingCard = card;

    editTitleInput.value = task.title;

    editDescriptionInput.value = task.description || "";

    selectEditPriority(task.priority);
    editRegion.querySelector("details").open = false;

    card.after(editRegion);

    editRegion.hidden = false;
    
    // card.hidden = true;
    
    checkEditChanges();
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
    checkEditChanges();
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
    if (newTitle === "") {
        editError.textContent = "لطفاً نام تسک را وارد کن.";
        editTitleInput.focus();
        return;
    }

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

function checkEditChanges() {
    const task = getTaskById(editingTaskId); 
    if (!task) return;
    
    const newTitle = editTitleInput.value.trim();
    const newDescription = editDescriptionInput.value.trim();

    const selectedPriority = document.querySelector(
        '#edit-task-form [data-selected="true"]'
    );

    const newPriority = selectedPriority?.dataset.priority;

    const hasChanges =
        newTitle !== task.title ||
        newDescription !== (task.description || "") ||
        newPriority !== task.priority;

    editSubmitButton.disabled = !hasChanges;
}

//close

document.addEventListener("click", (e) => {
    const closeButton = e.target.closest('[data-action="close-edit-task"]');
    if (!closeButton) return;

    closeEditTask();

});

function closeEditTask() {
    editRegion.hidden = true;
    
    // if (editingCard) editingCard.hidden = false;
    
    editingTaskId = null;
    editingCard = null;
    
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

document.querySelector("#create-task-toggle").addEventListener("click", () => {
    document.querySelector("#create-task-form details").open = false;
});

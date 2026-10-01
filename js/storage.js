function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || []
}

function saveTheme(theme) {
    localStorage.setItem("theme", theme);
}

function loadTheme() {
    return localStorage.getItem("theme") || "light";
}
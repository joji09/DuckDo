const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const clearAll = document.getElementById("clearAll");

const darkModeToggle = document.getElementById("darkmode-toggle");

browser.storage.local.get("theme").then((data) => {
    const theme =data.theme || "light";
    document.body.className = theme;
    darkModeToggle.checked = theme === "dark";
});

darkModeToggle.addEventListener("change", () => {
    const theme = darkModeToggle.checked ? "dark" : "light";
    document.body.className = theme;
    browser.storage.local.set({ theme });
});

let tasks = [];

function saveTasks(){
    browser.storage.local.set({ tasks });
}

function loadTasks() {
    browser.storage.local.get("tasks").then((data) => {
        tasks = data.tasks || [];
        renderTasks();
        updateProgress();
    });
}

function renderTasks(){
    taskList.innerHTML = "";
    tasks.forEach((task,index) => {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.textContent = task.text;
        link.href = task.url;
        link.target = "_blank";

        const completeButton = document.createElement("button");
        completeButton.setAttribute("id", "completebttn");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.addEventListener("click", () => toggleTaskComplete(index));

        const removeButton = document.createElement("button");
        removeButton.setAttribute("id", "removebttn");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => removeTasks(index));

        li.appendChild(link);
        li.appendChild(completeButton);
        li.appendChild(removeButton);

        taskList.appendChild(li);
    });
}

function updateProgress(){
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    progressBar.style.width = `${progress}$`;
}

function removeTasks(index){
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    updateProgress();
}

// addTaskButton.addEventListener("click", () => {
//     const taskText = taskInput.value;
//     if(!taskText) return;

//     const task = {text: taskText, url: null, completed: false};

//     browser.tabs.query({active: true, currentWindow: true }).then((tabs) => {
//         task.url = tabs[0].url;
//         tasks.push(task);
//         saveTasks();
//         renderTasks();
//         updateProgress();
//     });

//     taskInput.value = ""; // this clears input
// });

// testing 'Enter' to add tasks

taskInput.addEventListener("keydown", (evt) =>{
    if (evt.code === 'Enter'){
        const taskText = taskInput.value;
    if(!taskText) return;

    const task = {text: taskText, url: null, completed: false};

    browser.tabs.query({active: true, currentWindow: true }).then((tabs) => {
        task.url = tabs[0].url;
        tasks.push(task);
        saveTasks();
        renderTasks();
        updateProgress();
    });

    taskInput.value = ""; // this clears input
    }
})


function toggleTaskComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    updateProgress();
}

clearAll.addEventListener("click", () => {
    if (confirm("Do you want to clear all tasks?")){
        tasks = [];
        saveTasks();
        renderTasks();
        updateProgress();
    }
});

loadTasks();
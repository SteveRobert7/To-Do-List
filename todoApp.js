

const modalToggleButton = document.getElementById("modal-toggle-btn");
const modal = document.getElementById("modal");

modalToggleButton.addEventListener("click", toggleModal)
// function OnLoad() {
//     modalToggleButton = document.getElementById("modal-toggle-btn");
//     modal = document.getElementById("modal");
// }

function toggleModal() {
    modal.classList.toggle("hide-modal");
    modal.classList.toggle("show-modal");
}





let tasks = {
    todo: [],
    started: [],
    completed: [],
};

window.onload = (event) => {
    if (tasks.todo.length == 0) {
        document.getElementById("empty-container").style.display = "flex";
    }
};

let form = document.getElementById("task-form");
let todo = document.getElementById("todo");
let started = document.getElementById("started");
let completed = document.getElementById("completed");
let dropText = document.getElementsByClassName("drop-text");

let id = 1;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (form.button.innerText.trim() === "Save") {
        form.button.innerHTML = `Add <i class="fa-solid fa-circle-plus"></i>`;
    }

    document.getElementById("empty-container").style.display = "none";

    const taskName = form.task.value;
    const taskDueDate = form.date.value;
    const taskPriority = form.priority.value;


    const newTask = document.createElement("div");
    newTask.className = "task-item";
    newTask.id = id++;
    newTask.setAttribute("draggable", true);
    newTask.addEventListener("dragstart", onDragStart);

    newTask.innerHTML = `<div class="header">
                            <p>Due on ${taskDueDate}</p>
                            <p class="priority">${taskPriority}</p>
                        </div>
                        <div>
                            <p>${taskName}</p>
                            <div class="buttons">
                            </div>
                        </div>`;

    let editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;

    editButton.addEventListener("click", editTask);

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;

    deleteButton.addEventListener("click", deleteTask);
    newTask.querySelector(".buttons").append(editButton, deleteButton);

    todo.insertBefore(newTask, dropText[0]);

    //   function for delete
    function deleteTask() {
        const currentContainerId = newTask.parentNode.id;
        let index = (tasks[currentContainerId].findIndex = (task) =>
            task.id === newTask.id);
        tasks[currentContainerId].splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        document.getElementById(
            `${currentContainerId}-count`
        ).innerText = `${tasks[currentContainerId].length}`;
        document.getElementById(
            `${currentContainerId}-high`
        ).innerText = `${countHigh(tasks[currentContainerId])} of ${tasks[currentContainerId].length
            }`;

        newTask.remove();
        if (tasks.todo.length == 0) {
            document.getElementById("empty-container").style.display = "flex";
        }
    }

    //   function for edit
    function editTask() {
        console.log(taskName);
        if (form.button.innerText == "Save") {
            return;
        }
        form.task.value = taskName;
        form.date.value = taskDueDate;
        form.priority.value = taskPriority;
        form.button.innerText = "Save";
        deleteTask();
    }

    let taskObj = {
        id: newTask.id,
        name: taskName,
        dueDate: taskDueDate,
        priority: taskPriority,
    };
    tasks.todo.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("todo-count").innerText = `${tasks.todo.length}`;
    document.getElementById("todo-high").innerText = `${countHigh(
        tasks.todo
    )} of ${tasks.todo.length}`;
    console.log(tasks);

    // Tasks object for saving the data

    form.reset();
});

function countHigh(arr) {
    let ans = 0;
    arr.forEach((item) => {
        if (item.priority === "High") ans++;
    });
    return ans;
}

// Changing status (to-do, started or completed)

let draggingElement = null;
let dropIndex = null;
function onDragStart(e) {
    draggingElement = e.target;
}

todo.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropIndex = 0;
});

started.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropIndex = 1;
});

completed.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropIndex = 2;
});

todo.addEventListener("drop", dropElement);
started.addEventListener("drop", dropElement);
completed.addEventListener("drop", dropElement);

function dropElement(e) {
    const prevContainerId = draggingElement.parentNode.id;
    const currentContainerId = e.currentTarget.id;

    let index = tasks[prevContainerId].findIndex(
        (task) => task.id === draggingElement.id
    );

    tasks[currentContainerId].push(tasks[prevContainerId][index]);
    tasks[prevContainerId].splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    /*//   Decreesing the count of Element from previous container
    document.getElementById(
        `${prevContainerId}-count`
    ).innerText = `${tasks[prevContainerId].length}`;
    document.getElementById(
        `${prevContainerId}-high`
        ).innerText = `${countHigh(tasks[prevContainerId])} of ${tasks[prevContainerId].length}`;

    //   Increesing the count of Element in current container
    document.getElementById(
        `${currentContainerId}-count`
    ).innerText = `${tasks[currentContainerId].length}`;
    document.getElementById(
        `${currentContainerId}-high`
    ).innerText = `${countHigh(tasks[currentContainerId])} of ${tasks[currentContainerId].length}`;*/

    //   Adding element in current container
    e.currentTarget.insertBefore(draggingElement, dropText[dropIndex]);
    draggingElement = null;
}

// creating the task if localstorage have any data saved

document.addEventListener("DOMContentLoaded", () => {
    const extractedData = localStorage.getItem("tasks");
    if (extractedData) {
        document.getElementById("empty-container").style.display = "none";
        tasks = JSON.parse(extractedData);
        let i = 0;
        for (let key in tasks) {
            tasks[key].forEach((item) => {
                createTask(item.id, item.name, item.dueDate, item.priority, key, i);
            });
            i++;
        }
    }
});

function createTask(id, taskName, taskDueDate, taskPriority, key, i) {
    const newTask = document.createElement("div");
    newTask.className = "task-item";
    newTask.id = id;
    newTask.setAttribute("draggable", true);
    newTask.addEventListener("dragstart", onDragStart);

    newTask.innerHTML = `<div class="header">
                            <p>Due on ${taskDueDate}</p>
                            <p class="priority">${taskPriority}</p>
                        </div>
                        <div>
                            <p>${taskName}</p>
                            <div class="buttons">
                            </div>
                        </div>`;

    let editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;

    editButton.addEventListener("click", editTask);

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;

    deleteButton.addEventListener("click", deleteTask);
    newTask.querySelector(".buttons").append(editButton, deleteButton);

    document.getElementById(`${key}`).insertBefore(newTask, dropText[i]);

    //   function for delete
    function deleteTask() {
        const currentContainerId = newTask.parentNode.id;
        let index = (tasks[currentContainerId].findIndex = (task) =>
            task.id === newTask.id);
        tasks[currentContainerId].splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        document.getElementById(
            `${currentContainerId}-count`
        ).innerText = `${tasks[currentContainerId].length}`;
        document.getElementById(
            `${currentContainerId}-high`
        ).innerText = `${countHigh(tasks[currentContainerId])} of ${tasks[currentContainerId].length
            }`;

        newTask.remove();
    }

    //   function for edit
    function editTask() {
        if (form.button.innerText == "Save") {
            return;
        }

        form.task.value = taskName;
        form.date.value = taskDueDate;
        form.priority.value = taskPriority;
        form.button.innerText = "Save";
        deleteTask();
    }

    document.getElementById(`${key}-count`).innerText = `${tasks[key].length}`;
    document.getElementById(`${key}-high`).innerText = `${countHigh(
        tasks[key]
    )} of ${tasks[key].length}`;
}

// Filter Functionality

const filter = document.getElementById("filter");

filter.addEventListener("change", () => {
    for (let key in tasks) {
        tasks[key].forEach((item) => {
            const task = document.getElementById(`${item.id}`);
            if (task) task.remove();
        });
    }

    if (filter.value === "All") {
        let i = 0;
        for (let key in tasks) {
            tasks[key].forEach((item) => {
                createTask(item.id, item.name, item.dueDate, item.priority, key, i);
            });
            i++;
        }
        return;
    }

    console.log(filter.value);
    let i = 0;
    for (let key in tasks) {
        tasks[key].forEach((item) => {
            if (item.priority === filter.value)
                createTask(item.id, item.name, item.dueDate, item.priority, key, i);
        });
        i++;
    }
});
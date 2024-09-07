const addTaskBtn = document.getElementById('add-task-btn');
const deleteTaskBtn = document.getElementById('delete-task-btn');
const taskNameInput = document.getElementById('task-name');
const description = document.getElementById('description');
const taskHoursInput = document.getElementById('task-hours');
const taskLists = document.querySelectorAll('.task-list');
const completedList = document.getElementById('completed-list');
const todoList = document.getElementById('todo-list');
const progressList = document.getElementById('progress-list');
const assignbtn = document.getElementById('assign-btn');
const dropdown = document.getElementById('assign-member');
const membersInput = document.getElementById('assign');

let editingTaskId = null;
let members = [];

// Event Listeners
addTaskBtn.addEventListener('click', () => {
    if (editingTaskId) {
        updateTask(editingTaskId); 
    } else {
        addTask(); 
    }
});

deleteTaskBtn.addEventListener('click', deleteTask);
assignbtn.addEventListener('click', addMember);
taskLists.forEach(list => {
    list.addEventListener('dragover', dragoverHandler);
    list.addEventListener('drop', dropHandler);
});

// Task Count
function taskCount() {
    const completedTasks = completedList.querySelectorAll('.task-card');
    const todoTasks = todoList.querySelectorAll('.task-card');
    const progressTasks = progressList.querySelectorAll('.task-card');
    
    document.getElementById('completed-count').textContent = `Completed: ${completedTasks.length}`;
    document.getElementById('todo-count').textContent = `To-Do: ${todoTasks.length}`;
    document.getElementById('progress-count').textContent = `In Progress: ${progressTasks.length}`;
}

// Add Member
function addMember() {
    const memberValue = membersInput.value.trim();
    if (memberValue !== '') {
        const newMembers = memberValue.split(',').map(member => member.trim()).filter(member => member !== '');
        members.push(...newMembers);

        dropdown.innerHTML = '';
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            dropdown.appendChild(option);
        });

        membersInput.value = '';
    }
}

// Add Task
function addTask() {
    const taskName = taskNameInput.value.trim();
    const desc = description.value.trim();
    const taskHours = taskHoursInput.value.trim();
    const assignedMember = dropdown.value.trim();

    if (taskName === '' || desc === '' || taskHours === '') return;

    const taskId = `task=${Date.now()}`;
    const task = {
        id: taskId,
        name: taskName,
        description: desc,
        hours: taskHours,
        assignedMember: assignedMember,
        column: 'todo-list',
        position: todoList.children.length
    };

    createTaskElement(task);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    saveTasksToLocalStorage(tasks);

    clearForm();
}

function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('draggable', 'true');
    taskCard.setAttribute('id', task.id);
    taskCard.innerHTML = `
        <h3 class="taskname">${task.name}</h3>
        <p class="description">${task.description}</p>
        <p class="hours">Hours to Complete: ${task.hours}</p>
        <p class="assigned">Task Assigned to: ${task.assignedMember}</p>
        <button class="taskDelete">Delete Task</button>
        <button class="editTask" onclick="editTask('${task.id}')">Edit Task</button>
    `;

    taskCard.querySelector('.taskDelete').addEventListener('click', () => taskDeleted(task.id));

    taskCard.addEventListener('dragstart', dragstartHandler);
    taskCard.addEventListener('dragend', dragEnd);

    const taskList = document.getElementById(task.column);
    if (task.position >= 0 && taskList.children.length >= task.position) {
        taskList.insertBefore(taskCard, taskList.children[task.position]);
    } else {
        taskList.appendChild(taskCard);
    }

    taskCount();
}

// Edit Task
function editTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        taskNameInput.value = task.name;
        description.value = task.description;
        taskHoursInput.value = task.hours;
        dropdown.value = task.assignedMember;

        addTaskBtn.textContent = 'Save Changes';
        editingTaskId = taskId;
    }
}

function updateTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        task.name = taskNameInput.value.trim();
        task.description = description.value.trim();
        task.hours = taskHoursInput.value.trim();
        task.assignedMember = dropdown.value.trim();

        if (task.name === '' || task.description === '' || task.hours === '') return;

        tasks = tasks.map(t => t.id === taskId ? task : t);
        saveTasksToLocalStorage(tasks);

        const oldTaskCard = document.getElementById(taskId);
        if (oldTaskCard) {
            oldTaskCard.remove();
        }

        createTaskElement(task);
        clearForm();
        addTaskBtn.textContent = 'Add Task';
        editingTaskId = null;

        console.log('Task updated:', task);
    }
}

function taskDeleted(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(tasks);

    const taskCard = document.getElementById(taskId);
    if (taskCard) {
        taskCard.remove();
        taskCount();
    }
}

// Delete All Tasks
function deleteTask() {
    localStorage.removeItem('tasks');
    todoList.innerHTML = '';
    progressList.innerHTML = '';
    completedList.innerHTML = '';
    taskCount();
}

// Clear Form
function clearForm() {
    taskNameInput.value = '';
    description.value = '';
    taskHoursInput.value = '';
}

// Drag and Drop Functions
function dragstartHandler(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.id);
    ev.dataTransfer.effectAllowed = 'move';
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
}

function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text/plain');
    const taskCard = document.getElementById(data);
    const targetList = ev.target.closest('.task-list');

    if (targetList && taskCard) {
        targetList.appendChild(taskCard);

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(task => task.id === taskCard.id);
        if (task) {
            task.column = targetList.id;
            task.position = Array.from(targetList.children).indexOf(taskCard);
            saveTasksToLocalStorage(tasks);
        }

        taskCount();
    }
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.sort((a, b) => a.position - b.position);
    tasks.forEach(task => createTaskElement(task));
}

window.addEventListener('load', loadTasks);

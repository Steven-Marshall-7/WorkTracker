const addTaskBtn = document.getElementById('add-task-btn');
const deleteTaskBtn = document.getElementById('delete-task-btn')
const taskDelete = document.getElementsByClassName('taskDelete')
const taskNameInput = document.getElementById('task-name');
const description = document.getElementById('description');
const taskHoursInput = document.getElementById('task-hours');
const taskLists = document.querySelectorAll('.task-list');
const completedList = document.getElementById('completed-list');
const todoList = document.getElementById('todo-list');
const progressList = document.getElementById('progress-list');
const assignbtn = document.getElementById('assign-btn');
const dropdown = document.getElementById('assign-member');
const option = document.getElementsByName('option');
const editbtn = document.getElementsByClassName('editTask')


// Event Listeners
addTaskBtn.addEventListener('click', addTask);
deleteTaskBtn.addEventListener('click', deleteTask);
assignbtn.addEventListener('click', addMember);
taskLists.forEach(list => {
    list.addEventListener('dragover', dragoverHandler);
    list.addEventListener('drop', dropHandler);
});

function taskCount() {
    const completedTasks = completedList.querySelectorAll('.task-card');
    const todoTasks = todoList.querySelectorAll('.task-card');
    const progressTasks = progressList.querySelectorAll('.task-card');
    const todoCount = todoTasks.length;
    const count = completedTasks.length;
    const progressCount = progressTasks.length;
    console.log('Completed Task Count:', count);
    document.getElementById('completed-count').textContent = `Completed: ${count}`;
    console.log('Completed Task Count:', todoCount);
    document.getElementById('todo-count').textContent = `To-Do: ${todoCount}`;
    console.log('Completed Task Count:', todoCount);
    document.getElementById('progress-count').textContent = `In Progress: ${progressCount}`;
}

let members = [];

function addMember(){
    const addNewMembers = document.getElementById('assign')
   
    const memberValue = addNewMembers.value.trim();

    if(memberValue !== ''){
        const newMembers = memberValue.split(',').map(member => member.trim()).filter(member => member !== '');

    
    
    
    members.push(...newMembers)


    
    dropdown.innerHTML = '';
    
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        dropdown.appendChild(option)
    });

}
    addNewMembers.value='';

}





function addTask() {
    const taskName = taskNameInput.value;
    const desc = description.value;
    const taskHours = taskHoursInput.value;
    const assignedMember = document.getElementById('assign-member').value;

    if (taskName === '' || desc === '' || taskHours === '') return;

    const taskId = `task-${Date.now()}`;
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('draggable', 'true');
    taskCard.setAttribute('id', taskId);
    taskCard.innerHTML = `
        <h3 class="taskname">${taskName}</h3>
        <p class="description">${desc}</p>
        <p class="hours">Hours to Complete: ${taskHours}</p>
        <p class="assigned">Task Assigned to: ${assignedMember}</p>
        <button class ="taskDelete">Delete Task</button>
        <button class="editTask" onclick ="editTask('${taskId}')">Edit Task</button>    
    `;

    const deleteButton = taskCard.querySelector('.taskDelete');
    deleteButton.addEventListener('click', () => taskDeleted(taskId));

    taskCard.addEventListener('dragstart', dragstartHandler);
    taskCard.addEventListener('dragend', dragEnd);
    document.getElementById('todo-list').appendChild(taskCard);
    taskCount()
    // saveTasks();
    clearForm();
    const addTaskBtn = document.getElementById('add-task-btn');
    addTaskBtn.textContent = 'Add Task';   // Change back to "Add Task"
    addTaskBtn.onclick = addTask;
}

function editTask (taskId){

    const taskCard = document.getElementById(taskId);
    
    const taskName = taskCard.querySelector('.taskname').textContent.replace('Description: ', '');
    const description = taskCard.querySelector('.description').textContent;
    const hours = taskCard.querySelector('.hours').textContent;
    const assigned = taskCard.querySelector('.assigned').textContent;
    
    document.getElementById('task-name').value = taskName;
    document.getElementById('description').value = description;
    document.getElementById('assign-member').value = assigned;
    

    if (!isNaN(hours)) {
        document.getElementById('task-hours').value = taskHours;
    } else {
        document.getElementById('task-hours').value = '0'; 
    }
    
    const addTaskBtn = document.getElementById('add-task-btn');
    addTaskBtn.textContent = 'Save Changes';

    taskCard.remove();

    addTaskBtn.onclick = function () {
        addTask(taskId);            
        }
    }

    



function taskDeleted(taskId){
    const taskCard = document.getElementById(taskId);
        if (taskCard){
            taskCard.remove()
            taskCount();
        }
    
}

function deleteTask() {
    todoList.innerHTML = '';
    progressList.innerHTML = '';
    completedList.innerHTML = '';
    taskCount()
}

function clearForm() {
    taskNameInput.value = '';
    description.value = '';
    taskHoursInput.value = '';
}

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
    const currentParentList = taskCard.parentElement;
    if (targetList && taskCard) {
        targetList.appendChild(taskCard);
        if (targetList === todoList) {
            taskCount();
        }else if (targetList === completedList){
            taskCount()
        } else if (targetList === progressList){

        }
    }

  

taskCount();

}
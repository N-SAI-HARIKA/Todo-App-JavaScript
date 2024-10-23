document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        storedTasks.forEach(task => {
            tasks.push({
                text: task.text || '',
                completed: task.completed || false,
                dueDate: task.dueDate || '',
                priority: task.priority || 'low', 
                category: task.category || 'work'  
            });
        });
        updateTasks();
        updateStats();
    }
    document.getElementById('filterSelect').addEventListener('change', filterTasks);
});


let tasks = [];

const save = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const input = document.getElementById('input');
    const dueDateInput = document.getElementById('dueDate');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');

    const text = input.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value; 
    const category = categorySelect.value;
    if (text) {
        tasks.push({ text: text, completed: false, dueDate: dueDate, priority: priority, category: category });
        input.value = "";
        dueDateInput.value = ""; 
        prioritySelect.value = "low";
        categorySelect.value = "work";
        updateTasks();
        updateStats();
        save();
    }
};
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'low': return 'green';
        case 'medium': return 'orange';
        case 'high': return 'red';
        default: return 'grey';
    }
};

const updateTasks = () => {
    const tasksList = document.getElementById('task_List');
    tasksList.innerHTML = "";  // Clear previous tasks

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
                <p>${task.text}</p>
                <p class="due-date">Due: ${task.dueDate ? task.dueDate : 'No due date'}</p>
                <span class="priority" style="color:${getPriorityColor(task.priority)};">
                    ${task.priority ? task.priority.toUpperCase() : 'UNKNOWN'}</span>
                <span class="category">[${task.category}]</span>
            </div>
            <div class="icons">
                <img src="https://cdn-icons-png.flaticon.com/128/1160/1160515.png" onClick="editTask(${index})" alt="Edit" />
                <img src="https://cdn-icons-png.flaticon.com/128/3096/3096687.png" onClick="deleteTask(${index})" alt="Delete" />
            </div>
        </div>
        `;
        listItem.querySelector('.checkbox').addEventListener("change", () => toggleTaskComplete(index));
        tasksList.append(listItem);
    });
};

document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
});

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasks();
    updateStats();
    save();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasks();
    updateStats();
    save();
};

const editTask = (index) => {
    const input = document.getElementById('input');
    input.value = tasks[index].text;  
    tasks.splice(index, 1); 
    updateTasks();
    updateStats();
    
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;

    const num = document.getElementById('num');
    num.textContent = `${completedTasks}/${totalTasks}`;

    if(tasks.length && completedTasks === totalTasks){
        blastConfetti();
    }else {
        stopConfetti();  
    }
};

let confettiAnimationId;

const blastConfetti = () => {
    const end = Date.now() + 5 * 1000;

const colors = ["#bb0000", "#ffffff"];

(function frame() {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors,
  });

  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors,
  });

  if (Date.now() < end) {
    confettiAnimationId = requestAnimationFrame(frame);
  }
})();
};
const stopConfetti = () => {
    if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId); 
    }
};


const filterTasks = () => {
    const filterValue = document.getElementById('filterSelect').value;
    const tasksList = document.getElementById('task_List');
    tasksList.innerHTML = ""; 

    let filteredTasks = [];

    if (filterValue === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = "<li><h1>No tasks completed</h1></li>";
        }
    } else if (filterValue === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = "<li><h1>No pending tasks</h1></li>";
        }
    } else {
        filteredTasks = tasks;
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = "<li><h1>No tasks available</h1></li>";
        }
    }

    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
                <p>${task.text}</p>
            </div>
            <div class="icons">
               <img src="https://cdn-icons-png.flaticon.com/128/1160/1160515.png" onClick="editTask(${index})" alt="Edit" />
               <img src="https://cdn-icons-png.flaticon.com/128/3096/3096687.png" onClick="deleteTask(${index})" alt="Delete" />
            </div>
        </div>
        `;
        listItem.querySelector('.checkbox').addEventListener("change", () => toggleTaskComplete(index));
        tasksList.append(listItem);
    });
};


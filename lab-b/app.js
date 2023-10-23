document.addEventListener('DOMContentLoaded', () => {
    // Load tasks from Local Storage
    loadTasks();

    // Add event listener for search input
    document.getElementById('searchInput').addEventListener('input', filterTasks);

    // Set min attribute of the dueDate input to the current date and time
    const dueDateInput = document.getElementById('dueDate');
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
    dueDateInput.min = formattedNow;
});

function addTask() {
    const taskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueDate');

    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (validateTask(taskText, dueDate)) {
        const task = {
            text: taskText,
            dueDate: dueDate
        };

        saveTask(task);
        loadTasks();
        taskInput.value = '';
        dueDateInput.value = '';
    }
}

function validateTask(text, dueDate) {
    if (text.length < 3 || text.length > 255) {
        alert('Task must be between 3 and 255 characters.');
        return false;
    }

    if (dueDate && new Date(dueDate) < new Date()) {
        alert('Due date must be in the future.');
        return false;
    }

    return true;
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const formattedDueDate = task.dueDate ? formatDueDate(task.dueDate) : 'Not specified';
        span.textContent = `${task.text} - Do: ${formattedDueDate}`;
        li.appendChild(span);

        if (task.dueDate && new Date(task.dueDate) < new Date()) {
            li.classList.add('due-soon');
        }

        li.addEventListener('click', () => editTask(index));
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent li click event from firing
            deleteTask(index);
            loadTasks(); // Reload tasks after deletion
        });
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToEdit = tasks[index];

    const li = document.createElement('li');
    li.classList.add('editing');
    const input = document.createElement('input');
    input.value = taskToEdit.text;
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'datetime-local';
    dueDateInput.value = taskToEdit.dueDate || '';
    dueDateInput.min = document.getElementById('dueDate').min; // Set the same min as the add task form
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent li click event from firing
        saveEditedTask(index, input.value, dueDateInput.value);
    });

    li.appendChild(input);
    li.appendChild(dueDateInput);
    li.appendChild(saveButton);

    const taskList = document.getElementById('taskList');
    taskList.replaceChild(li, taskList.childNodes[index]);
}

function saveEditedTask(index, newText, newDueDate) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const editedTask = tasks[index];

    editedTask.text = newText;
    editedTask.dueDate = newDueDate;

    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function filterTasks() {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toLowerCase();

    const taskList = document.getElementById('taskList');
    const tasks = taskList.getElementsByTagName('li');

    Array.from(tasks).forEach(task => {
        const span = task.querySelector('span');
        const originalText = span.textContent;
        const taskText = originalText.toLowerCase();

        if (filter.length >= 2) {
            const isMatch = taskText.includes(filter);

            if (isMatch) {
                span.innerHTML = originalText.replace(new RegExp(filter, 'gi'), match => `<span style="background-color: yellow">${match}</span>`);
            } else {
                span.textContent = originalText; // Restore original text if there's no match
            }

            task.style.display = isMatch || filter === '' ? 'flex' : 'none';
        } else {
            // Jeśli mniej niż 2 znaki, pokaż wszystkie zadania
            task.style.display = 'flex';
            span.textContent = originalText; // Restore original text
        }
    });
}

function formatDueDate(dueDate) {
    const dateObj = new Date(dueDate);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date} godziny: ${time}`;
}

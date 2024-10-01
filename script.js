const tasks = [];
let currentTaskName = '';

const addTask = (name, dueDate) => {
    const taskObj = {
        id: Date.now(),
        name,
        dueDate: new Date(dueDate),
        createdAt: new Date(),
    };
    tasks.push(taskObj);
    renderTasks();
};

const renderTasks = () => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks.map(task => `
        <li>
            ${task.name} (Prazo: ${task.dueDate.toLocaleString()}) - Criado em: ${task.createdAt.toLocaleString()}
            <button class="delete-btn" data-id="${task.id}">Excluir</button>
        </li>
    `).join('');

    taskList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            tasks.splice(tasks.findIndex(task => task.id == e.target.dataset.id), 1);
            renderTasks();
        });
    });
};

document.getElementById('addTaskBtn').addEventListener('click', () => {
    currentTaskName = document.getElementById('taskInput').value.trim();
    document.getElementById('errorMsg').classList.add('hidden');

    if (currentTaskName) {
        document.getElementById('dateTimeSelector').classList.remove('hidden');
        document.getElementById('dueDate').value = '';
        document.getElementById('taskInput').value = currentTaskName;
    } else {
        alert('Por favor, insira uma tarefa!');
    }
});

document.getElementById('saveTaskBtn').addEventListener('click', () => {
    const dueDateInput = document.getElementById('dueDate');
    const dueDate = new Date(dueDateInput.value);
    const now = new Date();

    if (dueDateInput.value && dueDate >= now) {
        addTask(currentTaskName, dueDateInput.value);
        document.getElementById('dateTimeSelector').classList.add('hidden');
    } else {
        showError('Por favor, selecione uma data e hora válida (futura).');
    }
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('dateTimeSelector').classList.add('hidden');
    document.getElementById('taskInput').value = '';
});

const showError = (message) => {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden', 'visible');
    errorMsg.classList.add('visible');
    setTimeout(() => {
        errorMsg.classList.remove('visible');
        errorMsg.classList.add('hidden');
    }, 5000);
};

document.getElementById('exportBtn').addEventListener('click', () => {
    const ws = XLSX.utils.json_to_sheet(tasks.map(({ name, dueDate, createdAt }) => ({
        Nome: name,
        Prazo: dueDate.toLocaleString(),
        Criado_em: createdAt.toLocaleString(),
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tarefas');
    XLSX.writeFile(wb, 'tarefas.xlsx');
});

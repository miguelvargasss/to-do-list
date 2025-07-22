// Este módulo se encargará de renderizar las tareas en el DOM y de 
// manejar los eventos de la interfaz de usuario.


// Importamos las funciones de gestión de tareas desde taskManager.js
import { getTasks, addTask, toggleTaskCompleted, deleteTask } from './taskManager.js';

// Seleccionamos los elementos del DOM (manipulación del DOM)
const showTaskFormBtn = document.getElementById('show-task-form-btn');
const registerTaskModal = document.getElementById('register-task-modal');
const taskRegistrationForm = document.getElementById('task-registration-form');
const taskDaySelect = document.getElementById('task-day');
const taskPrioritySelect = document.getElementById('task-priority');
const taskDescriptionInput = document.getElementById('task-description');
const cancelTaskBtn = document.getElementById('cancel-task-btn');
const dailyTasksContainer = document.getElementById('daily-tasks-container');
const priorityColorIndicator = document.getElementById('priority-color-indicator');

// Array de los dias para tener un orden específico
const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

// Funcion para los colores de prioridad
const updatePriorityColorIndicator = () => {
    const selectedPriority = taskPrioritySelect.value;

    priorityColorIndicator.className = "priority-color-indicator";

    if (selectedPriority === "Alta") {
        priorityColorIndicator.classList.add("high");
    } else if (selectedPriority === "Media") {
        priorityColorIndicator.classList.add("medium");
    } else if (selectedPriority === "Baja") {
        priorityColorIndicator.classList.add("low");
    }
};

// Función para renderizar las tareas en el DOM - Por dia
export const renderTasks = () => {
    dailyTasksContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    // Obtener las tareas y agruparlas por día
    const tasks = getTasks();

    // Agrupar tareas por día
    const tasksByDay = {};
    daysOfWeek.forEach(day => {
        tasksByDay[day] = []; // Iniciar cda día con un array vacío
    });

    tasks.forEach(task => {
        if (tasksByDay[task.day]) {
            tasksByDay[task.day].push(task);
        };
    });

    // Iterar sobre las tareas y agruparlas, todo en orden
    daysOfWeek.forEach(day => {
        const daySection = document.createElement('div');
        daySection.classList.add('day-section');

        const dayHeader = document.createElement('h2');
        dayHeader.textContent = `${day}:`;
        daySection.appendChild(dayHeader);

        const taskList = document.createElement('ul');
        taskList.classList.add('task-list-daily');

        // Si existe tareas para este dia RENDERIZARLAS
        if (tasksByDay[day].length > 0) {
            // Estas tareas se ordenanran por Prioridad - (alta, media, baja)
            const sortedTasks = [...tasksByDay[day]].sort((a, b) => {
                const priorityOrder = { "Alta": 3, "Media": 2, "Baja": 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });

            sortedTasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.dataset.id = task.id;

                if (task.completed) {
                    listItem.classList.add('completed');
                }

                //  Determinar el color de la prioridad
                let priorityDotClass = '';
                if (task.priority === "Alta") {
                    priorityDotClass = 'high';
                } else if (task.priority === "Media") {
                    priorityDotClass = 'medium';
                } else if (task.priority === "Baja") {
                    priorityDotClass = 'low';
                }

                // Se usa template literals para crear el HTML
                listItem.innerHTML = `
                    <div class="task-details">
                        <span class = "task-description">${task.description}</span>
                        <div class = "priority-info">
                            Prioridad: ${task.priority} <span class = "priority-dot ${priorityDotClass}"></span>
                        </div>
                    </div>
                    <div>
                        <button class = "toggle-btn" data-id="${task.id}">
                            ${task.completed ? 'Deshacer' : 'Completar'}
                        </button>
                        <button class = "delete-btn" data-id="${task.id}">Eliminar</button> 
                    </div>
                `;

                // Eventos de los botones
                const toggleBtn = listItem.querySelector(".toggle-btn");
                toggleBtn.addEventListener("click", () => {
                    toggleTaskCompleted(task.id);
                    renderTasks(); // Vuelve a renderizar las tareas
                });

                const deleteBtn = listItem.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", () => {
                    deleteTask(task.id);
                    renderTasks(); // Vuelve a renderizar las tareas
                })

                taskList.appendChild(listItem);
            });
        } else {
            // Un mensaje si no hay tareas para este día
            const noTasksMessage = document.createElement('li');
            noTasksMessage.textContent = "No hay tareas para este día.";
            noTasksMessage.style.fontStyle = "italic";
            noTasksMessage.style.color = "#888";
            taskList.appendChild(noTasksMessage);
        };

        daySection.appendChild(taskList);
        dailyTasksContainer.appendChild(daySection);
    });
};

// Evento para mostrar el formulario de registro de tareas
export const setupEventListeners = () => {

    // Mostrar el formulario de registro de tareas
    showTaskFormBtn.addEventListener('click', () => {
        registerTaskModal.style.display = 'flex'; // Mostrar el modal

        // Limpiar el formulario al abrirlo nuevamente
        taskRegistrationForm.reset();
        updatePriorityColorIndicator(); // Actualizar el indicador de color de prioridad
    });

    // Oculatar formulario al cancelar
    cancelTaskBtn.addEventListener('click', () => {
        registerTaskModal.style.display = 'none'; // Ocultar el modal
    });

    // Actualizar el indicador de color de prioridad al cambiar la selección
    taskPrioritySelect.addEventListener('change', updatePriorityColorIndicator);

    // Envio del formulario de registro de tareas
    taskRegistrationForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const description = taskDescriptionInput.value.trim();
        const day = taskDaySelect.value;
        const priority = taskPrioritySelect.value;

        if (description && day && priority) {
            addTask(description, day, priority); // Añadir la tarea
            taskRegistrationForm.reset(); // Limpiar el formulario
            registerTaskModal.style.display = 'none'; // Ocultar el modal
            renderTasks(); // Volver a renderizar las tareas
        } else {
            // Una alerta si faltan campos
            alert("Por favor, completa todos los campos.");
        }
    });

}




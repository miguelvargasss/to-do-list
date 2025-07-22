// Este módulo manejará la lógica de negocio de las tareas.

import { saveTasks, loadTasks } from './storage.js'; // Importa desde storage.js
let tasks = loadTasks(); // Cargar las tareas al iniciar el módulo

export const getTasks = () => {
    return tasks;
};

export const addTask = (description, day, priority) => {
    const newTask = {
        id: Date.now(), // Un ID único basado en la marca de tiempo (ES6+ feature)
        description, 
        day,
        priority,   
        completed: false
    };
    tasks.push(newTask);
    saveTasks(tasks); // Guardar las tareas después de añadir
    return newTask;
};

export const toggleTaskCompleted = (id) => {
    const task = tasks.find(task => task.id === id); // find() es ES6+
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks); // Guardar después de actualizar
    }
};

export const deleteTask = (id) => {
    // filter() es ES6+
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks); // Guardar después de eliminar
};
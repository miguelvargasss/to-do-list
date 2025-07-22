// Este es el punto de entrada de tu aplicación. Aquí importarás los módulos y los inicializarás.

import { renderTasks, setupEventListeners } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();          // Carga y muestra las tareas existentes
    setupEventListeners();  // Configura todos los oyentes de eventos
});
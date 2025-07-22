// Este módulo se encargará de guardar y cargar las tareas del localStorage.
// Utilizaremos JSON para serializar y deserializar los datos de las tareas.

export const saveTasks = (tasks) => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
};
// Guardamos las tareas en el localStorage como una cadena JSON
export const loadTasks = () => {
    const tasksJSON = localStorage.getItem('todo-tasks');
    // Usamos el operador de cortocircuito (||) para devolver un array vacío si no hay nada en localStorage
    return tasksJSON ? JSON.parse(tasksJSON) : [];
};

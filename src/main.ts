document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
      <p>
        <label for="new-task">Nova tarefa</label>
        <input id="new-task" type="text">
        <button id="add-task">Criar</button>
      </p>
      
      <h3>Tarefas:</h3>
      <ul id="tasks-container">
      </ul>
    </div>
`;

const taskInput = document.querySelector<HTMLInputElement>("#new-task");
const addTaskButton = document.querySelector<HTMLButtonElement>("#add-task");
addTaskButton?.addEventListener("click", addTask);
const tasksContainer =
  document.querySelector<HTMLUListElement>("#tasks-container");

function addTask() {
  if (!taskInput || !tasksContainer) return;
  if (!taskInput.value) return;

  const taskContainer = createTask(taskInput.value);
  tasksContainer.appendChild(taskContainer);

  taskInput.value = "";
}

function createTask(title: string) {
  let taskContainer = document.createElement("li");
  let checkBox = document.createElement("input");
  let label = document.createElement("label");

  checkBox.type = "checkbox";

  label.innerText = title;

  taskContainer.appendChild(checkBox);
  taskContainer.appendChild(label);

  return taskContainer;
}

export {};

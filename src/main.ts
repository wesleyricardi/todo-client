import "./style.css";

//TODO: separate functions into different files or maybe create a class
//TODO: investigate that sometimes during development when calling the API to update or delete the function it sends incorrect id
//TODO: refactor to better handle errors

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const API_HOST = "http://localhost:3000/"; //TODO: CHANGE DO USE ENVIRONMENT VARIABLE

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
      <div>
        <label for="new-task">Crie uma nova tarefa</label>
        <input id="new-task" type="text">
        <button id="add-task">Criar</button>
      </div>
      
      <h3>Tarefas:</h3>
      <ul id="tasks-container">
      </ul>
    </div>
`;

const taskInput = document.querySelector<HTMLInputElement>("#new-task");
taskInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addNewTask();
});

const addTaskButton = document.querySelector<HTMLButtonElement>("#add-task");
addTaskButton?.addEventListener("click", addNewTask);

const tasksContainer =
  document.querySelector<HTMLUListElement>("#tasks-container");

//TODO: check if it's the best way to call the function that way in vanilla js
getAllTasks();

async function addNewTask() {
  if (!taskInput || !tasksContainer) return;
  if (!taskInput.value) return;

  const { id, title, completed } = await createTask(taskInput.value);
  const taskContainer = createTaskElement(id, title, completed);
  tasksContainer.appendChild(taskContainer);

  taskInput.value = "";
}

function addTasks(tasks: Task[]) {
  if (!tasksContainer) return;

  tasks.forEach((task) => {
    let taskContainer = createTaskElement(task.id, task.title, task.completed);

    tasksContainer.appendChild(taskContainer);
  });
}

function createTaskElement(
  id: number | string,
  title: string,
  completed: boolean = false
) {
  let taskContainer = document.createElement("li");
  let checkBox = document.createElement("input");
  let label = document.createElement("label");
  let deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  if (completed) checkBox.checked = true;
  checkBox.addEventListener("change", () => toggleTaskCompletion(id, checkBox));

  label.innerText = title;

  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  deleteButton.addEventListener("click", () => deleteTask(id, taskContainer));

  taskContainer.appendChild(checkBox);
  taskContainer.appendChild(label);
  taskContainer.appendChild(deleteButton);

  return taskContainer;
}

async function createTask(title: string): Promise<Task> {
  try {
    const res = await fetch(API_HOST + "add_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    });
    if (res.status !== 201) throw new Error("create task failed");

    const newTask = (await res.json()) as Task;
    return newTask;
  } catch (e) {
    throw new Error("Error");
  }
}

async function deleteTask(id: number | string, taskContainer: HTMLLIElement) {
  try {
    const res = await fetch(API_HOST + "delete_task?id=" + id, {
      method: "DELETE",
    });
    if (res.status !== 200) throw new Error("delete task failed");

    tasksContainer?.removeChild(taskContainer);
  } catch (e) {
    console.log("something went wrong: ", e);
  }
}

async function toggleTaskCompletion(
  id: string | number,
  checkBox: HTMLInputElement
) {
  if (checkBox.checked) {
    const res = await fetch(API_HOST + "mark_task_as_completed?id=" + id, {
      method: "PUT",
    });
    if (res.status !== 200) {
      checkBox.checked = false;
      console.log("mark task as completed failed");
    }
  } else {
    const res = await fetch(API_HOST + "mark_task_as_incompleted?id=" + id, {
      method: "PUT",
    });
    if (res.status !== 200) {
      checkBox.checked = true;
      console.log("mark task as incompleted failed");
    }
  }
}

async function getAllTasks() {
  try {
    const res = await fetch(API_HOST + "get_all_tasks");
    if (res.status === 204) {
      console.log("no tasks found");
      return;
    }
    if (res.status !== 200) throw new Error("get all task failed");

    const tasks = (await res.json()) as Task[];
    console.log(tasks);
    if (tasks.length) addTasks(tasks);
  } catch (e) {
    console.log("something went wrong: ", e);
  }
}

//TODO: remove export {}, I had to do it like this because it was showing an error, search again for how to solve it
export {};

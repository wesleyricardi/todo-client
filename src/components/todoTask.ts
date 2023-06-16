import createElement from "../utils/createElement";
import { Task } from "./todo";
import { TodoTasksList } from "./todoTasksList";

export class TodoTask extends HTMLElement {
    private tasksList: TodoTasksList;
    private task: Task;

    constructor(task: Task, tasksList: TodoTasksList) {
        super();

        this.attachShadow({ mode: 'open' });
        this.tasksList = tasksList;
        this.task = task;
    }

    getInput(task_id: string, completed: boolean) {
        return createElement("input", (e) => {
            e.type = "checkbox";
            e.id = task_id;
            e.checked = completed;
            e.required = true;
            e.addEventListener("change", async () => {
                const TaskUpdatedSuccessfuly = await this.tasksList.updateTask({ id: Number(task_id), title: undefined, completed: e.checked })
                if (!TaskUpdatedSuccessfuly) {
                    e.checked = e.checked ? false : true
                }
            })
        })
    }

    getLabel(task_id: number, title: string) {
        return createElement("label", (e) => {
            e.innerText = title;
            e.contentEditable = 'true';
            e.addEventListener("focusout", async () => {
                if (e.innerText === this.task.title) return

                const TaskUpdatedSuccessfuly = await this.tasksList.updateTask({ id: task_id, title: e.innerText, completed: undefined })
                if (!TaskUpdatedSuccessfuly) {
                    e.innerText = this.task.title
                }
            })
        })
    }

    getButton(task_id: number) {
        return createElement("button",
            (e) => {
                e.innerText = "delete";
                e.addEventListener("click", async () => {
                    const itsDeleted = await this.tasksList.deleteTask(task_id);
                    itsDeleted && this.remove()
                }
                )
            })
    }

    get styles() {
        return /*css*/`
          li {
            display: flex;
            align-items: center;
            position: relative;
          }
          
          li > input {
            width: 30px;
            height: 30px;
          }
          
          li > label {
            font-size: 18px;
            margin: 0 20px 0 10px;
            padding: 4px 12px;
            cursor: text;
          }
          
          li > button {
            margin: 0 0 0 auto;
            background-color: rgb(151, 71, 71);
            height: 30px;
            padding: 0 20px;
            color: rgb(244, 244, 244);
            border: none;
            cursor: pointer;
          }
        `
    }

    connectedCallback() {
        if (!this.shadowRoot) return;
        this.shadowRoot.appendChild(createElement("style", (e) => e.innerText = this.styles))

        const inputEl = this.getInput(String(this.task.id), this.task.completed)
        const labelEl = this.getLabel(this.task.id, this.task.title)
        const buttonEl = this.getButton(this.task.id);
        this.shadowRoot.appendChild(createElement("li", undefined, [inputEl, labelEl, buttonEl]))
    }
}

customElements.define('todo-task', TodoTask);
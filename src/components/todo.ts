import { TodoTasksList } from "./todoTasksList";
import { CreateNewTask } from "./createNewTask";
import createElement from "../utils/createElement";


export type Task = {
    id: number;
    title: string;
    completed: boolean;
};

const API_HOST = "https://todo-server-lime-chi.vercel.app";

export class Todo extends HTMLElement {
    TasksList?: TodoTasksList;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    get styles() {
        return /*css*/`
            slot {
                display: block;
                text-align: center;
                font-size: 2rem;
                margin-bottom: 20px;
            }
        `
    }

    async connectedCallback() {
        if (!this.shadowRoot) return;

        this.shadowRoot.appendChild(createElement("style", (e) => e.innerText = this.styles))
        this.shadowRoot.appendChild(createElement("slot"));

        const createNewTask = new CreateNewTask(this);
        const todoTaskList = new TodoTasksList(this);
        todoTaskList.innerText = "Tarefas";
        const container = createElement("div", undefined, [createNewTask, todoTaskList])
        this.shadowRoot.appendChild(container);

        this.TasksList = todoTaskList;
    }

    async getAllTasks(): Promise<Task[] | null> {
        try {
            const req = await fetch(`${API_HOST}/tasks`);
            if (req.status !== 200 && req.status !== 204) throw new Error("did't get status 200");
            if (req.status === 204) return null;

            return await req.json();
        } catch {
            alert("falha ao recuperar as tarefas");
            return null;
        }
    }

    async createTask(title: string): Promise<Task | false> {
        try {
            const res = await fetch(`${API_HOST}/task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                }),
            });
            if (res.status !== 201) throw new Error("did't get status 201");

            return await res.json();
        } catch {
            alert("falha ao criar tarefa")
            return false
        }
    }

    async deleteTask(id: number): Promise<boolean> {
        try {
            const res = await fetch(`${API_HOST}/task/${id}`, {
                method: "DELETE",
            });

            if (res.status !== 200) throw new Error("did't get status 200");

            return true
        } catch {
            alert("falha ao deletar tarefa")
            return false
        }
    }

    async updateTask(updateTask: { id: number, title?: string, completed?: boolean }): Promise<boolean> {
        try {
            const res = await fetch(`${API_HOST}/task/${updateTask.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: updateTask.title,
                    completed: updateTask.completed
                })
            })
            if (res.status !== 200) throw new Error("did't get status 200");

            return true
        } catch {
            alert("falha ao atualizar a tarefa")
            return false
        }

    }
}

customElements.define('custom-todo', Todo)
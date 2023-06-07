import createElement from "../utils/createElement";
import { Task, Todo } from "./todo";
import { TodoTask } from "./todoTask";


export class TodoTasksList extends HTMLElement {
    private tasksList: Task[] = [];
    private todo?: Todo;

    containerElement?: HTMLUListElement;

    constructor(todo: Todo) {
        super();
        this.todo = todo;
        todo.getAllTasks().then((tasksList) => {
            if (tasksList) this.tasksList = tasksList;
            this.render()
        })

        this.attachShadow({ mode: 'open' });
    }

    addNewTask(newTask: { id: number, title: string, completed: boolean }) {
        this.tasksList.push(newTask);

        const taskElement = new TodoTask(newTask, this)
        this.containerElement?.appendChild(taskElement)
    }

    async deleteTask(id: number): Promise<boolean> {
        const todoDeleted = await this.todo?.deleteTask(id);
        if (!todoDeleted) return false

        const taskIndex = this.tasksList.findIndex((task) => task.id === id)
        this.tasksList.splice(taskIndex, 1);
        return true
    }

    async updateTask(updateTask: { id: number, title?: string, completed?: boolean }): Promise<boolean | undefined> {
        const todoUpdated = await this.todo?.updateTask(updateTask);
        if (!todoUpdated) return false

        const taskIndex = this.tasksList.findIndex((task) => task.id === updateTask.id);
        const title = updateTask.title || this.tasksList[taskIndex].title
        const completed = updateTask.completed === undefined ? this.tasksList[taskIndex].completed : updateTask.completed

        this.tasksList[taskIndex] = { id: updateTask.id, title, completed };

        return true
    }

    get styles() {
        return /*css*/`
            slot {
                display: block;
                font-size: 1.5em;
                text-align: center;
            }

            ul {
                list-style: none;
                margin: 0 auto;
                width: clamp(100px, 100%, 500px);
            }
        `
    }

    render() {
        if (!this.shadowRoot) return;

        const ulElement = createElement('ul', (e) => {
            this.tasksList.map(task => {
                const taskElement = new TodoTask(task, this)
                e.appendChild(taskElement)
            })
        })

        this.shadowRoot.appendChild(createElement("style", (e) => e.innerText = this.styles))
        this.shadowRoot.appendChild(createElement('slot'))
        this.shadowRoot.appendChild(ulElement);

        this.containerElement = ulElement;
    }
}

customElements.define('todo-tasks-list', TodoTasksList)
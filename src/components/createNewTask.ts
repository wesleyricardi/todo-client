import createElement from "../utils/createElement";
import { Todo } from "./todo";

export class CreateNewTask extends HTMLElement {
    private todo: Todo

    constructor(todo: Todo) {
        super();
        this.todo = todo;
        this.attachShadow({ mode: 'open' });
    }

    get styles() {
        return /*css*/`
            form {
                width: clamp(100px, 100%, 600px);
                margin: 0 auto 20px;
                text-align: center;
            }

            form > label {
                display: block;
                font-size: 30px;
                margin-bottom: 10px;
            }
              
            form > input {
                height: 30px;
                width: max-content;
                padding: 10px 20px;
                border: none;
            }
              
            form > button {
                height: 50px;
                width: 100px;
                padding: 10px 20px;
                cursor: pointer;
                background-color: rgba(2, 92, 73, 0.444);
                color: rgb(244, 244, 244);
                border: none;
            }
        `
    }

    connectedCallback() {
        if (!this.shadowRoot) return;
        this.shadowRoot.appendChild(createElement("style", (e) => e.innerText = this.styles))

        const input = createElement("input", (e) => {
            e.type = "text";
            e.id = "new-task-input";
            e.required = true;
            e.addEventListener("keypress", async (event) => {
                if (event.key !== "Enter") return
                const newTask = await this.todo.createTask(e.value);
                if (newTask) {
                    this.todo.TasksList?.addNewTask(newTask);
                    e.value = "";
                }
            })
        })
        const label = createElement("label", (e) => {
            e.innerText = "Descrição";
            e.htmlFor = input.id
        })
        const button = createElement("button", (e) => {
            e.innerText = "CRIAR";
        })

        const container = createElement("form", (element) => element.addEventListener("submit", async (event) => {
            event.preventDefault()
            const newTask = await this.todo.createTask(input.value);
            if (newTask) {
                this.todo.TasksList?.addNewTask(newTask);
                input.value = "";
            }
        }), [label, input, button]);
        this.shadowRoot.appendChild(container);
    }
}

customElements.define('create-new-task', CreateNewTask)
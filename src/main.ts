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

export {};

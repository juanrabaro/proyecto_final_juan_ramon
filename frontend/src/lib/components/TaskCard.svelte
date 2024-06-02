<script>
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let task;

  function handleDelete() {
    dispatch("delete", task._id);
  }

  async function handleUpdate() {
    dispatch("update", task._id);
    goto(`/update-task/${task._id}`);
  }

  function handleDone() {
    dispatch("done", task._id);
  }
</script>

<div class="task-card">
  <div class="title-input">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <h2 on:click={handleDone} class:done={task.done}>{task.title}</h2>
    <input
      id={task._id}
      on:click={handleDone}
      type="checkbox"
      checked={task.done}
    />
  </div>
  <p class:done={task.done}>{task.description}</p>

  <button id={task._id} on:click={handleDelete}>Delete Task</button>
  <button id={task._id} on:click={handleUpdate}>Update Task</button>
</div>

<style lang="scss">
  @import "../assets/styles/variablesYMixins.scss";
  .task-card {
    @include flex(column, center, center, 10px);
    background-color: $cards;
    border-radius: 20px;
    box-shadow: $sombra-floja;
    min-width: 300px;
    padding: 30px 30px 40px 30px;

    .title-input {
      @include flex(row, center, center, 10px);

      h2 {
        font-size: 28px;
        font-family: $fuente-titulos;
        cursor: pointer;
      }

      input {
        width: 25px;
        height: 25px;
        cursor: pointer;
      }
    }

    p {
      font-size: 24px;
      margin-bottom: 15px;
    }

    button {
      @include boton-azul(22px);
    }
    button:hover {
      background-color: $azul-hover;
      cursor: pointer;
    }
  }
  .done {
    text-decoration: line-through;
  }
</style>

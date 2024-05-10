<script>
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let task;

  function handleDelete() {
    dispatch("delete", task._id);
  }

  async function handleUpdate() {
    goto(`/update-task/${task._id}`);
  }

  function handleDone() {
    dispatch("done", task._id);
  }
</script>

<ul>
  <li class:done={task.done}>{task.title}</li>
  <li class:done={task.done}>{task.description}</li>

  <input id={task._id} on:click={handleDone} type="checkbox" checked={task.done} />
  <button id={task._id} on:click={handleDelete}>Delete Task</button>
  <button id={task._id} on:click={handleUpdate}>Update Task</button>
</ul>

<style lang="scss">
  ul {
    background-color: rgb(20, 20, 20);
    padding: 10px;
    width: 20%;
    text-align: center;
    list-style: none;

    .done {
      text-decoration: line-through;
    }

    button {
      background-color: rgb(77, 18, 18);
      color: rgb(217, 217, 217);
      border: none;
      padding: 5px 10px 5px 10px;
      font-size: 1.1em;
      margin-top: 10px;
      cursor: pointer;
      border-radius: 5px;
    }
    button:hover {
      background-color: rgb(122, 28, 28);
    }
  }
</style>

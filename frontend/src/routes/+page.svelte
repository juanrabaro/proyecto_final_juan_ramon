<script>
  import { goto } from '$app/navigation';
  import { deleteTask, updateTask } from "$lib/api/task.js";

  export let data;

  let tasks = data.tasks;

  async function handleDelete(e) {
    const taskId = e.target.id;

    try {
      const res = await deleteTask(taskId, data.token);
      console.log(res);

      tasks = tasks.filter((task) => {
        return task._id !== taskId;
      });
      
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate(e) {
    goto(`/update-task/${e.target.id}`);
  }
</script>

<main>
  <h1>TASKS</h1>
  {#if !tasks.length}
    <p>No tasks</p>
  {:else}
    {#each tasks as task}
      <ul>
        <li>{task.title}</li>
        <li>{task.description}</li>
        <button id={task._id} on:click={handleDelete}>Delete Task</button>
        <button id={task._id} on:click={handleUpdate}>Update Task</button>
      </ul>
    {/each}
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-top: 50px;

    ul {
      background-color: rgb(20, 20, 20);
      padding: 10px;
      width: 20%;
      text-align: center;
      list-style: none;

      button {
        background-color: rgb(77, 18, 18);
        color: rgb(217, 217, 217);
        border: none;
        padding: 5px;
        margin-top: 10px;
        cursor: pointer;
        border-radius: 5px;
      }
      button:hover {
        background-color: rgb(122, 28, 28);
      }
    }
  }
</style>

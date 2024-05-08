<script>
  import { goto } from "$app/navigation";
  import { deleteTask, updateTask } from "$lib/api/task.js";
  import TaskCard from "../lib/components/TaskCard.svelte";

  export let data;

  let tasks = data.tasks;

  async function handleDelete(taskId) {
    // const taskId = e.target.id;

    try {
      const res = await deleteTask(taskId, data.token);
      console.log(res);

    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate(taskId) {
    goto(`/update-task/${taskId}`);
  }

  async function handleDone(e) {
    const taskFound = tasks.find((task) => {
      return task._id === e.target.id;
    });
    taskFound.done = !taskFound.done;

    tasks = tasks.map((task) => {
      if (task._id === taskFound._id) {
        return { ...task, done: taskFound.done };
      }
      return task;
    });

    try {
      const res = await updateTask(taskFound, data.token);
      console.log(res);
      goto("/");
    } catch (error) {
      console.error(error);
    }
  }
</script>

<main>
  <h1>TASKS hhhhhh</h1>
  <button on:click={() => goto("/add-task")}>Add Task</button>
  {#if !tasks.length}
    <p>No tasks</p>
  {:else}
    {#each tasks as task (task._id)}
      <TaskCard {task} on:delete={handleDelete} on:update={handleUpdate} />
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

    button {
      background-color: #ba3333;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 5px 10px 5px 10px;
      font-size: 1.1em;
    }
    button:hover {
      cursor: pointer;
      background-color: #740808;
      border: 1px solid #df7171;
    }
  }
</style>

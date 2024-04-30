<script>
  import { goto } from "$app/navigation";
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
  <h1>TASKS</h1>
  <button on:click={() => goto("/add-task")}>Add Task</button>
  {#if !tasks.length}
    <p>No tasks</p>
  {:else}
    {#each tasks as task}
      <ul>
        <li class:done={task.done}>{task.title}</li>
        <li class:done={task.done}>{task.description}</li>
        <input
          id={task._id}
          on:click={handleDone}
          type="checkbox"
          checked={task.done}
        />
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
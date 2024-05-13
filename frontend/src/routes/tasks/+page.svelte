<script>
  import { goto } from "$app/navigation";
  import { deleteTask, updateTask } from "$lib/api/task.js";
  import TaskCard from "$lib/components/TaskCard.svelte";

  export let data;

  let tasks = data.tasks;
  let showedTasks = orderTasks(data.tasks);


  function orderTasks(tasks) {
    const doneTasks = tasks.filter((task) => task.done);
    const notDoneTasks = tasks.filter((task) => !task.done);

    const orderedTasks = [...notDoneTasks, ...doneTasks];
    return orderedTasks;
  }

  async function handleDelete(data) {
    const taskId = data.detail;

    try {
      const res = await deleteTask(taskId, data.token);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDone(data) {
    const taskFound = tasks.find((task) => {
      return task._id === data.detail;
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
    {#each showedTasks as task (task._id)}
      <TaskCard {task} on:delete={handleDelete} on:done={handleDone} />
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

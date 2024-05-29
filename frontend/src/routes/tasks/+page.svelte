<script>
  import { goto } from "$app/navigation";
  import { deleteTask, updateTask } from "$lib/api/task.js";
  import TaskCard from "$lib/components/TaskCard.svelte";

  export let data;

  let tasks = data.tasks;
  let showedTasks = orderTasks(tasks);
  let doneTasks = tasks.filter((task) => task.done);
  let notDoneTasks = tasks.filter((task) => !task.done);
  let filter = "all";
  let filterName = "";
  let loading = false;

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

      tasks = tasks.filter((task) => task._id !== taskId);
      showedTasks = showedTasks.filter((task) => task._id !== taskId);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDone(data) {
    const taskFound = showedTasks.find((task) => {
      return task._id === data.detail;
    });
    taskFound.done = !taskFound.done;

    showedTasks = showedTasks.map((task) => {
      if (task._id === taskFound._id) {
        return { ...task, done: taskFound.done };
      }
      return task;
    });
    tasks = tasks.map((task) => {
      if (task._id === taskFound._id) {
        return { ...task, done: taskFound.done };
      }
      return task;
    });

    try {
      const res = await updateTask(taskFound, data.token);
      console.log(res);

      showedTasks = orderTasks(showedTasks);
      doneTasks = tasks.filter((task) => task.done);
      notDoneTasks = tasks.filter((task) => !task.done);

      handleFilter();
    } catch (error) {
      console.error(error);
    }
  }

  function handleFilter() {
    filterName = "";
    showedTasks = tasks;
    if (filter === "all") {
      showedTasks = orderTasks(tasks);
    } else if (filter === "done") {
      showedTasks = doneTasks;
    } else if (filter === "not-done") {
      showedTasks = notDoneTasks;
    }
  }

  function handleFilterName() {
    if (filter === "all") {
      showedTasks = tasks.filter((task) => {
        return task.title.toLowerCase().includes(filterName.toLowerCase());
      });
    } else if (filter === "done") {
      showedTasks = doneTasks.filter((task) => {
        return task.title.toLowerCase().includes(filterName.toLowerCase());
      });
    } else if (filter === "not-done") {
      showedTasks = notDoneTasks.filter((task) => {
        return task.title.toLowerCase().includes(filterName.toLowerCase());
      });
    }
  }
  async function handleGoToAddTask() {
    loading = true;
    await new Promise(r => setTimeout(r, 0));
    goto("/add-task");
    loading = false;
  }
</script>

<main>
  <h1>TASKS</h1>
  <button on:click={handleGoToAddTask}>Add Task</button>
  {#if loading}
    <div class="lds-dual-ring"></div>
  {:else}
    {#if tasks.length}
      <p>Tasks done: {doneTasks.length}/{tasks.length}</p>
    {/if}
    <select bind:value={filter} on:change={handleFilter}>
      <option value="all" default>All</option>
      <option value="done">Done</option>
      <option value="not-done">Not Done</option>
    </select>
    <input
      type="text"
      placeholder="Filter by title"
      bind:value={filterName}
      on:input={handleFilterName}
    />
    {#if !tasks.length}
      <p>No tasks</p>
    {:else if tasks.length && !showedTasks.length}
      <p>No tasks match with the filter</p>
    {:else}
      {#each showedTasks as task (task._id)}
        <TaskCard {task} on:delete={handleDelete} on:done={handleDone} />
      {/each}
    {/if}
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
    
    .lds-dual-ring,
    .lds-dual-ring:after {
      box-sizing: border-box;
    }
    .lds-dual-ring {
      display: inline-block;
      width: 80px;
      height: 80px;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 64px;
      height: 64px;
      margin: 8px;
      border-radius: 50%;
      border: 6.4px solid currentColor;
      border-color: currentColor transparent currentColor transparent;
      animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>

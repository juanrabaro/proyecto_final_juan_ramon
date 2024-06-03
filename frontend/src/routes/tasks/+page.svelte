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
      // console.log(res);

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
      // console.log(res);

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
</script>

<main>
  <h1>Tasks</h1>
  {#if loading}
    <div class="lds-dual-ring"></div>
  {:else}
    {#if tasks.length}
      <p>Tasks done: {doneTasks.length}/{tasks.length}</p>
    {/if}
    <section class="filters-container">
      <button
        on:click={() => {
          loading = true;
          goto("/add-task");
        }}>Add Task</button
      >
      <input
        type="text"
        placeholder="Filter by title"
        bind:value={filterName}
        on:input={handleFilterName}
      />
      <select bind:value={filter} on:change={handleFilter}>
        <option value="all" default>All</option>
        <option value="done">Done</option>
        <option value="not-done">Not Done</option>
      </select>
    </section>
    {#if !tasks.length}
      <p>No tasks</p>
    {:else if tasks.length && !showedTasks.length}
      <p>No tasks match with the filter</p>
    {:else}
      <section class="cards-container">
        {#each showedTasks as task (task._id)}
          <TaskCard {task} on:update={() => loading = true} on:delete={handleDelete} on:done={handleDone} />
        {/each}
      </section>
    {/if}
  {/if}
</main>

<style lang="scss">
  @import "../../lib/assets/styles/variablesYMixins.scss";
  main {
    @include flex(column, center, center, 10px);
    margin-bottom: 70px;

    h1 {
      font-size: 44px;
      font-family: $fuente-titulos;
    }

    p {
      font-size: 25px;
    }

    .filters-container {
      @include flex(row, space-between, center, 10px);
      width: 60%;

      button {
        @include boton-azul(22px);
        width: 40%;
        text-align: center;
      }
      button:hover {
        background-color: $azul-hover;
        cursor: pointer;
      }
      input {
        width: 40%;
        text-align: center;
        background-color: $inputs;
        color: $placeholders;
        border-radius: 20px;
        border: 0;
        font-size: 22px;
        padding: 10px 20px 10px 20px;
        box-shadow: $sombra;
        background-image: url("../../lib/assets/images/lupa.png");
        background-repeat: no-repeat;
        background-position: 93% center;
      }
      select {
        width: 40%;
        text-align: center;
        background-color: $inputs;
        border-radius: 20px;
        border: 0;
        font-size: 22px;
        padding: 10px 20px 10px 20px;
        color: $texto;
        box-shadow: $sombra;
        appearance: none;
        background-image: url("../../lib/assets/images/flechita.png");
        background-repeat: no-repeat;
        background-position: 90% center;
      }
      select:hover {
        cursor: pointer;
      }
    }
    .cards-container {
      margin-top: 27px;
      width: 60%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
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
  @media (max-width: 670px) {
    main {
      margin-top: 20px;
      .filters-container {
        @include flex(column, center, center, 10px);
        width: 90%;
        button {
          width: 90%;
        }
        input {
          width: 90%;
        }
        select {
          width: 90%;
        }
      }
      .cards-container {
        width: 80%;
      }
    }
  }
</style>

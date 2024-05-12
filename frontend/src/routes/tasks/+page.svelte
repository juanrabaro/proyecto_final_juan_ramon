<script>
  import { goto } from "$app/navigation";
  import { deleteTask, updateTask } from "$lib/api/task.js";
  import TaskCard from "$lib/components/TaskCard.svelte";

  export let data;

  let tasks = orderTasks(data.tasks);
  let filter = "all";
  let filterName = "";
  let doneTasks = tasks.filter((task) => task.done);
  let notDoneTasks = tasks.filter((task) => !task.done);

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
      doneTasks = doneTasks.filter((task) => task._id !== taskId);
      notDoneTasks = notDoneTasks.filter((task) => task._id !== taskId);
      tasks = orderTasks(tasks);
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
      doneTasks = tasks.filter((task) => task.done);
      notDoneTasks = tasks.filter((task) => !task.done);
      tasks = orderTasks(tasks);
    } catch (error) {
      console.error(error);
    }
  }

  let doneTaskShowed = doneTasks
  let notDoneTaskShowed = notDoneTasks
  function handleFilterName() {

    if (filter === "all") {
      if (filterName === "") {
        tasks = orderTasks(data.tasks);
      } else {
        const tasksOrdered = orderTasks(data.tasks);
        tasks = tasksOrdered.filter((task) =>
          task.title.toLowerCase().includes(filterName.toLowerCase()),
        );
      }
    } else if (filter === "done") {
      doneTaskShowed = doneTasks.filter((task) =>
        task.title.toLowerCase().includes(filterName.toLowerCase()),
      );
      console.log(filterName);
      console.log(tasks);
      console.log(doneTasks);
    } else if (filter === "not-done") {
      notDoneTasks = notDoneTasks.filter((task) =>
        task.title.toLowerCase().includes(filterName.toLowerCase()),
      );
    }
  }
</script>

<main>
  <h1>TASKS</h1>
  <button on:click={() => goto("/add-task")}>Add Task</button>
  {#if tasks.length}
    <p>Tasks done: {doneTasks.length}/{tasks.length}</p>
  {/if}
  <select bind:value={filter}>
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
  {:else if filter === "not-done"}
    {#if !notDoneTasks.length}
      <p>No not done tasks</p>
    {/if}
    {#each notDoneTasks as task (task._id)}
      <TaskCard {task} on:delete={handleDelete} on:done={handleDone} />
    {/each}
  {:else if filter === "done"}
    {#if !doneTasks.length}
      <p>No done tasks</p>
    {/if}
    {#each doneTaskShowed as task (task._id)}
      <TaskCard {task} on:delete={handleDelete} on:done={handleDone} />
    {/each}
  {:else}
    {#each tasks as task (task._id)}
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

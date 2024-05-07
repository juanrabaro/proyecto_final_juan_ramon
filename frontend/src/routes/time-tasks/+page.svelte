<script>
  import { addTimerTask } from "$lib/api/timerTask.js";
  import { addCronoTask } from "$lib/api/cronoTask.js";
  import CronoTask from "$lib/components/CronoTask.svelte";
  import TimerTask from "$lib/components/TimerTask.svelte";

  export let data;

  // console.log(data.cronoTasks);

  let titleEditMode = false;
  let idTaskToUpdate = "";
  let inputValueToUpdate = "";

  let timerTasks = data.timerTasks;
  let cronoTasks = data.cronoTasks;

  let taskTypeSelected = "timer";
  let titleTimeTask = "";
  let maxTimeTimerTask = 30;


  async function createTimeTask() {
    if (!titleTimeTask.length) return;

    if (taskTypeSelected === "crono") {
      try {
        const res = await addCronoTask({ title: titleTimeTask });
        console.log(res);
        cronoTasks = [...cronoTasks, res.data];
        titleTimeTask = "";
      } catch (error) {
        console.error(error);
      }
    } else if (taskTypeSelected === "timer") {
      try {
        const res = await addTimerTask({
          title: titleTimeTask,
          maxTime: maxTimeTimerTask,
        });
        console.log(res);
        timerTasks = [...timerTasks, res.data];
        titleTimeTask = "";
        maxTimeTimerTask = 30;
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleDeleteCronoTask(event) {
    const taskId = event.detail;
    cronoTasks = cronoTasks.filter((task) => task._id !== taskId);
    console.log(cronoTasks);
  }

  function handleDeleteTimerTask(event) {
    const newTimerTasks = timerTasks.filter(
      (task) => task._id !== event.detail,
    );
    timerTasks = [];
    timerTasks = newTimerTasks;
  }
</script>

<main>
  <h1>TIME TASKS</h1>
  <section>
    <select bind:value={taskTypeSelected}>
      <option value="crono" default>Crono</option>
      <option value="timer">Timer</option>
    </select>
    <input bind:value={titleTimeTask} type="text" placeholder="Title" />
    {#if taskTypeSelected === "timer"}
      <input bind:value={maxTimeTimerTask} type="text" placeholder="MaxTime" />
    {/if}
    <button on:click={createTimeTask}>Add Time Task</button>
  </section>
  <section class="task-container">
    {#if !timerTasks.length && !cronoTasks.length}
      <p>No time tasks</p>
    {:else}
      <section class="timer-task-container">
        <h2>Timer tasks</h2>
        {#each timerTasks as timerTask (timerTask._id)}
          <TimerTask
            on:deleteTimerTask={handleDeleteTimerTask}
            {titleEditMode}
            {idTaskToUpdate}
            {inputValueToUpdate}
            {timerTasks}
            {timerTask}
          />
        {/each}
      </section>
      <section class="crono-task-container">
        <h2>Crono tasks</h2>
        {#each cronoTasks as cronoTask (cronoTask._id)}
          <CronoTask
            on:deleteCronoTask={handleDeleteCronoTask}
            {titleEditMode}
            {idTaskToUpdate}
            {inputValueToUpdate}
            {cronoTasks}
            {cronoTask}
          />
        {/each}
      </section>
    {/if}
  </section>
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

    .task-container {
      display: flex;
      gap: 20px;

      // div {
      //   background-color: rgb(20, 20, 20);
      //   padding: 10px;
      //   width: 100%;
      //   text-align: center;
      //   list-style: none;

      //   button {
      //     background-color: rgb(77, 18, 18);
      //     color: rgb(217, 217, 217);
      //     border: none;
      //     padding: 5px;
      //     margin-top: 10px;
      //     cursor: pointer;
      //     border-radius: 5px;
      //   }
      //   button:hover {
      //     background-color: rgb(122, 28, 28);
      //   }
      // }
    }
  }
</style>

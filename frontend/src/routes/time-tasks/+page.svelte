<script>
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { addTimerTask } from "$lib/api/timerTask.js";
  import { addCronoTask } from "$lib/api/cronoTask.js";
  import CronoTask from "$lib/components/CronoTask.svelte";
  import TimerTask from "$lib/components/TimerTask.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let data;

  // console.log(data.cronoTasks);
  const flipDurationMs = 300;

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
        res.data.id = res.data._id;
        delete res.data._id;
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
        res.data.id = res.data._id;
        delete res.data._id;
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
    cronoTasks = cronoTasks.filter((task) => task.id !== taskId);
    console.log(cronoTasks);
  }

  function handleDeleteTimerTask(event) {
    const newTimerTasks = timerTasks.filter((task) => task.id !== event.detail);
    timerTasks = [];
    timerTasks = newTimerTasks;
  }

  let timerTaskBackup = {};
  function handleDndConsiderTimer(e) {
    console.log(e.detail.info.id);
    const timerTaskFound = timerTasks.find(
      (task) => task.id === e.detail.info.id,
    );
    console.log(timerTaskFound);
    timerTasks = {...e.detail.items, title: "nose"};
    // if (timerTaskFound) {
    //   timerTasks = timerTasks.map((task) => {
    //     if (task.id === timerTaskFound.id) {
    //       timerTaskBackup = task
    //       return { ...task, title: "nose" };
    //     }
    //     return task;
    //   });
    // }
  }
  function handleDndFinalizeTimer(e) {
    console.log(e.detail.info.id);
    const timerTaskFound = timerTasks.find(
      (task) => task.id === e.detail.info.id,
    );
    console.log(timerTaskFound);
    timerTasks = e.detail.items;
    // if (timerTaskFound) {
    //   timerTasks = timerTasks.map((task) => {
    //     if (task.id === timerTaskFound.id) {
    //       return { ...task, title: timerTaskBackup.title };
    //     }
    //     return task;
    //   });
    //   timerTaskBackup = {};
    // }
  }
  function handleDndConsiderCrono(e) {
    cronoTasks = e.detail.items;
  }
  function handleDndFinalizeCrono(e) {
    cronoTasks = e.detail.items;
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
      <section>
        <div>
          <h2>Timer tasks</h2>
          {#if !timerTasks.length}
            <p>No timer tasks</p>
          {/if}
        </div>
        <section
          class="timer-task-container"
          use:dndzone={{ items: timerTasks, flipDurationMs, type: "timer" }}
          on:consider={handleDndConsiderTimer}
          on:finalize={handleDndFinalizeTimer}
        >
          {#each timerTasks as timerTask (timerTask.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
              <TimerTask
                on:deleteTimerTask={handleDeleteTimerTask}
                {titleEditMode}
                {idTaskToUpdate}
                {inputValueToUpdate}
                {timerTasks}
                {timerTask}
              />
            </div>
          {/each}
        </section>
      </section>
      <section>
        <div>
          <h2>Crono tasks</h2>
          {#if !cronoTasks.length}
            <p>No crono tasks</p>
          {/if}
        </div>
        <section
          class="crono-task-container"
          use:dndzone={{ items: cronoTasks, flipDurationMs, type: "crono" }}
          on:consider={handleDndConsiderCrono}
          on:finalize={handleDndFinalizeCrono}
        >
          {#each cronoTasks as cronoTask (cronoTask.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
              <CronoTask
                on:deleteCronoTask={handleDeleteCronoTask}
                {titleEditMode}
                {idTaskToUpdate}
                {inputValueToUpdate}
                {cronoTasks}
                {cronoTask}
              />
            </div>
          {/each}
        </section>
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
    }

    .crono-task-container {
      border: 2px solid white;
      overflow: scroll;
    }

    .timer-task-container {
      border: 2px solid white;
      overflow: scroll;
    }
  }
</style>

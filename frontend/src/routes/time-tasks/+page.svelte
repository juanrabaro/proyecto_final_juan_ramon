<script>
  import {
    deleteTimerTask,
    updateTimerTask,
    addTimerTask,
  } from "$lib/api/timerTask.js";
  import {
    deleteCronoTask,
    updateCronoTask,
    addCronoTask,
  } from "$lib/api/cronoTask.js";

  export let data;

  // console.log(data.cronoTasks);

  let titleEditMode = false;
  let idTaskToUpdate = "";
  let inputValueToUpdate = "";

  let timerTasks = data.timerTasks;
  let cronoTasks = data.cronoTasks;
  let taskTypeSelected = "crono";
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

  async function handleDeleteTimeTask(e) {
    const taskId = e.target.id;

    const taskFound = timerTasks.find((task) => {
      return task._id === taskId;
    });

    // It's a timer task
    if (taskFound) {
      console.log("timer");
      try {
        const res = await deleteTimerTask(taskId);
        console.log(res);
        timerTasks = timerTasks.filter((task) => {
          return task._id !== taskId;
        });
      } catch (error) {
        console.error(error);
      }
    }
    // It's a crono task
    else {
      console.log("crono");
      console.log(taskId);
      try {
        const res = await deleteCronoTask(taskId);
        console.log(res);
        cronoTasks = cronoTasks.filter((task) => {
          return task._id !== taskId;
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleTransformInput(e) {
    titleEditMode = true;
    idTaskToUpdate = e.target.id;
  }

  async function blurOrEnterKey(e) {
    if (e.type === "keydown" && e.key !== "Enter") {
      return;
    }
    inputValueToUpdate = e.target.value;
    titleEditMode = false;

    await handleUpdateTitleTimeTask(e);
  }

  async function handleUpdateTitleTimeTask(e) {
    const taskId = e.target.id;

    const taskFound = timerTasks.find((task) => {
      return task._id === taskId;
    });

    if (taskFound) {
      taskFound.title = inputValueToUpdate;
    }

    // It's a timer task
    if (taskFound) {
      console.log("timer");
      try {
        const res = await updateTimerTask(taskFound);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }
    // It's a crono task
    else {
      console.log("crono");
      const cronoTaskFound = cronoTasks.find((task) => {
        return task._id === taskId;
      });

      cronoTaskFound.title = inputValueToUpdate;

      try {
        const res = await updateCronoTask(cronoTaskFound);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }
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
        {#each timerTasks as timerTask}
          <ul>
            {#if titleEditMode && idTaskToUpdate === timerTask._id}
              <input
                id={timerTask._id}
                autofocus
                on:blur={blurOrEnterKey}
                on:keydown={blurOrEnterKey}
                value={timerTask.title}
              />
            {:else}
              <li id={timerTask._id} on:dblclick={handleTransformInput}>
                {timerTask.title} ✏️
              </li>
            {/if}
            <li>{timerTask.maxTime}</li>
            <button id={timerTask._id} on:click={handleDeleteTimeTask}
              >Delete timerTask</button
            >
          </ul>
        {/each}
      </section>
      <section class="crono-task-container">
        <h2>Crono tasks</h2>
        {#each cronoTasks as cronoTask}
          <ul>
            {#if titleEditMode && idTaskToUpdate === cronoTask._id}
              <input
                id={cronoTask._id}
                autofocus
                on:blur={blurOrEnterKey}
                on:keydown={blurOrEnterKey}
                value={cronoTask.title}
              />
            {:else}
              <li id={cronoTask._id} on:dblclick={handleTransformInput}>
                {cronoTask.title} ✏️
              </li>
            {/if}
            <li>00:00</li>
            <button id={cronoTask._id} on:click={handleDeleteTimeTask}
              >Delete timerTask</button
            >
          </ul>
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

      ul {
        background-color: rgb(20, 20, 20);
        padding: 10px;
        width: 100%;
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
  }
</style>

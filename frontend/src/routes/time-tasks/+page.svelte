<script>
  import { goto } from "$app/navigation";
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

  let timerTasks = data.timerTasks;
  let cronoTasks = data.cronoTasks;
  let taskTypeSelected = "crono";
  let titleTimeTask = "";
  let maxTimeTimerTask = 0;

  async function createTimeTask() {
    if (!titleTimeTask.length) return;
    if (taskTypeSelected === "timer" && !maxTimeTimerTask) return;

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

    // Filtrador
  </section>
  <section>
    {#if !timerTasks.length && !cronoTasks.length}
      <p>No time tasks</p>
    {:else}
      {#each timerTasks as timerTask}
        <ul>
          <li>{timerTask.title}</li>
          <li>{timerTask.maxTime}</li>
          <button id={timerTask._id} on:click={handleDeleteTimeTask}>Delete timerTask</button
            >
            <!-- 
              <button id={timerTask._id} on:click={handleUpdate}
              >Update timerTask</button
              > -->
        </ul>
        {/each}
        {#each cronoTasks as cronoTask}
        <ul>
          <li>{cronoTask.title}</li>
          <button id={cronoTask._id} on:click={handleDeleteTimeTask}>Delete cronoTask</button>
            <!--
            <button id={cronoTask._id} on:click={handleUpdate}
            >Update cronoTask</button
          > -->
        </ul>
      {/each}
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
</style>

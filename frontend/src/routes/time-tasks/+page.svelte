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
        const res = await addTimerTask({ title: titleTimeTask });
        console.log(res);
        //timerTasks = [...timerTasks, res];
      } catch (error) {
        console.error(error);
      }
    } else if (taskTypeSelected === "timer") {
      try {
        const res = await addCronoTask({
          title: titleTimeTask,
          maxTime: maxTimeTimerTask,
        });
        console.log(res);
        //timerTasks = [...timerTasks, res];
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
    <input
      on:input={(e) => (titleTimeTask = e.target.value)}
      type="text"
      placeholder="Title"
    />
    {#if taskTypeSelected === "timer"}
      <input
        on:input={(e) => (maxTimeTimerTask = parseInt(e.target.value))}
        type="text"
        placeholder="MaxTime"
      />
    {/if}
    <button on:click={createTimeTask}>Add Time Task</button>
  </section>
  <section>
    {#if !timerTasks.length && !cronoTasks.length}
      <p>No time tasks</p>
    {:else}
      {#each timerTasks as timerTask}
        <ul>
          <li>{timerTask.title}</li>
          <!-- <button id={timerTask._id} on:click={handleDelete}
            >Delete timerTask</button
            >
            <button id={timerTask._id} on:click={handleUpdate}
            >Update timerTask</button
            > -->
        </ul>
      {/each}
      {#each cronoTasks as cronoTask}
        <ul>
          <li>{cronoTask.title}</li>
          <li>{cronoTask.maxTime}</li>
          <!-- <button id={cronoTask._id} on:click={handleDelete}
            >Delete cronoTask</button
          >
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

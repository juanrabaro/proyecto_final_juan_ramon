<script>
  import { createEventDispatcher } from "svelte";
  import { deleteCronoTask, updateCronoTask } from "$lib/api/cronoTask.js";

  const dispatch = createEventDispatcher();

  export let cronoTasks;
  export let cronoTask;
  export let titleEditMode;
  export let idTaskToUpdate;
  export let inputValueToUpdate;

  async function handleDeleteTimeTask(e) {
    const taskId = e.target.id;

    try {
      const res = await deleteCronoTask(taskId);
      console.log(res);
      dispatch("deleteCronoTask", taskId);
    } catch (error) {
      console.error(error);
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
</script>

<div>
  {#if titleEditMode && idTaskToUpdate === cronoTask._id}
    <input
      id={cronoTask._id}
      autofocus
      on:blur={blurOrEnterKey}
      on:keydown={blurOrEnterKey}
      value={cronoTask.title}
    />
  {:else}
    <p id={cronoTask._id} on:dblclick={handleTransformInput}>
      {cronoTask.title} ✏️
    </p>
  {/if}
  <p>00:00</p>
  <button id={cronoTask._id} on:click={handleDeleteTimeTask}
    >Delete timerTask</button
  >
</div>

<style lang="scss">
  div {
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
</style>

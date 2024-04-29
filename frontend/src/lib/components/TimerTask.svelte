<script>
  import { createEventDispatcher } from "svelte";
  import { deleteTimerTask, updateTimerTask } from "$lib/api/timerTask.js";

  const dispatch = createEventDispatcher();

  export let timerTasks;
  export let timerTask;
  export let titleEditMode;
  export let idTaskToUpdate;
  export let inputValueToUpdate;

  async function handleDeleteTimeTask(e) {
    const taskId = e.target.id;

    try {
      const res = await deleteTimerTask(taskId);
      console.log(res);
      dispatch("deleteTimerTask", taskId);
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

    const taskFound = timerTasks.find((task) => {
      return task._id === taskId;
    });

    taskFound.title = inputValueToUpdate;

    try {
      const res = await updateTimerTask(taskFound);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div>
  {#if titleEditMode && idTaskToUpdate === timerTask._id}
    <input
      id={timerTask._id}
      autofocus
      on:blur={blurOrEnterKey}
      on:keydown={blurOrEnterKey}
      value={timerTask.title}
    />
  {:else}
    <p id={timerTask._id} on:dblclick={handleTransformInput}>
      {timerTask.title} ✏️
    </p>
  {/if}
  <p>{timerTask.maxTime}</p>
  <button id={timerTask._id} on:click={handleDeleteTimeTask}
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

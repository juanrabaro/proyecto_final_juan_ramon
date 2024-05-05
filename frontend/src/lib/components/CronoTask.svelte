<script>
  import { Timer } from "easytimer.js";
  import RunImg from "$lib/assets/run.png";
  import PauseImg from "$lib/assets/pause.png";
  import StopImg from "$lib/assets/stop.png";
  import { createEventDispatcher } from "svelte";
  import { deleteCronoTask, updateCronoTask } from "$lib/api/cronoTask.js";

  // import { onMount } from 'svelte';
  // let isMounted = false;
  // onMount(() => {
  //   isMounted = true;
  // });
  // if (!isMounted) return;

  // console.log(cronoTask);

  const dispatch = createEventDispatcher();

  export let cronoTasks;
  export let cronoTask;
  export let titleEditMode;
  export let idTaskToUpdate;
  export let inputValueToUpdate;

  const timer = new Timer();
  let cronoState = "stopped";
  let showedCrono = "00:00:00:0";

  // $: {
  //   console.log("cronoState " + cronoTask.title + " ha cambiado a " + cronoState);
  // }

  // $: if (cronoTask) {
  // console.log("SALTA");
  // console.log(cronoTask.running);
  if (cronoTask.running === "stopped") {
    console.log("salta stopped " + cronoTask.title);
    cronoState = "stopped";
    timer.stop();
    showedCrono = "00:00:00:0";
  } else if (cronoTask.running === "running") {
    console.log("salta running " + cronoTask.title);
    cronoState = "running";
    const actualTime =
      (new Date() -
        new Date(cronoTask.timeStarted) -
        cronoTask.stoppedTime * 100) /
      100;

    timer.start({
      precision: "secondTenths",
      startValues: { secondTenths: actualTime },
    });
    timer.addEventListener("secondTenthsUpdated", function () {
      showedCrono = getTime();
    });
  } else if (cronoTask.running === "paused") {
    console.log("salta paused " + cronoTask.title);
    cronoState = "paused";
    timer.start({
      precision: "secondTenths",
      startValues: {
        secondTenths: transformIntoSecondTenths(cronoTask.showedCronoForPause),
      },
    });
    timer.pause();
    showedCrono = cronoTask.showedCronoForPause;
  }
  // }

  function getTime() {
    return timer
      .getTimeValues()
      .toString(["hours", "minutes", "seconds", "secondTenths"]);
  }

  function transformIntoSecondTenths(time) {
    const timeSplited = time.split(":");
    const hours = parseInt(timeSplited[0]) * 36000;
    const minutes = parseInt(timeSplited[1]) * 600;
    const seconds = parseInt(timeSplited[2]) * 10;
    const secondTenths = parseInt(timeSplited[3]);
    return hours + minutes + seconds + secondTenths;
  }

  async function handleClickButton(e) {
    const botonClickado = e.target.alt;
    if (botonClickado === "run") {
      try {
        const res = await updateCronoTask({
          _id: cronoTask._id,
          running: "run",
        });
        // console.log(res);
        console.log("EMPIEZA");

        cronoState = "running";

        if (showedCrono === "00:00:00:0") {
          timer.start({ precision: "secondTenths" });
          timer.addEventListener("secondTenthsUpdated", function () {
            showedCrono = getTime();
          });
        } else {
          timer.start({
            precision: "secondTenths",
            startValues: {
              secondTenths: transformIntoSecondTenths(showedCrono),
            },
          });
          timer.addEventListener("secondTenthsUpdated", function () {
            showedCrono = getTime();
          });
        }
      } catch (error) {
        console.error(error);
      }
    } else if (botonClickado === "pause") {
      try {
        const res = await updateCronoTask({
          _id: cronoTask._id,
          running: "pause",
          showedCronoForPause: showedCrono,
        });
        // console.log(res);
        console.log("PAUSATE");

        cronoState = "paused";

        timer.pause();
      } catch (error) {
        console.error(error);
      }
      // Stop crono
    } else {
      try {
        const res = await updateCronoTask({
          _id: cronoTask._id,
          running: "stop",
        });
        // console.log(res);
        console.log("PARATE");

        cronoState = "stopped";

        timer.stop();
        showedCrono = "00:00:00:0";
      } catch (error) {
        console.error(error);
      }
    }
  }

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

<div class="card">
  {#if titleEditMode && idTaskToUpdate === cronoTask._id}
    <!-- svelte-ignore a11y-autofocus -->
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
  <p>{showedCrono}</p>
  <div class="botones">
    {#if cronoState === "stopped"}
      <button on:click={handleClickButton}>
        <img src={RunImg} alt="run" />
      </button>
    {:else if cronoState === "paused"}
      <button on:click={handleClickButton}>
        <img src={StopImg} alt="stop" />
      </button>
      <button on:click={handleClickButton}>
        <img src={RunImg} alt="run" />
      </button>
      <!-- running -->
    {:else}
      <button on:click={handleClickButton}>
        <img src={StopImg} alt="stop" />
      </button>
      <button on:click={handleClickButton}>
        <img src={PauseImg} alt="pause" />
      </button>
    {/if}
  </div>
  <button
    class="delete-button"
    id={cronoTask._id}
    on:click={handleDeleteTimeTask}>Delete timerTask</button
  >
</div>

<style lang="scss">
  .card {
    background-color: rgb(20, 20, 20);
    padding: 10px;
    width: 100%;
    text-align: center;
    list-style: none;
    margin-bottom: 10px;

    .botones {
      margin-bottom: 0;
      display: flex;
      gap: 5px;

      button {
        cursor: pointer;
        display: block;
        width: 35px;
        height: 35px;
        padding: 0;
        margin-top: 4px;
        margin-bottom: 4px;
        border-radius: 6px;
        border: none;

        img {
          background-color: white;
          border-radius: 6px;
          padding: 6px;
          margin-top: 0;
          width: 100%;
          height: 100%;
        }
      }
    }

    .delete-button {
      background-color: rgb(77, 18, 18);
      color: rgb(217, 217, 217);
      border: none;
      padding: 5px;
      margin-top: 10px;
      cursor: pointer;
      border-radius: 5px;
    }
    .delete-button:hover {
      background-color: rgb(122, 28, 28);
    }
  }
</style>

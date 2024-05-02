<script>
  import { Timer } from "easytimer.js";
  import { createEventDispatcher } from "svelte";
  import RunImg from "$lib/assets/run.png";
  import PauseImg from "$lib/assets/pause.png";
  import StopImg from "$lib/assets/stop.png";
  import { deleteTimerTask, updateTimerTask } from "$lib/api/timerTask.js";

  const dispatch = createEventDispatcher();

  export let timerTasks;
  export let timerTask;
  export let titleEditMode;
  export let idTaskToUpdate;
  export let inputValueToUpdate;

  // console.log(timerTask);

  const timer = new Timer();
  let cronoState = "stopped";
  let maximoTiempo = (timerTask.maxTime).toString();

  maximoTiempo.length === 1 && (maximoTiempo = "0" + maximoTiempo);
  let showedCrono = `00:${maximoTiempo}:00:0`;

  if (timerTask.timeStarted && !timerTask.stoppedMoment) {
    cronoState = "running";
    const actualTime =
      (new Date() -
        new Date(timerTask.timeStarted) -
        timerTask.stoppedTime * 100) /
      100;

    timer.start({
      precision: "secondTenths",
      startValues: { secondTenths: actualTime },
    });
    timer.addEventListener("secondTenthsUpdated", function () {
      showedCrono = getTime();
    });
  } else if (timerTask.stoppedMoment) {
    console.log(timerTask.stoppedMoment);
    // cronoState = "paused";
    // showedCrono = timerTask.showedCronoForPause;
  }

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
        const res = await updatetimerTask({
          _id: timerTask._id,
          running: "run",
        });
        console.log(res);

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
        const res = await updatetimerTask({
          _id: timerTask._id,
          running: "pause",
          showedCronoForPause: showedCrono,
        });
        console.log(res);

        cronoState = "paused";

        timer.pause();
      } catch (error) {
        console.error(error);
      }
      // Stop crono
    } else {
      try {
        const res = await updatetimerTask({
          _id: timerTask._id,
          running: "stop",
        });
        console.log(res);

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

<div class="card">
  {#if titleEditMode && idTaskToUpdate === timerTask._id}
  <!-- svelte-ignore a11y-autofocus -->
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
  <!-- <p>{timerTask.maxTime}</p> -->
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
  <button class="delete-button" id={timerTask._id} on:click={handleDeleteTimeTask}
    >Delete timerTask</button
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
<script>
  import { Timer } from "easytimer.js";
  import RunImg from "$lib/assets/run.png";
  import PauseImg from "$lib/assets/pause.png";
  import StopImg from "$lib/assets/stop.png";
  import { createEventDispatcher } from "svelte";
  import { deleteCronoTask, updateCronoTask } from "$lib/api/cronoTask.js";

  const dispatch = createEventDispatcher();

  export let cronoTasks;
  export let cronoTask;
  export let titleEditMode;
  export let idTaskToUpdate;
  export let inputValueToUpdate;

  // console.log(cronoTask);

  let cronoState = "stop";
  const timer = new Timer();
  let actualTime = "00:00:00";
  let pausedTime = 0;

  if (cronoTask.timeStarted && !cronoTask.stoppedMoment) {
    console.log(cronoTask.stoppedTime);
    const elapsedSecondsTotal = Math.trunc(
      (new Date() -
        new Date(cronoTask.timeStarted) -
        cronoTask.stoppedTime * 1000) /
        1000,
    );
    const hours = Math.trunc(elapsedSecondsTotal / 3600);
    const minutes = Math.trunc((elapsedSecondsTotal % 3600) / 60);
    const seconds = Math.trunc(elapsedSecondsTotal % 60);

    actualTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    cronoState = "running";
    timer.start({ startValues: { seconds: elapsedSecondsTotal } });
    timer.addEventListener("secondsUpdated", function (e) {
      // console.log(getTime());
      actualTime = getTime();
    });
  } else if (cronoTask.stoppedMoment) {
    actualTime = cronoTask.actualTimeForPause;
    pausedTime = actualTime;
    cronoState = "pause";
    timer.addEventListener("secondsUpdated", function (e) {
      actualTime = getTime();
    });
  }

  function getTime() {
    return timer.getTimeValues().toString();
  }

  function timeStringToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  async function handleClickButton(e) {
    const botonClickado = e.target.alt;
    if (botonClickado === "run") {
      try {
        const res = await updateCronoTask({
          _id: cronoTask._id,
          running: "run",
        });
        console.log(res);

        cronoState = "running";
        if (actualTime === "00:00:00") {
          timer.start({ startValues: { seconds: actualTime } });
          timer.addEventListener("secondsUpdated", function (e) {
            // console.log(getTime());
            actualTime = getTime();
          });
        } else {
          // console.log("llega");
          // console.log(pausedTime);
          // console.log(timeStringToSeconds(pausedTime));
          // console.log(actualTime);
          timer.start({
            startValues: { seconds: timeStringToSeconds(pausedTime) },
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
          actualTimeForPause: actualTime,
        });
        console.log(res);

        cronoState = "pause";
        timer.pause();
        // console.log(timer.getTimeValues().toString());
        pausedTime = timer.getTimeValues().toString();
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await updateCronoTask({
          _id: cronoTask._id,
          running: "stop",
        });
        console.log(res);

        cronoState = "stop";
        timer.stop();
        timer.removeAllEventListeners();
        actualTime = "00:00:00";
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
  <p>{actualTime}</p>
  <div class="botones">
    {#if cronoState === "stop"}
      <button on:click={handleClickButton}>
        <img src={RunImg} alt="run" />
      </button>
    {:else if cronoState === "pause"}
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

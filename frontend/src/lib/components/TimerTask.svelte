<script>
  import { Timer } from "easytimer.js";
  import { createEventDispatcher } from "svelte";
  import RunImg from "$lib/assets/images/run.png";
  import PauseImg from "$lib/assets/images/pause.png";
  import StopImg from "$lib/assets/images/stop.png";
  import LapizImg from "$lib/assets/images/lapiz.png";
  import { deleteTimerTask, updateTimerTask } from "$lib/api/timerTask.js";
  import { dndMoving } from "$lib/stores/dndStore.js";

  const dispatch = createEventDispatcher();

  export let timerTasks;
  export let timerTask;
  export let titleEditMode;
  export let idTaskToUpdate;
  export let inputValueToUpdate;

  let alertShowed = false;

  let isMoving = false;
  $: {
    // console.log("dndMoving changed:", $dndMoving);
    isMoving = $dndMoving;
  }

  const timer = new Timer({
    countdown: true,
    precision: "secondTenths",
    target: { secondTenths: 0 },
  });
  let cronoState = "stopped";
  let maximoTiempo = timerTask.maxTime.toString();

  maximoTiempo.length === 1 && (maximoTiempo = "0" + maximoTiempo);
  let showedCrono = `00:${maximoTiempo}:00:0`;

  timer.removeAllEventListeners();
  if (!isMoving) {
    if (timerTask.timeStarted && !timerTask.stoppedMoment) {
      // console.log("tiempo corriendo");
      cronoState = "running";
      alertShowed = false;

      const tiempoTranscurrido =
        (new Date() - new Date(timerTask.timeStarted)) / 100;

      let actualTime =
        timerTask.maxTime * 60 * 10 -
        tiempoTranscurrido +
        timerTask.stoppedTime;

      if (actualTime <= 0) {
        actualTime = 0;
        cronoState = "stopped";
        maximoTiempo.length === 1 && (maximoTiempo = "0" + maximoTiempo);
        showedCrono = `00:${maximoTiempo}:00:0`;
        pararTimer();
      } else {
        timer.start({
          countdown: true,
          precision: "secondTenths",
          startValues: { secondTenths: actualTime },
        });
        timer.removeAllEventListeners();
        timer.addEventListener("secondTenthsUpdated", function () {
          showedCrono = getTime();
        });
        // console.log("añadido targetAchieved");
        timer.addEventListener("targetAchieved", function (e) {
          console.log("ANTES del metodo");
          handleTargetAchieved();
          timer.removeAllEventListeners();
          console.log("DESPUES del metodo");
          alertShowed = true;
          console.log(alertShowed);
        });
      }
    } else if (timerTask.stoppedMoment) {
      // console.log("tiempo parado");

      cronoState = "paused";
      showedCrono = timerTask.showedTimerForPause;
    }
  }

  function handleTargetAchieved() {
    if (cronoState !== "stopped" || !alertShowed) {
      alertShowed = true;
      // console.log("Time has run out!");
      cronoState = "stopped";
      maximoTiempo.length === 1 && (maximoTiempo = "0" + maximoTiempo);
      showedCrono = `00:${maximoTiempo}:00:0`;
      pararTimer();
      timer.removeAllEventListeners();
      if (typeof window !== "undefined") {
        alert(`The timer ${timerTask.title} has finished!`);
      }
    }
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

  function refreshTimerTasks() {
    dispatch("refreshTimerTasks");
  }

  async function handleClickButton(e) {
    const botonClickado = e.target.alt;
    if (botonClickado === "run") {
      try {
        const res = await updateTimerTask({
          id: timerTask.id,
          running: "run",
        });
        console.log(res);
        refreshTimerTasks();

        cronoState = "running";
        alertShowed = false;

        if (showedCrono === `00:${maximoTiempo}:00:0`) {
          timer.start({
            startValues: {
              secondTenths: transformIntoSecondTenths(showedCrono),
            },
          });
          timer.removeAllEventListeners();
          timer.addEventListener("secondTenthsUpdated", function () {
            showedCrono = getTime();
          });
          // console.log("añadido targetAchieved");
          timer.addEventListener("targetAchieved", function (e) {
            console.log("ANTES del metodo");
            handleTargetAchieved();
            timer.removeAllEventListeners();
            console.log("DESPUES del metodo");
            alertShowed = true;
            console.log(alertShowed);
          });
        } else {
          timer.start({
            startValues: {
              secondTenths: transformIntoSecondTenths(showedCrono),
            },
          });
          timer.removeAllEventListeners();
          timer.addEventListener("secondTenthsUpdated", function () {
            showedCrono = getTime();
          });
        }
      } catch (error) {
        console.error(error);
      }
    } else if (botonClickado === "pause") {
      try {
        const res = await updateTimerTask({
          id: timerTask.id,
          running: "pause",
          showedTimerForPause: showedCrono,
        });
        console.log(res);
        refreshTimerTasks();

        cronoState = "paused";

        timer.pause();
      } catch (error) {
        console.error(error);
      }
      // Stop timer
    } else {
      try {
        const res = await updateTimerTask({
          id: timerTask.id,
          running: "stop",
        });
        console.log(res);
        refreshTimerTasks();

        cronoState = "stopped";

        maximoTiempo.length === 1 && (maximoTiempo = "0" + maximoTiempo);
        showedCrono = `00:${maximoTiempo}:00:0`;

        timer.stop();
        timer.removeAllEventListeners();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function pararTimer() {
    try {
      await updateTimerTask({
        id: timerTask.id,
        running: "stop",
      });
    } catch (error) {
      console.error(error);
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
      return task.id === taskId;
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
  {#if titleEditMode && idTaskToUpdate === timerTask.id}
    <!-- svelte-ignore a11y-autofocus -->
    <input
      id={timerTask.id}
      autofocus
      on:blur={blurOrEnterKey}
      on:keydown={blurOrEnterKey}
      value={timerTask.title}
    />
  {:else}
    <h2 id={timerTask.id} on:dblclick={handleTransformInput}>
      {timerTask.title} <img src={LapizImg} alt="Edit" />
    </h2>
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
    id={timerTask.id}
    on:click={handleDeleteTimeTask}>Delete timerTask</button
  >
</div>

<style lang="scss">
  @import "../assets/styles/variablesYMixins.scss";
  .card {
    @include flex(column, center, center, 10px);
    border-radius: 20px;
    box-shadow: $sombra-floja;
    background-color: $cards;
    margin-bottom: 15px;
    padding: 20px 20px 30px 20px;

    h2 {
      cursor: pointer;
      font-size: 28px;
      font-family: $fuente-titulos;
      text-align: center;
    }

    p {
      font-size: 24px;
    }

    .botones {
      @include flex(row, center, center, 20px);

      button {
        width: 33px;
        background-color: $cards;
        border: 0;
        cursor: pointer;
        
        img {
          width: 33px;
          background-color: $cards;
          border: 0;
        }
      }
    }

    .delete-button {
      @include boton-azul(20px);
    }
    .delete-button:hover {
      cursor: pointer;
      background-color: $azul-hover;
    }
    
  }
</style>

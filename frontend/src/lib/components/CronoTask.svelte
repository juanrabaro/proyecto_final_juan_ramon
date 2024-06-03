<script>
  import { Timer } from "easytimer.js";
  import RunImg from "$lib/assets/images/run.png";
  import PauseImg from "$lib/assets/images/pause.png";
  import StopImg from "$lib/assets/images/stop.png";
  import LapizImg from "$lib/assets/images/lapiz.png";
  import { createEventDispatcher } from "svelte";
  import { deleteCronoTask, updateCronoTask } from "$lib/api/cronoTask.js";
  import { dndMoving } from "$lib/stores/dndStore.js";

  const dispatch = createEventDispatcher();

  export let cronoTasks;
  export let cronoTask;
  export let titleEditMode;
  export let idTaskToUpdate;
  export let inputValueToUpdate;

  let isMoving = false;
  $: {
    // console.log("dndMoving changed:", $dndMoving);
    isMoving = $dndMoving;
  }

  const timer = new Timer();
  let cronoState = "stopped";
  let showedCrono = "00:00:00:0";

  if (!isMoving) {
    if (cronoTask.running === "stopped") {
      cronoState = "stopped";
      timer.stop();
      showedCrono = "00:00:00:0";
    } else if (cronoTask.running === "running") {
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
      cronoState = "paused";
      timer.start({
        precision: "secondTenths",
        startValues: {
          secondTenths: transformIntoSecondTenths(
            cronoTask.showedCronoForPause,
          ),
        },
      });
      timer.pause();
      showedCrono = cronoTask.showedCronoForPause;
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

  function refreshCronoTasks() {
    dispatch("refreshCronoTasks");
  }

  async function handleClickButton(e) {
    const botonClickado = e.target.alt;
    if (botonClickado === "run") {
      try {
        const res = await updateCronoTask({
          id: cronoTask.id,
          running: "run",
        });
        // console.log(res);
        refreshCronoTasks();
        // console.log("EMPIEZA");

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
          id: cronoTask.id,
          running: "pause",
          showedCronoForPause: showedCrono,
        });
        // console.log(res);
        refreshCronoTasks();
        // console.log("PAUSATE");

        cronoState = "paused";

        timer.pause();
      } catch (error) {
        console.error(error);
      }
      // Stop crono
    } else {
      try {
        const res = await updateCronoTask({
          id: cronoTask.id,
          running: "stop",
        });
        // console.log(res);
        refreshCronoTasks();
        // console.log("PARATE");

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
      // console.log(res);

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

    // console.log("crono");
    const cronoTaskFound = cronoTasks.find((task) => {
      return task.id === taskId;
    });

    cronoTaskFound.title = inputValueToUpdate;

    try {
      const res = await updateCronoTask(cronoTaskFound);
      // console.log(res);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="card">
  {#if titleEditMode && idTaskToUpdate === cronoTask.id}
    <!-- svelte-ignore a11y-autofocus -->
    <input
      id={cronoTask.id}
      autofocus
      on:blur={blurOrEnterKey}
      on:keydown={blurOrEnterKey}
      value={cronoTask.title}
    />
  {:else}
    <h2 id={cronoTask.id} on:dblclick={handleTransformInput}>
      {cronoTask.title} <img src={LapizImg} alt="Edit" />
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
    id={cronoTask.id}
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

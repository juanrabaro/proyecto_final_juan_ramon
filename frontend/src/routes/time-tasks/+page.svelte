<script>
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { addTimerTask } from "$lib/api/timerTask.js";
  import { addCronoTask } from "$lib/api/cronoTask.js";
  import CronoTask from "$lib/components/CronoTask.svelte";
  import TimerTask from "$lib/components/TimerTask.svelte";
  import { moving, notMoving } from "$lib/stores/dndStore.js";
  import { verifyToken } from "$lib/api/auth.js";
  import { getTimerTasks } from "$lib/api/timerTask.js";
  import { getCronoTasks } from "$lib/api/cronoTask.js";
  import { extractToken } from "$lib/api/extractToken";

  export let data;

  // console.log(data.cronoTasks);
  const flipDurationMs = 300;
  let idDndMoving = "";

  let titleEditMode = false;
  let idTaskToUpdate = "";
  let inputValueToUpdate = "";

  let timerTasks = data.timerTasks;
  let cronoTasks = data.cronoTasks;
  let token = data.token;

  let taskTypeSelected = "timer";
  let titleTimeTask = "";
  let maxTimeTimerTask = null;

  let formValid = true;
  let errorMessage = "Fill all the fields with the correct format and title length less than 15 characters";

  async function createTimeTask() {
    if (!titleTimeTask.length || titleTimeTask.length > 15) {
      formValid = false;
      return;
    }
    formValid = true;

    if (taskTypeSelected === "crono") {
      try {
        const res = await addCronoTask({ title: titleTimeTask });
        console.log(res);
        res.data.id = res.data._id;
        delete res.data._id;
        cronoTasks = [...cronoTasks, res.data];
        titleTimeTask = "";
      } catch (error) {
        console.error(error);
      }
    } else if (taskTypeSelected === "timer") {
      if (!maxTimeTimerTask || !Number.isInteger(parseInt(maxTimeTimerTask))) {
        formValid = false;
        return;
      }
      maxTimeTimerTask = parseInt(maxTimeTimerTask);
      formValid = true;
      try {
        const res = await addTimerTask({
          title: titleTimeTask,
          maxTime: maxTimeTimerTask,
        });
        console.log(res);
        res.data.id = res.data._id;
        delete res.data._id;
        timerTasks = [...timerTasks, res.data];
        titleTimeTask = "";
        maxTimeTimerTask = null;
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleDeleteCronoTask(event) {
    const taskId = event.detail;
    cronoTasks = cronoTasks.filter((task) => task.id !== taskId);
  }

  function handleDeleteTimerTask(event) {
    const taskId = event.detail;
    timerTasks = timerTasks.filter((task) => task.id !== taskId);
  }

  function handleDndConsiderTimer(e) {
    moving();
    timerTasks = e.detail.items;
    idDndMoving = e.detail.info.id;
  }
  function handleDndFinalizeTimer(e) {
    notMoving();
    timerTasks = e.detail.items;
    idDndMoving = "";
  }
  function transformDraggedElement(draggedEl, data, index) {
    const msg = `Moving...`;
    draggedEl.innerHTML = msg;
    draggedEl.style.backgroundColor = "black";
    draggedEl.style.color = "white";
    draggedEl.style.display = "flex";
    draggedEl.style.justifyContent = "center";
    draggedEl.style.alignItems = "center";
  }
  function handleDndConsiderCrono(e) {
    // cronoTasks = e.detail.items;
    moving();
    cronoTasks = e.detail.items;
    idDndMoving = e.detail.info.id;
  }
  function handleDndFinalizeCrono(e) {
    // cronoTasks = e.detail.items;
    notMoving();
    cronoTasks = e.detail.items;
    idDndMoving = "";
  }

  function replaceId(array) {
    return array.map((item) => {
      const newItem = { ...item, id: item._id };
      delete newItem._id;
      return newItem;
    });
  }

  // CAMBIAR PARA TRAER ORDEN DEL LOCALSTORAGE
  function orderArray(orderedArray, updatedArray) {
    let newTimeTasks = [];
    newTimeTasks = orderedArray.map((task) => {
      const taskFound = updatedArray.find((taskRes) => {
        return taskRes.id === task.id;
      });
      return taskFound ? taskFound : task;
    });
    return newTimeTasks;
  }
  async function handleRefreshTimerTasks() {
    try {
      const tokenFormated = extractToken(token);
      await verifyToken({ token: tokenFormated });

      let resTimerTasks = await getTimerTasks(tokenFormated);
      resTimerTasks = replaceId(resTimerTasks.data);

      // CAMBIAR PARA TRAER ORDEN DEL LOCALSTORAGE
      timerTasks = orderArray(timerTasks, resTimerTasks);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleRefreshCronoTasks() {
    try {
      const tokenFormated = extractToken(token);
      await verifyToken({ token: tokenFormated });

      let resCronoTasks = await getCronoTasks(tokenFormated);
      resCronoTasks = replaceId(resCronoTasks.data);

      // CAMBIAR PARA TRAER ORDEN DEL LOCALSTORAGE
      cronoTasks = orderArray(cronoTasks, resCronoTasks);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<main>
  <h1>Time Tasks</h1>
  <section class="new-time-task">
    <select bind:value={taskTypeSelected}>
      <option value="crono" default>Crono</option>
      <option value="timer">Timer</option>
    </select>
    <input bind:value={titleTimeTask} type="text" placeholder="Title" />
    {#if taskTypeSelected === "timer"}
      <input bind:value={maxTimeTimerTask} type="text" placeholder="Minutos" />
    {/if}
    <button on:click={createTimeTask}>Add Time Task</button>
  </section>
  {#if !formValid}
    <p class="error">{errorMessage}</p>
  {/if}
  <section class="task-container">
    {#if !timerTasks.length && !cronoTasks.length}
      <p>No time tasks</p>
    {:else}
      <section>
        <div>
          <h2>Timers</h2>
          {#if !timerTasks.length}
            <p>No timer tasks</p>
          {/if}
        </div>
        <section
          class="timer-task-container"
          use:dndzone={{
            items: timerTasks,
            flipDurationMs,
            type: "timer",
            transformDraggedElement,
          }}
          on:consider={handleDndConsiderTimer}
          on:finalize={handleDndFinalizeTimer}
        >
          {#each timerTasks as timerTask (timerTask.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
              <TimerTask
                on:deleteTimerTask={handleDeleteTimerTask}
                on:refreshTimerTasks={handleRefreshTimerTasks}
                {titleEditMode}
                {idTaskToUpdate}
                {inputValueToUpdate}
                {timerTasks}
                {timerTask}
              />
            </div>
          {/each}
        </section>
      </section>
      <section>
        <div>
          <h2>Cronos</h2>
          {#if !cronoTasks.length}
            <p>No crono tasks</p>
          {/if}
        </div>
        <section
          class="crono-task-container"
          use:dndzone={{
            items: cronoTasks,
            flipDurationMs,
            type: "crono",
            transformDraggedElement,
          }}
          on:consider={handleDndConsiderCrono}
          on:finalize={handleDndFinalizeCrono}
        >
          {#each cronoTasks as cronoTask (cronoTask.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
              <CronoTask
                on:deleteCronoTask={handleDeleteCronoTask}
                on:refreshCronoTasks={handleRefreshCronoTasks}
                {titleEditMode}
                {idTaskToUpdate}
                {inputValueToUpdate}
                {cronoTasks}
                {cronoTask}
              />
            </div>
          {/each}
        </section>
      </section>
    {/if}
  </section>
</main>

<style lang="scss">
  @import "../../lib/assets/styles/variablesYMixins.scss";
  main {
    @include flex(column, center, center, 20px);
    padding-top: 15px;
    margin-bottom: 70px;

    h1 {
      font-size: 42px;
      font-family: $fuente-titulos;
    }

    .new-time-task {
      @include flex(row, center, center, 10px);

      select {
        width: 30%;
        text-align: center;
        background-color: $inputs;
        border-radius: 20px;
        border: 0;
        font-size: 19px;
        padding: 10px 20px 10px 20px;
        color: $texto;
        box-shadow: $sombra;
        appearance: none;
        background-image: url("../../lib/assets/images/flechita.png");
        background-repeat: no-repeat;
        background-position: 90% center;
      }
      select:hover {
        cursor: pointer;
      }
      input {
        width: 30%;
        text-align: center;
        background-color: $inputs;
        color: $placeholders;
        border-radius: 20px;
        border: 0;
        font-size: 19px;
        padding: 10px 20px 10px 20px;
        box-shadow: $sombra;
        background-image: url("../../lib/assets/images/lupa.png");
        background-repeat: no-repeat;
        background-position: 93% center;
      }
      button {
        width: 30%;
        @include boton-azul(19px);
      }
      button:hover {
        cursor: pointer;
        background-color: $azul-hover;
      }
    }

    .error {
      color: red;
      font-size: 24px;
    }

    .task-container {
      @include flex(row, center, start, 30px);
      gap: 20px;
      width: 55%;

      h2 {
        font-size: 32px;
        font-family: $fuente-titulos;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 15px;
      }

      section {
        overflow: scroll;
        width: 100%;

        .crono-task-container {
          // @include flex(row, center, center, 20px);
          gap: 20px;
          width: 100%;
        }
        .timer-task-container {
          // @include flex(row, center, center, 20px);
          gap: 20px;
          width: 100%;
        }
      }
    }
  }
  @media (max-width: 980px) {
    main {
      margin-top: 30px;
      .new-time-task {
        width: 80%;
        select,
        input,
        button {
          width: 100%;
        }
      }
      .task-container {
        width: 80%;
      }
    }
  }
  @media (max-width: 650px) {
    main {
      .new-time-task {
        flex-direction: column;
        select,
        input,
        button {
          font-size: 24px;
        }
      }
      .task-container {
        flex-direction: column;
      }
    }
  }
</style>

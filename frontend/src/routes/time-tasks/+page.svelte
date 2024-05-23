<script>
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { addTimerTask } from "$lib/api/timerTask.js";
  import { addCronoTask } from "$lib/api/cronoTask.js";
  import CronoTask from "$lib/components/CronoTask.svelte";
  import TimerTask from "$lib/components/TimerTask.svelte";
  import { dndMoving, moving, notMoving } from "$lib/stores/dndStore.js";
  import { verifyToken } from "$lib/api/auth.js";
  import { getTimerTasks } from "$lib/api/timerTask.js";
  import { extractToken } from "$lib/api/extractToken";

  export let data;

  // console.log(data.cronoTasks);
  const flipDurationMs = 300;
  // let dndMoving = false;
  let idDndMoving = "";

  let titleEditMode = false;
  let idTaskToUpdate = "";
  let inputValueToUpdate = "";

  let timerTasks = data.timerTasks;
  let cronoTasks = data.cronoTasks;
  let token = data.token;

  let taskTypeSelected = "timer";
  let titleTimeTask = "";
  let maxTimeTimerTask = 30;

  async function createTimeTask() {
    if (!titleTimeTask.length) return;

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
        maxTimeTimerTask = 30;
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
    cronoTasks = e.detail.items;
  }
  function handleDndFinalizeCrono(e) {
    cronoTasks = e.detail.items;
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
    let newTimerTasks = [];
    newTimerTasks = orderedArray.map((task) => {
      const taskFound = updatedArray.find((taskRes) => {
        return taskRes.id === task.id;
      });
      return taskFound ? taskFound : task;
    });
    return newTimerTasks;
  }
  async function handleRefreshTimerTasks() {
    console.log("llega");
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
  </section>
  <section class="task-container">
    {#if !timerTasks.length && !cronoTasks.length}
      <p>No time tasks</p>
    {:else}
      <section>
        <div>
          <h2>Timer tasks</h2>
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
              <!-- {dndMoving} -->
              <!-- {...(timerTask.id === idDndMoving ? { dndMoving } : { dndMoving: false })} -->
            </div>
          {/each}
        </section>
      </section>
      <section>
        <div>
          <h2>Crono tasks</h2>
          {#if !cronoTasks.length}
            <p>No crono tasks</p>
          {/if}
        </div>
        <section
          class="crono-task-container"
          use:dndzone={{ items: cronoTasks, flipDurationMs, type: "crono" }}
          on:consider={handleDndConsiderCrono}
          on:finalize={handleDndFinalizeCrono}
        >
          {#each cronoTasks as cronoTask (cronoTask.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
              <CronoTask
                on:deleteCronoTask={handleDeleteCronoTask}
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

    .task-container {
      display: flex;
      gap: 20px;
    }

    .crono-task-container {
      border: 2px solid white;
      overflow: scroll;
    }

    .timer-task-container {
      border: 2px solid white;
      overflow: scroll;
    }
  }
</style>

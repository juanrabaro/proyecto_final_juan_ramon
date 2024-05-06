<script>
  export let data;

  let cronoTasks = data.cronoTasks;
  let timerTasks = data.timerTasks;
</script>

<main>
  <h1>Stadistics</h1>
  <section>
    <h2>Crono Tasks</h2>
    {#each cronoTasks as task (task._id)}
      <div class="crono-tasks-container">
        <p>{cronoTasks.indexOf(task) + 1}. {task.title}</p>
        <p>{parseFloat((task.totalTime / 10).toFixed(1))} seconds</p>
      </div>
    {/each}
  </section>
  <section>
    <h2>Timer Tasks</h2>
    {#each timerTasks as task (task._id)}
      <div class="timer-tasks-container">
        <p>{timerTasks.indexOf(task) + 1}. {task.title}</p>
        <p>{task.totalTime}</p>
      </div>
    {/each}
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-top: 50px;

    section {
      width: 30%;

      h2 {
        text-align: center;
      }

      .crono-tasks-container {
        background-color: rgb(89, 3, 3);
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 10px 0 10px 0;
        padding: 10px;
        border-radius: 8px;
      }

      .timer-tasks-container {
        background-color: rgb(89, 3, 3);
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 10px 0 10px 0;
        padding: 10px;
        border-radius: 8px;
      }
    }
  }
</style>

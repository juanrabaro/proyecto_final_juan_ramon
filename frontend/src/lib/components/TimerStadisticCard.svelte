<script>
  import { Timer } from "easytimer.js";

  export let timerTasks;
  export let task;

  const timer = new Timer();
  let cronoState = task.running;
  let showedTime = "00:00:00";

  console.log(task);

  if (cronoState === "running") {
    const tiempoTotalReal =
      (task.totalTime +
        (new Date() - new Date(task.timeStarted)) / 100 -
        task.stoppedTime) /
      100;

    timer.start({
      precision: "seconds",
      startValues: { seconds: tiempoTotalReal * 10 },
    });
    timer.addEventListener("secondTenthsUpdated", function (e) {
      showedTime = timer
        .getTimeValues()
        .toString(["hours", "minutes", "seconds"]);
    });
  } else if (cronoState === "paused") {
    showedTime = formated(
      task.maxTime * 60 * 10 - task.remainingTime + task.totalTime,
    );
  } else {
    // cronoState === "stopped"
    showedTime = formated(task.totalTime);
  }

  function formated(secondTenths) {
    let hours = Math.floor(secondTenths / 36000);
    let minutes = Math.floor((secondTenths % 36000) / 600);
    let seconds = Math.floor((secondTenths % 600) / 10);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
</script>

<div class="timer-tasks-container">
  <p>{timerTasks.indexOf(task) + 1}. {task.title}</p>
  <p>{showedTime}</p>
</div>

<style lang="scss">
  .timer-tasks-container {
    background-color: rgb(89, 3, 3);
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 10px 0 10px 0;
    padding: 10px;
    border-radius: 8px;
  }
</style>

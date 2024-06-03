<script>
  import { Timer } from "easytimer.js";

  // export let timerTasks;
  export let task;

  const timer = new Timer();
  let cronoState = task.running;
  let showedTime = "00:00:00";

  // console.log(task);

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
  <h3>{task.title}</h3>
  <p>{showedTime} seconds</p>
</div>

<style lang="scss">
  @import "../assets/styles/variablesYMixins.scss";
  .timer-tasks-container {
    @include flex(column, center, center, 10px);
    background-color: $cards;
    width: 100%;
    padding: 20px;
    border-radius: 20px;
    height: 135px;
    box-shadow: $sombra-floja;

    h3 {
      font-size: 24px;
      font-family: $fuente-titulos;
      color: $azul;
    }
    p {
      font-size: 22px;
    }
  }
</style>

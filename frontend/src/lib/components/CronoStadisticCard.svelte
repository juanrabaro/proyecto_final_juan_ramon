<script>
  import { Timer } from "easytimer.js";

  export let cronoTasks;
  export let task;

  const timer = new Timer();
  let cronoState = task.running;
  let showedTime = "00:00:00";

  if (cronoState === "running") {
    const tiempoTotalReal =
      (task.totalTime +
        (new Date() - new Date(task.timeStarted)) / 100 -
        task.stoppedTime) /
      100;

    timer.start({
      precision: "seconds",
      startValues: { seconds: tiempoTotalReal*10 },
    });
    timer.addEventListener("secondTenthsUpdated", function (e) {
      showedTime = timer
        .getTimeValues()
        .toString(["hours", "minutes", "seconds"]);
    });
  } else if (cronoState === "paused") {
    showedTime = formated(
      transformIntoSecondTenths(task.showedCronoForPause) + task.totalTime,
    );
  } else {
    showedTime = formated(task.totalTime);
  }

  function formated(secondTenths) {
    let hours = Math.floor(secondTenths / 36000);
    let minutes = Math.floor((secondTenths % 36000) / 600);
    let seconds = Math.floor((secondTenths % 600) / 10);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function transformIntoSecondTenths(time) {
    const timeSplited = time.split(":");
    const hours = parseInt(timeSplited[0]) * 36000;
    const minutes = parseInt(timeSplited[1]) * 600;
    const seconds = parseInt(timeSplited[2]) * 10;
    const secondTenths = parseInt(timeSplited[3]);
    return hours + minutes + seconds + secondTenths;
  }
</script>

<div class="crono-tasks-container">
  <h3>{task.title}</h3>
  <p>{showedTime} seconds</p>
</div>

<style lang="scss">
  @import "../assets/styles/variablesYMixins.scss";
  .crono-tasks-container {
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

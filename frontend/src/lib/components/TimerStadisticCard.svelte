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
    // showedTime = formated(task.totalTime);
    // console.log(task.maxTime);
    // console.log(task.remainingTime);
    showedTime = formated(
      (task.maxTime*60*10 - task.remainingTime) + task.totalTime,
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
    time = time.toString();
    console.log(time);
    const timeSplited = time.split(":");
    const hours = parseInt(timeSplited[0]) * 36000;
    const minutes = parseInt(timeSplited[1]) * 600;
    const seconds = parseInt(timeSplited[2]) * 10;
    const secondTenths = parseInt(timeSplited[3]);
    console.log(hours + minutes + seconds + secondTenths);
    return hours + minutes + seconds + secondTenths;
  }
</script>

<div class="timer-tasks-container">
  <p>{timerTasks.indexOf(task) + 1}. {task.title}</p>
  <p>{showedTime}</p>
  <!-- <p>{Math.floor(task.totalTime / 10)} seconds</p> -->
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

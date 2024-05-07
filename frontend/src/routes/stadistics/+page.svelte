<script>
  import CronoStadisticCard from "../../lib/components/CronoStadisticCard.svelte";
  import TimerStadisticCard from "../../lib/components/TimerStadisticCard.svelte";

  export let data;

  let cronoTasks = data.cronoTasks;
  let timerTasks = data.timerTasks;

</script>

<main>
  <h1>Stadistics</h1>
  <section>
    <h2>Crono Tasks</h2>
    {#each cronoTasks as task (task._id)}
      <CronoStadisticCard {task} {cronoTasks} />
    {/each}
  </section>
  <section>
    <h2>Timer Tasks</h2>
    {#each timerTasks as task (task._id)}
      <TimerStadisticCard {task} {timerTasks} />
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
    }
  }
</style>

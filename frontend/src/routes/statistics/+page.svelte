<script>
  import CronoStadisticCard from "../../lib/components/CronoStadisticCard.svelte";
  import TimerStadisticCard from "../../lib/components/TimerStadisticCard.svelte";

  export let data;

  let cronoTasks = data.cronoTasks;
  let timerTasks = data.timerTasks;
</script>

<main>
  <h1>Statistics</h1>
  <section class="container">
    <section>
      <h2>Timers</h2>
      {#if timerTasks.length === 0}
        <p class="no-tasks">No timer tasks</p>
      {/if}
      {#each timerTasks as task (task._id)}
        <TimerStadisticCard {task} />
      {/each}
    </section>
    <section>
      <h2>Cronos</h2>
      {#if cronoTasks.length === 0}
        <p class="no-tasks">No crono tasks</p>
      {/if}
      {#each cronoTasks as task (task._id)}
        <CronoStadisticCard {task} />
      {/each}
    </section>
  </section>
</main>

<style lang="scss">
  @import "../../lib/assets/styles/variablesYMixins.scss";

  main {
    @include flex(column, center, center, 20px);
    margin-bottom: 70px;

    h1 {
      font-size: 44px;
      font-family: $fuente-titulos;
    }

    .container {
      @include flex(row, center, start, 20px);
      width: 60%;

      section {
        @include flex(column, center, center, 15px);
        width: 38%;

        h2 {
          text-align: center;
          font-size: 32px;
          font-family: $fuente-titulos;
        }

        .no-tasks {
          font-size: 24px;
        }
      }
    }
  }
  @media (max-width: 1000px) {
    main {
      margin-top: 20px;

      .container {
        width: 80%;
        padding: 10px;

        section {
          width: 100%;
        }
      }
    }
  }
  @media (max-width: 720px) {
    main {
      .container {
        flex-direction: column;
      }
    }
  }
</style>

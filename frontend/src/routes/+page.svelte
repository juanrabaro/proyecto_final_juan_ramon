<script>
  export let data;
</script>

<main>
  <h1>TASKS</h1>
  {#if !data.tasks.length}
    <p>No tasks</p>
  {:else}
    {#each data.tasks as task}
      <ul>
        <li>{task.title}</li>
        <li>{task.description}</li>
      </ul>
    {/each}
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-top: 50px;

    ul {
      background-color: rgb(20, 20, 20);
      padding: 10px;
      width: 20%;
      text-align: center;
      list-style: none;
    }
  }
</style>

<script>
  export let data


</script>

<main>
  <h1>TASKS</h1>
  <ul>
    {#each data.user as task}
      <li>{task.title}</li>
    {/each}
  </ul>
</main>
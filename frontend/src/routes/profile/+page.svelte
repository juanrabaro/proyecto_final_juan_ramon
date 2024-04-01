<script>
  import { onMount } from "svelte";

  export let data;
</script>

<main>
  <h1>PROFILE</h1>
  {#if data.user}
    <h3>Hello <span>{data.user.userName}!</span></h3>
    <h3>Your account email is <span>{data.user.email}</span></h3>
  {/if}
</main>

<style lang="scss">
  span {
    color: #db2b2b;
  }
</style>

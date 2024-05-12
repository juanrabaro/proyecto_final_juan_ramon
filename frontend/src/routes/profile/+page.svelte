<script>
  import { goto } from "$app/navigation";
  import { logoutStore } from "$lib/stores/authStore.js";

  export let data;

  function logout() {
    logoutStore();
    goto("/login");
  }
</script>

<main>
  <h1>PROFILE</h1>
  {#if data.user}
    <h3>Hello <span>{data.user.userName}!</span></h3>
    <h3>Your account email is <span>{data.user.email}</span></h3>
    <button on:click={logout}>Logout</button>
  {/if}
</main>

<style lang="scss">
  span {
    color: #db2b2b;
  }

  button {
    background-color: #ba3333;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px 5px 10px;
    font-size: 1.1em;
  }
  button:hover {
    cursor: pointer;
    background-color: #740808;
    border: 1px solid #df7171;
  }
</style>

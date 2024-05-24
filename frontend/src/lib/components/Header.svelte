<script>
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, loginStore, logoutStore } from "$lib/stores/authStore.js";
  import { verifyToken } from "$lib/api/auth.js";
  import { initLoading, endLoading } from "$lib/stores/loadingLogoutStore.js";
  
  onMount(async () => {
    try {
      const token = Cookies.get("token");
      const res = await verifyToken({token});
      loginStore(res.data);
    } catch (err) {
      //console.error(err);
      console.log("Error con el token o no encontrado en el header");
    }
  });

  let userHeader;

  user.subscribe((value) => {
    userHeader = value;
  });

  function logout() {
    initLoading();
    logoutStore();
    goto("/login");
    endLoading();
  }
</script>

<header>
  <h1>Task Master</h1>
  <nav>
    <ul>
      {#if userHeader}
        <li><a href="/">Tasks</a></li>
        <li><a href="/time-tasks">TimeTasks</a></li>
        <li><a href="/stadistics">Stadistics</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><button on:click={logout}>Logout</button></li>
      {:else}
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      {/if}
    </ul>
  </nav>
</header>

<style lang="scss">
  header {
    background-color: #3a0202;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 30px 20px 30px;

    h1 {
      color: rgb(213, 213, 213);
      font-size: 1.9em;
    }

    nav {
      ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        li {
          list-style-type: none;
          padding-right: 10px;

          a {
            text-decoration: none;
            color: rgb(213, 213, 213);
            font-size: 1.1em;
          }
          a:hover {
            color: rgb(247, 115, 115);
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
        }
      }
    }
  }
</style>

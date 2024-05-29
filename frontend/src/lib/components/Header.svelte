<script>
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, loginStore, logoutStore } from "$lib/stores/authStore.js";
  import { verifyToken } from "$lib/api/auth.js";
  import { initLoading, endLoading } from "$lib/stores/loadingLogoutStore.js";
  import Menu from "$lib/assets/menu.png";

  onMount(async () => {
    try {
      const token = Cookies.get("token");
      const res = await verifyToken({ token });
      loginStore(res.data);
    } catch (err) {
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
  <nav>
    <h1>Task Master</h1>
    <label for="menu_hamburguesa">
      <img src={Menu} alt="Menu" />
    </label>
    <input type="checkbox" id="menu_hamburguesa" class="menu_hamburguesa" />
    {#if userHeader}
      <ul class="ul_links">
        <li><a href="/">Tasks</a></li>
        <li><a href="/time-tasks">TimeTasks</a></li>
        <li><a href="/stadistics">Stadistics</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><button on:click={logout}>Logout</button></li>
      </ul>
      {:else}
      <ul class="ul_links">
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    {/if}
  </nav>
</header>

<style lang="scss">
  header {
    background-color: #3a0202;
    // padding: 20px 30px 20px 30px;
    // padding: 0;
    height: 80px;
    
    nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      flex-wrap: wrap;
      position: relative;
      padding: 0 20px 0 20px;

      h1 {
        color: rgb(213, 213, 213);
        font-size: 1.9em;
      }
      label {
        img {
          width: 50px;
          cursor: pointer;
        }
      }
      input {
        display: none;
      }
      .menu_hamburguesa:checked + .ul_links {
        height: calc(100vh - 80px);
      }
      ul {
        // display: flex;
        // flex-direction: row;
        // align-items: center;
        // justify-content: space-between;
        width: 100%;
        background-color: rgb(17, 88, 175);
        position: absolute;
        top: 80px;
        left: 0;
        height: calc(100vh - 80px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 3rem;
        height: 0;
        overflow: hidden;
        transition: all 0.3s;

        li {
          list-style-type: none;
          // padding-right: 10px;
          
          a {
            text-decoration: none;
            color: rgb(213, 213, 213);
            // font-size: 1.1em;
            font-size: 3rem;
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
            // font-size: 1.1em;
            font-size: 3em;
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

  @media (min-width: 768px) {
    label {
      display: none;
    }
    .ul_links {
      position: static;
      width: auto;
      height: auto;
      flex-direction: row;
      gap: 2rem;

      li {
        a {
          transition: all 0.3s;
          padding: 0.2rem 0.7rem;
          font-size: 1.1em;
        }
        a:hover {
          background-color: rgb(17, 44, 125);
        }
        button {
          font-size: 1.1rem;
        }
        button:hover {
          background-color: #740808;
        }
      }
    }
  }
</style>

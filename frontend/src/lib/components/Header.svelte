<script>
  import Cookies from "js-cookie";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, loginStore, logoutStore } from "$lib/stores/authStore.js";
  import { verifyToken } from "$lib/api/auth.js";
  import { initLoading, endLoading } from "$lib/stores/loadingLogoutStore.js";
  import Menu from "$lib/assets/images/menu.png";

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
    hideNav();
  }

  function hideNav() {
    document.getElementById("menu_hamburguesa").checked = false;
  }
</script>

<header>
  <nav>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="enlace-titulo" on:click={() => goto("/tasks")}>
      <h1>Task Master</h1>
    </a>
    <label for="menu_hamburguesa">
      <img src={Menu} alt="Menu" />
    </label>
    <input type="checkbox" id="menu_hamburguesa" class="menu_hamburguesa" />
    {#if userHeader}
      <ul class="ul_links">
        <li><a on:click={hideNav} href="/">Tasks</a></li>
        <li><a on:click={hideNav} href="/time-tasks">TimeTasks</a></li>
        <li><a on:click={hideNav} href="/stadistics">Stadistics</a></li>
        <li><a on:click={hideNav} href="/profile">Profile</a></li>
        <li><button on:click={logout}>Logout</button></li>
      </ul>
    {:else}
      <ul class="ul_links">
        <li><a on:click={hideNav} href="/login">Login</a></li>
        <li><a on:click={hideNav} href="/register">Register</a></li>
      </ul>
    {/if}
  </nav>
</header>

<style lang="scss">
  @import "../assets/styles/variablesYMixins.scss";

  header {
    background-color: $fondo;
    height: 150px;

    nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      flex-wrap: wrap;
      position: relative;
      padding: 0 100px 0 100px;

      .enlace-titulo {
        cursor: pointer;

        h1 {
          font-family: $fuente-titulos;
          color: $texto;
          font-size: 36px;
        }
        h1:hover {
          color: $azul-hover;
        }
      }

      label {
        img {
          width: 50px;
          cursor: pointer;
        }
        img:hover {
          filter: brightness(0.8);
        }
      }
      input {
        display: none;
      }
      .menu_hamburguesa:checked + .ul_links {
        height: calc(100vh - 150px);
      }
      ul {
        width: 100%;
        // background-color: $fondo;
        background-color: $cards;
        position: absolute;
        top: 150px;
        left: 0;
        height: calc(100vh - 150px);
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
            font-family: $fuente-textos;
            text-decoration: none;
            color: $texto;
            // font-size: 1.1em;
            font-size: 3rem;
          }
          a:hover {
            color: $azul-hover;
          }

          button {
            @include boton-azul(3rem);
          }
          button:hover {
            cursor: pointer;
            background-color: $azul-hover;
          }
        }
      }
    }
  }

  @media (min-width: 1110px) {
    label {
      display: none;
    }
    .ul_links {
      background-color: $fondo;
      position: static;
      width: auto;
      height: auto;
      flex-direction: row;
      gap: 0.8rem;

      li {
        a {
          transition: all 0.2s;
          padding: 0.2rem 0.7rem;
          font-size: 27px;
          color: $texto;
        }
        button {
          font-size: 24px;
        }
        button:hover {
          background-color: $azul-hover;
          transition: all 0.2s;
        }
      }
    }
  }

  @media (max-width: 510px) {
    header {
      nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .enlace-titulo {
          h1 {
            text-align: center;
          }
        }
      }
    }
  }
</style>

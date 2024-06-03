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
  <section class="profile-card">
    <h1>Profile</h1>
    {#if data.user}
      <div class="info-container">
        <p>Username: <span>{data.user.userName}</span></p>
        <p>Email: <span>{data.user.email}</span></p>
      </div>
      <button on:click={logout}>Logout</button>
    {/if}
  </section>
</main>

<style lang="scss">
  @import "../../lib/assets/styles/variablesYMixins.scss";

  main {
    display: flex;
    flex-direction: column;
    align-items: center;

    .profile-card {
      background-color: $cards;
      @include flex(column, space-evenly, center, 0);
      height: 400px;
      width: 40%;
      box-shadow: $sombra;
      border-radius: 20px;

      h1 {
        font-family: $fuente-titulos;
        color: $texto;
        font-size: 48px;
      }

      .info-container {
        @include flex(column, space-between, center, 0);

        p {
          font-size: 32px;
          text-align: center;
        }
        span {
          color: $azul;
          font-size: 28px;
        }

      }
      button {
        @include boton-azul(24px);
        width: 30%;
      }
      button:hover {
        cursor: pointer;
        background-color: $azul-hover;
      }
    }
  }
  @media (max-width: 1000px) {
    main {
      .profile-card {
        width: 80%;
        margin-top: 20px;
        padding: 10px;
        
        .info-container {
          p, span {
            font-size: 23px;
          }
        }

        button {
          width: 50%;
        }
      }
    }
  }
</style>

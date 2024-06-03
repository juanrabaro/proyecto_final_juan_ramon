<script>
  import { goto } from "$app/navigation";
  import { loginStore } from "$lib/stores/authStore.js";
  import { login } from "$lib/api/auth.js";

  let loading = false;
  let formData = {
    email: "",
    password: "",
  };
  let error = false;
  let errorMessage = "User or password incorrect";

  function handleInput(e) {
    formData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await login(formData);
      // console.log(res);
      error = false;
      loading = true;

      loginStore(formData);
      formData = {
        email: "",
        password: "",
      };

      goto("/");
    } catch (err) {
      error = true;
      console.error(err);
    }
  }
</script>

<main>
  <section class="login-card">
    <h1>Login</h1>

    {#if loading}
      <div class="lds-dual-ring"></div>
    {:else}
      <form>
        <input
          placeholder="Email"
          type="email"
          id="email"
          name="email"
          required
          on:input={handleInput}
          bind:value={formData.email}
        />

        <input
          placeholder="Password"
          type="password"
          id="password"
          name="password"
          required
          on:input={handleInput}
          bind:value={formData.password}
        />

        {#if error}
          <p class="error">{errorMessage}</p>
        {/if}
      </form>
      <button on:click={handleLogin}>Login</button>
    {/if}
  </section>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <p class="register">
    You don´t have an account? <span on:click={() => goto("/register")}
      >Register here</span
    >
  </p>
</main>

<style lang="scss">
  @import "../../lib/assets/styles/variablesYMixins.scss";

  main {
    display: flex;
    flex-direction: column;
    align-items: center;

    .login-card {
      background-color: $cards;
      @include flex(column, space-evenly, center, 0);
      height: 470px;
      width: 50%;
      box-shadow: $sombra;
      border-radius: 20px;

      h1 {
        font-family: $fuente-titulos;
        color: $texto;
        font-size: 48px;
      }

      form {
        @include flex(column, space-between, center, 20px);

        input {
          background-color: $inputs;
          color: $placeholders;
          border-radius: 15px;
          border: 0;
          box-shadow: $sombra-floja;
          text-align: center;
          font-size: 30px;
          width: 90%;
          padding: 8px 0px 8px 0px;
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

      .error {
        color: red;
      }
    }

    .register {
      color: $texto;
      font-size: 24px;
      font-family: $fuente-titulos;
      margin-top: 20px;

      span {
        color: $azul;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 32px;
      }
      span:hover {
        color: $azul-hover;
      }
    }

    .lds-dual-ring,
    .lds-dual-ring:after {
      box-sizing: border-box;
    }
    .lds-dual-ring {
      display: inline-block;
      width: 80px;
      height: 80px;
    }
    .lds-dual-ring:after {
      content: " ";
      display: block;
      width: 64px;
      height: 64px;
      margin: 8px;
      border-radius: 50%;
      border: 6.4px solid currentColor;
      border-color: currentColor transparent currentColor transparent;
      animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  @media (max-width: 670px) {
    main {
      .login-card {
        width: 90%;
        margin-top: 20px;
      }
      .register {
        text-align: center;
        margin-bottom: 40px;
      }
    }
  }
</style>

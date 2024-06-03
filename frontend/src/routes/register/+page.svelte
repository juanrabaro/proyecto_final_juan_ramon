<script>
  import { goto } from "$app/navigation";
  import { loginStore } from "$lib/stores/authStore.js";
  import { register } from "$lib/api/auth.js";

  let loading = false;
  let formData = {
    username: "",
    email: "",
    password: "",
  };
  let errorsTypes = {
    userExist: false,
    emailFormat: false,
    emptyFields: false,
    passwordLength: false,
  };
  let errorsMessages = {
    userExist: "Email already in use",
    emailFormat: "Email format incorrect",
    emptyFields: "Please fill all fields",
    passwordLength: "Password must be at least 8 characters",
  };

  function validate(e) {
    e.preventDefault();
    if (
      formData.email === "" ||
      formData.password === "" ||
      formData.username === ""
    ) {
      errorsTypes.emptyFields = true;
      return false;
    } else {
      errorsTypes.emptyFields = false;
    }

    if (!formData.email.includes("@gmail.com")) {
      errorsTypes.emailFormat = true;
      return false;
    } else {
      errorsTypes.emailFormat = false;
    }

    if (formData.password.length < 8) {
      errorsTypes.passwordLength = true;
      return false;
    } else {
      errorsTypes.passwordLength = false;
    }

    return true;
  }

  async function handleRegister(e) {
    if (validate(e)) {
      try {
        const res = await register(formData);
        console.log(res);
        loading = true;

        await loginStore(formData);
        formData = {
          username: "",
          email: "",
          password: "",
        };

        goto("/");
      } catch (error) {
        if (error.response.data.message === "The email is already in use") {
          errorsTypes.userExist = true;
        }
        console.log(error.response.data.message);
      }
    }
  }
</script>

<main>
  <section class="register-card">
    <h1>Register</h1>

    {#if loading}
      <div class="lds-dual-ring"></div>
    {:else}
      <form>
        <input
          placeholder="Username"
          type="text"
          id="username"
          name="username"
          required
          bind:value={formData.username}
        />

        <input
          placeholder="Email"
          type="email"
          id="email"
          name="email"
          required
          bind:value={formData.email}
        />

        <input
          placeholder="Password"
          type="password"
          id="password"
          name="password"
          required
          bind:value={formData.password}
        />

        {#if errorsTypes.emptyFields}
          <p class="error">{errorsMessages.emptyFields}</p>
        {/if}
        {#if errorsTypes.emailFormat}
          <p class="error">{errorsMessages.emailFormat}</p>
        {/if}
        {#if errorsTypes.passwordLength}
          <p class="error">{errorsMessages.passwordLength}</p>
        {/if}
        {#if errorsTypes.userExist}
          <p class="error">{errorsMessages.userExist}</p>
        {/if}
      </form>
      <button on:click={handleRegister}>Register</button>
      {/if}
    </section>
    <p class="login">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      You already have an account? <span on:click={() => goto("/login")}
        >Login here</span
      >
    </p>
</main>

<style lang="scss">
  @import "../../lib/assets/styles/variablesYMixins.scss";

  main {
    display: flex;
    flex-direction: column;
    align-items: center;

    .register-card {
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
        width: 40%;
      }
      button:hover {
        cursor: pointer;
        background-color: $azul-hover;
      }

      .error {
        color: red;
      }
    }

    .login {
      color: $texto;
      font-size: 24px;
      font-family: $fuente-titulos;
      margin-top: 20px;
      
      span {
        font-size: 32px;
        color: $azul;
        cursor: pointer;
        transition: all 0.2s;
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
      .register-card {
        width: 90%;
        margin-top: 20px;

        button {
          width: 50%;
        }
      }
      .login {
        text-align: center;
        margin-bottom: 40px;
      }
    }
  }
</style>

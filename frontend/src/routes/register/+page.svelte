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
  <h1>Register</h1>

  {#if loading}
    <div class="lds-dual-ring"></div>
  {:else}
    <form>
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        required
        bind:value={formData.username}
      />

      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        bind:value={formData.email}
      />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        bind:value={formData.password}
      />

      {#if errorsTypes.emptyFields}
        <p>{errorsMessages.emptyFields}</p>
      {/if}
      {#if errorsTypes.emailFormat}
        <p>{errorsMessages.emailFormat}</p>
      {/if}
      {#if errorsTypes.passwordLength}
        <p>{errorsMessages.passwordLength}</p>
      {/if}
      {#if errorsTypes.userExist}
        <p>{errorsMessages.userExist}</p>
      {/if}

      <button on:click={handleRegister}>Register</button>
    </form>
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;

    h1 {
      padding-bottom: 20px;
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

    form {
      display: flex;
      flex-direction: column;
      align-items: center;

      input {
        padding: 5px;
        border-radius: 5px;
        border: 0;
      }
      input:focus {
        outline: none;
        border: 3px solid #df7171;
        border-radius: 5px;
      }

      button {
        margin-top: 8px;
        padding: 7px;
        border-radius: 5px;
        border: none;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
      }
      button:hover {
        background-color: #df7171;
        cursor: pointer;
      }
    }
  }
</style>

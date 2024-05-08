<script>
  import { goto } from "$app/navigation";
  import { loginStore } from "$lib/stores/authStore.js";
  import { login } from "$lib/api/auth.js";

  let loading = false;
  let formData = {
    email: "",
    password: "",
  };

  function handleInput(e) {
    formData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
  }

  async function handleLogin(e) {
    loading = true;
    e.preventDefault();
    try {
      const res = await login(formData);
      console.log(res);

      loginStore(formData);
      formData = {
        email: "",
        password: "",
      };

      goto("/");
    } catch (err) {
      console.error(err);
    }
  }
</script>

<main>
  <h1>LOGIN</h1>

  {#if loading}
    <div class="lds-dual-ring"></div>
  {:else}
    <form>
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        on:input={handleInput}
        bind:value={formData.email}
      />

      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        on:input={handleInput}
        bind:value={formData.password}
      />

      <button on:click={handleLogin}>Login</button>
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

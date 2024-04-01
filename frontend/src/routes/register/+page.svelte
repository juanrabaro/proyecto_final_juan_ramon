<script>
  import { goto } from '$app/navigation';
  import { loginStore } from '$lib/stores/authStore.js'
  import { register } from '$lib/api/auth.js'

  let formData = {
    username: '',
    email: '',
    password: ''
  }

  function handleInput(e) {
    formData = {
      ...formData,
      [e.target.name]: e.target.value
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await register(formData);
      console.log(res)

      loginStore(formData)
      formData = {
        username: '',
        email: '',
        password: ''
      }

      goto('/')
    } catch (err) {
      console.error(err)
    }
  }
</script>

<main>
  <h1>Register</h1>
  
  <form>
    <label for="username">Username</label>
    <input type="text" id="username" name="username" required on:input={handleInput} bind:value={formData.username} />
    
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required on:input={handleInput} bind:value={formData.email} />
    
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required on:input={handleInput} bind:value={formData.password} />
    
    <button on:click={handleRegister}>Register</button>
  </form>
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
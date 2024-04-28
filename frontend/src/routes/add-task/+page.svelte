<script>
  import { goto } from '$app/navigation';
  import { addTask } from '$lib/api/task.js'

  export let data

  let formData = {
    title: '',
    description: ''
  }

  function handleInput(e) {
    formData = {
      ...formData,
      [e.target.name]: e.target.value
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {

      const res = await addTask(formData, data.token)
      console.log(res);

      formData = {
        title: '',
        description: ''
      }

      goto('/')
    } catch (err) {
      console.error(err)
    }
  }
</script>

<main>
  <h1>Add task</h1>

  <form>
    <label for="title">Title</label>
    <input type="title" id="title" name="title" required on:input={handleInput} bind:value={formData.title} />
    
    <label for="description">Description</label>
    <input type="description" id="description" name="description" required on:input={handleInput} bind:value={formData.description} />
    
    <button on:click={handleSubmit}>Add Task</button>
  </form>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5%;

    h1 {
      padding-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;

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
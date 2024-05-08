<script>
  import { goto } from "$app/navigation";
  import { addTask } from "$lib/api/task.js";

  export let data;

  let loading = false;
  let formData = {
    title: "",
    description: "",
  };

  async function handleSubmit(e) {
    loading = true;
    e.preventDefault();
    try {
      const res = await addTask(formData, data.token);
      console.log(res);

      formData = {
        title: "",
        description: "",
      };

      goto("/");
    } catch (err) {
      console.error(err);
    }
  }
</script>

<main>
  <h1>Add task</h1>

  {#if loading}
    <div class="lds-dual-ring"></div>
  {:else}
    <form>
      <label for="title">Title</label>
      <input
        type="title"
        id="title"
        name="title"
        required
        bind:value={formData.title}
      />

      <label for="description">Description</label>
      <input
        type="description"
        id="description"
        name="description"
        required
        bind:value={formData.description}
      />

      <button on:click={handleSubmit}>Add Task</button>
    </form>
  {/if}
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

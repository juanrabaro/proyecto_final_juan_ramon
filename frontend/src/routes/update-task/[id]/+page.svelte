<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getTaskById, updateTask } from "$lib/api/task.js";

  export let data;

  let id;
  page.subscribe(({ params }) => {
    id = params.id;
  });

  let task = {
    _id: "",
    title: "",
    description: "",
  };

  onMount(async () => {
    try {
      const res = await getTaskById(id, data.token);
      console.log(res);
      task = res.data;
    } catch (error) {
      console.log(error);
      goto("/");
    }
  });

  function handleInput(e) {
    task = {
      ...task,
      [e.target.name]: e.target.value,
    };
  }

  async function handleUpdate() {
    try {
      const res = await updateTask(task, data.token);
      console.log(res);
      goto("/")
    } catch (error) {
      console.error(error);
    }
  }
</script>

<main>
  <h1>Update task</h1>

  <form>
    <label for="title">Title</label>
    <input
      type="title"
      id="title"
      name="title"
      required
      on:input={handleInput}
      bind:value={task.title}
    />

    <label for="description">Description</label>
    <input
      type="description"
      id="description"
      name="description"
      required
      on:input={handleInput}
      bind:value={task.description}
    />

    <button on:click={handleUpdate}>Login</button>
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

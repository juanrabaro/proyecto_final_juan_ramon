<script>
  import { goto } from "$app/navigation";
  import { addTask } from "$lib/api/task.js";

  export let data;

  let loading = false;
  let formData = {
    title: "",
    description: "",
  };
  let formValid = true;
  let errorMessage = "Fill all the fields";

  async function handleSubmit(e) {
    if (formData.title === "" || formData.description === "") {
      formValid = false;
      return;
    }
    formValid = true;
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
  <section class="new-task-card">
    <h1>Add new task</h1>

    {#if loading}
      <div class="lds-dual-ring"></div>
    {:else}
      <form>
        <!-- svelte-ignore a11y-autofocus -->
        <input
          autofocus
          placeholder="Title"
          type="title"
          id="title"
          name="title"
          required
          bind:value={formData.title}
        />

        <textarea
          placeholder="Short description"
          type="description"
          id="description"
          name="description"
          required
          bind:value={formData.description}
        />

        {#if !formValid}
          <p class="error">{errorMessage}</p>
        {/if}

      </form>
      <button on:click={handleSubmit}>Add Task</button>
    {/if}
  </section>
</main>

<style lang="scss">
  @import "../../lib/assets/styles/variablesYMixins.scss";

  main {
    display: flex;
    flex-direction: column;
    align-items: center;

    .new-task-card {
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
        textarea {
          background-color: $inputs;
          color: $placeholders;
          border-radius: 15px;
          border: 0;
          box-shadow: $sombra-floja;
          text-align: center;
          font-size: 30px;
          width: 90%;
          height: 100px;
          resize: none;
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
        font-size: 24px;
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
  @media (max-width: 800px) {
    main {
      margin-top: 20px;

      .new-task-card {
        width: 80%;
        height: 500px;

        h1 {
          font-size: 40px;
        }

        form {
          input {
            font-size: 24px;
          }
          textarea {
            font-size: 24px;
          }
        }
        
        button {
          width: 40%;
        }
      }
    }
  }
  @media (max-width: 450px) {
    main {
      .new-task-card {
        width: 90%;
        height: 500px;

        h1 {
          font-size: 32px;
        }

        form {
          input {
            font-size: 20px;
          }
          textarea {
            font-size: 20px;
          }
        }
        
        button {
          width: 50%;
        }
      }
    }
  }
</style>

<script>
  import Header from "../lib/components/Header.svelte";
  import { loadingLogout } from "$lib/stores/loadingLogoutStore.js";
</script>

<Header />
{#if $loadingLogout}
  <div class="lds-dual-ring"></div>
{:else}
  <slot />
{/if}

<style lang="scss">
  .lds-dual-ring {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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
</style>

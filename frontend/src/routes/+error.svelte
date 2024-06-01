<script>
	import { page } from '$app/stores';
</script>

<main>
  <h1>{$page.status}: {$page.error.message}</h1>
</main>

<style lang="scss">
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  flex-direction: column;
}
</style>
<script>
	import GlobalDashboard from './GlobalDashboard.svelte';

  export let data;
  const user = data.user;
</script>

{#if user}<GlobalDashboard {data} />{/if}

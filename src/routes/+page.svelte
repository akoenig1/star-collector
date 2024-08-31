<script lang="ts">
	import { enhance } from "$app/forms";

  export let data;
</script>

<h1 class="text-xl">Welcome to Star Collector</h1>

{#if data.user}
  <p>Hello, {data.user.email}!</p>
  <form method="post" use:enhance>
    <button>Sign out</button>
  </form>
{:else}
  <p><a href="/login">Log in</a> to get started</p>
{/if}

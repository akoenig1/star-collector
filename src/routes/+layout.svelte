<script>
  import "../app.css";
  import "../tailwind.css";
	import { enhance } from "$app/forms";

  export let data;
</script>

{#if data.user}
  <p>Hello, {data.user.email}!</p>
  <form method="post" action="/logout" use:enhance>
    <button>Sign out</button>
  </form>
{:else}
  <p><a href="/login">Log in</a> to get started</p>
{/if}

<slot />

<script lang="ts">
  import { superForm } from 'sveltekit-superforms';

  export let data;

  const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<h1>Sign up</h1>

{#if $message}<h3>{$message}</h3>{/if}

<form method="post" use:enhance>
	<label for="email">Email</label>
	<input 
    name="email" 
    id="email" 
    aria-invalid={$errors.email ? 'true' : undefined}
    bind:value={$form.email} 
    {...$constraints.email}
  />
  {#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
  <br />

	<label for="password">Password</label>
	<input 
    type="password" 
    name="password" 
    id="password" 
    aria-invalid={$errors.password ? 'true' : undefined}
    bind:value={$form.password}
    {...$constraints.password}
  />
  {#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
  <br />

  <button>Sign Up</button>
</form>

<style>
  .invalid {
    color: red;
  }
</style>

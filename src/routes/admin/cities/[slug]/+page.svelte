<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  
  export let data;
  const { city } = data;

  $: venues = data.venues;

  const { form, errors, constraints, message, enhance } = superForm(data.form, {
    onError({ result }) {
      console.log(result);
      $message = result.error.message || "Unknown error";
    }
  });
</script>

<h1>{city.name}</h1>

<p>Showing {venues.length} venues.</p>

<ul>
  {#each venues as venue}
    <li>
      <a href="/admin/venues/{venue.slug}">{venue.name}</a>
    </li>
  {/each}
  <form action="?/create" method="post" use:enhance>
    <label for="venueName">Venue Name</label>
    <input 
      name="venueName" 
      id="venue-name" 
      aria-invalid={$errors.venueName ? 'true' : undefined}
      bind:value={$form.venueName} 
      {...$constraints.venueName}
    />
    {#if $errors.venueName}<span class="invalid">{$errors.venueName}</span>{/if}

    <label for="slug">Slug</label>
    <input 
      name="slug" 
      id="slug" 
      aria-invalid={$errors.slug ? 'true' : undefined}
      bind:value={$form.slug} 
      {...$constraints.slug}
    />
    {#if $errors.slug}<span class="invalid">{$errors.slug}</span>{/if}

    <button type="submit">Add Venue</button>
    {#if $message}<p>{$message}</p>{/if}
  </form>
</ul>
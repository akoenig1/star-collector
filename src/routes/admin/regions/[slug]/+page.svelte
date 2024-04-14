<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  
  export let data;
  const { region } = data;
  $: cities = data.cities;

  const { form, errors, constraints, message, enhance } = superForm(data.form, {
    onError({ result }) {
      console.log(result);
      $message = result.error.message || "Unknown error";
    }
  });
</script>

<h1>{region.name}</h1>

<p>Showing {cities.length} cities.</p>

<ul>
  {#each cities as city}
    <li>
      <a href="/admin/cities/{city.slug}">{city.name}</a>
    </li>
  {/each}
  <form action="?/create" method="post" use:enhance>
    <label for="cityName">City Name</label>
    <input 
      name="cityName" 
      id="city-name" 
      aria-invalid={$errors.cityName ? 'true' : undefined}
      bind:value={$form.cityName} 
      {...$constraints.cityName}
    />
    {#if $errors.cityName}<span class="invalid">{$errors.cityName}</span>{/if}

    <label for="slug">Slug</label>
    <input 
      name="slug" 
      id="slug" 
      aria-invalid={$errors.slug ? 'true' : undefined}
      bind:value={$form.slug} 
      {...$constraints.slug}
    />
    {#if $errors.slug}<span class="invalid">{$errors.slug}</span>{/if}

    <label for="currentYear">Current Year</label>
    <input 
      name="currentYear" 
      id="current-year" 
      aria-invalid={$errors.currentYear ? 'true' : undefined}
      bind:value={$form.currentYear} 
      {...$constraints.currentYear}
    />
    {#if $errors.currentYear}<span class="invalid">{$errors.currentYear}</span>{/if}

    <button type="submit">Add City</button>
    {#if $message}<p>{$message}</p>{/if}
  </form>
</ul>

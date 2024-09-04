<script lang="ts">
  import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
  import Svelecte from 'svelecte';

  export let data;
  $: cities = data.cities;
  $: regions = data.regions;

  const regionOptions = data.regions.map(region => ({ value: region.region_id, text: region.name }));

  const { form, errors, constraints, message, enhance } = superForm(data.form, {
    onError({ result }) {
      console.log(result);
      $message = result.error.message || "Unknown error";
    }
  });
</script>

<h1>Cities</h1>

<p>Showing {cities.length} cities in {regions.length} regions.</p>

<ul>
  {#each regions as region}
    <li class="my-4">
      <a href="/admin/regions/{region.slug}" class="font-bold">{region.name}</a>
      <ul>
        {#each cities as city}
          {#if city.region_id === region.region_id}
            <li>
              <a href="/admin/cities/{city.slug}">{city.name}</a>
            </li>
          {/if}
        {/each}
      </ul>
    </li>
  {/each}
</ul>

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

  <label for="regionId">Region</label>
  <Svelecte 
    options={regionOptions}
    name="regionId"
    inputId="region-id"
    bind:value={$form.regionId}
    placeholder="Select region"
  ></Svelecte>
  {#if $errors.regionId}<span class="invalid">{$errors.regionId}</span>{/if}

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
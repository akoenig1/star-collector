<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

  export let data;
  $: regions = data.regions;

  const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<h1>Regions</h1>

<p>Showing {regions.length} regions.</p>

<ul>
  {#each regions as region}
    <li>
      <a href="/admin/regions/{region.slug}">{region.name}</a>
    </li>
  {/each}
  <form action="?/create" method="post">
    <label for="regionName">Region Name</label>
    <input 
      name="regionName" 
      id="region-name" 
      aria-invalid={$errors.regionName ? 'true' : undefined}
      bind:value={$form.regionName} 
      {...$constraints.regionName}
    />
    {#if $errors.regionName}<span class="invalid">{$errors.regionName}</span>{/if}

    <label for="slug">Slug</label>
    <input 
      name="slug" 
      id="slug" 
      aria-invalid={$errors.slug ? 'true' : undefined}
      bind:value={$form.slug} 
      {...$constraints.slug}
    />
    {#if $errors.slug}<span class="invalid">{$errors.slug}</span>{/if}

    <button type="submit">Add Region</button>
  </form>
</ul>

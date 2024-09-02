<script lang="ts">
	// import { superForm } from 'sveltekit-superforms';

  export let data;
  $: cities = data.cities;
  $: regions = data.regions;

  // const { form, errors, constraints, message, enhance } = superForm(data.form, {
  //   onError({ result }) {
  //     console.log(result);
  //     $message = result.error.message || "Unknown error";
  //   }
  // });
</script>

<h1>Regions</h1>

<p>Showing {cities.length} cities in {regions.length} regions.</p>

<ul>
  {#each regions as region}
    <li>
      <a href="/admin/regions/{region.slug}" class="font-bold my-1">{region.name}</a>
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
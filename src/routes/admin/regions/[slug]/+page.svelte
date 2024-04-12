<script lang="ts">
  export let data;
  const { region, cities } = data;
</script>

<h1>{region.name}</h1>

<ul>
  {#each cities as city}
    <li>
      <a href="/admin/cities/{city.slug}">{city.name}</a>
    </li>
  {/each}
</ul>

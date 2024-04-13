<script lang="ts">
	export let data;
  const { regions } = data;
</script>

<h1>Regions</h1>

<p>Showing {regions.length} regions.</p>

<ul>
  {#each regions as region}
    <li>
      <a href="/admin/regions/{region.slug}">{region.name}</a>
    </li>
  {/each}
</ul>

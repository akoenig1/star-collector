<script lang="ts">
	async function getRegions() {
    const response = await fetch('/api/regions')
    const regions = await response.json()
    return regions;
  }
</script>

<h1>Regions</h1>

{#await getRegions()}
  <p>Loading...</p>
{:then regions}
  <p>Showing {regions.length} regions.</p>

  <ul>
    {#each regions as region}
      <li>
        <a href="/regions/{region.name}">{region.name}</a>
      </li>
    {/each}
  </ul>
{:catch error}
  <p>{error.message}</p>
{/await}

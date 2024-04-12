<script lang="ts">
  export let data;
  const { city, venues } = data;
</script>

<h1>{city.name}</h1>

<ul>
  {#each venues as venue}
    <li>
      <a href="/admin/venues/{venue.slug}">{venue.name}</a>
    </li>
  {/each}
</ul>
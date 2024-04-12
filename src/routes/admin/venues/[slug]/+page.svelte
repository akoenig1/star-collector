<script lang="ts">
  export let data;
  const { venue, starAwards } = data;
</script>

<h1>{venue.name}</h1>

<ul>
  {#each starAwards as starAward}
    <li>
      <div>
        {starAward.year}
      </div>
      <div>
        {starAward.stars}
      </div>
    </li>
  {/each}
</ul>
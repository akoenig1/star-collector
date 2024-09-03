<script lang="ts">
  export let data;
  $: totalGlobalStars = data.totalGlobalStars;
  $: regions = data.regions;
  $: cities = data.cities;
  $: venues = data.venues;
  $: totalThreeStarVenues = data.totalThreeStarVenues;
  $: totalTwoStarVenues = data.totalTwoStarVenues;
  $: totalOneStarVenues = data.totalOneStarVenues;
  $: userVisits = data.userVisits;
</script>

<h1 class="text-xl">Welcome to Star Collector</h1>

<div class="my-4">
  <h3>Stars</h3>
  <p>0 | {totalGlobalStars}</p>
</div>

<div class="my-4">
  <h3>Regions</h3>
  <p>0 | {regions.length}</p>
</div>

<div class="my-4">
  <h3>Cities</h3>
  <p>0 | {cities.length}</p>
</div>

<div class="my-4">
  <h3>Venues</h3>
  <p>0 | {venues.length}</p>
</div>

<div class="my-4">
  <h3>Three Star Restaurants</h3>
  <p>0 | {totalThreeStarVenues}</p>
</div>

<div class="my-4">
  <h3>Two Star Restaurants</h3>
  <p>0 | {totalTwoStarVenues}</p>
</div>

<div class="my-4">
  <h3>One Star Restaurants</h3>
  <p>0 | {totalOneStarVenues}</p>
</div>

<div class="my-4">
  <a href="/visits">Visits</a>
  <p>{userVisits}</p>
</div>

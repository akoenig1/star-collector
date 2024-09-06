<script lang="ts">
	import { ProgressBar, ProgressCircle } from "$lib/components";

  export let data;
  $: totalGlobalStars = data.totalGlobalStars;
  $: regions = data.regions;
  $: cities = data.cities;
  $: venues = data.venues;
  $: totalThreeStarVenues = data.totalThreeStarVenues;
  $: totalTwoStarVenues = data.totalTwoStarVenues;
  $: totalOneStarVenues = data.totalOneStarVenues;
  $: userVisits = data.userVisits;
  $: userStars = data.userStars;
  $: userVenueCount = data.userVenueCount;
  $: userOneStarVenues = data.userOneStarVenues;
  $: userTwoStarVenues = data.userTwoStarVenues;
  $: userThreeStarVenues = data.userThreeStarVenues;
  $: userRegionCount = data.userRegionCount;
  $: userCityCount = data.userCityCount;
</script>

<h1 class="text-xl">Welcome to Star Collector</h1>

<div class="my-4">
  <h3>Stars</h3>
  <p>{userStars} | {totalGlobalStars}</p>
  <ProgressBar value={userStars} maxValue={totalGlobalStars} />
</div>

<div class="flex justify-between">
  <div class="my-4">
    <h3>Three Star Restaurants</h3>
    <p>{userThreeStarVenues} | {totalThreeStarVenues}</p>
    <ProgressCircle value={userThreeStarVenues} maxValue={totalThreeStarVenues} />
  </div>
  
  <div class="my-4">
    <h3>Two Star Restaurants</h3>
    <p>{userTwoStarVenues} | {totalTwoStarVenues}</p>
  </div>
  
  <div class="my-4">
    <h3>One Star Restaurants</h3>
    <p>{userOneStarVenues} | {totalOneStarVenues}</p>
    <ProgressCircle value={userOneStarVenues} maxValue={totalOneStarVenues} />
  </div>
</div>

<div class="flex justify-between">
  <div class="my-4">
    <h3>Regions</h3>
    <p>{userRegionCount} | {regions.length}</p>
  </div>
  
  <div class="my-4">
    <h3>Cities</h3>
    <p>{userCityCount} | {cities.length}</p>
  </div>
  
  <div class="my-4">
    <h3>Venues</h3>
    <p>{userVenueCount} | {venues.length}</p>
  </div>
</div>

<div class="my-4">
  <a href="/visits">Visits</a>
  {#each userVisits as visit}
    <span class="block my-1">
      <p class="inline-block">{visit.venues.name}</p>
      <p class="inline-block">{visit.star_awards.stars}</p>
      <p class="inline-block">{visit.visits.visit_date.toLocaleDateString('en-US')}</p>
    </span>
  {/each}
</div>

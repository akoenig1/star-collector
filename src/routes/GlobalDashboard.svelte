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
  <div class="progress-bar" aria-valuemin="0" aria-valuemax="{totalGlobalStars}" aria-valuenow="{userStars}">
    <div class="progress-bar-inner" style="width: {userStars / totalGlobalStars * 100}%"></div>
  </div>
</div>

<div class="flex justify-between">
  <div class="my-4">
    <h3>Three Star Restaurants</h3>
    <p>{userThreeStarVenues} | {totalThreeStarVenues}</p>
    <div class="relative size-40">
      <svg class="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500 animate-fill" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={totalThreeStarVenues - userThreeStarVenues} stroke-linecap="round"></circle>
      </svg>
    
      <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span class="text-center text-2xl font-bold text-blue-600 dark:text-blue-500">{userThreeStarVenues}</span>
      </div>
    </div>
  </div>
  
  <div class="my-4">
    <h3>Two Star Restaurants</h3>
    <p>{userTwoStarVenues} | {totalTwoStarVenues}</p>
  </div>
  
  <div class="my-4">
    <h3>One Star Restaurants</h3>
    <p>{userOneStarVenues} | {totalOneStarVenues}</p>
    <div class="relative size-40">
      <svg class="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
        <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={totalOneStarVenues - userOneStarVenues} stroke-linecap="round"></circle>
      </svg>
    
      <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <span class="text-center text-2xl font-bold text-blue-600 dark:text-blue-500">{userOneStarVenues}</span>
      </div>
    </div>
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

<style>
  @keyframes fill {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  .animate-fill {
    animation: fill 2s ease-out forwards;
  }
  
  .progress-bar {
    background-color: #f3f3f3;
    border-radius: 20px;
    overflow: hidden;
  }
  .progress-bar-inner {
    height: 20px;
    background-color: #4caf50;
    width: 0;
    transition: width 0.3s ease-in-out;
  }
</style>

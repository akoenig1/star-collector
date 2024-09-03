<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

  export let data;
  $: venues = data.venues;

  const months = [
    { id: 1, name: "January" },
    { id: 2, name: "February" },
    { id: 3, name: "March" },
    { id: 4, name: "April" },
    { id: 5, name: "May" },
    { id: 6, name: "June" },
    { id: 7, name: "July" },
    { id: 8, name: "August" },
    { id: 9, name: "September" },
    { id: 10, name: "October" },
    { id: 11, name: "November" },
    { id: 12, name: "December" }
  ];

  const { form, errors, constraints, message, enhance } = superForm(data.form, {
    onError({ result }) {
      console.log(result);
      $message = result.error.message || "Unknown error";
    }
  });
</script>

<form action="?/create" method="post" use:enhance>
  <label for="venueId">Restaurant</label>
  <select 
    name="venueId" 
    id="venue-id" 
    aria-invalid={$errors.venueId ? 'true' : undefined}
    bind:value={$form.venueId} 
    {...$constraints.venueId}
  >
    {#each venues as venue (venue.venue_id)}
      <option value={venue.venue_id}>{venue.name}</option>
    {/each}
  </select>
  {#if $errors.venueId}<span class="invalid">{$errors.venueId}</span>{/if}

  <label for="year">Year</label>
  <input 
    name="year" 
    id="year" 
    aria-invalid={$errors.year ? 'true' : undefined}
    bind:value={$form.year} 
    {...$constraints.year}
  />
  {#if $errors.year}<span class="invalid">{$errors.year}</span>{/if}

  <label for="month">Month</label>
  <select 
    name="month" 
    id="month" 
    aria-invalid={$errors.month ? 'true' : undefined}
    bind:value={$form.month} 
    {...$constraints.month}
  >
    {#each months as month (month.id)}
      <option value={month.id}>{month.name}</option>
    {/each}
  </select>
  {#if $errors.month}<span class="invalid">{$errors.month}</span>{/if}

  <label for="day">Day</label>
  <select 
    name="day" 
    id="day" 
    aria-invalid={$errors.day ? 'true' : undefined}
    bind:value={$form.day} 
    {...$constraints.day}
  >
    {#each Array.from({ length: 31 }, (_, i) => i + 1) as day}
      <option value={day}>{day}</option>
    {/each}
  </select>
  {#if $errors.day}<span class="invalid">{$errors.day}</span>{/if}

  <button type="submit">Add Visit</button>
  {#if $message}<p>{$message}</p>{/if}
</form>
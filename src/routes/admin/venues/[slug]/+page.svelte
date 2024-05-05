<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  
  export let data;
  const { venue } = data;
  $: starAwards = data.starAwards;

  const { form, errors, constraints, message, enhance } = superForm(data.form, {
    onError({ result }) {
      console.log(result);
      $message = result.error.message || "Unknown error";
    }
  });
</script>

<h1>{venue.name}</h1>

<p>Showing {starAwards.length} star awards.</p>

<ul>
  {#each starAwards as starAward}
    <li>
      <div>
        {starAward.year}: {starAward.stars}
      </div>
    </li>
  {/each}
  <form action="?/create" method="post" use:enhance>
    <label for="starAwardYear">Star Award Year</label>
    <input 
      name="starAwardYear" 
      id="star-award-year" 
      aria-invalid={$errors.starAwardYear ? 'true' : undefined}
      bind:value={$form.starAwardYear} 
      {...$constraints.starAwardYear}
    />
    {#if $errors.starAwardYear}<span class="invalid">{$errors.starAwardYear}</span>{/if}

    <label for="stars">Stars</label>
    <input 
      name="stars" 
      id="stars" 
      aria-invalid={$errors.stars ? 'true' : undefined}
      bind:value={$form.stars} 
      {...$constraints.stars}
    />
    {#if $errors.stars}<span class="invalid">{$errors.stars}</span>{/if}

    <button type="submit">Add Star Award</button>
    {#if $message}<p>{$message}</p>{/if}
  </form>
</ul>
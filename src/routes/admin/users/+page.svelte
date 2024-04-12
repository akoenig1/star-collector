<script lang="ts">
  export let data;
  const { users } = data;
</script>

<h1>Users</h1>

<p>Showing {users.length} users.</p>

<ul>
  {#each users as user}
    <li>{user.email}</li>
  {/each}
</ul>

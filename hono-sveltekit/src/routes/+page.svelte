<script>
  import { enhance } from "$app/forms";

  export let data;
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="post" action="/api/signout" use:enhance>
  <button>Sign out</button>
</form>
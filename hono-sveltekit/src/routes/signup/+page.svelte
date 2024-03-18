<script>
  import { enhance } from "$app/forms";

  export let form;
</script>

<h1>Create an account</h1>
<form method="post" action="/api/signup" use:enhance>
  <label for="username">Username</label>
  <input name="username" id="username" /><br />

  <label for="password">Password</label>
  <input type="password" name="password" id="password" /><br />

  <button>Continue</button>

  <p>{form?.message ?? ""}</p>
</form>

<a href="/login">Sign in</a>
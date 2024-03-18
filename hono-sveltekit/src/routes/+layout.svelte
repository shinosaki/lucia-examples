<script>
  export let data;
</script>

<slot />
<pre>{JSON.stringify(data.items, null, '  ')}</pre>
<script lang="ts">
	let { data } = $props()
</script>

<h1>Blue Raven</h1>
<pre>{JSON.stringify(data.products, null, 2)}</pre>

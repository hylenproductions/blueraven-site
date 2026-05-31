<script>
	import { onMount } from 'svelte'

	onMount(async () => {
		const { default: config } = await import('../../../sanity.config')
		const { renderStudio } = await import('sanity')
		renderStudio(document.getElementById('studio'), config)
	})
</script>

<div id="studio" style="height: 100vh" />

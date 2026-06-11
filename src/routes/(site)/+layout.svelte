<script lang="ts">
	import AnnouncementBanner from '$lib/components/AnnouncementBanner.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import ContactBanner from '$lib/components/ContactBanner.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<header class="site-header">
	<AnnouncementBanner />
	<Nav />
</header>

<main>
	{@render children()}
</main>

<ContactBanner />
<Footer />

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
	}
</style>

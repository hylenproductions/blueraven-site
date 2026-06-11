<script lang="ts">
	import SectionLabel from '$lib/components/SectionLabel.svelte';
</script>

<svelte:head>
	<title>Manifesto · Blue Raven</title>
	<meta
		name="description"
		content="Why Blue Raven exists: an open protocol that puts you in control of your data, your endpoints, and your connections."
	/>
</svelte:head>

<article class="manifesto">
	<div class="container">
		<header class="head">
			<SectionLabel text="MANIFESTO" />
			<h1>Who your devices answer to.</h1>
		</header>

		<div class="body">
			<p>
				We're at the beginning of something. People are building their own operating systems for
				their health, their homes, their lives. Not apps. Not dashboards. Actual personal
				infrastructure that knows your nutrition goals, tracks your garden, monitors your kitchen,
				and connects all of it without asking a corporation for permission.
			</p>
			<p>
				The problem is the inputs. Every sensor wants a subscription. Every device wants a login.
				Every piece of hardware routes your data through someone else's server, someone with a
				financial interest in what you do with it.
			</p>
			<p>
				Blue Raven is the alternative. An open protocol. A certification standard. A guarantee that
				hardware carrying our name puts you in control of your data, your endpoints, and your
				connections. No lock-in. No conflict of interest. No platform that raises prices once you've
				built on it.
			</p>
			<p>
				Think of it like Bluetooth: a common language for hardware. Except instead of just
				standardizing how devices talk, Blue Raven standardizes who they answer to.
			</p>
			<p class="you">You.</p>
		</div>
	</div>
</article>

<style>
	.manifesto {
		padding: clamp(64px, 9vw, 120px) 0 var(--space-section);
	}
	.head {
		max-width: 760px;
		margin: 0 auto clamp(48px, 7vw, 88px);
	}
	h1 {
		font-size: var(--text-h2);
		margin-top: 20px;
	}
	.body {
		max-width: 65ch;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 36px;
	}
	.body p {
		font-size: clamp(1.05rem, 1.4vw, 1.2rem);
		line-height: 1.9;
	}
	.body p.you {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(5rem, 16vw, 13rem);
		line-height: 0.9;
		letter-spacing: -0.04em;
		color: var(--blue);
		text-shadow: 0 0 90px var(--blue-glow);
		margin-top: 16px;
	}
</style>

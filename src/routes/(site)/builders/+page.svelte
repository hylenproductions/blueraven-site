<script lang="ts">
	import SectionLabel from '$lib/components/SectionLabel.svelte';
	import GlassCard from '$lib/components/GlassCard.svelte';
	import CtaButton from '$lib/components/CtaButton.svelte';

	const GITHUB = 'https://github.com/hylenproductions/blueraven';

	const cases = [
		{
			tag: 'HARDWARE MAKERS',
			title: 'Certification your customers can trust.',
			body: 'You make devices and you’re competing against platforms that monetize their users’ data. Blue Raven certification is a verifiable promise: works without an account, exposes data locally, keeps working if you ever shut down. That trust is a feature no platform can copy.'
		},
		{
			tag: 'TINKERERS & INTEGRATORS',
			title: 'Data sovereignty by default.',
			body: 'You wire things together. Homelab, automation, weird experiments. Every Blue Raven device is permissionless by design: open spec, local endpoints, no sign-up walls. Fork the protocol, extend it, and own every byte your hardware generates.'
		},
		{
			tag: 'AI-READY BY SPEC',
			title: 'Your device, integrated in one fetch.',
			body: 'Every certified device exposes a /br/manifest endpoint: a machine-readable description of its capabilities. Your customers point their AI tools at it and the integration writes itself. Certification means your hardware works with the coding agents your buyers already use.'
		},
		{
			tag: 'OPEN SPEC, APACHE 2.0',
			title: 'The gray areas you hit shape the spec.',
			body: 'Seven rules, no royalties, no member fees, no vendor consortium. If your device almost complies, open an issue: the edge cases real builders hit are exactly what the next version addresses. Built a compliant device already? Certification is a weekend.'
		}
	];
</script>

<svelte:head>
	<title>For Builders · Blue Raven</title>
	<meta
		name="description"
		content="Make hardware that carries the Blue Raven badge: open spec, local data, certification your customers can trust."
	/>
</svelte:head>

<section class="builders">
	<div class="container">
		<header class="head">
			<SectionLabel text="FOR BUILDERS" />
			<h1>Make hardware people can trust.</h1>
			<p class="sub">
				For the people making the devices: manufacturers, firmware engineers, and the homelab crowd.
				Meet the spec, carry the badge, and your hardware works with every stack your customers
				build.
			</p>
		</header>

		<div class="cards">
			{#each cases as c (c.tag)}
				<GlassCard glow>
					<p class="tag">{c.tag}</p>
					<h2>{c.title}</h2>
					<p class="body">{c.body}</p>
				</GlassCard>
			{/each}
		</div>

		<div class="closing">
			<CtaButton href={GITHUB} external>Read the protocol spec ↗</CtaButton>
		</div>

		<p class="crosslink">
			Building apps, not hardware? <a href="/vibecoders">For vibe coders →</a>
		</p>
	</div>
</section>

<style>
	.builders {
		padding: clamp(64px, 9vw, 120px) 0 var(--space-section);
	}
	.head {
		max-width: 720px;
		margin-bottom: clamp(48px, 6vw, 80px);
	}
	h1 {
		font-size: var(--text-h2);
		margin: 20px 0 18px;
	}
	.sub {
		color: var(--slate);
	}

	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}
	.tag {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: var(--text-label);
		letter-spacing: 0.18em;
		color: var(--blue);
		margin-bottom: 18px;
	}
	h2 {
		font-size: var(--text-h3);
		margin-bottom: 14px;
	}
	.body {
		color: var(--slate);
		font-size: 0.95rem;
		line-height: 1.75;
	}

	.closing {
		margin-top: 56px;
		text-align: center;
	}
	.crosslink {
		margin-top: 28px;
		text-align: center;
		color: var(--slate);
		font-size: 0.9rem;
	}
	.crosslink a {
		color: var(--paper);
		text-underline-offset: 3px;
	}
	.crosslink a:hover {
		color: var(--blue);
	}

	@media (max-width: 900px) {
		.cards {
			grid-template-columns: 1fr;
		}
	}
</style>

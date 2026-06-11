<script lang="ts">
	import SectionLabel from '$lib/components/SectionLabel.svelte';
	import InterestForm from '$lib/components/InterestForm.svelte';
	import IdeasSection from '$lib/components/IdeasSection.svelte';

	let { data } = $props();

	type Status = 'AVAILABLE NOW' | 'IN DEVELOPMENT' | 'CONCEPT';

	interface Product {
		slug: string;
		deviceId: string;
		name: string;
		status: Status;
		mode: 'push' | 'serve' | 'both';
		hook: string;
		body: string;
		emits: string;
	}

	const products: Product[] = [
		{
			slug: 'soil-sensor',
			deviceId: 'br-soil-01',
			name: 'Soil Moisture Sensor',
			status: 'AVAILABLE NOW',
			mode: 'push',
			hook: 'Your garden, reporting to your database.',
			body: 'The reference Blue Raven device. An ESP32 with a capacitive probe that wakes, reads, and posts moisture straight to whatever endpoint you configure in the captive portal. Open firmware you can flash today.',
			emits: 'moisture %, raw ADC'
		},
		{
			slug: 'outdoor-camera',
			deviceId: 'br-cam-01',
			name: 'Outdoor Camera',
			status: 'IN DEVELOPMENT',
			mode: 'push',
			hook: 'Time-window captures straight to your storage.',
			body: 'Set a capture window in the portal and stills land in your own bucket. No cloud subscription, no app, no footage on anyone else’s server. Your security feed belongs in your stack.',
			emits: 'JPEG frames, capture metadata'
		},
		{
			slug: 'weight-scale',
			deviceId: 'br-scale-01',
			name: 'Digital Weight Scale',
			status: 'IN DEVELOPMENT',
			mode: 'push',
			hook: 'The device that started all of this.',
			body: 'Step on it and your weight posts to your health app before you finish brushing your teeth. No account, no ecosystem, no losing your history when a subscription lapses. The founding use case for Blue Raven.',
			emits: 'weight kg/lb, body timestamp'
		},
		{
			slug: 'air-quality',
			deviceId: 'br-air-01',
			name: 'Air Quality Monitor',
			status: 'CONCEPT',
			mode: 'serve',
			hook: 'Ask your air how it’s doing. Locally.',
			body: 'CO2, PM2.5, and VOC on a local REST API your dashboard polls whenever it wants. Serve mode means zero outbound connections: a device that never initiates a connection cannot phone home.',
			emits: 'CO2 ppm, PM2.5, VOC index, temp/RH'
		},
		{
			slug: 'kitchen-scale',
			deviceId: 'br-kitchen-01',
			name: 'Kitchen Scale',
			status: 'CONCEPT',
			mode: 'push',
			hook: 'Grams to your nutrition tracker as you cook.',
			body: 'Weigh an ingredient and it lands in your nutrition log automatically. Pairs with whatever health stack you’ve built, not with a branded recipe app you never asked for.',
			emits: 'weight g/oz, tare events'
		},
		{
			slug: 'presence-sensor',
			deviceId: 'br-presence-01',
			name: 'Presence Sensor',
			status: 'CONCEPT',
			mode: 'serve',
			hook: 'Room occupancy without cameras.',
			body: 'mmWave radar detects presence through furniture and darkness. Your automations query it locally: lights, climate, do-not-disturb logic, all without a single image ever existing.',
			emits: 'occupancy bool, motion level'
		},
		{
			slug: 'energy-plug',
			deviceId: 'br-power-01',
			name: 'Energy Monitor Plug',
			status: 'CONCEPT',
			mode: 'both',
			hook: 'Know what every appliance actually costs.',
			body: 'Per-appliance power draw, pushed to your stack on an interval or queried live. Find the vampire loads, graph the fridge, automate the space heater. Your meter, your data.',
			emits: 'watts, kWh, voltage, relay state'
		},
		{
			slug: 'climate-probe',
			deviceId: 'br-climate-01',
			name: 'Temp & Humidity Probe',
			status: 'CONCEPT',
			mode: 'push',
			hook: 'Fridge, freezer, greenhouse, sauna.',
			body: 'A sealed probe with thresholds you set in the captive portal. Get a webhook the moment the freezer door is left open or the greenhouse dips toward frost. No app between you and the alert.',
			emits: 'temp °C/°F, RH %, threshold alerts'
		},
		{
			slug: 'leak-sensor',
			deviceId: 'br-leak-01',
			name: 'Water Leak Sensor',
			status: 'CONCEPT',
			mode: 'push',
			hook: 'Under the sink, before the damage.',
			body: 'Months on a battery, silent until it matters, then a POST to any webhook you own. Pair it with your own notification logic: text, siren, smart valve. You decide what a leak triggers.',
			emits: 'leak bool, battery %'
		},
		{
			slug: 'contact-sensor',
			deviceId: 'br-contact-01',
			name: 'Door & Window Sensor',
			status: 'CONCEPT',
			mode: 'serve',
			hook: 'Open or closed, answered locally.',
			body: 'Your security dashboard queries state directly on your network. No cloud round trip to learn whether your own front door is open. Build the alarm logic you actually want.',
			emits: 'open/closed, last-change time'
		}
	];
</script>

<svelte:head>
	<title>Marketplace · Blue Raven</title>
	<meta
		name="description"
		content="Certified open hardware for the stack you already built. Your device, your data."
	/>
</svelte:head>

<section class="marketplace">
	<div class="container">
		<header class="head">
			<SectionLabel text="MARKETPLACE" />
			<h1>Hardware for the stack you already built.</h1>
			<p class="sub">
				Every device here carries the Blue Raven badge: open firmware, captive-portal config, and
				data that goes where you point it. Tell us which ones you want and we'll build them in that
				order.
			</p>
		</header>

		<div class="rows">
			{#each products as p (p.slug)}
				<article class="row" id={p.slug}>
					<div class="visual" aria-hidden="true">
						<div class="tile">
							<svg viewBox="0 0 80 80" width="72" height="72" fill="none" aria-hidden="true">
								<rect
									x="10"
									y="10"
									width="60"
									height="60"
									rx="12"
									stroke="currentColor"
									stroke-width="2"
								/>
								<circle cx="40" cy="40" r="10" stroke="currentColor" stroke-width="2" />
								<circle cx="40" cy="40" r="2.5" fill="currentColor" />
								<line x1="40" y1="10" x2="40" y2="22" stroke="currentColor" stroke-width="2" />
							</svg>
							<span class="device-id">{p.deviceId}</span>
						</div>
					</div>

					<div class="info">
						<div class="meta">
							<span class="chip" class:live={p.status === 'AVAILABLE NOW'}>{p.status}</span>
							<span class="mode">MODE: {p.mode.toUpperCase()}</span>
						</div>
						<h2>{p.name}</h2>
						<p class="hook">{p.hook}</p>
						<p class="body">{p.body}</p>
						<p class="emits">EMITS: {p.emits}</p>
						<InterestForm product={p.slug} />
					</div>
				</article>
			{/each}
		</div>

		<IdeasSection ideas={data.ideas} />
	</div>
</section>

<style>
	.marketplace {
		padding: clamp(64px, 9vw, 120px) 0 var(--space-section);
	}
	.head {
		max-width: 760px;
		margin-bottom: clamp(56px, 7vw, 96px);
	}
	h1 {
		font-size: var(--text-h2);
		margin: 20px 0 18px;
	}
	.sub {
		color: var(--slate);
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: clamp(40px, 5vw, 72px);
	}

	.row {
		display: grid;
		grid-template-columns: 45fr 55fr;
		gap: clamp(28px, 4vw, 64px);
		align-items: center;
		padding-bottom: clamp(40px, 5vw, 72px);
		border-bottom: 1px solid var(--line);
	}
	.row:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	/* Visual placeholder tile */
	.visual {
		min-height: 280px;
		display: flex;
	}
	.tile {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		color: var(--blue);
		background:
			radial-gradient(ellipse 70% 70% at 50% 40%, var(--blue-soft), transparent 75%),
			var(--glass-bg);
		border: 1px solid var(--line);
		border-radius: var(--radius-card);
		box-shadow: var(--glass-highlight), var(--glass-shadow);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
	}
	.device-id {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		color: var(--slate);
	}

	/* Info column */
	.meta {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 16px;
		flex-wrap: wrap;
	}
	.chip {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		color: var(--slate);
		border: 1px solid var(--line);
		border-radius: var(--radius-btn);
		padding: 5px 12px;
	}
	.chip.live {
		color: var(--ink);
		background: var(--blue);
		border-color: var(--blue);
	}
	.mode {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		color: var(--blue);
	}
	h2 {
		font-size: var(--text-h3);
		margin-bottom: 10px;
	}
	.hook {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--paper);
		margin-bottom: 12px;
	}
	.body {
		color: var(--slate);
		font-size: 0.95rem;
		line-height: 1.75;
		margin-bottom: 14px;
		max-width: 52ch;
	}
	.emits {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--slate);
		margin-bottom: 22px;
	}

	@media (max-width: 820px) {
		.row {
			grid-template-columns: 1fr;
		}
		.visual {
			min-height: 200px;
		}
	}
</style>

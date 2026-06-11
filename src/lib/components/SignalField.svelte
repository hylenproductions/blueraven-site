<script lang="ts">
	import { onMount } from 'svelte';

	/*
	 * SignalField — ambient adaptation of the "Blue Raven — Broadcast" piece.
	 * Keeps: node field + spring/wander integration, peer mesh, hub-convergence
	 * links, broadcast pulses, radial glow, vignette, film grain.
	 * Drops: the 30s narrative timeline, text scenes, HUD/timecode.
	 * Runs as a continuous non-looping simulation with a fade-in on mount.
	 */

	interface Props {
		maxDpr?: number;
	}

	let { maxDpr = 1.75 }: Props = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		// ---- Palette (matches app.css tokens) ----
		const INK = '#0a0c12';

		// ---- Steady-state intensities (collapsed from the narrative A_* tracks) ----
		const FIELD_A = 0.75; // node/mesh visibility
		const PEER_A = 0.7; // peer-link strength
		const HUB_A = 0.32; // hub convergence — soft, sits behind the headline
		const PULL = 0.12; // gentle drift toward center
		const GLOW_A = 0.5; // radial glow
		const PULSE_PERIOD = 5; // seconds per broadcast ring
		const PULSE_COUNT = 3;

		const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
		const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

		// ---- Sizing ----
		let W = 0;
		let H = 0;
		let dpr = 1;

		interface Node {
			hx: number;
			hy: number;
			x: number;
			y: number;
			vx: number;
			vy: number;
			seed: number;
			r: number;
			ph: number;
		}
		let nodes: Node[] = [];

		function nodeCountFor(width: number) {
			return width >= 1024 ? 82 : width >= 768 ? 48 : 32;
		}

		function seedNodes(count: number) {
			nodes = [];
			for (let i = 0; i < count; i++) {
				const hx = 0.06 + Math.random() * 0.88;
				const hy = 0.1 + Math.random() * 0.8;
				nodes.push({
					hx,
					hy,
					x: hx * W,
					y: hy * H,
					vx: 0,
					vy: 0,
					seed: Math.random() * 1000,
					r: 0.7 + Math.random() * 1.5,
					ph: Math.random() * Math.PI * 2
				});
			}
		}

		function resize() {
			const rect = canvas.parentElement!.getBoundingClientRect();
			const prevW = W;
			const prevH = H;
			W = rect.width;
			H = rect.height;
			dpr = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.25 : maxDpr);
			canvas.width = Math.round(W * dpr);
			canvas.height = Math.round(H * dpr);
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

			const want = nodeCountFor(W);
			if (nodes.length !== want) {
				seedNodes(want);
			} else if (prevW > 0 && prevH > 0) {
				// Rescale positions proportionally — avoids a visual pop.
				for (const n of nodes) {
					n.x = (n.x / prevW) * W;
					n.y = (n.y / prevH) * H;
				}
			}
		}

		// ---- Pre-rendered film grain (replaces per-frame feTurbulence) ----
		const grain = document.createElement('canvas');
		function renderGrain() {
			const gw = 160;
			const gh = 160;
			grain.width = gw;
			grain.height = gh;
			const gctx = grain.getContext('2d')!;
			const img = gctx.createImageData(gw, gh);
			for (let i = 0; i < img.data.length; i += 4) {
				const v = Math.random() * 255;
				img.data[i] = v;
				img.data[i + 1] = v;
				img.data[i + 2] = v;
				img.data[i + 3] = 255;
			}
			gctx.putImageData(img, 0, 0);
		}
		renderGrain();

		// ---- Draw layers ----
		function drawGlow(t: number) {
			const breathe = 0.6 + 0.4 * Math.sin(t * 0.8);
			const R = Math.min(W, H) * 0.78;
			const a = 0.13 * GLOW_A * breathe;
			const grd = ctx!.createRadialGradient(W / 2, H * 0.5, 0, W / 2, H * 0.5, R);
			grd.addColorStop(0, 'rgba(74,104,224,' + a + ')');
			grd.addColorStop(1, 'rgba(74,104,224,0)');
			ctx!.fillStyle = grd;
			ctx!.fillRect(0, 0, W, H);
		}

		function drawPulses(t: number) {
			const cx = W / 2;
			const cy = H * 0.5;
			const maxR = Math.min(W, H) * 0.62;
			for (let k = 0; k < PULSE_COUNT; k++) {
				const ph = (t / PULSE_PERIOD + k / PULSE_COUNT) % 1;
				const fadeIn = ph < 0.06 ? ph / 0.06 : 1;
				const a = (1 - ph) * fadeIn * 0.14;
				if (a <= 0.002) continue;
				ctx!.beginPath();
				ctx!.arc(cx, cy, ph * maxR, 0, 6.2832);
				ctx!.strokeStyle = 'rgba(91,124,255,' + a + ')';
				ctx!.lineWidth = 1;
				ctx!.stroke();
			}
		}

		function drawField(t: number, dt: number, A: number) {
			const cx = W / 2;
			const cy = H * 0.5;
			const base = Math.min(W, H);

			// Integrate (spring-to-target + gentle wander), dt-scaled to 60fps units.
			const step = Math.min(dt, 0.05) * 60;
			for (const n of nodes) {
				const homeX = n.hx * W;
				const homeY = n.hy * H;
				const tx = lerp(homeX, cx, PULL);
				const ty = lerp(homeY, cy, PULL);
				n.vx += (tx - n.x) * 0.012 * step;
				n.vy += (ty - n.y) * 0.012 * step;
				n.vx += Math.sin(t * 0.8 + n.seed) * 0.05 * step;
				n.vy += Math.cos(t * 0.7 + n.seed * 1.7) * 0.05 * step;
				n.vx *= Math.pow(0.9, step);
				n.vy *= Math.pow(0.9, step);
				n.x += n.vx * step;
				n.y += n.vy * step;
			}

			// Peer links (proximity mesh).
			const D = base * 0.17;
			const D2 = D * D;
			ctx!.lineWidth = 1;
			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				for (let j = i + 1; j < nodes.length; j++) {
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const d2 = dx * dx + dy * dy;
					if (d2 < D2) {
						const al = (1 - Math.sqrt(d2) / D) * PEER_A * A * 0.5;
						if (al > 0.004) {
							ctx!.strokeStyle = 'rgba(150,170,255,' + al + ')';
							ctx!.beginPath();
							ctx!.moveTo(a.x, a.y);
							ctx!.lineTo(b.x, b.y);
							ctx!.stroke();
						}
					}
				}
			}

			// Hub links — every node points back to the center.
			const reach = base * 0.6;
			for (const n of nodes) {
				const d = Math.hypot(n.x - cx, n.y - cy);
				const al = HUB_A * A * clamp01(1 - d / reach) * 0.55;
				if (al > 0.004) {
					ctx!.strokeStyle = 'rgba(91,124,255,' + al + ')';
					ctx!.beginPath();
					ctx!.moveTo(n.x, n.y);
					ctx!.lineTo(cx, cy);
					ctx!.stroke();
				}
			}

			// Nodes.
			for (const n of nodes) {
				const tw = 0.6 + 0.4 * Math.sin(t * 1.6 + n.ph);
				ctx!.globalAlpha = A * (0.55 + 0.4 * tw);
				ctx!.fillStyle = 'rgb(168,186,255)';
				ctx!.beginPath();
				ctx!.arc(n.x, n.y, n.r, 0, 6.2832);
				ctx!.fill();
			}
			ctx!.globalAlpha = 1;
		}

		function drawVignette() {
			const grd = ctx!.createRadialGradient(
				W / 2,
				H / 2,
				Math.min(W, H) * 0.34,
				W / 2,
				H / 2,
				Math.max(W, H) * 0.78
			);
			grd.addColorStop(0, 'rgba(0,0,5,0)');
			grd.addColorStop(1, 'rgba(0,0,6,0.62)');
			ctx!.fillStyle = grd;
			ctx!.fillRect(0, 0, W, H);
		}

		function drawGrain() {
			ctx!.save();
			ctx!.globalAlpha = 0.04;
			ctx!.globalCompositeOperation = 'soft-light';
			for (let gy = 0; gy < H; gy += grain.height) {
				for (let gx = 0; gx < W; gx += grain.width) {
					ctx!.drawImage(grain, gx, gy);
				}
			}
			ctx!.restore();
		}

		function render(t: number, dt: number) {
			// 1.5s fade-in replaces the narrative intro.
			const A = FIELD_A * clamp01(t / 1.5);
			ctx!.fillStyle = INK;
			ctx!.fillRect(0, 0, W, H);
			drawGlow(t);
			drawPulses(t);
			drawField(t, dt, A);
			drawVignette();
			drawGrain();
		}

		// ---- Clock + loop ----
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let raf = 0;
		let elapsed = 0;
		let last = 0;
		let lastDraw = 0;
		const mobile = () => W < 768;

		function frame(now: number) {
			raf = requestAnimationFrame(frame);
			if (!last) last = now;
			const dt = Math.min((now - last) / 1000, 0.05); // clamp tab-restore jumps
			last = now;
			// ~30fps cap on mobile
			if (mobile() && now - lastDraw < 33) return;
			lastDraw = now;
			elapsed += dt;
			render(elapsed, dt);
		}

		function staticFrame() {
			// Reduced motion: advance the sim a touch, draw once, never loop.
			for (let i = 0; i < 120; i++) render(2 + i * 0.016, 0.016);
			render(4, 0.016);
		}

		function start() {
			stop();
			if (reduceMotion.matches) {
				staticFrame();
			} else {
				last = 0;
				raf = requestAnimationFrame(frame);
			}
		}
		function stop() {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
		}

		function onVisibility() {
			if (document.hidden) {
				stop();
			} else if (!reduceMotion.matches) {
				last = 0;
				raf = requestAnimationFrame(frame);
			}
		}

		const ro = new ResizeObserver(() => {
			resize();
			if (reduceMotion.matches) staticFrame();
		});

		resize();
		seedNodes(nodeCountFor(W));
		ro.observe(canvas.parentElement!);
		document.addEventListener('visibilitychange', onVisibility);
		reduceMotion.addEventListener('change', start);
		start();

		return () => {
			stop();
			ro.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
			reduceMotion.removeEventListener('change', start);
		};
	});
</script>

<div class="field" aria-hidden="true">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.field {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		contain: strict;
	}
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
</style>

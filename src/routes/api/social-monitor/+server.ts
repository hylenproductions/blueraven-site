import { json } from '@sveltejs/kit';
import { SLACK_WEBHOOK_URL, CRON_SECRET } from '$env/static/private';

// Each search is either a global phrase or a subreddit-scoped query.
// Subreddit searches let us use broader terms in communities where they're relevant
// without drowning in noise from the global firehose.
type Search = { query: string; subreddit?: string };

const SEARCHES: Search[] = [
	// ── Vibe coding + AI + hardware ──────────────────────────────────────
	{ query: '"vibe coding" hardware' },
	{ query: '"vibe coding" sensors' },
	{ query: '"AI app" hardware sensors' },
	{ query: 'LLM "home automation"' },
	{ query: '"building with AI" hardware' },
	{ query: '"cursor" OR "claude" hardware sensors' },
	{ query: 'hardware inputs "AI agent"' },
	{ query: '"personal OS" hardware sensors' },

	// ── Jailbreak / unlock / local-first ─────────────────────────────────
	{ query: '"local API" "smart home"' },
	{ query: '"no cloud" IoT sensor' },
	{ query: '"offline" "smart home" local' },
	{ query: '"bypass cloud" IoT' },
	{ query: '"smart home" "without subscription"' },
	{ query: '"jailbreak" smart home device' },
	{ query: '"remove cloud" smart home' },
	{ query: '"local only" smart home' },

	// ── Homelab + self-hosted automation ─────────────────────────────────
	{ query: 'ESP32 webhook REST sensors' },
	{ query: 'ESP32 "home automation" app' },
	{ query: '"raspberry pi" sensors "home automation"' },
	{ query: '"self hosted" sensors webhook' },
	{ query: 'homelab IoT sensors', subreddit: 'homelab' },
	{ query: 'local sensors automation', subreddit: 'selfhosted' },
	{ query: 'smart home open source protocol', subreddit: 'selfhosted' },
	{ query: 'ESP32 REST API sensors', subreddit: 'esp32' },
	{ query: 'without cloud subscription', subreddit: 'homeautomation' },
	{ query: 'local only offline', subreddit: 'homeautomation' },
	{ query: 'cancel subscription alternative', subreddit: 'homeautomation' },
	{ query: 'open protocol certification', subreddit: 'IOT' },

	// ── Smart appliances / frictionless / no data entry ──────────────────
	{ query: '"smart fridge" tracking automatic' },
	{ query: '"smart appliance" "data entry"' },
	{ query: '"smart fridge" "data entry"' },
	{ query: '"kitchen" sensors automatic tracking' },
	{ query: '"inventory tracking" home automatic' },
	{ query: '"smart home" "too much effort"' },
	{ query: '"ambient" computing sensors home' },
	{ query: '"passive tracking" home sensors' },
	{ query: '"smart home" "pull out phone"' },
	{ query: '"always having to open app"' },

	// ── Health / quantified self / personal data ──────────────────────────
	{ query: '"quantified self" hardware sensor' },
	{ query: '"health tracking" hardware sensors' },
	{ query: '"personal data" hardware local' },
	{ query: '"weight scale" "local API"' },
	{ query: '"smart scale" without app' },
	{ query: 'biometrics "home server"' },
	{ query: 'health sensors "own data"' },

	// ── Home security local / no subscription ────────────────────────────
	{ query: '"local" "security camera" "no subscription"' },
	{ query: '"self hosted" camera NVR' },
	{ query: '"home security" "no cloud"' },
	{ query: '"presence sensor" local privacy' },
	{ query: '"motion sensor" local webhook' },
	{ query: 'camera "no subscription" local storage', subreddit: 'homelab' },

	// ── Anti-ecosystem / anti-subscription / data sovereignty ────────────
	{ query: '"data sovereignty" IoT' },
	{ query: '"smart home" "lock in"' },
	{ query: '"subscription" "smart home" tired' },
	{ query: '"Matter" alternative protocol' },
	{ query: '"open source" smart home protocol' },
	{ query: '"who owns" smart home data' },
	{ query: '"smart home" "privacy" local' },
	{ query: '"IoT" "phone home" privacy' },
	{ query: '"device" "sunset" smart home' },

	// ── App/side-project builders needing hardware inputs ─────────────────
	{ query: 'hardware sensors "side project"' },
	{ query: 'app "real world data" sensors' },
	{ query: '"REST API" hardware "home automation"' },
	{ query: 'hardware inputs "web app"' },
	{ query: '"webhook" sensors "home automation"' },
	{ query: 'hardware sensors app', subreddit: 'SideProject' },
	{ query: 'AI hardware sensors app', subreddit: 'LocalLLaMA' },
	{ query: 'hardware inputs "AI agent"', subreddit: 'LocalLLaMA' },

	// ── Brand / direct ────────────────────────────────────────────────────
	{ query: 'blueraven' },
	{ query: '"blue raven" protocol' }
];

const REDDIT_UA = 'web:BlueRavenMonitor:1.0';

interface Post {
	id: string;
	title: string;
	url: string;
	score: number;
	meta: string;
	platform: 'reddit' | 'hn';
}

function since24h() {
	return Math.floor(Date.now() / 1000) - 86400;
}

async function searchReddit(query: string, subreddit?: string): Promise<Post[]> {
	const base = subreddit
		? `https://www.reddit.com/r/${subreddit}/search.json?restrict_sr=1`
		: `https://www.reddit.com/search.json?`;
	const url = `${base}q=${encodeURIComponent(query)}&sort=new&t=day&limit=5&type=link`;
	const res = await fetch(url, { headers: { 'User-Agent': REDDIT_UA } });
	if (!res.ok) return [];
	const data = await res.json();
	const cutoff = since24h();
	return (data.data?.children ?? [])
		.map((c: any) => c.data)
		.filter((p: any) => p.created_utc >= cutoff)
		.map((p: any) => ({
			id: `reddit:${p.id}`,
			title: p.title,
			url: `https://reddit.com${p.permalink}`,
			score: p.score,
			meta: `r/${p.subreddit} · ${p.score} pts`,
			platform: 'reddit' as const
		}));
}

async function searchHN(query: string): Promise<Post[]> {
	const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=(story,comment)&numericFilters=created_at_i>${since24h()}&hitsPerPage=5`;
	const res = await fetch(url);
	if (!res.ok) return [];
	const data = await res.json();
	return (data.hits ?? []).map((h: any) => ({
		id: `hn:${h.objectID}`,
		title: h.title ?? h.comment_text?.replace(/<[^>]+>/g, '').slice(0, 120) ?? '(comment)',
		url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
		score: h.points ?? 0,
		meta: `HN · ${h.points ?? 0} pts`,
		platform: 'hn' as const
	}));
}

function buildMessage(posts: Post[]) {
	if (posts.length === 0) {
		return {
			blocks: [
				{
					type: 'header',
					text: { type: 'plain_text', text: '🔍 Social Listening — quiet today', emoji: true }
				}
			]
		};
	}

	const reddit = posts.filter((p) => p.platform === 'reddit');
	const hn = posts.filter((p) => p.platform === 'hn');

	const blocks: any[] = [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: `🔍 Social Listening — ${posts.length} threads to jump into`,
				emoji: true
			}
		}
	];

	if (reddit.length) {
		blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*Reddit*' } });
		for (const p of reddit) {
			blocks.push({
				type: 'section',
				text: { type: 'mrkdwn', text: `<${p.url}|${p.title}>\n_${p.meta}_` }
			});
		}
	}

	if (reddit.length && hn.length) blocks.push({ type: 'divider' });

	if (hn.length) {
		blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*Hacker News*' } });
		for (const p of hn) {
			blocks.push({
				type: 'section',
				text: { type: 'mrkdwn', text: `<${p.url}|${p.title}>\n_${p.meta}_` }
			});
		}
	}

	return { blocks };
}

export async function GET({ request }) {
	if (request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const seen = new Set<string>();
		const allPosts: Post[] = [];

		// Run Reddit searches sequentially to stay within rate limits;
		// run HN in parallel since it has no auth constraints
		for (const { query, subreddit } of SEARCHES) {
			const [redditPosts, hnPosts] = await Promise.all([
				searchReddit(query, subreddit).catch(() => []),
				// HN doesn't support subreddit scoping — global search only
				subreddit ? Promise.resolve([]) : searchHN(query).catch(() => [])
			]);

			for (const p of [...redditPosts, ...hnPosts]) {
				if (!seen.has(p.id)) {
					seen.add(p.id);
					allPosts.push(p);
				}
			}
		}

		allPosts.sort((a, b) => b.score - a.score);

		const message = buildMessage(allPosts.slice(0, 15));
		const res = await fetch(SLACK_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message)
		});

		if (!res.ok) return json({ error: 'Slack post failed' }, { status: 500 });
		return json({ ok: true, count: allPosts.length });
	} catch (err: any) {
		console.error('[social-monitor]', err);
		return json({ error: err?.message ?? 'Monitor failed' }, { status: 500 });
	}
}

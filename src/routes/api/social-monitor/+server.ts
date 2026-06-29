import { json } from '@sveltejs/kit';
import { SLACK_WEBHOOK_URL, CRON_SECRET } from '$env/static/private';

const KEYWORDS = [
	'"IoT protocol"',
	'"device interoperability"',
	'"smart home protocol"',
	'"open IoT"',
	'"IoT standard"',
	'"Matter alternative"',
	'"Zigbee alternative"',
	'blueraven'
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

async function searchReddit(keyword: string): Promise<Post[]> {
	const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&t=day&limit=5&type=link`;
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

async function searchHN(keyword: string): Promise<Post[]> {
	const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(keyword)}&tags=(story,comment)&numericFilters=created_at_i>${since24h()}&hitsPerPage=5`;
	const res = await fetch(url);
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
					text: { type: 'plain_text', text: '🔍 Social Listening — quiet day, no new threads', emoji: true }
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
				text: `🔍 Social Listening — ${posts.length} conversations to jump into`,
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

export async function POST({ request }) {
	if (request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const seen = new Set<string>();
		const allPosts: Post[] = [];

		for (const kw of KEYWORDS) {
			const [redditPosts, hnPosts] = await Promise.all([
				searchReddit(kw).catch(() => []),
				searchHN(kw).catch(() => [])
			]);

			for (const p of [...redditPosts, ...hnPosts]) {
				if (!seen.has(p.id)) {
					seen.add(p.id);
					allPosts.push(p);
				}
			}
		}

		allPosts.sort((a, b) => b.score - a.score);

		const message = buildMessage(allPosts.slice(0, 12));
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

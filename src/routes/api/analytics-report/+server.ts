import { json } from '@sveltejs/kit';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { ExternalAccountClient } from 'google-auth-library';
import { google } from 'googleapis';
import { getVercelOidcToken } from '@vercel/oidc';
import {
	SLACK_WEBHOOK_URL,
	GA4_PROPERTY_ID,
	GCP_PROJECT_NUMBER,
	GCP_WORKLOAD_IDENTITY_POOL_ID,
	GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID,
	GCP_SERVICE_ACCOUNT_EMAIL,
	CRON_SECRET
} from '$env/static/private';

function buildAuthClient() {
	return ExternalAccountClient.fromJSON({
		type: 'external_account',
		audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
		subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
		token_url: 'https://sts.googleapis.com/v1/token',
		service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
		subject_token_supplier: { getSubjectToken: getVercelOidcToken }
	});
}

async function fetchGA4(auth: ExternalAccountClient) {
	const client = new BetaAnalyticsDataClient({ authClient: auth as any });
	const property = `properties/${GA4_PROPERTY_ID}`;

	const [summary, sources, pages] = await Promise.all([
		client.runReport({
			property,
			dateRanges: [
				{ startDate: '7daysAgo', endDate: 'today', name: 'this_week' },
				{ startDate: '14daysAgo', endDate: '8daysAgo', name: 'last_week' }
			],
			metrics: [
				{ name: 'sessions' },
				{ name: 'totalUsers' },
				{ name: 'screenPageViews' },
				{ name: 'averageSessionDuration' },
				{ name: 'bounceRate' }
			]
		}),
		client.runReport({
			property,
			dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
			dimensions: [{ name: 'sessionDefaultChannelGroup' }],
			metrics: [{ name: 'sessions' }],
			orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
			limit: 6
		}),
		client.runReport({
			property,
			dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
			dimensions: [{ name: 'pagePath' }],
			metrics: [{ name: 'screenPageViews' }, { name: 'averageSessionDuration' }],
			orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
			limit: 5
		})
	]);

	return { summary: summary[0], sources: sources[0], pages: pages[0] };
}

async function fetchSearchConsole(auth: ExternalAccountClient) {
	const sc = google.searchconsole({ version: 'v1', auth: auth as any });
	const siteUrl = 'https://blueraven.build/';

	const [queries, pages] = await Promise.all([
		sc.searchanalytics.query({
			siteUrl,
			requestBody: {
				startDate: '7daysAgo' as any,
				endDate: 'today' as any,
				dimensions: ['query'],
				rowLimit: 5
			}
		}),
		sc.searchanalytics.query({
			siteUrl,
			requestBody: {
				startDate: '7daysAgo' as any,
				endDate: 'today' as any,
				dimensions: ['page'],
				rowLimit: 5
			}
		})
	]);

	return { queries: queries.data.rows ?? [], pages: pages.data.rows ?? [] };
}

function getMetric(report: any, dateRange: string, metricName: string): number {
	const row = report.rows?.find((r: any) => r.dimensionValues?.[0]?.value === dateRange);
	if (!row) return 0;
	const idx = report.metricHeaders?.findIndex((h: any) => h.name === metricName) ?? -1;
	return parseFloat(row.metricValues?.[idx]?.value ?? '0');
}

function pct(current: number, prev: number): string {
	if (prev === 0) return current > 0 ? 'new' : '—';
	const d = ((current - prev) / prev) * 100;
	return (d >= 0 ? '+' : '') + d.toFixed(0) + '%';
}

function trend(current: number, prev: number, lowerIsBetter = false): string {
	if (prev === 0) return '';
	return (current >= prev) !== lowerIsBetter ? ' :chart_with_upwards_trend:' : ' :small_red_triangle_down:';
}

function fmtDuration(s: number): string {
	const m = Math.floor(s / 60);
	return m > 0 ? `${m}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`;
}

function buildMessage(ga4: Awaited<ReturnType<typeof fetchGA4>>, sc: Awaited<ReturnType<typeof fetchSearchConsole>>) {
	const tw = (m: string) => getMetric(ga4.summary, 'this_week', m);
	const lw = (m: string) => getMetric(ga4.summary, 'last_week', m);

	const sessions = tw('sessions'), prevSessions = lw('sessions');
	const users = tw('totalUsers'), prevUsers = lw('totalUsers');
	const bounce = tw('bounceRate'), prevBounce = lw('bounceRate');
	const duration = tw('averageSessionDuration');
	const pageviews = tw('screenPageViews');

	const sourceLines = (ga4.sources.rows ?? [])
		.map((r: any) => `• ${r.dimensionValues[0].value}: *${r.metricValues[0].value}* sessions`)
		.join('\n') || '_No data yet_';

	const pageLines = (ga4.pages.rows ?? [])
		.map((r: any) => {
			const path = r.dimensionValues[0].value || '/';
			const views = r.metricValues[0].value;
			const dur = parseFloat(r.metricValues[1].value);
			return `• \`${path}\` — *${views}* views · ${fmtDuration(dur)} avg`;
		})
		.join('\n') || '_No data yet_';

	const queryLines = sc.queries
		.map((r: any) => {
			const ctr = ((r.ctr ?? 0) * 100).toFixed(1);
			return `• _"${r.keys[0]}"_ — *${r.clicks}* clicks · ${r.impressions} impressions · ${ctr}% CTR · pos ${r.position?.toFixed(1)}`;
		})
		.join('\n') || '_No search data yet — may take a few days_';

	return {
		blocks: [
			{
				type: 'header',
				text: { type: 'plain_text', text: '📊 Blue Raven Weekly Report', emoji: true }
			},
			{
				type: 'section',
				text: { type: 'mrkdwn', text: '*Last 7 days vs prior 7 days*' }
			},
			{
				type: 'section',
				fields: [
					{ type: 'mrkdwn', text: `*Sessions*\n${sessions} (${pct(sessions, prevSessions)})${trend(sessions, prevSessions)}` },
					{ type: 'mrkdwn', text: `*Users*\n${users} (${pct(users, prevUsers)})${trend(users, prevUsers)}` },
					{ type: 'mrkdwn', text: `*Page Views*\n${pageviews}` },
					{ type: 'mrkdwn', text: `*Avg Session*\n${fmtDuration(duration)}` },
					{ type: 'mrkdwn', text: `*Bounce Rate*\n${(bounce * 100).toFixed(1)}% (${pct(bounce, prevBounce)})${trend(bounce, prevBounce, true)}` }
				]
			},
			{ type: 'divider' },
			{ type: 'section', text: { type: 'mrkdwn', text: `*Traffic Sources*\n${sourceLines}` } },
			{ type: 'divider' },
			{ type: 'section', text: { type: 'mrkdwn', text: `*Top Pages*\n${pageLines}` } },
			{ type: 'divider' },
			{ type: 'section', text: { type: 'mrkdwn', text: `*Top Search Queries* (Google)\n${queryLines}` } },
			{
				type: 'context',
				elements: [{ type: 'mrkdwn', text: '<https://analytics.google.com|GA4> · <https://search.google.com/search-console|Search Console>' }]
			}
		]
	};
}

export async function POST({ request }) {
	if (request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const auth = buildAuthClient()!;
		const [ga4, sc] = await Promise.all([fetchGA4(auth), fetchSearchConsole(auth)]);
		const message = buildMessage(ga4, sc);

		const res = await fetch(SLACK_WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message)
		});

		if (!res.ok) return json({ error: 'Slack post failed' }, { status: 500 });
		return json({ ok: true });
	} catch (err: any) {
		return json({ error: err?.message ?? String(err), stack: err?.stack }, { status: 500 });
	}
}

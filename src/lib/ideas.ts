import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Idea } from './types';

/*
 * Device-idea voting backed by Supabase (project: blueraven-site).
 * Plain fetch against PostgREST; the anon key is public by design and RLS
 * restricts it to reading published ideas and inserting votes.
 */

const HEADERS = {
	apikey: PUBLIC_SUPABASE_ANON_KEY,
	Authorization: `Bearer ${PUBLIC_SUPABASE_ANON_KEY}`
};

/*
 * Fetch published ideas, most-seconded first. Returns null on ANY failure
 * (timeout, network, paused project) so the marketplace can hide the list
 * instead of breaking. Takes a fetch function so SvelteKit's server load
 * can pass its own.
 */
export async function fetchIdeas(fetchFn: typeof fetch): Promise<Idea[] | null> {
	if (!PUBLIC_SUPABASE_URL) return null;
	try {
		const res = await fetchFn(
			`${PUBLIC_SUPABASE_URL}/rest/v1/ideas` +
				'?select=id,title,description,vote_count,created_at' +
				'&order=vote_count.desc,created_at.desc',
			{ headers: HEADERS, signal: AbortSignal.timeout(3000) }
		);
		if (!res.ok) return null;
		return (await res.json()) as Idea[];
	} catch {
		return null;
	}
}

/*
 * Record a vote. The (idea_id, voter_token) primary key makes this
 * idempotent: a 409 means this browser already seconded the idea, which
 * the caller should treat as success.
 */
export async function submitVote(ideaId: string, voterToken: string): Promise<boolean> {
	try {
		const res = await fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/votes`, {
			method: 'POST',
			headers: {
				...HEADERS,
				'Content-Type': 'application/json',
				Prefer: 'return=minimal'
			},
			body: JSON.stringify({ idea_id: ideaId, voter_token: voterToken })
		});
		return res.ok || res.status === 409;
	} catch {
		return false;
	}
}

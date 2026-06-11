import { fetchIdeas } from '$lib/ideas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	// null when Supabase is unreachable; the page hides the ideas list.
	return { ideas: await fetchIdeas(fetch) };
};

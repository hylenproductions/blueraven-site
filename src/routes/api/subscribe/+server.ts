import type { RequestHandler } from './$types'

// Accepts email, returns success. Resend integration wired in next step.
export const POST: RequestHandler = async ({ request }) => {
	const { email } = await request.json()

	if (!email || typeof email !== 'string') {
		return new Response(JSON.stringify({ error: 'Email required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		})
	}

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	})
}

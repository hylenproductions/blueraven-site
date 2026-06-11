import { SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_STORE_DOMAIN } from '$env/static/private';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

export async function shopifyFetch<T>(
	query: string,
	variables?: Record<string, unknown>
): Promise<T> {
	const res = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});

	if (!res.ok) {
		throw new Error(`Shopify API error: ${res.status}`);
	}

	const { data, errors } = await res.json();
	if (errors) throw new Error(errors[0].message);
	return data;
}

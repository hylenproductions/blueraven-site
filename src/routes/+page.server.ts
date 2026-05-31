import { client } from '$lib/sanity'

export const load = async () => {
	const products = await client.fetch(`*[_type == "product"] | order(order asc)`)
	return { products }
}

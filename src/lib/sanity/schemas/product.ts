import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', title: 'Title' }),
		defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } }),
		defineField({ name: 'tagline', type: 'string', title: 'Tagline' }),
		defineField({ name: 'description', type: 'text', title: 'Description' }),
		defineField({
			name: 'status',
			type: 'string',
			title: 'Status',
			options: { list: ['coming_soon', 'pre_order', 'available', 'sold_out'] },
		}),
		defineField({ name: 'preOrderDate', type: 'date', title: 'Pre-order Date' }),
		defineField({ name: 'price', type: 'number', title: 'Price (USD)' }),
		defineField({
			name: 'image',
			type: 'image',
			title: 'Product Image',
			options: { hotspot: true },
		}),
		defineField({ name: 'shopifyProductId', type: 'string', title: 'Shopify Product ID' }),
		defineField({ name: 'githubUrl', type: 'url', title: 'GitHub URL' }),
		defineField({ name: 'order', type: 'number', title: 'Display Order' }),
	],
})

import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'siteSettings',
	title: 'Site Settings',
	type: 'document',
	fields: [
		defineField({ name: 'headline', type: 'string', title: 'Hero Headline' }),
		defineField({ name: 'subheadline', type: 'text', title: 'Hero Subheadline' }),
		defineField({ name: 'manifestoStatement', type: 'text', title: 'Manifesto Statement' }),
	],
})

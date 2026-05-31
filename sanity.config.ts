import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/lib/sanity/schemas'

export default defineConfig({
	name: 'blueraven',
	title: 'Blue Raven',
	projectId: 'sw0gwzgu',
	dataset: 'production',
	plugins: [structureTool()],
	schema: { types: schemaTypes },
})

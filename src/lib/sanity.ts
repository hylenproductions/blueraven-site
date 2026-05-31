import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_API_VERSION
} from '$env/static/public'

export const sanity = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: PUBLIC_SANITY_API_VERSION,
	useCdn: true
})

const builder = imageUrlBuilder(sanity)

export function urlFor(source: SanityImageSource) {
	return builder.image(source)
}

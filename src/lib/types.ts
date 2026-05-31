// Sanity
export interface SanityImage {
	_type: 'image'
	asset: { _ref: string; _type: 'reference' }
	alt?: string
}

// Shopify
export interface Product {
	id: string
	title: string
	handle: string
	description: string
	priceRange: {
		minVariantPrice: { amount: string; currencyCode: string }
	}
	images: {
		edges: Array<{ node: { url: string; altText: string | null } }>
	}
}

// Blue Raven device payload (mirrors firmware output)
export interface DevicePayload {
	device_id: string
	timestamp: number
	readings: Record<string, number>
}

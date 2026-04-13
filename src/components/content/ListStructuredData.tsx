import type { ContentFrontmatter, ContentType } from '@/lib/content'
import { getContentTypeMetadata, getSiteUrl } from '@/lib/site-config'

interface ListStructuredDataProps {
	contentType: ContentType
	locale: string
	items: Array<{ slug: string; frontmatter: ContentFrontmatter }>
}

export function ListStructuredData({ contentType, locale, items }: ListStructuredDataProps) {
	const siteUrl = getSiteUrl()
	const listUrl =
		locale === 'en' ? `${siteUrl}/${contentType}` : `${siteUrl}/${locale}/${contentType}`
	const contentTypeMeta = getContentTypeMetadata(contentType)

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: contentTypeMeta.title,
		description: contentTypeMeta.description,
		url: listUrl,
		numberOfItems: items.length,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			url:
				locale === 'en'
					? `${siteUrl}/${contentType}/${item.slug}`
					: `${siteUrl}/${locale}/${contentType}/${item.slug}`,
			name: item.frontmatter.title,
		})),
	}

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
		/>
	)
}

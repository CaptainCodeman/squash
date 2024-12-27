export const Format = ['AVIF', 'JPEG', 'JXL', 'PNG', 'WEBP'] as const
export type Format = (typeof Format)[number]

export const Formats = arrayToSentence([...Format], 'or')

function arrayToSentence<T>(arr: T[], conjunction: string) {
	const last = arr.pop()
	return `${arr.join(', ')} ${conjunction} ${last}`
}

export const defaultQuality: Record<Format, number> = {
	AVIF: 50,
	JPEG: 75,
	JXL: 75,
	PNG: 0,
	WEBP: 75
}

export function suggestCategory(t: string) { return { slug: null, confidence: 0 } }
export function suggestBudget(t: string, s: string) { return null }
export function detectSpam(t: string) { return { isSpam: false, confidence: 0, reasons: [] as string[] } }
export function improveTitle(t: string) { return t }

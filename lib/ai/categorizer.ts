export function suggestCategory(title: string) {
  return { slug: null, confidence: 0 }
}
export function suggestBudget(title: string, slug: string) {
  return null
}
export function detectSpam(title: string) {
  return { isSpam: false, confidence: 0, reasons: [] as string[] }
}
export function improveTitle(title: string) {
  return title
}

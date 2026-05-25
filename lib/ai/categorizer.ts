/**
 * Tabitus AI Layer
 * Catégorisation + estimation budget + détection spam
 */

// ── Keyword→Category mapping ────────────────────────────────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  smartphones:    ['téléphone', 'smartphone', 'iphone', 'samsung', 'xiaomi', 'mobile', 'portable'],
  informatique:   ['pc', 'ordinateur', 'laptop', 'macbook', 'dell', 'hp', 'lenovo', 'clavier', 'souris'],
  gaming:         ['ps5', 'xbox', 'nintendo', 'switch', 'jeux vidéo', 'gaming', 'manette', 'console'],
  tv-audio:       ['tv', 'télévision', 'smart tv', 'écran', 'home cinéma', 'samsung tv'],
  electromenager: ['réfrigérateur', 'machine à laver', 'lave-linge', 'four', 'micro-ondes', 'aspirateur', 'frigo'],
  meubles:        ['canapé', 'sofa', 'table', 'chaise', 'lit', 'armoire', 'meuble', 'commode', 'bureau'],
  voitures:       ['voiture', 'auto', 'car', 'véhicule', 'toyota', 'renault', 'dacia', 'citroën'],
  motos:          ['moto', 'scooter', 'yamaha', 'honda', 'kawasaki'],
  mode-femme:     ['robe', 'jupe', 'blouse', 'tailleur', 'hijab', 'abaya'],
  mode-homme:     ['costume', 'chemise', 'pantalon', 'veste', 'djellaba'],
  chaussures:     ['chaussures', 'sneakers', 'basket', 'boots', 'sandales', 'nike', 'adidas'],
  pharmacie:      ['médicament', 'vitamines', 'paracétamol', 'compléments', 'crème médicale'],
  alimentation:   ['huile', 'sucre', 'farine', 'riz', 'café', 'lait', 'épicerie', 'alimentaire'],
  menage:         ['femme de ménage', 'nettoyage', 'ménage', 'repassage', 'entretien maison'],
  bricolage:      ['perceuse', 'vis', 'plomb', 'peinture', 'carrelage', 'installation'],
  hotels:         ['hôtel', 'riad', 'chambre', 'hébergement', 'nuit', 'séjour'],
  vols:           ['vol', 'billet avion', 'avion', 'flight', 'aller retour'],
  parfums:        ['parfum', 'eau de toilette', 'cologne', 'fragrance', 'cosmétique'],
  bijoux:         ['montre', 'bague', 'collier', 'bracelet', 'bijou', 'or', 'argent'],
  sacs:           ['sac', 'sac à main', 'portefeuille', 'valise', 'bagage'],
  coiffure:       ['coiffeur', 'coupe', 'barbier', 'barbe', 'cheveux', 'salon'],
  mariages:       ['mariage', 'wedding', 'noces', 'réception', 'traiteur mariage'],
  dev-web:        ['site web', 'application', 'développeur', 'app mobile', 'e-commerce', 'wordpress'],
  design:         ['logo', 'design', 'identité visuelle', 'graphiste', 'illustration'],
  formation:      ['formation', 'cours', 'coaching', 'apprentissage', 'certification'],
  courses:        ['cours particulier', 'soutien scolaire', 'professeur', 'mathématiques'],
}

// Budget ranges by category (MAD)
const BUDGET_RANGES: Record<string, [number, number]> = {
  smartphones:    [1500, 12000],
  informatique:   [2500, 20000],
  gaming:         [1000, 8000],
  tv-audio:       [2000, 15000],
  electromenager: [1500, 20000],
  meubles:        [500, 30000],
  voitures:       [40000, 300000],
  mode-femme:     [100, 2000],
  mode-homme:     [100, 3000],
  chaussures:     [150, 3000],
  pharmacie:      [20, 500],
  alimentation:   [50, 2000],
  hotels:         [300, 5000],
  vols:           [800, 8000],
  parfums:        [200, 3000],
  bijoux:         [500, 50000],
  dev-web:        [2000, 50000],
  design:         [500, 10000],
  formation:      [500, 15000],
  menage:         [200, 1500],
  coiffure:       [50, 500],
  mariages:       [5000, 100000],
}

/**
 * Suggest category based on request title + description
 */
export function suggestCategory(title: string, description = ''): {
  slug: string | null
  confidence: number
} {
  const text = (title + ' ' + description).toLowerCase()

  let bestSlug: string | null = null
  let bestScore = 0

  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => {
      if (text.includes(kw)) return acc + (kw.length > 5 ? 2 : 1)
      return acc
    }, 0)
    if (score > bestScore) {
      bestScore = score
      bestSlug = slug
    }
  }

  const confidence = bestScore > 0
    ? Math.min(bestScore / 5, 1)
    : 0

  return { slug: confidence > 0.2 ? bestSlug : null, confidence }
}

/**
 * Suggest budget range based on title and category
 */
export function suggestBudget(
  title: string,
  categorySlug: string
): { min: number; max: number; confidence: number } | null {
  const range = BUDGET_RANGES[categorySlug]
  if (!range) {
    // Try to infer from title keywords
    const { slug } = suggestCategory(title)
    if (slug && BUDGET_RANGES[slug]) {
      return { min: BUDGET_RANGES[slug][0], max: BUDGET_RANGES[slug][1], confidence: 0.6 }
    }
    return null
  }
  return { min: range[0], max: range[1], confidence: 0.85 }
}

/**
 * Spam / fraud detection — basic heuristics
 */
export function detectSpam(title: string, description = ''): {
  isSpam: boolean
  confidence: number
  reasons: string[]
} {
  const reasons: string[] = []
  const text = (title + ' ' + description).toLowerCase()

  const spamPatterns = [
    /whatsapp|telegram|signal|wa\.me/i,
    /\d{10,}/,          // phone number
    /click here|cliquez ici|bit\.ly/i,
    /free money|argent facile|gagner sans travailler/i,
  ]

  let spamScore = 0
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      spamScore += 0.3
      reasons.push(`Pattern suspect: ${pattern.source}`)
    }
  }

  // Very short title
  if (title.length < 5) {
    spamScore += 0.4
    reasons.push('Titre trop court')
  }

  // ALL CAPS
  if (title === title.toUpperCase() && title.length > 10) {
    spamScore += 0.2
    reasons.push('Titre en majuscules')
  }

  return {
    isSpam: spamScore >= 0.5,
    confidence: Math.min(spamScore, 1),
    reasons,
  }
}

/**
 * Auto-improve request title using basic NLP
 */
export function improveTitle(rawTitle: string): string {
  return rawTitle
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[a-z]/, c => c.toUpperCase()) // Capitalize first
    .slice(0, 120)
}

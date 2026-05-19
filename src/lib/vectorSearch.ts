// Vector Search and Embedding Simulation for Make Sense OS
// Maps natural language text to a 12-dimensional concept vector space

export const SEMANTIC_DIMENSIONS = [
  'meta-ads',
  'google-ads',
  'seo',
  'crm-email',
  'ugc-creative',
  'data-reporting',
  'client-onboarding',
  'technical',
  'creative',
  'strategy',
  'retention',
  'finance'
] as const;

export type Embedding = number[];

// Pre-defined vocabulary mappings for concepts
const VOCABULARY: Record<string, { index: number; weight: number }[]> = {
  // meta ads
  'meta': [{ index: 0, weight: 1.0 }, { index: 7, weight: 0.2 }],
  'facebook': [{ index: 0, weight: 1.0 }],
  'instagram': [{ index: 0, weight: 0.9 }],
  'cbo': [{ index: 0, weight: 1.0 }, { index: 9, weight: 0.4 }],
  'abo': [{ index: 0, weight: 1.0 }],
  'ads': [{ index: 0, weight: 0.6 }, { index: 1, weight: 0.6 }],
  'adset': [{ index: 0, weight: 0.8 }],
  'publicitaire': [{ index: 0, weight: 0.5 }, { index: 1, weight: 0.5 }],
  
  // google ads
  'google': [{ index: 1, weight: 1.0 }],
  'shopping': [{ index: 1, weight: 0.9 }],
  'pmax': [{ index: 1, weight: 1.0 }, { index: 9, weight: 0.3 }],
  'gmc': [{ index: 1, weight: 1.0 }, { index: 7, weight: 0.4 }],
  'merchant': [{ index: 1, weight: 1.0 }],
  'search': [{ index: 1, weight: 0.6 }, { index: 2, weight: 0.6 }],

  // seo & content
  'seo': [{ index: 2, weight: 1.0 }, { index: 9, weight: 0.3 }],
  'referencement': [{ index: 2, weight: 1.0 }],
  'référencement': [{ index: 2, weight: 1.0 }],
  'crawl': [{ index: 2, weight: 0.8 }, { index: 7, weight: 0.4 }],
  'semrush': [{ index: 2, weight: 1.0 }],
  'ahrefs': [{ index: 2, weight: 1.0 }],
  'backlinks': [{ index: 2, weight: 0.9 }],
  'netlinking': [{ index: 2, weight: 0.9 }],
  'indexation': [{ index: 2, weight: 0.8 }],

  // crm & email
  'crm': [{ index: 3, weight: 1.0 }, { index: 10, weight: 0.4 }],
  'klaviyo': [{ index: 3, weight: 1.0 }, { index: 7, weight: 0.3 }],
  'email': [{ index: 3, weight: 1.0 }],
  'emailing': [{ index: 3, weight: 1.0 }],
  'newsletter': [{ index: 3, weight: 0.9 }],
  'relance': [{ index: 3, weight: 0.8 }],
  'panier': [{ index: 3, weight: 0.8 }, { index: 10, weight: 0.4 }],
  'abandon': [{ index: 3, weight: 0.7 }],

  // ugc & video
  'ugc': [{ index: 4, weight: 1.0 }, { index: 8, weight: 0.5 }],
  'brief': [{ index: 4, weight: 0.8 }, { index: 6, weight: 0.2 }],
  'createur': [{ index: 4, weight: 0.9 }],
  'créateur': [{ index: 4, weight: 0.9 }],
  'video': [{ index: 4, weight: 0.9 }, { index: 8, weight: 0.7 }],
  'vidéo': [{ index: 4, weight: 0.9 }, { index: 8, weight: 0.7 }],
  'script': [{ index: 4, weight: 0.8 }],
  'hook': [{ index: 4, weight: 0.9 }],
  'accroche': [{ index: 4, weight: 0.9 }],

  // reporting & analytics
  'reporting': [{ index: 5, weight: 1.0 }, { index: 11, weight: 0.3 }],
  'dashboard': [{ index: 5, weight: 0.9 }, { index: 7, weight: 0.3 }],
  'mer': [{ index: 5, weight: 1.0 }, { index: 11, weight: 0.7 }],
  'cac': [{ index: 5, weight: 0.9 }, { index: 11, weight: 0.7 }],
  'roas': [{ index: 5, weight: 0.9 }, { index: 11, weight: 0.5 }],
  'analytics': [{ index: 5, weight: 0.8 }],
  'looker': [{ index: 5, weight: 0.9 }],
  'data': [{ index: 5, weight: 0.8 }, { index: 7, weight: 0.4 }],

  // onboarding
  'onboarding': [{ index: 6, weight: 1.0 }],
  'welcome': [{ index: 6, weight: 0.8 }],
  'kickoff': [{ index: 6, weight: 0.9 }],
  'intégration': [{ index: 6, weight: 0.8 }],
  'integration': [{ index: 6, weight: 0.8 }],
  'slack': [{ index: 6, weight: 0.7 }],

  // technical / tracking
  'api': [{ index: 7, weight: 1.0 }],
  'tracking': [{ index: 7, weight: 0.9 }],
  'pixel': [{ index: 0, weight: 0.3 }, { index: 7, weight: 1.0 }],
  'code': [{ index: 7, weight: 0.7 }],
  'technique': [{ index: 7, weight: 0.7 }],
  'conversion': [{ index: 7, weight: 0.8 }],

  // creative / design
  'crea': [{ index: 8, weight: 1.0 }],
  'créa': [{ index: 8, weight: 1.0 }],
  'design': [{ index: 8, weight: 1.0 }],
  'charte': [{ index: 8, weight: 0.9 }],
  'visuel': [{ index: 8, weight: 0.9 }],
  'studio': [{ index: 8, weight: 0.8 }],

  // strategy / scaling
  'strategie': [{ index: 9, weight: 1.0 }],
  'stratégie': [{ index: 9, weight: 1.0 }],
  'scale': [{ index: 9, weight: 0.9 }],
  'scaling': [{ index: 9, weight: 0.9 }],
  'optimisation': [{ index: 9, weight: 0.6 }],
  'growth': [{ index: 9, weight: 0.8 }],

  // retention
  'retention': [{ index: 10, weight: 1.0 }],
  'rétention': [{ index: 10, weight: 1.0 }],
  'reachat': [{ index: 10, weight: 0.9 }],
  'réachat': [{ index: 10, weight: 0.9 }],
  'ltv': [{ index: 10, weight: 1.0 }],
  'fidelisation': [{ index: 10, weight: 0.8 }],
  'fidélisation': [{ index: 10, weight: 0.8 }],

  // finance & margins
  'budget': [{ index: 11, weight: 0.8 }],
  'finance': [{ index: 11, weight: 1.0 }],
  'marge': [{ index: 11, weight: 0.9 }],
  'cout': [{ index: 11, weight: 0.8 }],
  'coût': [{ index: 11, weight: 0.8 }],
  'ca': [{ index: 11, weight: 0.8 }],
  'depenses': [{ index: 11, weight: 0.8 }],
  'dépenses': [{ index: 11, weight: 0.8 }]
};

// Generates a 12-dimensional vector embedding normalized to unit length
export function getVectorEmbedding(text: string, tags: string[] = []): Embedding {
  const vector = new Array(16).fill(0); // Vector of size 12 (using 16 to be safe/future-proof, mapped dimensions are 0-11)
  const cleanText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const tokens = cleanText.split(/[^a-z0-9]+/g).filter(t => t.length > 1);

  // 1. Process body words
  tokens.forEach((token) => {
    const mappings = VOCABULARY[token];
    if (mappings) {
      mappings.forEach(({ index, weight }) => {
        vector[index] += weight;
      });
    }
  });

  // 2. Heavy weight for explicit tags
  tags.forEach((tag) => {
    const cleanTag = tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const mappings = VOCABULARY[cleanTag];
    if (mappings) {
      mappings.forEach(({ index, weight }) => {
        vector[index] += weight * 3.0; // Tags carry 3x weight
      });
    } else {
      // General fallbacks
      if (cleanTag.includes('ads') || cleanTag.includes('campagne')) vector[0] += 2.0;
      if (cleanTag.includes('seo') || cleanTag.includes('content')) vector[2] += 2.0;
      if (cleanTag.includes('email') || cleanTag.includes('klaviyo')) vector[3] += 2.0;
      if (cleanTag.includes('ugc') || cleanTag.includes('video')) vector[4] += 2.0;
      if (cleanTag.includes('reporting') || cleanTag.includes('data')) vector[5] += 2.0;
    }
  });

  // Crop to 12 dimensions
  const finalVector = vector.slice(0, 12);

  // 3. Normalize the vector to unit length (L2 Normalization)
  const sumSquares = finalVector.reduce((sum, val) => sum + val * val, 0);
  const magnitude = Math.sqrt(sumSquares);

  if (magnitude === 0) {
    // Return a default base vector if nothing matched
    const fallback = new Array(12).fill(0);
    fallback[9] = 1.0; // Strategy dimension fallback
    return fallback;
  }

  return finalVector.map((val) => val / magnitude);
}

// Calculates Cosine Similarity between two unit vectors (which is just the Dot Product)
export function cosineSimilarity(vecA: Embedding, vecB: Embedding): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  
  return Math.max(0, Math.min(1, dotProduct)); // Clamp between 0 and 1
}

import { RecipeForCS } from "@/interfaces/recipe";

export function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
}

export function buildVocabulary(docs: string[][]): string[] {
  const vocab = new Set<string>();
  docs.forEach(doc => doc.forEach(word => vocab.add(word)));
  return Array.from(vocab);
}

export function tf(word: string, doc: string[]): number {
  const count = doc.filter(w => w === word).length;
  return count / doc.length;
}

export function idf(word: string, allDocs: string[][]): number {
  const count = allDocs.filter(doc => doc.includes(word)).length;
  return Math.log((allDocs.length + 1) / (1 + count));
}

export function calcTfIdfVector(doc: string[], allDocs: string[][], vocab: string[]): number[] {
  return vocab.map(word => tf(word, doc) * idf(word, allDocs));
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}


export function recommendRecipes(
  target: RecipeForCS,
  allRecipes: RecipeForCS[],
  topN = 10
): RecipeForCS[] {
  const docs = allRecipes.map(r =>
    tokenize(
      `${r.nume} ${r.descriere} ${r.tip} ${r.pasi_preparare} ${r.ingrediente.join(' ')}`
    )
  );

  // 2. Construim vocabularul
  const vocab = buildVocabulary(docs);

  // 3. Calculăm vectorii TF-IDF pentru toate rețetele
  const tfidfVectors = docs.map(doc => calcTfIdfVector(doc, docs, vocab));

  // 4. Procesăm rețeta țintă
  const targetDoc = tokenize(
    `${target.nume} ${target.descriere} ${target.tip} ${target.pasi_preparare} ${target.ingrediente}`
  );
  const targetVector = calcTfIdfVector(targetDoc, docs, vocab);

  // 5. Calculăm similaritatea
  return allRecipes
    .map((r, i) => ({
      recipe: r,
      score: cosineSimilarity(targetVector, tfidfVectors[i]),
    }))
    .filter(item => item.recipe.id !== target.id)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(item => item.recipe);
}
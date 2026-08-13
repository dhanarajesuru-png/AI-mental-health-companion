/**
 * Advanced Semantic Retrieval-Augmented Generation (RAG) Engine
 * Uses a TF-IDF Vector Space Model with Cosine Similarity Scoring
 * over vetted evidence-based clinical workbooks.
 */

import { CLINICAL_KNOWLEDGE_BASE } from '../data/clinicalKnowledge.js';

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "about", "above", "after", "again", "against", "all",
  "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before",
  "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each",
  "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't",
  "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in",
  "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most",
  "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
  "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't",
  "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than",
  "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
  "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd",
  "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
  "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
  "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves"
]);

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 2 && !STOP_WORDS.has(term));
}

export class RAGEngine {
  static corpus = null;
  static idfMap = null;
  static docVectors = null;

  /**
   * Build TF-IDF corpus index from clinical knowledge base
   */
  static initializeIndex() {
    if (this.corpus) return;

    const docs = CLINICAL_KNOWLEDGE_BASE.map(doc => ({
      ...doc,
      fullText: `${doc.title} ${doc.category} ${doc.content} ${(doc.tags || []).join(' ')}`,
      tokens: tokenize(`${doc.title} ${doc.category} ${doc.content} ${(doc.tags || []).join(' ')}`)
    }));

    const numDocs = docs.length;
    const dfMap = {};

    docs.forEach(doc => {
      const uniqueTokens = new Set(doc.tokens);
      uniqueTokens.forEach(token => {
        dfMap[token] = (dfMap[token] || 0) + 1;
      });
    });

    const idfMap = {};
    Object.keys(dfMap).forEach(token => {
      idfMap[token] = Math.log((numDocs + 1) / (dfMap[token] + 1)) + 1.0;
    });

    const docVectors = docs.map(doc => {
      const tfMap = {};
      doc.tokens.forEach(token => {
        tfMap[token] = (tfMap[token] || 0) + 1;
      });

      const vector = {};
      let normSq = 0;
      Object.keys(tfMap).forEach(token => {
        const tf = 1 + Math.log(tfMap[token]);
        const idf = idfMap[token] || 1.0;
        const tfidf = tf * idf;
        vector[token] = tfidf;
        normSq += tfidf * tfidf;
      });

      return {
        ...doc,
        vector,
        norm: Math.sqrt(normSq) || 1.0
      };
    });

    this.corpus = docs;
    this.idfMap = idfMap;
    this.docVectors = docVectors;
  }

  /**
   * Perform TF-IDF Cosine Similarity Search over clinical knowledge
   * @param {string} query 
   * @param {number} maxResults 
   * @returns {Array} Top-k relevant clinical documents with similarity scores and citations
   */
  static search(query, maxResults = 2) {
    if (!query || typeof query !== 'string') return [];

    this.initializeIndex();

    const queryTokens = tokenize(query);
    if (!queryTokens.length) return [];

    const queryTfMap = {};
    queryTokens.forEach(token => {
      queryTfMap[token] = (queryTfMap[token] || 0) + 1;
    });

    const queryVector = {};
    let queryNormSq = 0;
    Object.keys(queryTfMap).forEach(token => {
      const tf = 1 + Math.log(queryTfMap[token]);
      const idf = this.idfMap[token] || Math.log(this.corpus.length + 1);
      const tfidf = tf * idf;
      queryVector[token] = tfidf;
      queryNormSq += tfidf * tfidf;
    });

    const queryNorm = Math.sqrt(queryNormSq) || 1.0;

    const scoredDocs = this.docVectors.map(doc => {
      let dotProduct = 0;
      Object.keys(queryVector).forEach(token => {
        if (doc.vector[token]) {
          dotProduct += queryVector[token] * doc.vector[token];
        }
      });

      let cosineSim = dotProduct / (queryNorm * doc.norm);

      // Boost score if explicit tag match exists
      const hasTagMatch = doc.tags.some(tag => queryTokens.includes(tag.toLowerCase()));
      if (hasTagMatch) cosineSim += 0.2;

      // Boost score if title match exists
      const hasTitleMatch = queryTokens.some(token => doc.title.toLowerCase().includes(token));
      if (hasTitleMatch) cosineSim += 0.15;

      return {
        id: doc.id,
        category: doc.category,
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        relevanceScore: parseFloat(cosineSim.toFixed(4)),
        citation: `[Ref: ${doc.id.toUpperCase()} - ${doc.title}]`
      };
    });

    return scoredDocs
      .filter(item => item.relevanceScore > 0.05)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }
}


// Text similarity and AI-based essay grading utilities

interface EssayGradingResult {
  score: number; // 0-100
  percentage: number; // 0-100
  keywordsFound: string[];
  keywordsMissing: string[];
  similarityScore: number; // 0-1
  feedback: string;
  wordCount: number;
  passed: boolean;
}

// Simple text preprocessing
function preprocessText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .trim();
}

// Extract words from text
function getWords(text: string): string[] {
  return preprocessText(text).split(' ').filter(word => word.length > 2);
}

// Calculate Jaccard similarity (simple but effective)
function calculateJaccardSimilarity(text1: string, text2: string): number {
  const words1 = new Set(getWords(text1));
  const words2 = new Set(getWords(text2));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Calculate cosine similarity using word frequency
function calculateCosineSimilarity(text1: string, text2: string): number {
  const words1 = getWords(text1);
  const words2 = getWords(text2);
  
  // Create word frequency maps
  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  
  words1.forEach(word => freq1[word] = (freq1[word] || 0) + 1);
  words2.forEach(word => freq2[word] = (freq2[word] || 0) + 1);
  
  // Get unique words
  const allWords = new Set([...words1, ...words2]);
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (const word of allWords) {
    const f1 = freq1[word] || 0;
    const f2 = freq2[word] || 0;
    
    dotProduct += f1 * f2;
    magnitude1 += f1 * f1;
    magnitude2 += f2 * f2;
  }
  
  const magnitude = Math.sqrt(magnitude1) * Math.sqrt(magnitude2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Check keyword presence
function checkKeywords(studentText: string, keywords: string[]): {
  found: string[];
  missing: string[];
  score: number;
} {
  const processedText = preprocessText(studentText);
  const found: string[] = [];
  const missing: string[] = [];
  
  keywords.forEach(keyword => {
    const processedKeyword = preprocessText(keyword);
    if (processedText.includes(processedKeyword)) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const score = keywords.length > 0 ? found.length / keywords.length : 1;
  return { found, missing, score };
}

// Generate feedback based on analysis
function generateFeedback(
  similarity: number, 
  keywordCheck: { found: string[]; missing: string[]; score: number },
  wordCount: number,
  minWords?: number,
  maxWords?: number
): string {
  const feedback: string[] = [];
  
  // Similarity feedback
  if (similarity >= 0.8) {
    feedback.push("✅ Excellent content similarity with the key answer.");
  } else if (similarity >= 0.6) {
    feedback.push("✅ Good content similarity with the key answer.");
  } else if (similarity >= 0.4) {
    feedback.push("⚠️ Moderate content similarity. Consider adding more relevant details.");
  } else {
    feedback.push("❌ Low content similarity. Please review the key concepts.");
  }
  
  // Keyword feedback
  if (keywordCheck.score >= 0.8) {
    feedback.push("✅ Most important keywords are present.");
  } else if (keywordCheck.score >= 0.5) {
    feedback.push("⚠️ Some important keywords are missing.");
  } else {
    feedback.push("❌ Many important keywords are missing.");
  }
  
  if (keywordCheck.missing.length > 0) {
    feedback.push(`Missing keywords: ${keywordCheck.missing.join(', ')}`);
  }
  
  // Word count feedback
  if (minWords && wordCount < minWords) {
    feedback.push(`❌ Answer too short. Minimum ${minWords} words required, you wrote ${wordCount}.`);
  } else if (maxWords && wordCount > maxWords) {
    feedback.push(`⚠️ Answer too long. Maximum ${maxWords} words allowed, you wrote ${wordCount}.`);
  } else if (minWords && wordCount >= minWords) {
    feedback.push(`✅ Good length (${wordCount} words).`);
  }
  
  return feedback.join(' ');
}

// Main essay grading function
export function gradeEssay(
  studentAnswer: string,
  keyAnswer: string,
  keywords: string[] = [],
  minWords?: number,
  maxWords?: number,
  passingThreshold: number = 60,
  gradingType: 'keyword' | 'similarity' | 'ai' = 'similarity'
): EssayGradingResult {
  const wordCount = getWords(studentAnswer).length;
  
  // Check keywords
  const keywordCheck = checkKeywords(studentAnswer, keywords);
  
  // Calculate similarity
  const jaccardSim = calculateJaccardSimilarity(studentAnswer, keyAnswer);
  const cosineSim = calculateCosineSimilarity(studentAnswer, keyAnswer);
  
  // Use average of both similarity methods
  const similarityScore = (jaccardSim + cosineSim) / 2;
  
  // Calculate final score based on grading type
  let finalScore = 0;
  
  switch (gradingType) {
    case 'keyword':
      finalScore = keywordCheck.score * 100;
      break;
    case 'similarity':
      finalScore = similarityScore * 100;
      break;
    case 'ai':
      // Weighted combination: 60% similarity + 40% keywords
      finalScore = (similarityScore * 0.6 + keywordCheck.score * 0.4) * 100;
      break;
  }
  
  // Adjust score based on word count requirements
  if (minWords && wordCount < minWords) {
    finalScore *= 0.7; // Penalty for too short
  }
  if (maxWords && wordCount > maxWords) {
    finalScore *= 0.9; // Small penalty for too long
  }
  
  // Cap at 100
  finalScore = Math.min(100, Math.max(0, finalScore));
  
  const feedback = generateFeedback(
    similarityScore, 
    keywordCheck, 
    wordCount, 
    minWords, 
    maxWords
  );
  
  return {
    score: Math.round(finalScore),
    percentage: Math.round(finalScore),
    keywordsFound: keywordCheck.found,
    keywordsMissing: keywordCheck.missing,
    similarityScore,
    feedback,
    wordCount,
    passed: finalScore >= passingThreshold
  };
}

// Function to extract keywords from key answer automatically
export function extractKeywords(text: string, count: number = 10): string[] {
  const words = getWords(text);
  const frequency: Record<string, number> = {};
  
  // Count word frequency
  words.forEach(word => {
    if (word.length > 3) { // Only words longer than 3 chars
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}

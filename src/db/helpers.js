/** Stable document key from topic name (450-DSA style) */
export function topicKey(topicName) {
  return topicName.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
}

export function countDoneQuestions(questions) {
  return questions.filter((q) => q.status === 'done' || q.status === 'revise').length;
}

export function isTopicStarted(questions) {
  return questions.some(
    (q) => q.status !== 'pending' || q.review || Boolean(q.notes?.trim())
  );
}

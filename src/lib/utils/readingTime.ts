export function getWordCount(text: string): number {
  if (!text) return 0;
  const withoutHtml = text.replace(/<[^>]*>/g, ' ');
  const withoutMarkdown = withoutHtml
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/>\s/g, '')
    .replace(/[-*+]\s/g, '')
    .replace(/\d+\.\s/g, '');
  const chineseChars = (withoutMarkdown.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (withoutMarkdown.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
}

export function getReadingTime(wordCount: number): number {
  if (wordCount === 0) return 1;
  return Math.max(1, Math.ceil(wordCount / 250));
}

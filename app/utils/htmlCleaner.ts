/**
 * Utility function to clean HTML tags and entities from content
 */

export function cleanHtmlContent(content: any): string {
  if (content === null || content === undefined) return '';
  
  let text = '';
  
  if (typeof content === 'string') {
    text = content;
  } else if (typeof content === 'object' && content !== null) {
    // Handle Django RichTextField structure: { format: 'html', content: '...' }
    text = String(content.content || content.html || content.raw || '');
  } else {
    text = String(content);
  }
  
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    // Clean up extra whitespace
    .trim();
}

/**
 * Utility to ensure all properties of an object are cleaned strings.
 * Primary use: Pre-processing CMS data for safe rendering.
 */
export function cleanContentObject<T extends Record<string, any>>(content: T): any {
  if (!content || typeof content !== 'object') return content;
  
  const cleaned: any = Array.isArray(content) ? [] : {};
  
  for (const [key, value] of Object.entries(content)) {
    if (value === null || value === undefined) {
      cleaned[key] = '';
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // If it's a structural CMS object {format, content}, extract content
      if (value.content !== undefined || value.html !== undefined) {
        cleaned[key] = cleanHtmlContent(value);
      } else {
        // Recurse for nested objects
        cleaned[key] = cleanContentObject(value);
      }
    } else if (Array.isArray(value)) {
      cleaned[key] = value.map(item => 
        typeof item === 'object' ? cleanContentObject(item) : cleanHtmlContent(item)
      );
    } else {
      cleaned[key] = cleanHtmlContent(value);
    }
  }
  
  return cleaned;
}
/**
 * Utility functions for handling RichTextField content from Django backend
 */

export function getRichTextContent(data: any): string {
  if (data === null || data === undefined) return '';

  let content = '';

  // Handle different data types from CMS
  if (typeof data === 'string') {
    content = data;
  } else if (typeof data === 'object') {
    // Attempt to extract content from common rich text object structures
    content = data.content || data.html || data.raw || '';
    if (typeof content !== 'string') {
      content = String(content || '');
    }
  } else {
    content = String(data);
  }

  if (!content) return '';

  // Decode HTML entities to render proper text
  if (content.includes('&')) {
    content = content
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '…')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™');
  }

  // Remove HTML tags for plain text display
  content = content.replace(/<[^>]*>/g, '');

  return content;
}

export function getRichTextHTML(data: any): { __html: string } {
  if (data === null || data === undefined) return { __html: '' };

  let content = '';

  // Handle different data types from CMS
  if (typeof data === 'string') {
    content = data;
  } else if (typeof data === 'object') {
    // Attempt to extract content from common rich text object structures
    content = data.content || data.html || data.raw || '';
    if (typeof content !== 'string') {
      content = String(content || '');
    }
  } else {
    content = String(data);
  }

  // Decode HTML entities to render proper HTML
  if (content && content.includes('&')) {
    content = content
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '…')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™');
  }

  return { __html: content };
}
import { NextResponse } from 'next/server';
// Импортируем cheerio
import * as cheerio from 'cheerio';

// Proxy URLs to bypass CORS if direct fetching fails
const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors.bridged.cc/'
];

// Селекторы для определения контента статьи
const contentSelectors = [
  // Типичные селекторы для статей и контента
  'article', '[role="article"]', '.article', '.post', '.content', '.post-content', 
  'main', '#content', '#main', '.main-content',
  '.entry-content', '.story', '.story-body',
  '.article-body', '.article-content', '.post-body',
  '.node__content', '.page-content'
];

// Интерфейс для изображения
interface ImageData {
  src: string;
  alt: string;
  position: number; // Позиция в тексте
}

// Content block types for better structure
type BlockType = 'title' | 'subtitle' | 'heading' | 'paragraph' | 'figure' | 'metadata';

interface ContentBlock {
  type: BlockType;
  content: string;
  level?: number; // For headings
}

// Function to extract paragraphs preserving original structure
function extractParagraphs($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>, baseUrl: string): { content: string, images: ImageData[] } {
  let content = '';
  let contentPositionCounter = 0;
  const images: ImageData[] = [];
  
  // Process children elements to preserve structure
  element.children().each((_, child) => {
    const $child = $(child);
    const tagName = child.tagName?.toLowerCase();
    
    // Skip empty nodes and non-content elements
    if (!tagName || ['script', 'style', 'iframe', 'form'].includes(tagName)) {
      return;
    }
    
    // Handle different elements
    if (tagName === 'p') {
      // Direct paragraph
      const text = $child.text().trim();
      if (text) {
        content += text + '\n\n';
        contentPositionCounter += text.length + 2;
        
        // Check for images inside this paragraph
        $child.find('img').each((_, img) => {
          processImage($, $(img), images, contentPositionCounter, baseUrl);
        });
      }
    } else if (tagName === 'br') {
      // Line break
      content += '\n';
      contentPositionCounter += 1;
    } else if (tagName === 'blockquote') {
      // Quote
      const quoteText = $child.text().trim();
      if (quoteText) {
        content += '> ' + quoteText + '\n\n';
        contentPositionCounter += quoteText.length + 4;
      }
    } else if (tagName.match(/^h[1-6]$/)) {
      // Heading
      const headingText = $child.text().trim();
      if (headingText) {
        const level = parseInt(tagName.substring(1), 10);
        const prefix = '#'.repeat(level) + ' ';
        content += '\n' + prefix + headingText + '\n\n';
        contentPositionCounter += headingText.length + level + 3;
      }
    } else if (tagName === 'div' || tagName === 'section' || tagName === 'article') {
      // Container elements - process their children recursively
      // But first check if this div contains only text and no other block elements
      const hasBlockChildren = $child.children('p, div, h1, h2, h3, h4, h5, h6, blockquote, ul, ol').length > 0;
      
      if (!hasBlockChildren) {
        const text = $child.text().trim();
        if (text) {
          content += text + '\n\n';
          contentPositionCounter += text.length + 2;
        }
      } else {
        // Process each child element
        $child.children().each((_, grandchild) => {
          const $grandchild = $(grandchild);
          const grandchildTag = grandchild.tagName?.toLowerCase();
          
          if (grandchildTag === 'p') {
            const paragraphText = $grandchild.text().trim();
            if (paragraphText) {
              content += paragraphText + '\n\n';
              contentPositionCounter += paragraphText.length + 2;
            }
          } else if (grandchildTag && grandchildTag.match(/^h[1-6]$/)) {
            const headingText = $grandchild.text().trim();
            if (headingText) {
              const level = parseInt(grandchildTag.substring(1), 10);
              const prefix = '#'.repeat(level) + ' ';
              content += '\n' + prefix + headingText + '\n\n';
              contentPositionCounter += headingText.length + level + 3;
            }
          } else if (grandchildTag === 'blockquote') {
            const quoteText = $grandchild.text().trim();
            if (quoteText) {
              content += '> ' + quoteText + '\n\n';
              contentPositionCounter += quoteText.length + 4;
            }
          } else if (grandchildTag === 'img') {
            // Process images within containers
            processImage($, $grandchild, images, contentPositionCounter, baseUrl);
          } else if (grandchildTag === 'ul' || grandchildTag === 'ol') {
            // Process lists
            $grandchild.find('li').each((idx, li) => {
              const listItemText = $(li).text().trim();
              if (listItemText) {
                content += (grandchildTag === 'ul' ? '• ' : `${idx + 1}. `) + listItemText + '\n';
                contentPositionCounter += listItemText.length + 3; // +3 for bullet/number and spacing
              }
            });
            content += '\n'; // Extra space after list
            contentPositionCounter += 1;
          } else if ($grandchild.text().trim()) {
            // Handle other elements with text
            content += $grandchild.text().trim() + '\n\n';
            contentPositionCounter += $grandchild.text().trim().length + 2;
          }
        });
      }
    } else if (tagName === 'ul' || tagName === 'ol') {
      // Lists
      $child.find('li').each((idx, li) => {
        const listItemText = $(li).text().trim();
        if (listItemText) {
          content += (tagName === 'ul' ? '• ' : `${idx + 1}. `) + listItemText + '\n';
          contentPositionCounter += listItemText.length + 3;
        }
      });
      content += '\n'; // Extra space after list
      contentPositionCounter += 1;
    } else if (tagName === 'img') {
      // Handle images
      processImage($, $child, images, contentPositionCounter, baseUrl);
    } else {
      // For any other elements, just get the text if it's not empty
      const text = $child.text().trim();
      if (text) {
        content += text + '\n\n';
        contentPositionCounter += text.length + 2;
      }
    }
  });
  
  return { content, images };
}

// Function to clean and format content
function cleanContent(content: string): string {
  return content
    .replace(/\s{2,}/g, ' ')      // Replace multiple spaces with one
    .replace(/\n{3,}/g, '\n\n')   // Limit consecutive newlines
    .trim()
    .replace(/^\s+|\s+$/g, '')    // Remove empty lines at start/end
    .replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2'); // Add paragraph breaks after sentences
}

// Function to extract paragraphs preserving original structure as HTML
function extractParagraphsAsHtml($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>, baseUrl: string): { content: string, images: ImageData[] } {
  let content = '';
  const images: ImageData[] = [];
  let contentPositionCounter = 0;
  
  // First, check if we have proper paragraph structure
  const paragraphs = element.find('p');
  if (paragraphs.length > 0) {
    // Process each paragraph and heading as separate HTML block
    element.find('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol').each((_, elem) => {
      const $elem = $(elem);
      const tagName = elem.tagName.toLowerCase();
      
      // Skip empty elements
      if (!$elem.text().trim()) {
        return;
      }
      
      // Process images in this element
      $elem.find('img').each((_, img) => {
        processImage($, $(img), images, contentPositionCounter, baseUrl);
      });
      
      // Clone the element to work with
      const $clone = $elem.clone();
      
      // Replace any image tags with placeholders
      $clone.find('img').each((idx, img) => {
        const $img = $(img);
        const alt = $img.attr('alt') || 'Image';
        $(img).replaceWith(`[Image: ${alt}]`);
      });
      
      // Get the HTML content of this element
      let elemHtml = '';
      
      if (tagName.match(/^h[1-6]$/)) {
        // Preserve headings with <h> tags
        elemHtml = $.html($clone);
        contentPositionCounter += elemHtml.length;
      } else if (tagName === 'blockquote') {
        // Preserve blockquote tags
        elemHtml = $.html($clone);
        contentPositionCounter += elemHtml.length;
      } else if (tagName === 'p') {
        // Preserve paragraph tags
        elemHtml = $.html($clone);
        contentPositionCounter += elemHtml.length;
      } else if (tagName === 'ul' || tagName === 'ol') {
        // Preserve list tags
        elemHtml = $.html($clone);
        contentPositionCounter += elemHtml.length;
      } else {
        // Other elements
        elemHtml = $.html($clone);
        contentPositionCounter += elemHtml.length;
      }
      
      content += elemHtml;
    });
  } else {
    // No proper paragraph structure found, let's create it
    // Get the main content
    let rawText = element.text().trim();
    
    // First, try to find any div with substantial text
    const textDivs = element.find('div').filter(function() {
      return $(this).text().trim().length > 100;
    });
    
    if (textDivs.length > 0) {
      // Extract text from divs and wrap in paragraphs
      textDivs.each((_, div) => {
        const divText = $(div).text().trim();
        if (divText) {
          // Split text by double line breaks
          const paragraphs = divText.split(/\n\s*\n|\r\n\s*\r\n|\r\s*\r/);
          paragraphs.forEach(para => {
            const trimmedPara = para.trim();
            if (trimmedPara) {
              content += `<p>${trimmedPara}</p>`;
              contentPositionCounter += trimmedPara.length + 7; // +7 for <p></p> tags
            }
          });
        }
      });
    } else {
      // Split text by double line breaks or sentences
      let paragraphs = rawText.split(/\n\s*\n|\r\n\s*\r\n|\r\s*\r/);
      
      // If we don't have multiple paragraphs, try to split by sentences
      if (paragraphs.length <= 1) {
        paragraphs = rawText.split(/(?<=[.!?])\s+(?=[A-Z])/);
      }
      
      paragraphs.forEach(para => {
        const trimmedPara = para.trim();
        if (trimmedPara) {
          content += `<p>${trimmedPara}</p>`;
          contentPositionCounter += trimmedPara.length + 7; // +7 for <p></p> tags
        }
      });
    }
  }
  
  // Process any standalone images
  element.find('> img, > figure').each((_, elem) => {
    const $elem = $(elem);
    if (elem.tagName.toLowerCase() === 'img') {
      processImage($, $elem, images, contentPositionCounter, baseUrl);
      
      // Add image placeholder
      const alt = $elem.attr('alt') || 'Image';
      content += `<figure><img src="${$elem.attr('src') || ''}" alt="${alt}" /><figcaption>${alt}</figcaption></figure>`;
      contentPositionCounter += 50; // Approximate length
    } else {
      // Process figure element
      const img = $elem.find('img');
      if (img.length) {
        processImage($, img, images, contentPositionCounter, baseUrl);
        
        // Add figure with caption if available
        const figcaption = $elem.find('figcaption');
        content += $.html($elem);
        contentPositionCounter += $.html($elem).length;
      }
    }
  });
  
  // If we didn't find any structured content, get div content
  if (!content.trim()) {
    element.find('div').each((_, div) => {
      const $div = $(div);
      // Only process divs that don't have p, h elements as direct children
      if ($div.find('> p, > h1, > h2, > h3, > h4, > h5, > h6').length === 0) {
        const text = $div.text().trim();
        if (text && text.length > 100) {
          // Split text by double line breaks or sentences
          const paragraphs = text.split(/\n\s*\n|\r\n\s*\r\n|\r\s*\r/);
          paragraphs.forEach(para => {
            const trimmedPara = para.trim();
            if (trimmedPara) {
              content += `<p>${trimmedPara}</p>`;
              contentPositionCounter += trimmedPara.length + 7; // +7 for <p></p> tags
            }
          });
        }
      }
    });
  }
  
  return { content, images };
}

// POST request handler
export async function POST(request: Request) {
  try {
    // Get article URL from request
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Try to fetch HTML content with fallbacks
    let html = await fetchWithFallbacks(url);
    
    // Parse HTML with cheerio
    const $ = cheerio.load(html);

    // Base URL for relative links
    const baseUrl = new URL(url).origin;

    // Remove unnecessary elements from the page
    $('script, style, svg, iframe, .ads, .ad-container, .advertisement, .social-buttons, .share-buttons, .related-articles, .recommended, nav, footer, header > nav, aside, .sidebar').remove();

    // Extract title
    let title = $('h1').first().text().trim();
    if (!title) {
      title = $('title').text().trim();
    }
    
    // Array to store image information
    let images: ImageData[] = [];
    let content = '';
    
    // Extract article content
    let contentElement = findMainContentElement($);
    
    if (contentElement) {
      // Extract structured content with paragraphs and images as HTML
      const result = extractParagraphsAsHtml($, contentElement, baseUrl);
      content = result.content;
      images = result.images;
      
      // If the content extraction didn't yield much, try with the original function
      if (content.trim().length < 200) {
        // Try to find the article body with a different approach
        const possibleArticle = $('article, [role="article"], .article-body, .post-content').first();
        if (possibleArticle.length) {
          const result = extractParagraphsAsHtml($, possibleArticle, baseUrl);
          content = result.content;
          
          // Add images from second extraction
          result.images.forEach(img => {
            if (!images.some(existing => existing.src === img.src)) {
              images.push(img);
            }
          });
        }
      }
    }
    
    // Fallback to body if no content found
    if (!content.trim()) {
      $('body').find('script, style, nav, header, footer, .comments, .sidebar, aside, .ad, .ads, .advertisement, .sharing, .related').remove();
      
      // Try extracting paragraphs from body
      const bodyResult = extractParagraphsAsHtml($, $('body'), baseUrl);
      content = bodyResult.content;
      
      // Add images from body extraction
      bodyResult.images.forEach(img => {
        if (!images.some(existing => existing.src === img.src)) {
          images.push(img);
        }
      });
      
      // If still no content, get all body text in a paragraph
      if (!content.trim()) {
        const bodyText = $('body').text().trim();
        
        // Split text by double line breaks or sentences
        const paragraphs = bodyText.split(/\n\s*\n|\r\n\s*\r\n|\r\s*\r/);
        
        // If we have paragraphs, add them
        if (paragraphs.length > 1) {
          paragraphs.forEach(para => {
            const trimmedPara = para.trim();
            if (trimmedPara) {
              content += `<p>${trimmedPara}</p>`;
            }
          });
        } else {
          // Try to split by sentences for better readability
          const sentences = bodyText.split(/(?<=[.!?])\s+(?=[A-Z])/);
          if (sentences.length > 1) {
            // Group sentences into paragraphs of 2-3 sentences
            for (let i = 0; i < sentences.length; i += 2) {
              const paraText = sentences.slice(i, i + 2).join(' ');
              if (paraText.trim()) {
                content += `<p>${paraText.trim()}</p>`;
              }
            }
          } else {
            // Just wrap everything in a paragraph
            content = `<p>${bodyText}</p>`;
          }
        }
        
        // Find all images in body
        $('body').find('img').each((_, imgElem) => {
          processImage($, $(imgElem), images, 0, baseUrl);
        });
      }
    }
    
    // Don't use cleanContent for HTML content
    // Instead, make sure we don't have completely empty paragraphs
    content = content.replace(/<p>\s*<\/p>/g, '');
    
    // If still no images, try one last broader search
    if (images.length === 0) {
      $('img').each((_, elem) => {
        const $img = $(elem);
        // Check for width and height attributes
        const width = $img.attr('width') || $img.attr('data-width');
        const height = $img.attr('height') || $img.attr('data-height');
        
        // Only include larger images likely to be content
        if ((width && parseInt(width) > 300) || (height && parseInt(height) > 200)) {
          // Make sure image is not in header/footer/sidebar
          if (!$img.closest('header, footer, aside, .sidebar, nav').length) {
            processImage($, $img, images, 0, baseUrl);
          }
        }
      });
    }
    
    return NextResponse.json({
      title,
      content,
      images,
      source: url
    });
    
  } catch (error) {
    console.error('Article parser error:', error);
    return NextResponse.json(
      { error: 'Failed to parse article' },
      { status: 500 }
    );
  }
}

// Function to find the main content element
function findMainContentElement($: cheerio.CheerioAPI): cheerio.Cheerio<cheerio.Element> | null {
  let contentElement: cheerio.Cheerio<cheerio.Element> | null = null;
  
  // Try common content selectors
  for (const selector of contentSelectors) {
    const elements = $(selector);
    if (elements.length) {
      for (let i = 0; i < elements.length; i++) {
        const element = elements.eq(i);
        
        // Remove non-content elements
        element.find('script, style, nav, header, footer, .comments, .sidebar, aside, .ad, .ads, .advertisement, .sharing, .related, form, .newsletter').remove();
        
        // Get text
        const text = element.text().trim();
        if (text && text.length > 300) { // Stricter requirement for text volume
          contentElement = element as cheerio.Cheerio<cheerio.Element>;
          break;
        }
      }
      
      if (contentElement) break;
    }
  }
  
  return contentElement;
}

// Function to fetch with fallback to proxies
async function fetchWithFallbacks(url: string): Promise<string> {
  // Try direct fetch first
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      }
    });
    
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    console.error('Direct fetch failed, trying proxies:', error);
  }
  
  // Try each proxy in order
  for (const proxy of PROXY_URLS) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error(`Proxy ${proxy} failed:`, error);
    }
  }
  
  throw new Error('Failed to fetch content through all available methods');
}

// Function to process image data
function processImage($: cheerio.CheerioAPI, $img: cheerio.Cheerio<cheerio.Element>, images: ImageData[], position: number, baseUrl: string) {
  let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src') || $img.attr('data-original');
  
  // Skip small images, icons, and non-content images
  if (src && 
      !src.includes('icon') && 
      !src.includes('logo') && 
      !src.includes('avatar') && 
      !src.includes('button') && 
      !src.includes('badge') &&
      !src.endsWith('.svg')) {
    
    // Check if image is in a non-content area
    if ($img.closest('header, footer, aside, .sidebar, nav, .menu, .navigation').length) {
      return; // Skip images in non-content areas
    }
    
    // Resolve relative URLs
    if (src.startsWith('//')) {
      src = 'https:' + src;
    } else if (src.startsWith('/')) {
      src = `${baseUrl}${src}`;
    } else if (!src.startsWith('http')) {
      src = `${baseUrl}/${src}`;
    }
    
    const alt = $img.attr('alt') || '';
    
    // Check width and height attributes
    const width = $img.attr('width') || $img.attr('data-width');
    const height = $img.attr('height') || $img.attr('data-height');
    
    // Filter small images if size info is available
    if (!width || !height || parseInt(width) > 100 || parseInt(height) > 100) {
      // Check for duplicates
      if (!images.some(img => img.src === src)) {
        images.push({ src, alt, position });
      }
    }
  }
} 
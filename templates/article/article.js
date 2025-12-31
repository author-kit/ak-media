import { getConfig, getMetadata, loadStyle } from '../../scripts/ak.js';

const { codeBase } = getConfig();

async function loadAuthor() {
}

function buildArticleHero() {
  const pic = document.querySelector('picture');
  const title = document.querySelector('h1');

  const bg = pic.cloneNode(true);
  bg.className = 'section-background strong-blur';

  const fg = document.createElement('div');
  fg.className = 'block-content article-hero-foreground';

  const fgMedia = document.createElement('div');
  fgMedia.className = 'article-hero-foreground-media';

  const overlay = document.createElement('div');
  overlay.className = 'article-hero-background-overlay';

  fgMedia.append(pic);

  const fgText = document.createElement('div');
  fgText.className = 'article-hero-foreground-text';

  const date = document.createElement('p');
  date.className = 'article-date';
  date.textContent = getMetadata('publication-date') || 'No publish date';

  const author = document.createElement('a');
  author.className = 'article-author';
  author.textContent = getMetadata('author') || 'Unknown author';
  author.href = '#';
  loadAuthor(author);

  fgText.append(date, title, author);

  fg.append(fgText, fgMedia);

  const section = document.createElement('section');
  section.className = 'article-hero';
  section.append(bg, overlay, fg);

  return section;
}

export default function init() {
  const hero = buildArticleHero();

  const main = document.querySelector('main');
  main.prepend(hero);
}

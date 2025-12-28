function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default function formatRss(details, items) {
  const itemsXml = items
    .map(
      (item) => `  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(item.link)}</link>
    <description>${escapeXml(item.description)}</description>
    <guid>${escapeXml(item.link)}</guid>
  </item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(details.title)}</title>
  <link>${escapeXml(details.link)}</link>
  <description>${escapeXml(details.description)}</description>
  <atom:link href="${escapeXml(details.feedUrl)}" rel="self" type="application/rss+xml" />
  ${itemsXml}
</channel>
</rss>`;
}

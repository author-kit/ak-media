import { getMetadata } from '../../scripts/ak.js';

const AVAILABLE_SERVICES = {
  bluesky: {
    title: 'Bluesky',
    href: 'https://bsky.app/intent/compose?text={{text}}',
  },
  facebook: {
    title: 'Facebook',
    href: 'https://www.facebook.com/sharer/sharer.php?u={{href}}',
  },
  linkedin: {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/sharing/share-offsite/?url={{href}}',
  },
  mastodon: {
    title: 'Mastodon',
    href: 'https://{{instance}}/share?text={{text}}',
  },
  pinterest: {
    title: 'Pinterest',
    href: 'https://pinterest.com/pin/create/button/?url={{href}}&description={{description}}',
  },
  reddit: {
    title: 'Reddit',
    href: 'https://reddit.com/submit?url={{href}}&title={{title}}',
  },
  x: {
    title: 'X',
    href: 'https://x.com/share?&url={{href}}',
  },
};

function getServices(names) {
  return names.map((name) => {
    const service = AVAILABLE_SERVICES[name];

    const { href } = window.location;
    const text = `${document.title} ${encodeURI(href)}`;
    const description = getMetadata('description');

    const a = document.createElement('a');
    a.textContent = service.title;
    a.href = service.href
      .replace('{{text}}', text)
      .replace('{{description}}', description)
      .replace('{{href}}', href);

    return a;
  });
}

export default function init(a) {
  const { searchParams } = new URL(a.href);
  const custom = searchParams.get('services');
  const names = custom
    ? custom.split(',')
    : Object.keys(AVAILABLE_SERVICES);

  const services = getServices(names);

  const div = document.createElement('div');
  div.className = 'social-share';
  div.append(...services);
  a.parentElement.replaceChild(div, a);
}

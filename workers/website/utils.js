const isRUMRequest = (url) => /\/\.(rum|optel)\/.*/.test(url.pathname);

export const isMediaRequest = (url) => /\/media_[0-9a-f]{40,}[/a-zA-Z0-9_-]*\.[0-9a-z]+$/.test(url.pathname);

export const getExtension = (path) => {
  const basename = path.split('/').pop();
  const pos = basename.lastIndexOf('.');
  return (basename === '' || pos < 1) ? '' : basename.slice(pos + 1);
};

export const getPortRedirect = (request, url) => {
  if (url.port && url.hostname !== 'localhost') {
    const redirectTo = new URL(request.url);
    redirectTo.port = '';
    return new Response(`Moved permanently to ${redirectTo.href}`, {
      status: 301,
      headers: { location: redirectTo.href },
    });
  }
  return null;
};

export const getRUMRequest = (request, url) => {
  if (!isRUMRequest(url)) return null;
  if (['GET', 'POST', 'OPTIONS'].includes(request.method)) return null;
  return new Response('Method Not Allowed', { status: 405 });
};

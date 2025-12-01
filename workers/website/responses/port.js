export default function getPortResponse({ url }) {
  if (url.port && url.hostname !== 'localhost') {
    const redirectTo = new URL(url);
    redirectTo.port = '';
    return new Response(`Moved permanently to ${redirectTo.href}`, {
      status: 301,
      headers: { location: redirectTo.href },
    });
  }
  return null;
}

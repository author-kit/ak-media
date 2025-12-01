export default function rumRoute({ req, url }) {
  const isRum = /\/\.(rum|optel)\/.*/.test(url.pathname);
  const rumAllowed = ['GET', 'POST', 'OPTIONS'].includes(req.method);

  if (isRum) {
    if (rumAllowed) return {};

    const response = new Response('Method not allowed', { status: 405 });
    return { response };
  }

  return null;
}

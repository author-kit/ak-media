export default function getResponse() {
  return new Response('Method Not Allowed', { status: 405 });
}

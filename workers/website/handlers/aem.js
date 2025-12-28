const getRedirect = (resp, savedSearch) => {
  if (!(resp.status === 301 && savedSearch)) return;
  const location = resp.headers.get('location');
  if (location && !location.match(/\?.*$/)) {
    resp.headers.set('location', `${location}${savedSearch}`);
  }
};

const formatSchedule = async (response) => {
  const schedule2Response = (json) => new Response(JSON.stringify(json), response);

  const json = await response.json();
  if (!json.data?.[0]?.fragment) return schedule2Response(json);

  const data = [];
  for (const [idx, schedule] of json.data.entries()) {
    const { start, end } = schedule;

    // Presumably the default fragment
    if (!start && !end) {
      data.push(json.data[idx]);
    } else {
      const now = Date.now();
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate < now && endDate > now) data.push(json.data[idx]);
    }
  }

  return schedule2Response({ ...json, data });
};

export const fetchFromAem = async ({ request, cache, savedSearch }) => {
  let resp = await fetch(request, { method: request.method, cf: { cacheEverything: cache } });

  // Recreate a mutable response
  resp = new Response(resp.body, resp);

  // Handle redirects
  const redirectResp = getRedirect(resp, savedSearch);
  if (redirectResp) return redirectResp;

  // 304 Not Modified - remove CSP header
  if (resp.status === 304) resp.headers.delete('Content-Security-Policy');

  resp.headers.delete('age');
  resp.headers.delete('x-robots-tag');

  return resp;
};

export async function fetchRssFeed({ request, cache, savedSearch }) {
  const detailsUrl = request.url.replace('.xml', '.json');
  const detailsReq = new Request(detailsUrl, request);
  const details = fetchFromAem({ request: detailsReq, cache, savedSearch });

  const listUrl = request.url.replace('rss.xml', 'query-index.json');
  const listReq = new Request(listUrl, request);
  const feed = fetchFromAem({ request: listReq, cache, savedSearch });

  await Promise.all([details, feed]);

  console.log(feed);

  return new Response('RSS Handled', { status: 200 });
}

export function fetchPodcastFeed() {
  return new Response('Podcast Handled', { status: 200 });
}

export async function fetchSchedule({ request, cache, savedSearch }) {
  const resp = await fetchFromAem({ request, cache, savedSearch });

  if (resp.status === 301) return resp;

  return formatSchedule(resp);
}

const schedule2Response = (json, response) => new Response(JSON.stringify(json), response);

const formatSchedule = async (pathname, response) => {
  const json = await response.json();
  if (!json.data?.[0]?.fragment) return schedule2Response(json, response);

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

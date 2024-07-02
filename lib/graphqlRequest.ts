export default async function graphqlRequest(query: {
  query: string;
}): Promise<{ data: any }> {
  const url = 'http://localhost:8000/graphql';
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(query),
  });

  const reJson = await res.json();
  return reJson;
}

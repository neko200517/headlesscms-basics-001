export default async function graphqlRequest(query: {
  query: string;
}): Promise<{ data: any }> {
  const url = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!;
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(query),
  });

  const reJson = await res.json();
  return reJson;
}

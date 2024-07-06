import { AppConfig } from '@/config/AppConfig';

type RequestHeader = {
  'Content-Type': string;
  Authorization?: string;
};

export default async function graphqlRequest(query: {
  query: string;
}): Promise<any> {
  const url = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!;
  let headers: RequestHeader = { 'Content-Type': 'application/json' };

  if (process.env.NEXT_PUBLIC_WP_AUTH_REFRESH_TOKEN) {
    headers = {
      ...headers,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_WP_AUTH_REFRESH_TOKEN}`,
    };
  }

  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(query),
    next: { revalidate: AppConfig.REVALIDATE_1MIN },
  });

  const reJson = await res.json();
  return reJson;
}

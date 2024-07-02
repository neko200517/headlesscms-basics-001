import graphqlRequest from './graphqlRequest';
import { SinglePage } from '@/types/page';

export async function getPageSlugs(): Promise<{ slug: string }[]> {
  const query = {
    query: `query getPageSlugs {
      pages {
        nodes {
          slug
        }
      }
    }
    `,
  };

  const resJson = await graphqlRequest(query);
  const allPageSlugs = resJson.data.pages.nodes;

  return allPageSlugs;
}

export async function getSinglePage(slug: string): Promise<SinglePage> {
  const query = {
    query: `query getPageSlugs {
      pages(where: {name: "${slug}"}) {
        nodes {
          content(format: RENDERED)
          date
          modified
          slug
          title(format: RENDERED)
        }
      }
    }
    `,
  };

  const resJson = await graphqlRequest(query);
  const singlePage = resJson.data.pages.nodes[0];

  return singlePage;
}

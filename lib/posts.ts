import { PostList, SinglePost } from '@/types/post';
import graphqlRequest from './graphqlRequest';
import { AppConfig } from '@/config/const';

export async function getPostList(
  endCursor: string | null = null,
  taxonomy: { key: string; value: string } | null = null
): Promise<PostList> {
  let condition = `
    after: "${endCursor}", first: 5,
    where: {orderby: {field: DATE, order: DESC}}
  `;

  if (taxonomy) {
    condition = `
      after: "${endCursor}", first: 5,
      where: {orderby: {field: DATE, order: DESC},
      ${taxonomy.key}: "${taxonomy.value}"}
    `;
  }

  const query = {
    query: `query getPostList {
      posts(${condition}) {
        nodes {
          date
          slug
          title
          excerpt(format: RENDERED)
          featuredImage {
            node {
              mediaDetails {
                file
                sizes {
                  sourceUrl
                  width
                  height
                }
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage      
        }
      }
    }
    `,
  };

  const resJson = await graphqlRequest(query);
  const postList = resJson.data.posts;

  return postList;
}

export async function getSinglePost(slug: string): Promise<SinglePost> {
  const query = {
    query: `query getSinglePost {
      post(id: "${slug}", idType: SLUG) {
        content(format: RENDERED)
        date
        excerpt(format: RENDERED)
        modified
        slug
        title(format: RENDERED)
        databaseId
        featuredImage {
          node {
            mediaDetails {
              sizes {
                sourceUrl
                width
                height
              }
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
    `,
  };

  const resJson = await graphqlRequest(query);
  const singlePost = resJson.data.post;

  return singlePost;
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  const condition = `first: ${AppConfig.MAX_PAGE_SLUGS}, after: "null"`;

  const query = {
    query: `query getPostSlugs {
      posts(${condition}) {
        nodes {
          slug
        }
      }
    }
    `,
  };

  const resJson = await graphqlRequest(query);
  const allPostSlugs = resJson.data.posts.nodes;

  return allPostSlugs;
}

export async function getCategorySlugs(): Promise<{ slug: string }[]> {
  const query = {
    query: `query getCategorySlugs {
      categories {
        nodes {
          slug
        }
      }
    }
    `,
  };

  const resJson = await graphqlRequest(query);
  const allCategorySlugs = resJson.data.categories.nodes;

  return allCategorySlugs;
}

export async function getCategoryDetail(categorySlug: string) {
  const query = {
    query: `query getCategoryDetail {
      category(id: "${categorySlug}", idType: SLUG) {
        count
        name
        slug
      }
    }`,
  };

  const resJson = await graphqlRequest(query);
  const categoryDetail = resJson.data.category;

  return categoryDetail;
}

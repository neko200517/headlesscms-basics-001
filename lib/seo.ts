import { SeoPost } from '@/types/seo';
import graphqlRequest from './graphqlRequest';

export async function getSeo(
  pageType: string = 'post',
  slug: string = '/'
): Promise<SeoPost> {
  const query = {
    query: `query getSeo {
      ${pageType}(id: "${slug}", idType: SLUG) {
        seo {
          title
          metaDesc
          schema {
            raw
          }
          opengraphTitle
          opengraphDescription
          opengraphUrl      
          opengraphImage {
            mediaItemUrl
          }
          opengraphType
          opengraphSiteName
        }
      }
    }`,
  };

  const seoJson = await graphqlRequest(query);
  const seoData = seoJson.data[pageType].seo;

  return seoData;
}

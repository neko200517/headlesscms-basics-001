export type SeoPost = {
  title: string;
  metaDesc: string;
  schema: {
    raw: string;
  };
  opengraphTitle: string;
  opengraphDescription: string;
  opengraphUrl: string;
  opengraphImage: {
    mediaItemUrl: string;
  } | null;
  opengraphType: string;
  opengraphSiteName: string;
};

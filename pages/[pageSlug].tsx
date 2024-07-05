import Head from 'next/head';
import { SiteHeader } from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { getPageSlugs, getSinglePage } from '@/lib/pages';
import { SinglePage } from '@/types/page';
import { AppConfig } from '@/config/const';

export async function getStaticProps({
  params,
}: {
  params: { pageSlug: string };
}) {
  const pageData = await getSinglePage(params.pageSlug);

  return {
    props: {
      pageData,
    },
    revalidate: AppConfig.REVALIDATE_1DAY,
  };
}

export async function getStaticPaths() {
  const pageSlugs = await getPageSlugs();
  const paths = pageSlugs.map((s) => ({
    params: {
      pageSlug: s.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default function Page({ pageData }: { pageData: SinglePage }) {
  return (
    <>
      <Head>
        <title key={pageData.slug}>{pageData.title}</title>
      </Head>
      <section className='bg-slate-700'>
        <SiteHeader className='header-page z-10 relative' />
      </section>
      <section className='content-area py-8'>
        <article>
          <h1 className='text-6xl text-center text-slate-700 relative py-8'>
            {pageData.title}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: pageData.content }}
            className='post-content container mx-auto lg:max-w-4xl'
          />
        </article>
      </section>
      <SiteFooter />
    </>
  );
}

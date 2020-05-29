import React from 'react';
import Head from 'next/head';
import Layout, { siteTitle } from 'src/layouts/Layout';
import utilStyles from 'src/styles/utils.module.css';
import { getSortedPostsData } from 'src/modules/posts/sources/posts';
import Link from 'next/link';
import Date from 'src/modules/posts/components/Date';

interface HomeProps {
    allPostsData: {
        id: string,
        date: string,
        title: string
    }[]
}

export default function Home({ allPostsData }: HomeProps) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          {'This is a disposable '}
          <Link href="/webrtc"><a>rtc web app</a></Link>
          {'.'}
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog (unchanged from nextjs-blog boilerplate)</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br/>
              <small className={'bp3-text-muted'}>
                <Date dateString={date}/>
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

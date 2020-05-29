import React from 'react';
import Head from 'next/head';
import Layout from 'src/layouts/Layout';
import { getAllPostIds, getPostData } from 'src/modules/posts/sources/posts';
import Date from 'src/modules/posts/components/Date';
import utilStyles from 'src/styles/utils.module.css';

interface PostProps {
    postData: {
        id: string,
        title: string
        date: string
        contentHtml: string
    }
}

export default function Post({ postData }: PostProps) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date}/>
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}/>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

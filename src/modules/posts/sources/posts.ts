import util from 'util';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
// @ts-ignore
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/modules/posts/sources/md');

export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = await util.promisify(fs.readdir)(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await util.promisify(fs.readFile)(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        ...matterResult.data,
      };
    })
  );
    // Sort posts by date
  return allPostsData.sort((a, b) => {
    // @ts-ignore
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getAllPostIds() {
  const fileNames = await util.promisify(fs.readdir)(postsDirectory);
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = await util.promisify(fs.readFile)(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

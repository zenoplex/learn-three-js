import * as React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { promises as fsPromises } from 'fs';
import path from 'path';

type Props = {
  readonly links: readonly string[];
};

export const Page = ({ links }: Props): JSX.Element => {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ul>
          {links.map((link) => (
            <li key={link}>
              <Link href={link}>
                <a>{link}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async () => {
  const getFiles = async (dir: string): Promise<readonly string[]> => {
    const dirents = await fsPromises.readdir(dir, { withFileTypes: true });
    const files: readonly (readonly string[])[] = await Promise.all(
      // @ts-expect-error below returns nested array of path strings
      dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      }),
    );

    // with node 12, we could use Array.prototype.flat but having problem with module resolution (react-dat-gui)
    return ([] as readonly string[]).concat(...files);
  };

  const targetDir = path.join(process.cwd(), 'src/pages');
  const links: readonly string[] = (await getFiles(targetDir))
    // eslint-disable-next-line functional/prefer-readonly-type
    .reduce<readonly string[]>((acc, filename) => {
      const match = filename.match(/(chapter\d+\/.+)\.tsx$/);
      const filePath = match?.[1];
      if (!filePath) return acc;

      return [...acc, filePath];
    }, []);

  return {
    props: {
      links,
    },
  };
};

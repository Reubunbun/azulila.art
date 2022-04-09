import type { ReactNode } from 'react';
import Head from 'next/head';
import NavBar from '../../components/NavBar/NavBar';

interface Props {
  children: ReactNode;
  title: string;
};

const DefaultLayout = ({children, title}: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <NavBar/>
      <main>{children}</main>
    </>
  );
};

export default DefaultLayout;

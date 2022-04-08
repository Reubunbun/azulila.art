import type { NextPage } from 'next'
import Link from 'next/link';

const NavBar: NextPage = () => {
  return (
    <>
      <Link href='/work'>Work</Link>
      <Link href='/gallery'>Gallery</Link>
      <Link href='/about'>About</Link>
      <Link href='/contact'>Contact</Link>
      <Link href='/FAQ'>FAQ</Link>
    </>
  );
};

export default NavBar;

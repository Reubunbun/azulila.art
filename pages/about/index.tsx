import Link from 'next/link';
import type { Page } from '../../interfaces/index';
import styles from './About.module.css';

const About: Page = () => {
  return (
    <>
      <h2>About</h2>
      <div className={styles.containerAbout}>
        <p>
          <b>Hello!</b><br />
            I&apos;m Tania Reyes, also known as Azulilah online, I&apos;m an artist based in Mexico.
            I&apos;m a huge fan of movies and Japanese art styles, so my artwork is a testament to my love for them.
            Having previously worked in a video game, I focus on digital art working with dynamic art styles, concept art, background and character design.
            <br /> <br />
            Feel free to contact me using the form <Link href='/contact'><a>here</a></Link> or email me directly at <a href='mailto:azulilah.art@gmail.com'>azulilah.art@gmail.com</a>
          </p>
      </div>
    </>
  );
};
About.title = 'About Me';

export default About;

import Link from 'next/link';
import type { Page } from 'interfaces';
import styles from './About.module.css';

const About: Page = () => {
  return (
    <>
      <h2 className={styles.header}>About</h2>
      <div className={styles.containerAbout}>
        <p className={styles.hello}><b>Hello!</b></p>
        <p>
          I&apos;m Tania Reyes, also known as Azulilah online, I&apos;m an artist based in Mexico.
          <br />
          I&apos;m a huge fan of movies and Japanese art styles, so my artwork is a testament to my love for them.
          Having previously worked on the indie video game <a href='https://www.popslinger.com/' target='_blank' rel='noreferrer'>Popslinger</a>, I focus on digital art working with dynamic art styles, concept art, background and character design.
          <br /> <br />
          Feel free to contact me using the form <Link href='/contact'><a>here</a></Link> or email me directly at <a href='mailto:azulilah.art@gmail.com'>azulilah.art@gmail.com</a>
        </p>
      </div>
    </>
  );
};
About.title = 'About Me';
About.description = 'I\'m Tania Reyes, also known as Azulilah online, I\'m an artist based in Mexico';

export default About;

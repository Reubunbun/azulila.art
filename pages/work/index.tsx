import type { Page, Image } from 'interfaces/index';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import scrollToTop from 'helpers/smoothScroll';
import WorkItem from 'components/WorkItem/WorkItem';
import styles from './Work.module.css';

interface WorkItem {
  title: string;
  description: string;
  image: Image;
  linkPath: string;
};

const c_workItems: WorkItem[] = [
  {
    title: 'Popslinger',
    image: {
      id: 1,
      url: '/work/popslinger-ex.png',
      width: 1280,
      height: 720,
      tags: [],
      priority: 0,
    },
    linkPath: 'popslinger',
    description: 'Popslinger is a music shooter game inspired by classic beat-em-ups, City Pop and old school anime, developed by Funky Can Creative. In this entry, I was one of the main artists in which I focused primarily on background design, from the level design to the city hub, to the cutscenes; I also contributed with a few profiles for the characters and various animations. My work involved making concept art for the levels, backgrounds and even a few character designs, as well as making the finished artwork for all these assets. It\'s been one of my most ambitious projects yet and a dream come true being able to work in a video game.',
  },
  {
    title: 'Fanzines',
    image: {
      id: 2,
      url: '/work/fanzine-ex.png',
      width: 1875,
      height: 960,
      tags: [],
      priority: 0,
    },
    linkPath: 'fanzines',
    description: 'A fan magazine, better known as a fanzine, is an inexpensive, independent published magazine or book made by people with a certain interest in common, such as popular subjects like photography, writing and, in this case, art. I\'ve participated in over 15 fanzines over the span of 5 years with a focus on media franchises, such as Sonic the Hedgehog, Ace Attorney, Pokémon, Persona 5, Earthbound, Splatoon, among others; I\'ve done both illustrations and merchandise for these publications.'
  },
  {
    title: 'Personal Projects',
    image: {
      id: 3,
      url: '/work/personal-proj-ex.png',
      width: 2000,
      height: 1430,
      tags: [],
      priority: 0,
    },
    linkPath: 'personalProjects',
    description: 'As for my own personal projects, I like to write and draw about my own characters; they vary from fantastic creatures to normal people trying to live day by day. My main project as of now is Azur\'s Story, which revolves around Azur, an undead prince trying to recover his kingdom from the hands of a young dictator called Blanc, and the emotional turmoil that involves both characters. Other hobbies also involve using traditional media, such as colored pencils, markers and watercolors making concept art of various characters or background design.',
  },
];

const Work: Page = () => {
  const router = useRouter();

  return (
    <>
      <h2 className={styles.mainHeader}>My Work</h2>
      <div className={styles.containerAllWorkItems}>
        {c_workItems.map(({title, image, linkPath, description}, i) => (
          <Fragment key={title}>
            <WorkItem
              title={title}
              image={image}
              linkPath={linkPath}
              description={description}
              isReversed={i % 2 === 0}
              onLinkClicked={pathname => scrollToTop().then(() => router.push(pathname))}
            />
          </Fragment>
        ))}
      </div>
    </>
  );
};

Work.title = 'My Work';
Work.removePadding = true;
Work.description = 'Tania Reyes (known as Azulila or Azulilah online) portfolio website. Read about my professional work, view my art and request commissions here!';

export default Work;

import type { FC } from 'react';
import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import styles from './Filters.module.css';

interface Props {
  filters: string[];
  changeSelected?: (filters: string[]) => void;
};

interface FilterOption {
  name: string;
  selected: boolean;
};

const Filters: FC<Props> = ({filters, changeSelected}) => {
  const [selected, setSelected] = useState<FilterOption[]>([]);

  const disabledBtns = useRef<{[key: string]: boolean}>({});
  const firstRender = useRef<boolean>(true);

  useEffect(() => {
    setSelected(
      filters.map(name => ({
        name,
        selected: false,
      }),
    ));
  }, [filters]);

  return (
    <motion.div
      className={styles.containerFilters}
    //   initial={{height: 0, opacity: 0}}
    //   animate={{height: 'auto', opacity: 0}}
    //   exit={{height: 0, opacity: 0}}
      transition={{
        duration: 0.4,
        type: 'tween',
      }}
    >
      {selected.length &&
        <div className={styles.containerHelpers}>
          <button
            onClick={() => {
              const anyNotSelected = selected.some(({selected}) => !selected);
              if (anyNotSelected) {
                setSelected(
                  prev => prev.map(({name}) => ({
                    name,
                    selected: true,
                  })),
                );
              }
            }}
          >
            Select All
          </button>
          <button
            onClick={() => {
              const anySelected = selected.some(({selected}) => selected);
              if (anySelected) {
                setSelected(
                  prev => prev.map(({name}) => ({
                    name,
                    selected: false,
                  })),
                );
              }
            }}
          >
            Remove All
          </button>
        </div>
      }
      <div className={styles.containerOptions}>
        {selected.map(({name: currName, selected: currSelected}) => (
          <button
            key={`${currName}-${currSelected}`}
            className={currSelected ? styles.selected : ''}
            onClick={() => {
              if (disabledBtns.current[currName]) {
                return;
              }

              const newSelected = selected.map(({name, selected}): FilterOption => {
                if (currName === name) {
                  disabledBtns.current[currName] = true;
                  setTimeout(
                    () => disabledBtns.current[currName] = false,
                    900,
                  );

                  return {
                    name,
                    selected: !currSelected,
                  };
                }

                return {name, selected};
              });

              setSelected(newSelected);
            }}
          >
            {currName}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default memo(Filters);

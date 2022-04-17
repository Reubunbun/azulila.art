import type { FC } from 'react';
import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import styles from './Filters.module.css';

export interface FilterOption {
  name: string;
  selected: boolean;
};
interface Props {
  filters: string[];
  changeSelected: (filters: FilterOption[]) => void;
};

const Filters: FC<Props> = ({filters, changeSelected}) => {
  const [selected, setSelected] = useState<FilterOption[]>([]);

  const disabledBtns = useRef<{[key: string]: boolean}>({});

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
                const newSelected = selected.map(({name}) => ({
                  name,
                  selected: true,
                }));
                changeSelected(newSelected);
                setSelected(newSelected);
              }
            }}
          >
            Select All
          </button>
          <button
            onClick={() => {
              const anySelected = selected.some(({selected}) => selected);
              if (anySelected) {
                const newSelected = selected.map(({name}) => ({
                  name,
                  selected: false,
                }));

                changeSelected(newSelected);
                setSelected(newSelected);
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

              changeSelected(newSelected);
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

export default memo(
  Filters,
  ({filters: prevFilters}, {filters: currFilters}) =>
    JSON.stringify(prevFilters) === JSON.stringify(currFilters),
);

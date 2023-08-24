import { type FC, type ChangeEvent, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from './SearchBar.module.css';

interface Props {
  onSearchChange: (searchTerm: string) => void;
}

const DEBOUNCE_TIME = 250; // ms

const SearchBar: FC<Props> = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchValue(term);

    if (timerId) {
      clearTimeout(timerId);
    }

    setTimerId(setTimeout(() => onSearchChange(term.toLowerCase()), DEBOUNCE_TIME));
  };

  return (
    <div className={styles.containerSearchBar}>
      <input
        className={styles.searchInput}
        type='text'
        value={searchValue}
        onChange={inputChange}
        placeholder='Search anything here!'
      />
      <SearchIcon
        color='inherit'
        className={styles.searchIcon}
      />
      {searchValue &&
        <CloseIcon
          color='inherit'
          className={styles.closeIcon}
          onClick={() => {
            setSearchValue('');
            onSearchChange('');
          }}
        />
      }
    </div>
  );
};

export default SearchBar;

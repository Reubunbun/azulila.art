import { type FC, type ChangeEvent, useState, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import sharedStyles from 'styles/shop-shared.module.css';
import styles from './SearchBar.module.css';

interface Props {
  onSearchChange: (searchTerm: string) => void;
}

const DEBOUNCE_TIME = 250; // ms

const SearchBar: FC<Props> = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchValue(term);

    if (timerId) {
      clearTimeout(timerId);
    }

    setTimerId(setTimeout(() => onSearchChange(term.toLowerCase()), DEBOUNCE_TIME));
  };

  return (
    <div
      className={styles.containerSearchBar}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className={`${
            sharedStyles.textInput
          } ${
            styles.searchInput
          } ${
            isFocused ? styles.focused : ''
          }`
        }
        type='text'
        value={searchValue}
        onChange={inputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder='Search anything here!'
      />
      <SearchIcon
        color='inherit'
        className={`${styles.searchIcon} ${isFocused ? styles.focused : ''}`}
      />
      {searchValue &&
        <CloseIcon
          color='inherit'
          className={styles.closeIcon}
          onClick={e => {
            setSearchValue('');
            onSearchChange('');
            inputRef.current?.blur();
            e.stopPropagation();
          }}
        />
      }
    </div>
  );
};

export default SearchBar;

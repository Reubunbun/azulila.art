import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

interface Props {
  children: ReactNode;
}
interface AppState {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}

const AppStateContext = createContext<AppState>({
  navOpen: false,
  setNavOpen: () => {}
});

export const AppStateProvider = ({children}: Props) => {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
    <AppStateContext.Provider value={{navOpen, setNavOpen}}>
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateContext;

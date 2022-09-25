import {
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
  useContext
} from 'react';

interface UIContextType {
  modalContent: ReactNode | null;
  setModalContent: Dispatch<SetStateAction<ReactNode | null>>;
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
};

const UIContext = createContext<UIContextType>(undefined!);

export const UIStateProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
    <UIContext.Provider value={{
      modalContent,
      setModalContent,
      navOpen,
      setNavOpen,
    }}>
      {children}
    </UIContext.Provider>
  );
};

export function useUIContext() {
  return useContext(UIContext);
};

export default UIContext;

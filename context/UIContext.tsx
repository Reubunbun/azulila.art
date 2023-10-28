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
  alertContent: ReactNode | null;
  setAlertContent: Dispatch<SetStateAction<ReactNode | null>>;
};

const UIContext = createContext<UIContextType>(undefined!);

export const UIStateProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [alertContent, setAlertContent] = useState<ReactNode | null>(null);

  return (
    <UIContext.Provider value={{
      modalContent,
      setModalContent,
      navOpen,
      setNavOpen,
      alertContent,
      setAlertContent
    }}>
      {children}
    </UIContext.Provider>
  );
};

export function useUIContext() {
  return useContext(UIContext);
};

export default UIContext;

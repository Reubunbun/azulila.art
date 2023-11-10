import {
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

interface UIContextType {
  modalContent: ReactNode | null;
  setModalContent: Dispatch<SetStateAction<ReactNode | null>>;
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  alertContent: ReactNode | null;
  setAlertContent: (alertContent: ReactNode | null) => void;
  setClosedAlert: Dispatch<SetStateAction<boolean>>;
};

const UIContext = createContext<UIContextType>(undefined!);

export const UIStateProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const [alertContent, setAlert] = useState<ReactNode | null>(null);
  const [closedAlert, setClosedAlert] = useState(false);

  const setAlertContent = (alertContent: ReactNode | null) => {
    if (closedAlert) return;
    setAlert(alertContent);
  }

  useEffect(() => {
    if (closedAlert) setAlert(null);
  }, [closedAlert]);

  return (
    <UIContext.Provider value={{
      modalContent,
      setModalContent,
      navOpen,
      setNavOpen,
      alertContent,
      setAlertContent,
      setClosedAlert
    }}>
      {children}
    </UIContext.Provider>
  );
};

export function useUIContext() {
  return useContext(UIContext);
};

export default UIContext;

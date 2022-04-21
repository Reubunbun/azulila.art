import type { FC, ReactNode, Dispatch, SetStateAction } from 'react';
import type {
  Image,
  CommissionData as CommissionResponseData,
  CommissionType,
  ImagesData as ImagesResponseData,
} from '../interfaces/index';
import { createContext, useState, useContext } from 'react';
import axios from 'axios';

interface CommissionData {
  spacesOpen: number | null;
  priceTotal: number;
  setPriceTotal: Dispatch<SetStateAction<number>>;
  baseTypes: CommissionType[];
  backgroundTypes: CommissionType[];
  fetchCommissionData: () => Promise<void>;
  selectedBaseType?: CommissionType;
  setSelectedBaseType: Dispatch<SetStateAction<CommissionType | undefined>>
};

interface ImagesData {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  fetchImagesData?: (page: number, limit: number, filter: string) => Promise<ImagesResponseData>;
};

interface AppContextType {
  commissionData: CommissionData;
  imagesData: ImagesData;
};

type AppStateType = 'commissionData' | 'imagesData';
type AppInterfaceType<T> =
  T extends 'commissionData'
    ? CommissionData
    : T extends 'imagesData'
      ? ImagesData
      : never;

const AppContext = createContext<AppContextType>({
  commissionData: {
    spacesOpen: null,
    priceTotal: 0,
    setPriceTotal: () => {},
    baseTypes: [],
    backgroundTypes: [],
    fetchCommissionData: async () => {},
    setSelectedBaseType: () => {},
  },
  imagesData: {
    images: [],
    setImages: () => {},
    tags: [],
    setTags: () => {},
  }
});

export const AppStateProvider: FC<{children: ReactNode}> = ({children}) => {
  const [madeCommissionRequest, setMadeCommissionRequest] = useState<boolean>(false);
  const [commissionPriceTotal, setCommissionPriceTotal] = useState(0);
  const [commissionSelectedBaseType, setCommissionBaseType] = useState<CommissionType>();

  const [
    {
      spaces: commissionSpacesOpen,
      baseTypes: commissionBaseTypes,
      backgroundTypes: commissionBackgroundTypes,
    },
    setCommissionServerData
  ] = useState<CommissionResponseData>({spaces: null, baseTypes: [], backgroundTypes: []})

  const fetchCommissionData = async () => {
    if (madeCommissionRequest) return;

    axios({
      method: 'GET',
      url: '/api/commission',
    })
      .then(({data}: {data: CommissionResponseData}) => {
        setMadeCommissionRequest(true);
        setCommissionServerData(data);
        setCommissionBaseType(data.baseTypes[0]);
      })
      .catch(console.dir);
  };

  const [images, setImages] = useState<Image[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const fetchImagesData = async (
    page: number,
    limit: number,
    filter: string,
  ): Promise<ImagesResponseData> => {
    return axios({
      url: `/api/images?page=${page}&limit=${limit}&filter=${filter}`,
      method: 'GET',
    })
      .then(({data}: {data: ImagesResponseData}) => data);
  };

  return (
    <AppContext.Provider
      value={{
        commissionData: {
          spacesOpen: commissionSpacesOpen,
          priceTotal: commissionPriceTotal,
          setPriceTotal: setCommissionPriceTotal,
          baseTypes: commissionBaseTypes,
          backgroundTypes: commissionBackgroundTypes,
          fetchCommissionData,
          selectedBaseType: commissionSelectedBaseType,
          setSelectedBaseType: setCommissionBaseType,
        },
        imagesData: {
          images,
          setImages,
          fetchImagesData,
          tags,
          setTags
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext<T extends AppStateType> (type: T): AppInterfaceType<T> {
  const appState = useContext(AppContext);
  const allStateTypes = Object.keys(appState);
  const foundType = allStateTypes.find(key => key === type);

  if (foundType === 'commissionData') {
    return appState.commissionData as AppInterfaceType<T>;
  }
  if (foundType === 'imagesData') {
    return appState.imagesData as AppInterfaceType<T>;
  }
  throw new Error('No such context type');
};

export default AppContext;

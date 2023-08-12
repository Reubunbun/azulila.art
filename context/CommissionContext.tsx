import {
  type FC,
  type ReactNode,
  type Dispatch,
  createContext,
  useState,
  useContext,
  useReducer,
} from 'react';
import type {
  CommissionData as CommissionResponseData,
  CommissionType,
} from 'interfaces';
import axios from 'axios';

/** USER STATE DEFINITION */
interface Character {
  id: number;
  visualDescription: string;
  personalityDescription: string;
  fileMap: {[name: string]: File};
};

interface CommissionOption extends CommissionType {
  actualPrice: number;
};

interface CommissionState {
  pageProgress: string;
  totalPrice: number;
  baseType?: CommissionOption;
  backgroundType?: CommissionOption;
  backgroundDescription: string;
  characters: Character[];
  userName: string;
  userContactEmail: string;
  userPaypalEmail: string;
};

type CommissionAction =
  | { type: 'PAGE', payload: string }
  | { type: 'BASE', payload: CommissionOption }
  | { type: 'BACKGROUND-TYPE', payload: CommissionOption }
  | { type: 'BACKGROUND-DESC', payload: string }
  | { type: 'CHARACTER-ADD' }
  | { type: 'CHARACTER-UPDATE-VIS', payload: { id: number, newValue: string } }
  | { type: 'CHARACTER-UPDATE-PERS', payload: { id: number, newValue: string } }
  | { type: 'CHARACTER-ADD-FILES', payload: { id: number, files: File[] } }
  | { type: 'CHARACTER-REMOVE-FILE', payload: { id: number, fileName: string } }
  | { type: 'CHARACTER-REMOVE', payload: number }
  | { type: 'USER-NAME', payload: string }
  | { type: 'USER-CONTACT-EMAIL', payload: string }
  | { type: 'USER-PAYPAL-EMAIL', payload: string }
  | { type: 'RESET' };

const createNewCharacter = (): Character => ({
  id: Date.now(),
  visualDescription: '',
  personalityDescription: '',
  fileMap: {},
});

const createNewUserState = (): CommissionState => ({
  pageProgress: '',
  totalPrice: 0,
  characters: [createNewCharacter()],
  backgroundType: BG_TYPE_FLAT_COLOUR,
  backgroundDescription: '',
  userName: '',
  userContactEmail: '',
  userPaypalEmail: '',
})

const calcTotalPrice = (state: CommissionState): number => {
  return (
    (state.baseType?.actualPrice || 0) +
    (state.backgroundType?.actualPrice || 0) +
    (
      (state.characters.length - 1) * (state.baseType?.actualPrice || 0)
    )
  );
};

const calcActualPrice = (basePrice: number, offer: number | null): number => {
  if (offer === null) return basePrice;

  return basePrice * ((100 - offer) / 100)
};

const reducer = (state: CommissionState, action: CommissionAction) : CommissionState => {
  switch (action.type) {
    case 'PAGE': {
      return {
        ...state,
        pageProgress: action.payload,
      };
    }
    case 'BASE': {
      const newState = {
        ...state,
        baseType: action.payload,
      };
      return {
        ...newState,
        totalPrice: calcTotalPrice(newState),
      };
    }
    case 'BACKGROUND-TYPE': {
      const newState = {
        ...state,
        backgroundType: action.payload,
      };
      return {
        ...newState,
        totalPrice: calcTotalPrice(newState),
      };
    }
    case 'BACKGROUND-DESC': {
      return {...state, backgroundDescription: action.payload};
    }
    case 'CHARACTER-ADD': {
      if (state.characters.length === 3) {
        return state;
      }

      const newState = {
        ...state,
        characters: [
          ...state.characters,
          createNewCharacter(),
        ],
      };
      return {
        ...newState,
        totalPrice: calcTotalPrice(newState),
      };
    }
    case 'CHARACTER-UPDATE-VIS': {
      const { id, newValue } = action.payload;

      return {
        ...state,
        characters: state.characters.map(character => {
          if (character.id === id) {
            return {
              ...character,
              visualDescription: newValue,
            };
          }
          return character;
        })
      };
    }
    case 'CHARACTER-UPDATE-PERS': {
      const { id, newValue } = action.payload;

      return {
        ...state,
        characters: state.characters.map(character => {
          if (character.id === id) {
            return {
              ...character,
              personalityDescription: newValue,
            }
          }
          return character;
        })
      };
    }
    case 'CHARACTER-ADD-FILES': {
      const { id, files } = action.payload;

      return {
        ...state,
        characters: state.characters.map(character => {
          if (character.id === id) {
            const fileMapToAdd = files.reduce(
              (fileMapToAdd, nextFile) => ({
                ...fileMapToAdd,
                [nextFile.name]: nextFile
              }),
              {},
            );

            return {
              ...character,
              fileMap: {
                ...character.fileMap,
                ...fileMapToAdd,
              },
            };
          }
          return character;
        })
      };
    }
    case 'CHARACTER-REMOVE-FILE': {
      const { id, fileName } = action.payload;

      return {
        ...state,
        characters: state.characters.map(character => {
          if (character.id === id) {
            const characterFiles = character.fileMap;
            delete characterFiles[fileName];
            return {
              ...character,
              fileMap: {...character.fileMap},
            };
          }
          return character;
        })
      };
    }
    case 'CHARACTER-REMOVE': {
      if (state.characters.length === 1) {
        return state;
      }

      const newState = {
        ...state,
        characters: state.characters.filter(character => character.id !== action.payload),
      };
      return {
        ...newState,
        totalPrice: calcTotalPrice(newState),
      };
    }
    case 'USER-NAME': {
      return {
        ...state,
        userName: action.payload,
      };
    }
    case 'USER-CONTACT-EMAIL': {
      return {
        ...state,
        userContactEmail: action.payload,
      };
    }
    case 'USER-PAYPAL-EMAIL': {
      return {
        ...state,
        userPaypalEmail: action.payload,
      };
    }
    case 'RESET': {
      return createNewUserState();
    }
    default:
      return state;
  }
};

/** END USER STATE DEFINITION */


/** CONTEXT DEFINITION */

interface CommissionContextType extends CommissionState {
  spacesOpen: number | null;
  baseTypes: CommissionOption[];
  backgroundTypes: CommissionOption[];
  fetchCommissionData: () => Promise<void>;
  dispatchUserState: Dispatch<CommissionAction>;
};

const BG_TYPE_FLAT_COLOUR: CommissionOption = {
  price: 0,
  display: 'Flat Color or Transparent',
  id: -1,
  offer: null,
  actualPrice: 0,
  exampleImage: 'https://tania-portfolio.s3.eu-west-1.amazonaws.com/transparent-ex.png',
};

const defaultUserState = createNewUserState();

const CommissionContext = createContext<CommissionContextType>({
  spacesOpen: null,
  pageProgress: '',
  baseTypes: [],
  backgroundTypes: [],
  fetchCommissionData: async () => {},
  totalPrice: defaultUserState.totalPrice,
  characters: defaultUserState.characters,
  dispatchUserState: () => {},
  backgroundDescription: '',
  userName: '',
  userContactEmail: '',
  userPaypalEmail: '',
});

/** END CONTEXT DEFINITION */

export const CommissionStateProvider: FC<{children: ReactNode}> = ({children}) => {
  const [madeCommissionRequest, setMadeCommissionRequest] = useState<boolean>(false);
  const [
    {
      pageProgress,
      totalPrice,
      baseType,
      backgroundType,
      backgroundDescription,
      characters,
      userName,
      userContactEmail,
      userPaypalEmail,
    },
    dispatch,
  ] = useReducer(reducer, defaultUserState);

  const [
    {
      spaces: spacesOpen,
      baseTypes,
      backgroundTypes,
    },
    setCommissionServerData
  ] = useState<{
    spaces: number | null,
    baseTypes: CommissionOption[],
    backgroundTypes: CommissionOption[],
  }>
  ({spaces: null, baseTypes: [], backgroundTypes: [BG_TYPE_FLAT_COLOUR]})

  const fetchCommissionData = async () => {
    if (madeCommissionRequest) return;

    const { data } = await axios({
      method: 'GET',
      url: '/api/commission',
    }) as {data: CommissionResponseData}

    setMadeCommissionRequest(true);
    setCommissionServerData(prev => ({
      spaces: data.spaces,
      baseTypes: data.baseTypes.map(baseType => ({
        ...baseType,
        actualPrice: calcActualPrice(baseType.price, baseType.offer),
      })),
      backgroundTypes: [
        ...prev.backgroundTypes,
        ...data.backgroundTypes.map(backgroundType => ({
          ...backgroundType,
          actualPrice: calcActualPrice(backgroundType.price, backgroundType.offer),
        })),
      ],
    }));

    const defaultSelectedBase = data.baseTypes[0];
    dispatch({
      type: 'BASE',
      payload: {
        ...defaultSelectedBase,
        actualPrice: calcActualPrice(defaultSelectedBase.price, defaultSelectedBase.offer),
      },
    });

  };

  return (
    <CommissionContext.Provider
      value={{
        pageProgress,
        spacesOpen,
        baseTypes,
        backgroundTypes,
        fetchCommissionData,
        totalPrice,
        baseType,
        backgroundType,
        backgroundDescription,
        characters,
        userName,
        userContactEmail,
        userPaypalEmail,
        dispatchUserState: dispatch,
      }}
    >
      {children}
    </CommissionContext.Provider>
  );
};

export function useCommissionContext() {
  return useContext(CommissionContext);
};

export default CommissionContext;

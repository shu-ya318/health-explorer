"use client";

import { 
  createContext, 
  useContext, 
  useEffect,
  useCallback, 
  useReducer 
} from "react";

import { UserType } from "./useAuth"; 
import { InstitutionInfo } from "../lib/types";

import {db} from "../lib/firebaseConfig";
import { FirebaseFavoriteData} from "../lib/types";
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where
} from "firebase/firestore";

interface FavoriteProviderProps {
  children: React.ReactNode;
  user: UserType | null;
}
export interface FavoriteState {
  favorites: FirebaseFavoriteData[];
}
type FavoriteAction =
  | { type: "SET_FAVORITES"; payload: FirebaseFavoriteData[] }
  | { type: "ADD_FAVORITE"; payload: FirebaseFavoriteData } 
  | { type: "REMOVE_FAVORITE"; payload: string }; 


const initialState: FavoriteState = {
  favorites: [],
};

const FavoriteContext = createContext<{
  state: FavoriteState;
  dispatch: React.Dispatch<FavoriteAction>;
  fetchFavoriteData: () => Promise<void>;
  handleAddFavorite: (user: UserType | null, institution: InstitutionInfo) => Promise<void>;
  handleRemoveFavorite: (user: UserType | null, docId: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  fetchFavoriteData:async () => {},
  handleAddFavorite: async () => {},
  handleRemoveFavorite: async () => {},
});

const FavoriteReducer = (state: FavoriteState, action: FavoriteAction) => {
  switch (action.type) {
      case "SET_FAVORITES":
          return { ...state, favorites: action.payload };
      case "ADD_FAVORITE":
          return { ...state, favorites: [...state.favorites, action.payload] };
      case "REMOVE_FAVORITE":
          return { ...state, favorites: state.favorites.filter(item => item.id !== action.payload) };
      default:
          return state;
  }
};

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ 
  children, 
  user 
}) => {
  const [state, dispatch] = useReducer(FavoriteReducer, initialState);

  const fetchFavoriteData = useCallback(async () => {
      if (!user) return;

      const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data() as FirebaseFavoriteData,
        id: doc.id
      }));

      dispatch({ type: "SET_FAVORITES", payload: data });
  }, [user]);
  
  useEffect(() => {
    fetchFavoriteData();
}, [fetchFavoriteData]);

//多個元件均完全相同的資料處理及狀態管理邏輯
const handleAddFavorite = async (user: UserType | null, institution: InstitutionInfo) => {
  if (!user) return;
  
  const favoriteItem: FirebaseFavoriteData = {
    userId: user.uid,
    hosp_name: institution.hosp_name,
    hosp_addr: institution.hosp_addr,
    tel: institution.tel,
    imageUrl: institution.imageUrl
  };

  try {
    const docRef = await addDoc(collection(db, "favorites"), favoriteItem);
    dispatch({ type: "ADD_FAVORITE", payload: { ...favoriteItem, id: docRef.id } });
  } catch (error) {
    console.error("Failed to add favorite:", error);
  }
};

  const handleRemoveFavorite =  async (user: UserType | null, objectID: string) => {
    if (!user) return;
  
    const q = query(collection(db, "favorites"), where("hosp_name", "==", objectID), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const batch = querySnapshot.docs.map(async (document) => {
            await deleteDoc(doc(db, "favorites", document.id));
            return document.id;
        });

        const deletedDocIds = await Promise.all(batch);
        deletedDocIds.forEach(docId => {
          dispatch({ type: "REMOVE_FAVORITE", payload: docId });
        });
    } else {
        console.error("No favorite record found in Firestore or element with matching ID not found");
    }
};

console.log(state);

  return (
      <FavoriteContext.Provider value={{ state, dispatch, fetchFavoriteData, handleAddFavorite, handleRemoveFavorite }}>
        {children}
      </FavoriteContext.Provider>
  );
}

export const useFavorite = () => useContext(FavoriteContext);
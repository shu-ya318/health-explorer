'use client';
import { createContext, useContext, useEffect,useCallback, useReducer } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import {db} from '../lib/firebaseConfig';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where, orderBy, startAfter, limit, DocumentSnapshot } from 'firebase/firestore';
import { FirebaseFavoriteData} from '../lib/types';


interface FavoriteProviderProps {
  children: React.ReactNode;
  user: any;
}
interface FavoriteState {
  favorites: FirebaseFavoriteData[];
}
interface FavoriteAction {
  type: 'SET_FAVORITES' | 'ADD_FAVORITE' | 'REMOVE_FAVORITE';
  payload: any;
}


const initialState: FavoriteState = {
  favorites: [],
};

const FavoriteContext = createContext<{
  state: FavoriteState;
  dispatch: React.Dispatch<FavoriteAction>;
  fetchFavoriteData: () => void;
  addFavorite: (favoriteItem: FirebaseFavoriteData) => Promise<void>;
  removeFavorite: (docId: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  fetchFavoriteData: () => {},
  addFavorite: async () => {},
  removeFavorite: async () => {},
});


const FavoriteReducer = (state: FavoriteState, action: FavoriteAction) => {
  switch (action.type) {
      case 'SET_FAVORITES':
          return { ...state, favorites: action.payload };
      case 'ADD_FAVORITE':
          return { ...state, favorites: [...state.favorites, action.payload] };
      case 'REMOVE_FAVORITE':
          return { ...state, favorites: state.favorites.filter(item => item.id !== action.payload) };
      default:
          return state;
  }
};


export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children, user }) => {
  const [state, dispatch] = useReducer(FavoriteReducer, initialState);

  const fetchFavoriteData = useCallback(async () => {
      if (!user) return;

      const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data() as FirebaseFavoriteData,
        id: doc.id                                            //id 在展開合併操作後才賦值，避免被覆蓋
      }));

      dispatch({ type: 'SET_FAVORITES', payload: data });
  }, [user]);
  
  useEffect(() => {
    fetchFavoriteData();
}, [fetchFavoriteData]);


  const addFavorite = async (favoriteItem: FirebaseFavoriteData) => {
      const docRef = await addDoc(collection(db, 'favorites'), favoriteItem);
      dispatch({ type: 'ADD_FAVORITE', payload: {  ...favoriteItem, id: docRef.id} });
      fetchFavoriteData();
  };

  const removeFavorite = async (docId: string) => {
      await deleteDoc(doc(db, 'favorites', docId));
      dispatch({ type: 'REMOVE_FAVORITE', payload: docId });
      fetchFavoriteData();
  };


  return (
      <FavoriteContext.Provider value={{ state, dispatch, fetchFavoriteData, addFavorite, removeFavorite }}>
          {children}
      </FavoriteContext.Provider>
  );
};


export const useFavorite = () => useContext(FavoriteContext);
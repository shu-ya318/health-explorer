'use client';
import { createContext, useContext, useEffect,useCallback, useReducer } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import {db} from '../lib/firebaseConfig';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where, orderBy, startAfter, limit, DocumentSnapshot } from 'firebase/firestore';


interface CollectionProviderProps {
  children: React.ReactNode;
  user: any;
}
export interface CollectionData{
  id?: string;          //每筆收藏文件id，由firestore內建
  userId: string;
  hosp_name: string;
  area: string;
  division?: string;
  cancer_screening?: string;
  timestamp: Date;
}
interface CollectionState {
  collections: CollectionData[];
}
interface CollectionAction {
  type: 'SET_COLLECTIONS' | 'ADD_COLLECTION' | 'REMOVE_COLLECTION';
  payload: any;
}


const initialState: CollectionState = {
  collections: [],
};


const CollectionContext = createContext<{
  state: CollectionState;
  dispatch: React.Dispatch<CollectionAction>;
  fetchCollectionData: () => void;
  addCollection: (collectionItem: CollectionData) => Promise<void>;
  removeCollection: (docId: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  fetchCollectionData: () => {},
  addCollection: async () => {},
  removeCollection: async () => {},
});


const collectionReducer = (state: CollectionState, action: CollectionAction) => {
  switch (action.type) {
      case 'SET_COLLECTIONS':
          return { ...state, collections: action.payload };
      case 'ADD_COLLECTION':
          return { ...state, collections: [...state.collections, action.payload] };
      case 'REMOVE_COLLECTION':
          return { ...state, collections: state.collections.filter(item => item.id !== action.payload) };
      default:
          return state;
  }
};


export const CollectionProvider: React.FC<CollectionProviderProps> = ({ children, user }) => {
  const [state, dispatch] = useReducer(collectionReducer, initialState);

  const fetchCollectionData = useCallback(async () => {
      if (!user) return;

      const q = query(collection(db, 'collections'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data() as CollectionData,
        id: doc.id                                            //id 在展開合併操作後才賦值，避免被覆蓋
      }));

      dispatch({ type: 'SET_COLLECTIONS', payload: data });
  }, [user]);

  useEffect(() => {
      fetchCollectionData();
  }, [fetchCollectionData]);


  const addCollection = async (collectionItem: CollectionData) => {
      const docRef = await addDoc(collection(db, 'collections'), collectionItem);
      dispatch({ type: 'ADD_COLLECTION', payload: {  ...collectionItem, id: docRef.id} });
      console.log(state);
  };

  const removeCollection = async (docId: string) => {
      await deleteDoc(doc(db, 'collections', docId));
      console.log("Removing document from state:", docId);
      dispatch({ type: 'REMOVE_COLLECTION', payload: docId });
      console.log(state);
  };


  return (
      <CollectionContext.Provider value={{ state, dispatch, fetchCollectionData, addCollection, removeCollection }}>
          {children}
      </CollectionContext.Provider>
  );
};


export const useCollection = () => useContext(CollectionContext);
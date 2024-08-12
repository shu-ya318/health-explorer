'use client';
import { createContext, useContext, useEffect,useCallback , useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import {db} from '../lib/firebaseConfig';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where, orderBy, startAfter, limit, DocumentSnapshot } from 'firebase/firestore';


interface CollectionData{
    id?: string; 
    userId: string;
    hosp_name: string;
    view?:number;
}

const CollectionContext = createContext();


export const CollectionContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [collectionData, setCollectionData] = useState<CollectionData[]>([]);


    const fetchCollectionData = useCallback(async () => {
        if (!user) return;   
        
        const q = query(collection(db, 'accounting'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as CollectionData
        }));
    
        setCollectionData(data);
      }, [user]);


      const addCollectionRecord = async (record: CollectionData) => {
        try {
            await addDoc(collection(db, 'accounting'), record);
            fetchCollectionData();
          } catch (error:any) {
            throw new Error(error.message);
          }
      };

      const deleteCollectionRecord = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'medicalInstitutions', id));
            fetchCollectionData();
        } catch (error:any) {
          throw new Error(error.message);
        }
      };


    return (
        <CollectionContext.Provider value={{collectionData, addCollectionRecord, deleteCollectionRecord}}>
          {children}
        </CollectionContext.Provider>
      );
}


export const useCollection = () => useContext(CollectionContext);
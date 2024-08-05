'use client';
import { createContext, useContext, useEffect, useState, ReactNode} from 'react';
import { FirebaseInstitutionData } from '../lib/types';
import { initInstitutionData }from '../api/initInstitutionData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';


interface InstitutionsContextType {
    institutionData: FirebaseInstitutionData[];
    setInstitutionData: (data: FirebaseInstitutionData[]) => void;
    loading: boolean;
}

const defaultInstitutionContextValue: InstitutionsContextType = {
    institutionData: [],
    setInstitutionData: () => {},
    loading: true
};

const InstitutionsContext = createContext<InstitutionsContextType>(defaultInstitutionContextValue);

interface InstitutionsProviderProps {
    children: ReactNode;
}


export const InstitutionsProvider: React.FC<InstitutionsProviderProps> = ({ children }) => {
    const [institutionData, setInstitutionData] = useState<FirebaseInstitutionData[]>([]);
    const [loading,setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function handleInstitutionData() {
            await initInstitutionData();

            setLoading(true);

            try {
                const querySnapshot = await getDocs(collection(db, 'medicalInstitutions'));
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    return {
                    hosp_name: docData.hosp_name || '',
                    tel: docData.tel || '',
                    area: docData.area || '',
                    hosp_addr: docData.hosp_addr || '',
                    division: docData.division || ''
                    } as FirebaseInstitutionData;
                });
                setInstitutionData(data);
            } finally {
                setLoading(false);
            }
        }
        handleInstitutionData();
    }, []);

    return (
        <InstitutionsContext.Provider value={{institutionData, setInstitutionData, loading}}>
            {children}
        </InstitutionsContext.Provider>
    );
};

export const useInstitutions = (): InstitutionsContextType => {
    const context = useContext(InstitutionsContext);
    if (context === undefined) {
        throw new Error('useInstitutions must be used within a InstitutionsProvider');
    }
    return context;
}

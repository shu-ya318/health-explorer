/*
'use client';
import { createContext, useContext, useEffect, useState, ReactNode} from 'react';
import { FirebaseInstitutionData} from '../lib/types';
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
    loading: true,
};

const InstitutionsContext = createContext<InstitutionsContextType>(defaultInstitutionContextValue);

interface InstitutionsProviderProps {
    children: ReactNode;
}


export const InstitutionsProvider: React.FC<InstitutionsProviderProps> = ({ children }) => {
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(() => {
        const loaded = localStorage.getItem('isDataLoaded');
        return loaded === 'true';
    });
    const [institutionData, setInstitutionData] = useState<FirebaseInstitutionData[]>(() => {
        const storedData = localStorage.getItem('institutionData');
        const parsedData = storedData ? JSON.parse(storedData) : [];
        return parsedData;
    });
    const [loading,setLoading] = useState<boolean>(false);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places']
    });


    useEffect(() => {
        async function handleInstitutionData() {
            if (!isDataLoaded) {
                setLoading(true);
                const newData: FirebaseInstitutionData[] = [];
                try {
                    //await initInstitutionData();
                    const geocoder = new google.maps.Geocoder();
                    const querySnapshot = await getDocs(collection(db, 'medicalInstitutions'));
                    
                    const promises = querySnapshot.docs.map(async doc => {
                        try {
                            const docData = doc.data();
                            const response = await geocoder.geocode({ address: docData.hosp_addr });
                
    
                            newData.push({
                                hosp_name: docData.hosp_name || '',
                                tel: docData.tel || '',
                                area: docData.area || '',
                                hosp_addr: docData.hosp_addr || '',
                                division: docData.division || '',
                                cancer_screening: docData.cancer_screening || '',
                                lat: docData.lat(),
                                lng: docData.lng(),
                                map: docData.imageUrl
                            } as FirebaseInstitutionData);
                        } catch (error) {
                            console.error("Error processing document:", doc.id, error);
                        }
                    });
                    await Promise.all(promises);
    
                    if (newData.length > 0) {
                        setInstitutionData(newData);
                        setIsDataLoaded(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch institution data:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        handleInstitutionData();
    }, [isDataLoaded]);           


    useEffect(() => {
        if (Object.keys(views).length === 0 && institutionData.length > 0) {
            const initialViews = institutionData.reduce((acc: Record<string, number>, institution: FirebaseInstitutionData) => {
                acc[institution.hosp_name] = 1;
                return acc;
            }, {});
        setViews(initialViews);
        }
    }, [institutionData, views]);


    const incrementView = (hosp_name: string) => {
        setViews(prevViews => {
            const updatedViews = {
                ...prevViews,
                [hosp_name]: (prevViews[hosp_name] || 0) + 1
            };
            localStorage.setItem('views', JSON.stringify(updatedViews));
            return updatedViews;
        });
    };

    

    return (
        <InstitutionsContext.Provider value={{institutionData, loading}}>
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
*/
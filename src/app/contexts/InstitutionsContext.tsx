'use client';
import { createContext, useContext, useEffect, useState, ReactNode} from 'react';
import { FirebaseInstitutionData } from '../lib/types';
import { initInstitutionData }from '../api/initInstitutionData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useLoadScript, useGoogleMap } from '@react-google-maps/api';


interface InstitutionsContextType {
    institutionData: FirebaseInstitutionData[];
    setInstitutionData: (data: FirebaseInstitutionData[]) => void;
    loading: boolean;
    views: Record<string, number>;
    incrementView: (hosp_name: string) => void;
}

const defaultInstitutionContextValue: InstitutionsContextType = {
    institutionData: [],
    setInstitutionData: () => {},
    loading: true,
    views: {},
    incrementView: () => {}
};

const InstitutionsContext = createContext<InstitutionsContextType>(defaultInstitutionContextValue);

interface InstitutionsProviderProps {
    children: ReactNode;
}


export const InstitutionsProvider: React.FC<InstitutionsProviderProps> = ({ children }) => {
    const [institutionData, setInstitutionData] = useState<FirebaseInstitutionData[]>([]);
    const [views, setViews] = useState<Record<string, number>>(() => {                    //單純預設值為1，重載頁面會重置
        const savedViews = localStorage.getItem('views');
        return savedViews ? JSON.parse(savedViews) : {};
    });
    const [loading,setLoading] = useState<boolean>(true);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,  // !   非空 斷言
        libraries: ['places']
    });

    useEffect(() => {
        async function handleInstitutionData() {
            await initInstitutionData();
            setLoading(true);

            if (isLoaded) {
                try {
                    const querySnapshot = await getDocs(collection(db, 'medicalInstitutions'));
                    const geocoder = new google.maps.Geocoder();

                    const data = await Promise.all(querySnapshot.docs.map(async doc => {
                        const docData = doc.data();
                        const response = await geocoder.geocode({ address: docData.hosp_addr });
                        const location = response.results[0].geometry.location;

                        return {
                            hosp_name: docData.hosp_name || '',
                            tel: docData.tel || '',
                            area: docData.area || '',
                            hosp_addr: docData.hosp_addr || '',
                            division: docData.division || '',
                            cancer_screening: docData.cancer_screening || '',
                            lat: location.lat(),
                            lng: location.lng()
                        } as FirebaseInstitutionData;
                    }));

                    setInstitutionData(data);
                } catch (error) {
                    console.error("Failed to fetch institution data:", error);
                } finally {
                    setLoading(false);
                }
            }
        }

        handleInstitutionData();
    }, [isLoaded]);


    useEffect(() => {
        if (Object.keys(views).length === 0 && institutionData.length > 0) {
            const initialViews = institutionData.reduce((acc: Record<string, number>, institution: FirebaseInstitutionData) => {
                acc[institution.hosp_name] = 1; // 僅首次初始化為預設值1 (如:localStorage清空紀錄)
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
        <InstitutionsContext.Provider value={{institutionData, setInstitutionData, loading, views, incrementView}}>
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

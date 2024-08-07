'use client';
import { createContext, useContext, useEffect, useState, ReactNode} from 'react';
import { FirebaseInstitutionData} from '../lib/types';
import { initInstitutionData }from '../api/initInstitutionData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
// import { useLoadScript, useGoogleMap } from '@react-google-maps/api';


interface InstitutionsContextType {
    institutionData: FirebaseInstitutionData[];
    setInstitutionData: (data: FirebaseInstitutionData[]) => void;
    loading: boolean;
    views: Record<string, number>;
    incrementView: (hosp_name: string) => void;

    logMessage: string; // 新增 logMessage 屬性
}

const defaultInstitutionContextValue: InstitutionsContextType = {
    institutionData: [],
    setInstitutionData: () => {},
    loading: true,
    views: {},
    incrementView: () => {},

    logMessage: "test"  // 新增 logMessage，並提供一個初始值
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

    const [logMessage, setLogMessage] = useState<string>('測試');
    console.log(logMessage);
    /*
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,  // !   非空 斷言
        libraries: ['places']
    });
    */

    //切換 setLoading(false); 否則條件渲染UI無限加載中
    useEffect(() => {
        async function handleInstitutionData() {
            await initInstitutionData();
            setLoading(true);

                try {
                    const querySnapshot = await getDocs(collection(db, 'medicalInstitutions'));

                    const data = await Promise.all(querySnapshot.docs.map(async doc => {
                        const docData = doc.data();

                        return {
                            hosp_name: docData.hosp_name || '',
                            tel: docData.tel || '',
                            area: docData.area || '',
                            hosp_addr: docData.hosp_addr || '',
                            division: docData.division || '',
                            cancer_screening: docData.cancer_screening || '',
                        } as FirebaseInstitutionData;
                    }));

                    setInstitutionData(data);
                } catch (error) {
                    console.error("Failed to fetch institution data:", error);
                } finally {
                    setLoading(false);
                }
            }
        handleInstitutionData();
    }, []);                 //依賴條件勿 為印值 而寫[initInstitutionData]、[loading] ->無限執讀取firestore 
    /*
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
                        // const response = await geocoder.geocode({ address: docData.hosp_addr });
                        // const location = response.results[0].geometry.location;

                        return {
                            hosp_name: docData.hosp_name || '',
                            tel: docData.tel || '',
                            area: docData.area || '',
                            hosp_addr: docData.hosp_addr || '',
                            division: docData.division || '',
                            cancer_screening: docData.cancer_screening || '',
                            // lat: location.lat(),
                            // lng: location.lng()
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
    */


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
        <InstitutionsContext.Provider value={{institutionData, setInstitutionData, loading, views, incrementView, logMessage}}>
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

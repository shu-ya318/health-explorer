'use client';
import { createContext, useContext, useEffect, useState, ReactNode} from 'react';
import { FirebaseInstitutionData} from '../lib/types';
import { initInstitutionData }from '../api/initInstitutionData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useLoadScript, useGoogleMap } from '@react-google-maps/api';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


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
    incrementView: () => {},
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

    const [views, setViews] = useState<Record<string, number>>(() => { //單純預設值為1，重載頁面會重置
        const savedViews = localStorage.getItem('views');
        return savedViews ? JSON.parse(savedViews) : {};
    });

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places']
    });

   
    useEffect(() => {
        localStorage.setItem('isDataLoaded', isDataLoaded.toString());
    }, [isDataLoaded]);

    useEffect(() => {
        async function handleInstitutionData() {
            if (!isDataLoaded && isLoaded) {
                setLoading(true);
                const newData: FirebaseInstitutionData[] = [];
                try {
                    await initInstitutionData();
                    const geocoder = new google.maps.Geocoder();
                    const querySnapshot = await getDocs(collection(db, 'medicalInstitutions'));
                    const storage = getStorage();
                    
                    const promises = querySnapshot.docs.map(async doc => {
                        try {
                            const docData = doc.data();
                            const response = await geocoder.geocode({ address: docData.hosp_addr });
                            const location = response.results[0].geometry.location;
                            const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(docData.hosp_addr)}&zoom=15&size=250x200&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
                            let imageBlob;
                            try {
                                const imageResp = await fetch(imageUrl);
                                imageBlob = await imageResp.blob();
                            } catch (fetchError) {
                                console.error("Failed to fetch Google Static Map, using placeholder instead for", docData.hosp_addr, fetchError);
                                imageBlob = await fetch('/images/placeholder.png').then(res => res.blob());
                            }
                            const imageRef = ref(storage, 'institutionImages/' + (docData.hosp_name || 'unknown'));
                            await uploadBytes(imageRef, imageBlob);
                            const mapUrl = await getDownloadURL(imageRef);
    
                            newData.push({
                                hosp_name: docData.hosp_name || '',
                                tel: docData.tel || '',
                                area: docData.area || '',
                                hosp_addr: docData.hosp_addr || '',
                                division: docData.division || '',
                                cancer_screening: docData.cancer_screening || '',
                                lat: location.lat(),
                                lng: location.lng(),
                                map: mapUrl
                            } as FirebaseInstitutionData);
                        } catch (error) {
                            console.error("Error processing document:", doc.id, error);
                        }
                    });
                    await Promise.all(promises);
    
                    if (newData.length > 0) {
                        localStorage.setItem('institutionData', JSON.stringify(newData));
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
    }, [isDataLoaded, isLoaded]);           


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
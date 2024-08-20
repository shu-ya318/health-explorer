//import {useInstitutions }  from "../contexts/InstitutionsContext";
import { useRouter } from 'next/navigation'; 
import {useState, useEffect, useMemo} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { motion, AnimatePresence } from "framer-motion"; 
import BounceLoader from "react-spinners/BounceLoader";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { db } from '../lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useFavorite} from '../hooks/useFavorite'; 
import { FirebaseFavoriteData, InstitutionInfo} from '../lib/types';
import { useAuth } from '../hooks/useAuth'; 
import algoliasearch from 'algoliasearch/lite';
import SignInModal from './auth/SignInModal';
import RegisterModal from './auth/RegisterModal';


const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string, 
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);
const index = searchClient.initIndex('Medical_Institutions');

const InstitutionContent: React.FC = (): React.ReactElement | null  => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 

    const [openLoading, setOpenLoading] = useState<boolean>(true);
    const [loading,setLoading] = useState<boolean>(false);

    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
    const { user } = useAuth();
    const { state, addFavorite, removeFavorite} = useFavorite();

    const router = useRouter();
    const [institutionDetails, setInstitutionDetails] = useState<InstitutionInfo| null>(null);
    const [comparableInstitutions, setComparableInstitutions] = useState<InstitutionInfo[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places']
    });


    useEffect(() => {
        setLoading(true);
    
        const pathSegments = window.location.pathname.split('/');
        const encodedHospName = pathSegments.pop() || '';
        const hosp_name = decodeURIComponent(encodedHospName); 

        index.search<InstitutionInfo>(hosp_name)
            .then(({ hits }) => {
                if (hits && hits.length > 0) {
                    const result = hits[0];
                    setInstitutionDetails({
                        objectID: result.objectID,
                        hosp_name: result.hosp_name,
                        area: result.area,
                        path: result.path,
                        tel: result.tel,
                        hosp_addr: result.hosp_addr,
                        division: result.division,
                        view: result.view,
                        lat: result.lat,
                        lng: result.lng,
                        imageUrl: result.imageUrl,
                        lastmodified: result.lastmodified
                    });
                } else {
                    console.error('No data found for:', hosp_name);
                }
            }).catch(error => {
                console.error('Search failed:', error);
            });
            setLoading(false);
    }, []);
    
    useEffect(() => {
        if (institutionDetails) {
            setLoading(true);
            const filters = `division:"${institutionDetails.division}" AND area:"${institutionDetails.area}"`;
            console.log(filters);
            index.search<InstitutionInfo>('', { filters })
                .then(({ hits }) => {
                    const filteredHits = hits.filter(hit => hit.objectID !== institutionDetails.objectID).map(hit => ({
                        objectID: hit.objectID,
                        hosp_name: hit.hosp_name || '',
                        area: hit.area || '',
                        path: hit.path || '',
                        tel: hit.tel || '',
                        hosp_addr: hit.hosp_addr || '',
                        division: hit.division || '',
                        view: hit.view || 0,
                        lat: hit.lat || 0,
                        lng: hit.lng || 0,
                        imageUrl: hit.imageUrl || '',
                        lastmodified: hit.lastmodified || { _operation: '', value: 0 }
                    }));
                    setComparableInstitutions(filteredHits);
                }).catch(error => {
                    console.error('Search failed for comparable institutions:', error);
                });
                setLoading(false);
        }
    }, [institutionDetails]);

    
    const mapCenter = useMemo(() => {
        if (institutionDetails && typeof institutionDetails.lat === 'number' && typeof institutionDetails.lng === 'number') {  //因可選參屬性,嚴格檢查型別
            return { lat: institutionDetails.lat, lng: institutionDetails.lng };
        }
        return { lat: 0, lng: 0 };
    }, [institutionDetails]);


    /*const handleIncrement = (hosp_name: string, url: string) => {
        //incrementView(hosp_name);
        router.push(url); 
    };*/


    const handleNext = () => {
        if (carouselIndex + 3 < comparableInstitutions.length) {
            setCarouselIndex(prev => prev + 3);
        }
    };
    const handlePrev = () => {
        if (carouselIndex > 0) {
            setCarouselIndex(prev => prev - 3);
        }
    };
    const displayedInstitutions = useMemo(() => {
        return comparableInstitutions.slice(carouselIndex, carouselIndex + 3);
    }, [carouselIndex, comparableInstitutions]);

    const isAtStart = carouselIndex === 0;
    const isAtEnd = carouselIndex + 3 >= comparableInstitutions.length;


    const handleAddClick = async (institution: InstitutionInfo, userId:string) => {
        if (!user) return;

        const newRecord: FirebaseFavoriteData = {
            userId: user.uid,
            hosp_name: institution.hosp_name,
            hosp_addr: institution.hosp_addr,
            tel:institution.tel,
            //division: institution.division, 
            //cancer_screening: institution.cancer_screening,
            timestamp: new Date() ,
            imageUrl: institution.imageUrl
        };
        await addFavorite(newRecord);
    };
    const handleRemoveClick = async (objectID:string, userId:string) => {
        if (!user) return;

        const q = query(collection(db, 'favorites'), where("hosp_name", "==", objectID), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
            const batch = querySnapshot.docs.map(async (document) => {
                await deleteDoc(doc(db, 'favorites', document.id));
                return document.id;
            });
            const deletedDocIds = await Promise.all(batch);
    
            deletedDocIds.forEach(docId => {
                removeFavorite(docId);
            });
        } else {
            console.error("firestore無此筆收藏紀錄文件或狀態找不到對應id的元素");
        }
    };

    const handleIncrement = async (institution: InstitutionInfo) => {
        const docRef = doc(db, 'medicalInstitutions', institution.hosp_name);
        router.push(`/search/${encodeURIComponent(institution.hosp_name)}`);
        
        try {
            await updateDoc(docRef, {
                view: increment(1)
            });
            
        } catch (error) {
            console.error('Failed to increment views:', error);
        }
     };


    return(
        <>
            {isLoaded && institutionDetails ? (
            <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <main className="w-full h-auto flex flex-col  justify-center items-center flex-grow  bg-[#FCFCFC]" >
                        <div className="flex w-full h-auto relative">
                            <div className="relative flex  flex-col w-full h-[300px]"> 
                                <Image  src="/images/institutionPage_banner.png" alt="icon" width={1700} height={300} className="w-auto h-[300px] object-cover"/>
                                <div className="absolute inset-0 w-full h-full bg-gray-900 bg-opacity-3">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-[#ffffff] font-bold text-[36px] text-center text-shadow-[2px 2px 8px rgba(0,0,0,0.8)] bg-[#FFFFFF] opacity-90 px-[8px] py-[16px] rounded-lg">
                                        {institutionDetails.hosp_name}
                                    </div>  
                                </div>
                            </div>  
                        </div>
                        <div className="mt-[100px] bg-[#ffffff] w-[1200px] flex flex-col items-center my-[50px] border-solid border-2 border-[#2D759E] shadow-[0_0_5px_#AABBCC]"> 
                            <div className="w-[1200px] px-[30px]">
                                <div className="w-full flex  flex-col items-center">
                                    {!user ? (
                                        <>
                                            <button type="button" onClick={() => setIsSignInModalVisible(true)}>
                                                <Image src="/images/heart_line.svg" alt="collection" width={40} height={40} className="mt-[30px] border-solid border-2 border-[#6898a5] rounded-full" />
                                            </button>
                                            {isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                                            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                                        </>
                                    ) : (
                                        <>
                                            {(() => {
                                                const isFavorited = state.favorites.some(item => item.userId === user.uid && item.hosp_name === institutionDetails.objectID);
                                                const handleHeartClick = isFavorited ? () => handleRemoveClick(institutionDetails.objectID, user.uid) : () => handleAddClick(institutionDetails, user.uid);
                                                return (
                                                    <button type="button" onClick={handleHeartClick}>
                                                        <Image 
                                                            src="/images/heart_line.svg" 
                                                            alt="collection" width={40} height={40} 
                                                            className={`${isFavorited ? 'bg-[#FFFFFF] border-[10px]  shadow-[0_0_10px_#6898a5]' : 'bg-transparent '} mt-[30px] border-solid border-2  border-[#6898a5] rounded-full`}
                                                        />
                                                    </button>
                                                );
                                            })()}
                                        </>
                                    )}
                                </div>
                                {/*簡介*/}
                                    <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                    <h3 className="text-2xl text-black underline decoration-[#2D759E] decoration-4 font-bold mb-[30px]">資訊簡介</h3>
                                    <form className="wfull h-full flex flex-col justify-around p-[10px] ml-[10px] text-black ">
                                        <div className="w-full flex  h-[24px] text-xl mb-[25px]">
                                            <p className="mr-[120px] font-bold">電話:</p>
                                            <span className="">{institutionDetails.tel}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl mb-[25px]">
                                            <p className="mr-[100px] font-bold">行政區:</p>
                                            <span className="">{institutionDetails.area}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl mb-[25px]">
                                            <p className="mr-[115px] font-bold">地址:</p>
                                            <span className="">{institutionDetails.hosp_addr}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl mb-[25px]">
                                            <p className="mr-[120px] font-bold">科別:</p>
                                            <span className="">{institutionDetails.division}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl mb-[25px]">
                                            <p className="mr-[40px] font-bold">癌症篩檢服務:</p>
                                            <span className="">{institutionDetails.cancer_screening}</span>
                                        </div>
                                    </form>
                                    {/*地圖*/}
                                    <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                    <h3 className="text-2xl text-black underline decoration-[#2D759E] decoration-4 font-bold mt-[5px] mb-[30px]">地圖實景</h3>
                                    {loading ? (
                                        <Skeleton height={450} width={1140} className="my-[40px] mx-auto" />
                                    ) : (
                                        <GoogleMap
                                            zoom={15}
                                            center={mapCenter}
                                            mapTypeId={google.maps.MapTypeId.ROADMAP}
                                            mapContainerStyle={{ width: "1140px", height: "450px" }}
                                            onLoad={(map) => console.log("Map Loaded")}
                                        >
                                            <Marker
                                                position={mapCenter}
                                                icon="/images/hospital_fill.svg"
                                                onLoad={() => console.log("Marker Loaded")}
                                            />
                                        </GoogleMap>
                                    )}
                                    {/*輪播薦*/}
                                    <hr className="w-full border-solid border border-[#acb8b6] my-[30px]"/>
                                    {loading ? (
                                        <Skeleton height={320} width={1140} className="my-[40px] mx-auto" />
                                    ) : (
                                    <div className="w-full">
                                        <h3 className="text-black font-bold text-2xl  underline decoration-[#2D759E] decoration-4 my-[10px]">您可能也想比較...</h3>
                                        <div className="w-full flex justify-between mt-[50px] relative px-[60px]">
                                            <button
                                                id="left-arrow"
                                                onClick={handlePrev}
                                                disabled={isAtStart}
                                                className={`flex justify-center items-center w-9 h-full ${isAtStart ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <Image src="/images/left_arrow.png" alt="left-arrow-icon" width={46} height={46} />
                                            </button>  
                                            {displayedInstitutions.map(institution => (   
                                                <div  key={institution.hosp_name} className="relative h-[320px] border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                                                     <button onClick={() => handleIncrement(institution)} className="h-full w-full flex flex-col">
                                                        {institution.imageUrl && (
                                                            <Image
                                                                src={institution.imageUrl}
                                                                alt="institution"
                                                                width={250}
                                                                height={200}
                                                                className="w-full h-[200px] object-cover object-center"
                                                                unoptimized={true}
                                                            />
                                                        )}
                                                        <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[10px] pr-[15px]">{institution.hosp_name}</div>
                                                        <div className="w-full h-[30px] flex items-center justify-end">
                                                            <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                            <span className="ml-2 text-black mr-[10px]">觀看數:{institution.view}</span>
                                                        </div>
                                                    </button>
                                                    {!user ? (
                                                        <>
                                                            <button type="button"  className="absolute top-1.5 right-1.5 z-10" onClick={() => setIsSignInModalVisible(true)}>
                                                                <Image src="/images/heart_line.svg" alt="collection" width={40} height={40} className="border-solid border-2 border-[#6898a5] rounded-full" />
                                                            </button>
                                                            {isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                                                            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {(() => {
                                                                const isFavorited = state.favorites.some(item => item.userId === user.uid && item.hosp_name === institution.objectID);
                                                                const handleHeartClick = isFavorited ? () => handleRemoveClick(institution.objectID, user.uid) : () => handleAddClick(institution, user.uid);
                                                                return (
                                                                    <button type="button" className="absolute top-1.5 right-1.5 z-10" onClick={handleHeartClick}>
                                                                        <Image 
                                                                            src="/images/heart_line.svg" 
                                                                            alt="collection" width={40} height={40} 
                                                                            className={`${isFavorited ? 'bg-[#FFFFFF] border-[10px]  shadow-[0_0_10px_#6898a5]' : 'bg-transparent '} border-solid border-2  border-[#6898a5] rounded-full`}
                                                                        />
                                                                    </button>
                                                                );
                                                            })()}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                id="right-arrow"
                                                onClick={handleNext}
                                                disabled={isAtEnd}
                                                className={`flex justify-center items-center w-9 h-full ${isAtEnd ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <Image src="/images/right_arrow.png" alt="right-arrow-icon" width={46} height={46} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {/*返鈕*/}
                                <div className="flex items-center">
                                    <button 
                                        className="mx-auto my-16  w-64 bg-[#5B98BC] rounded-md py-4.5 px-2.5  h-11  hover:bg-[#9FC5DF]  font-bold text-white text-center text-[20px]"
                                        onClick={()=>router.push('/search')}
                                    >
                                        搜尋更多機構
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </motion.div>
            </AnimatePresence>
        ) : (
            <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#24657d' }}>
                <BounceLoader size="300px" color="#FFFFFF"/>
            </div>
        )}
        </>
    )
}


export default InstitutionContent;
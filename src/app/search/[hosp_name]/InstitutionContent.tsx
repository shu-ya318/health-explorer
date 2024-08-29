//import {useInstitutions }  from "../contexts/InstitutionsContext";
import { useRouter } from 'next/navigation'; 
import {useState, useEffect, useMemo, useRef} from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { motion, AnimatePresence } from "framer-motion"; 
import BounceLoader from "react-spinners/BounceLoader";
import { db } from '../../lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useFavorite } from '../../hooks/useFavorite'; 
import { FirebaseFavoriteData, InstitutionInfo} from '../../lib/types';
import { useAuth } from '../../hooks/useAuth'; 
import algoliasearch from 'algoliasearch/lite';
import SignInModal from '../../components/auth/SignInModal';
import RegisterModal from '../../components/auth/RegisterModal';

import GoogleMap from './GoogleMap';


const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string, 
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);
const index = searchClient.initIndex('Medical_Institutions');

const InstitutionContent: React.FC = (): React.ReactElement | null  => {

    const [openLoading, setOpenLoading] = useState<boolean>(true);
    const [loading,setLoading] = useState<boolean>(false);

    const favoriteButtonRef = useRef<HTMLButtonElement>(null);
    const loggedFavoriteButtonRef = useRef<HTMLButtonElement>(null);
    const [favoriteHover, setFavoriteHover] = useState<Record<string, boolean>>({});
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
    const { user } = useAuth();
    const { state, addFavorite, removeFavorite} = useFavorite();

    const router = useRouter();
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [institutionDetails, setInstitutionDetails] = useState<InstitutionInfo| null>(null);
    const [comparableInstitutions, setComparableInstitutions] = useState<InstitutionInfo[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);


    useEffect(() => {
        console.log('updated:', favoriteHover);
    }, [favoriteHover]);

    useEffect(() => {
        if (!user && favoriteButtonRef.current) {
            favoriteButtonRef.current.focus();
        } else if (user && loggedFavoriteButtonRef.current) {
            loggedFavoriteButtonRef.current.focus();
        }
    }, [user]);

    
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
            
            const filters = `area:"${institutionDetails.area}"`;
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
                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [institutionDetails]);

    
    const setFavoriteHoverState = (hosp_name: string, state: boolean) => {
        setFavoriteHover(prev => {
            if (prev[hosp_name] === state) {
                return prev; 
            }
            const updated = { ...prev, [hosp_name]: state };
            console.log(`Setting favorite hover for ${hosp_name} to ${state}`);
            return updated;
        });
    };


    const displayedInstitutions = useMemo(() => {
        return comparableInstitutions.slice(carouselIndex, carouselIndex + 3);
    }, [carouselIndex, comparableInstitutions]);

    const isAtStart = carouselIndex === 0;
    const isAtEnd = carouselIndex + 3 >= comparableInstitutions.length;

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
            { institutionDetails ? (
                <AnimatePresence>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <main className="common-col-flex  justify-center w-full h-auto bg-[#FCFCFC]" >
                            <div className="relative w-full h-auto flex">
                                <div className="relative w-full h-[400px] flex flex-col"> 
                                    <Image  priority={false} src="/images/institutionPage_banner.png" alt="icon" fill={true} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 w-full h-full bg-gray-900 bg-opacity-5">
                                        <div className="absolute top-[55%] left-1/2 -translate-x-[56%] -translate-y-1/2 min-w-72 text-black text-[#ffffff] font-bold text-[26px] text-center text-shadow-[2px 2px 8px rgba(0,0,0,0.8)] bg-[#FFFFFF] opacity-90 p-[10px] rounded-lg">
                                            {institutionDetails.hosp_name}
                                        </div>  
                                    </div>
                                </div>  
                            </div>
                            <div className="common-col-flex xl:w-full max-w-[1180px] w-[95%] mt-[100px] my-[50px] bg-[#ffffff] common-border border-2 shadow-[0_0_5px_#AABBCC]"> 
                                <div className="w-full xs:px-[30px] px-[10px]">
                                {!user && isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                                {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                                    <div className="w-full common-col-flex justify-between">
                                        {!user ? (
                                            <>
                                                <button 
                                                    ref={favoriteButtonRef}
                                                    type="button" 
                                                    onMouseEnter={() => {console.log(`Mouse entered for ${institutionDetails.hosp_name}`); setFavoriteHoverState(institutionDetails.hosp_name, true)}}
                                                    onMouseLeave={() => {console.log(`Mouse left for ${institutionDetails.hosp_name}`); setFavoriteHoverState(institutionDetails.hosp_name, false)}} 
                                                    onClick={() => {
                                                        console.log(`Click for ${institutionDetails.hosp_name}`);
                                                        setFavoriteHoverState(institutionDetails.hosp_name, false);
                                                        setIsSignInModalVisible(true);
                                                    }}
                                                >
                                                    <Image 
                                                        src={favoriteHover[institutionDetails.hosp_name] ? "/images/diamond_selected.png" : "/images/diamond_white.png"} 
                                                        alt="favorite" 
                                                        width={40} 
                                                        height={40} 
                                                        className={`rounded-full p-[2px] mt-[20px] ${favoriteHover[institutionDetails.hosp_name] ? 'bg-[#FFFFFF]  common-border border  shadow-[0_0_3px_#2D759E]':'border-none shadow-none bg-[#0000004d]' }`}
                                                    />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {(() => {
                                                    const isFavorited = state.favorites.some(item => item.userId === user.uid && item.hosp_name === institutionDetails.objectID);
                                                    const handleHeartClick = isFavorited ? () => handleRemoveClick(institutionDetails.objectID, user.uid) : () => handleAddClick(institutionDetails, user.uid);
                                                    return (
                                                        <button 
                                                            ref={loggedFavoriteButtonRef}
                                                            type="button" 
                                                            onMouseEnter={() => {console.log(`Mouse entered for ${institutionDetails.hosp_name}`); setFavoriteHoverState(institutionDetails.hosp_name, true)}}
                                                            onMouseLeave={() => { console.log(`Mouse left for ${institutionDetails.hosp_name}`); setFavoriteHoverState(institutionDetails.hosp_name, false)}} 
                                                            onClick={() => {
                                                                console.log(`Click for ${institutionDetails.hosp_name}`);
                                                                setFavoriteHoverState(institutionDetails.hosp_name, false);
                                                                handleHeartClick();
                                                            }}
                                                        >
                                                            <Image 
                                                                src={isFavorited || favoriteHover[institutionDetails.hosp_name]? "/images/diamond_selected.png" : "/images/diamond_white.png"}  
                                                                alt="favorite"
                                                                width={36} 
                                                                height={36} 
                                                                className={`rounded-full p-[2px] mt-[20px] ${isFavorited || favoriteHover[institutionDetails.hosp_name] ?'bg-[#FFFFFF]  common-border border shadow-[0_0_3px_#2D759E]':'border-none shadow-none bg-[#0000004d]'}`} 
                                                            />
                                                        </button>
                                                    );
                                                })()}
                                            </>
                                        )}
                                    </div>
                                    {/*簡介*/}
                                    <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                    <h3 className="xs:institutionPage-title-xs institutionPage-title-mobile mb-[30px] ">資訊簡介</h3>
                                    <div className="w-full h-full flex flex-col sm:justify-around justify-center text-black sm:text-xl ">
                                        <div className="w-full flex mb-[25px]">
                                            <span className="w-[90px] font-bold ">電話</span>
                                            <span>{institutionDetails.tel}</span>
                                        </div>
                                        <div className="w-full flex mb-[25px]">
                                            <span className="w-[90px] font-bold">行政區</span>
                                            <span>{institutionDetails.area}</span>
                                        </div>
                                        <div className="w-full flex mb-[25px]">
                                            <span className="w-[90px] font-bold">地址</span>
                                            <span>{institutionDetails.hosp_addr}</span>
                                        </div>
                                        <div className="w-full flex mb-[25px]">
                                            <span className="w-[90px] font-bold">科別</span>
                                            <span>{institutionDetails.division}</span>
                                        </div>
                                        <div className="w-full flex mb-[25px]">
                                            <span className="w-[90px] font-bold">癌症篩檢</span>
                                            <span>{institutionDetails.cancer_screening}</span>
                                        </div>
                                    </div>
                                    {/*地圖*/}
                                    <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                    <h3 className="xs:institutionPage-title-xs institutionPage-title-mobile  mb-[30px] mt-[5px]">地圖實景</h3>
                                    {loading ? (
                                        <div className="w-[90%] h-[450px] my-[40px] bg-gray-300 rounded-lg animate-pulse"></div>
                                    ) : (
                                        <>
                                            <div  className="flex flex-col w-full  md:h-[450px] sm:h-[400px] xs:h-[350px] h-[300px]"> 
                                                <GoogleMap institutionDetails={institutionDetails}/>
                                            </div>
                                        </>
                                    )}
                                    {/*輪播薦*/}
                                    <hr className="w-full border-solid border border-[#acb8b6] my-[30px]"/>
                                    {loading ? (
                                        <div className="w-[80%] h-[360px] my-[40px] bg-gray-300 rounded-lg animate-pulse"></div>   
                                    ) : (
                                        <div className="w-full">
                                            <h3 className="xs:institutionPage-title-xs institutionPage-title-mobile  my-[10px]">您可能也想比較...</h3>
                                            <div className="relative w-full common-row-flex justify-between mt-[50px]">
                                                <button
                                                    id="left-arrow"
                                                    onClick={handlePrev}
                                                    disabled={isAtStart}
                                                    className={`common-row-flex justify-center w-9 h-full ${isAtStart ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <Image src="/images/left_arrow.png" alt="left-arrow-icon" width={46} height={46} />
                                                </button>  
                                                <div className="md:w-[80%] xs:w-[95%] w-[70%] h-auto grid grid-cols-1 lg:gap-x-[1%] gap-0 justify-center items-start m-auto box-border">
                                                    {displayedInstitutions.map(institution => (   
                                                        <div  
                                                        key={institution.hosp_name} 
                                                        className="relative xs:w-full xs:h-[136px] w-full h-[300px] fill-column mb-[15px] border border-gray-300 rounded-sm overflow-hidden bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]"
                                                        >
                                                            <button onClick={() => handleIncrement(institution)} className="flex xs:flex-row flex-col h-full w-full">
                                                                {institution.imageUrl && (
                                                                    <Image
                                                                        src={institution.imageUrl}
                                                                        alt="institution"
                                                                        width={170}
                                                                        height={170}
                                                                        onLoad={() => setLoadedImages(prev => ({...prev, [institution.imageUrl]: true}))}
                                                                        style={loadedImages[institution.imageUrl] ? {} : {backgroundImage: 'linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)'}}
                                                                        className="xs:w-[170px] xs:h-[170px] w-[300px] h-[150px] common-bg-image"
                                                                    />
                                                                )}
                                                                <div className="flex flex-col w-full max-w-[700px] justify-between p-[15px]">
                                                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px]  w-[400px] common-card text-[16px] text-[#3E3A39] font-bold pr-[15px]">{institution.hosp_name}</div>
                                                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px] w-[400px] common-card text-[14px] text-[#595959]">{institution.division}</div>
                                                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px] w-[400px] common-card text-[14px] text-[#595959]">{institution.cancer_screening}</div>
                                                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px] w-[400px] common-row-flex w-[380px] h-[30px] ">
                                                                        <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} className="w-[20px] h-[20px]"/>
                                                                        <span className="ml-[5px]  text-[14px] text-[#707070]">{institution.view}</span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>   
                                                <button
                                                    id="right-arrow"
                                                    onClick={handleNext}
                                                    disabled={isAtEnd}
                                                    className={`common-row-flex justify-center w-9 h-full ${isAtEnd ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <Image src="/images/right_arrow.png" alt="right-arrow-icon" width={46} height={46} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/*返鈕*/}
                                    <div className="w-full h-auto flex items-center">
                                        <button 
                                            className="common-button w-64 h-11 mx-auto my-16 py-4.5 px-2.5 "
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
                <div className="common-row-flex justify-center h-screen" style={{ backgroundColor: "#FFFFFF" }}>
                    <BounceLoader size="300px" color="#24657d"/>
                </div>
            )}
        </>
    )
}


export default InstitutionContent;
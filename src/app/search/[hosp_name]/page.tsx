'use client';
import { InstitutionsProvider } from '../../contexts/InstitutionsContext';
import {useState, useEffect, useMemo} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import {useInstitutions }  from "../../contexts/InstitutionsContext";
import { FirebaseInstitutionData, FirebaseInstitutionDataExtended } from '../../lib/types.js';
// import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from "framer-motion"; 
import BounceLoader from "react-spinners/bounceLoader";


const Institution: React.FC = (): React.ReactElement | null  => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 

    const [openLoading, setOpenLoading] = useState<boolean>(true);
    const router = useRouter();
    const {institutionData, loading, views, incrementView} = useInstitutions();
    const [institutionDetails, setInstitutionDetails] = useState<FirebaseInstitutionDataExtended | null>(null);  //不型別定義[ ]，因接收內容為單物件、也不定義{ }
    const [comparableInstitutions, setComparableInstitutions] = useState<FirebaseInstitutionData[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const encodedHospName = pathSegments.pop() || '';
        const hosp_name = decodeURIComponent(encodedHospName); 
         if (!loading) {
            const matchedData = institutionData.find(data => data.hosp_name === hosp_name);
            setInstitutionDetails(matchedData || null);
            if (matchedData) {
                const filteredData = institutionData.filter(data =>
                    data.area === matchedData.area && data.division === matchedData.division && data.hosp_name !== hosp_name
                );
                setComparableInstitutions(filteredData);
                setCarouselIndex(0);
            }
        }
    }, [institutionData, loading]);

/*
    const mapCenter = useMemo(() => {
        if (institutionDetails && institutionDetails.lat !== undefined && institutionDetails.lng !== undefined) { //因可選參屬性,多檢查非空值
            return { lat: institutionDetails.lat, lng: institutionDetails.lng };
        }
        return { lat: 0, lng: 0 }; //抓不到經緯度的預設值
    }, [institutionDetails]);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places']
    });
*/


    const handleIncrement = (hosp_name: string, url: string) => {
        incrementView(hosp_name);
        window.location.href = url; 
    };


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


    return(
        <InstitutionsProvider>  
        <>
            {institutionDetails ? (
             <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <main className="w-full h-auto flex flex-col  justify-center items-center flex-grow  bg-[#F0F0F0]" >
                        <div className="mt-[100px] bg-[#ffffff] w-[1280px] flex flex-col items-center my-[50px] border-solid border-2 border-[#6898a5] shadow-[0_0_5px_#AABBCC]"> 
                            <div className="w-[1200px]">
                                <div className="w-full flex  flex-col items-center">
                                    <h3 className="text-3xl text-black font-bold text-center mt-[40px]">{institutionDetails.hosp_name}</h3>
                                    <Image src="/images/heart_line.svg" alt="collection"  width={40} height={40} className="mt-[30px] border-solid border-4 border-[#6898a5] rounded-full" />
                                </div>
                                {/*簡介*/}
                                    <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                    <h3 className="text-2xl text-black underline decoration-[#6898a5] decoration-4 font-bold mb-[30px]">資訊簡介</h3>
                                    <form className="wfull h-full flex flex-col justify-around p-[10px] ml-[10px]">
                                        <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                            <p className="mr-[120px]">電話:</p>
                                            <span className="">{institutionDetails.tel}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                            <p className="mr-[100px]">行政區:</p>
                                            <span className="">{institutionDetails.area}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                            <p className="mr-[115px]">地址:</p>
                                            <span className="">{institutionDetails.hosp_addr}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                            <p className="mr-[120px]">科別:</p>
                                            <span className="">{institutionDetails.division}</span>
                                        </div>
                                        <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                            <p className="mr-[40px]">癌症篩檢服務:</p>
                                            <span className="">{institutionDetails.cancer_screening}</span>
                                        </div>
                                    </form>
                                    {/*地圖*/}
                                    <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                    <h3 className="text-2xl text-black underline decoration-[#6898a5] decoration-4 font-bold mt-[5px] mb-[30px]">地圖實景</h3>
                                    {/*
                                    {loading ? (
                                        <Skeleton height={450} width={1200} className="my-[40px] mx-auto" />
                                    ) : (
                                        <GoogleMap
                                            zoom={15}
                                            center={mapCenter}
                                            mapTypeId={google.maps.MapTypeId.ROADMAP}
                                            mapContainerStyle={{ width: "1200px", height: "450px" }}
                                            onLoad={(map) => console.log("Map Loaded")}
                                        >
                                            <Marker
                                                position={mapCenter}
                                                onLoad={() => console.log("Marker Loaded")}
                                                icon="/images/heart_line.svg"
                                            />
                                        </GoogleMap>
                                    )}
                                    */}
                                    {/*輪播薦*/}
                                    <hr className="w-full border-solid border border-[#acb8b6] my-[30px]"/>
                                    {loading ? (
                                        <Skeleton height={320} width={1200} className="my-[40px] mx-auto" />
                                    ) : (
                                    <div className="w-full">
                                        <h3 className="text-black font-bold text-2xl  underline decoration-[#6898a5] decoration-4 my-[10px]">您可能也想比較...</h3>
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
                                                <Link 
                                                key={institution.hosp_name} 
                                                href={`/Search/${encodeURIComponent(institution.hosp_name)}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleIncrement(institution.hosp_name, `/Search/${encodeURIComponent(institution.hosp_name)}`);
                                                }}
                                            >
                                                <div className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                                                    <div className="relative">     {/* 圖片連結 `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(institution.hosp_addr)}&zoom=15&size=250x200&key=${apiKey}`   */}
                                                        <Image 
                                                            src={`http://www.google.com/intl/zh-TW/privacy}`} 
                                                            alt="institution" 
                                                            width={250} 
                                                            height={200} 
                                                            className="w-full object-cover object-center" 
                                                            unoptimized={true}
                                                        />
                                                        <Image 
                                                            className="absolute top-1.5 right-1.5 z-10 border-solid border-2 border-[#6898a5] rounded-full" 
                                                            src="/images/heart_line.svg" 
                                                            alt="collection" 
                                                            width={40} 
                                                            height={40} 
                                                        />
                                                    </div>
                                                    <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[10px] pr-[15px]">{institution.hosp_name}</div>
                                                    <div className="w-full h-[30px] flex items-center justify-end">
                                                        <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                        <span className="ml-2 text-black mr-[10px] mt-[5px]">觀看數:{views[institution.hosp_name]}</span>
                                                    </div>
                                                </div>
                                            </Link>
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
                                        className="mx-auto my-16  w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-11  hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]"
                                        onClick={()=>router.push('/Search')}
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
                <BounceLoader size="300" color="#FFFFFF"/>
            </div>
        )}
        </>
        </InstitutionsProvider>
    )
}

export default Institution;

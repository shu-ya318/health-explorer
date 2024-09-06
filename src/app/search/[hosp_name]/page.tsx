"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation'; 
import Image from "next/image";

import { useAuth } from "../../hooks/useAuth";
import useFavorite from "../../hooks/useFavorite";
import { useInstitution }  from "../../hooks/useInstitution";

import FavoriteButton from "./FavoriteButton";
import InstitutionMap from "./InstitutionMap";
import InstitutionCarousel from "./InstitutionCarousel";

import { InstitutionInfo } from "../../lib/types";
import algoliasearch from "algoliasearch/lite";

import { motion, AnimatePresence } from "framer-motion"; 
import BounceLoader from "react-spinners/BounceLoader";

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string, 
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);
const index = searchClient.initIndex("Medical_Institutions");

const InstitutionPage: React.FC = () => {
    const { user } = useAuth();

    const { state, handleAddFavorite, handleRemoveFavorite} = useFavorite(user);
    const { handleIncrement } = useInstitution();

    const router = useRouter();

    const [openLoading, setOpenLoading] = useState<boolean>(true);
    const [loading,setLoading] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [institutionDetails, setInstitutionDetails] = useState<InstitutionInfo| null>(null);
    const [comparableInstitutions, setComparableInstitutions] = useState<InstitutionInfo[]>([]);
    const [carouselIndex, setCarouselIndex] = useState<number>(0);

    useEffect(() => {
        const timer = setTimeout(() => {
          setOpenLoading(false);
        }, 1500);
    
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        setLoading(true);
    
        const pathSegments = window.location.pathname.split("/");
        const encodedHospName = pathSegments.pop() || "";
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
                        cancer_screening:result.cancer_screening,
                        view: result.view,
                        lat: result.lat,
                        lng: result.lng,
                        imageUrl: result.imageUrl,
                        lastmodified: result.lastmodified
                    });
                } else {
                    console.error("No data found for:", hosp_name);
                }
            }).catch(error => {
                console.error("Search failed:", error);
            });
            setLoading(false);
    }, []);
    
    useEffect(() => {
        if (institutionDetails) {
            setLoading(true);
            
            const filters = `area:"${institutionDetails.area}"`;
            index.search<InstitutionInfo>("", { filters })
                .then(({ hits }) => {
                    const filteredHits = hits.filter(hit => hit.objectID !== institutionDetails.objectID).map(hit => ({
                        objectID: hit.objectID,
                        hosp_name: hit.hosp_name || "",
                        area: hit.area || "",
                        path: hit.path || "",
                        tel: hit.tel || "",
                        hosp_addr: hit.hosp_addr || "",
                        division: hit.division || "",
                        cancer_screening:hit.cancer_screening || "",
                        view: hit.view || 0,
                        lat: hit.lat || 0,
                        lng: hit.lng || 0,
                        imageUrl: hit.imageUrl || "",
                        lastmodified: hit.lastmodified || { _operation: "", value: 0 }
                    }));
                    setComparableInstitutions(filteredHits);
                }).catch(error => {
                    console.error("Search failed for comparable institutions:", error);
                }).finally(() => {
                    setLoading(false);
                });
        }
    }, [institutionDetails]);


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

    if (openLoading) {
        return (
            <div className="common-row-flex justify-center h-screen bg-[#FFFFFF]">
            <BounceLoader 
                size="300px" 
                color="#24657d"
            />
        </div>
        );
    }

    return(
        <>
            { institutionDetails && (
                <AnimatePresence>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                    >
                        <main className="common-col-flex justify-center w-full h-auto bg-[#FCFCFC]" >
                            <div className="relative w-full h-auto flex">
                                <div className="relative w-full h-[400px] flex flex-col"> 
                                    <Image  
                                        src="/images/institutionPage_banner.png" 
                                        alt="institutionPage_banner" 
                                        fill={true} 
                                        className="w-full h-full object-cover"
                                        onLoad={() => setImageLoaded(true)}
                                        style={{backgroundImage: imageLoaded ? "" : "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)"}}
                                    />
                                    <div className="absolute inset-0 w-full h-full bg-gray-900 bg-opacity-5">
                                        <div className="absolute top-[55%] left-1/2 -translate-x-[56%] -translate-y-1/2 min-w-72 text-black text-[#ffffff] font-bold text-[26px] text-center text-shadow-[2px 2px 8px rgba(0,0,0,0.8)] bg-[#FFFFFF] opacity-90 p-[10px] rounded-lg">
                                            {institutionDetails.hosp_name}
                                        </div>  
                                    </div>
                                </div>  
                            </div>
                            <div className="common-col-flex xl:w-full max-w-[1180px] w-[95%] mt-[100px] my-[50px] bg-[#ffffff] common-border border-2 shadow-[0_0_5px_#AABBCC]"> 
                                <div className="w-full xs:px-[30px] px-[10px]">
                                    <FavoriteButton
                                        user={user} 
                                        state={state} 
                                        institutionDetails={institutionDetails}
                                        institutionName={institutionDetails.hosp_name}
                                        handleAddFavorite={handleAddFavorite} 
                                        handleRemoveFavorite={handleRemoveFavorite} 
                                    />
                                    <hr className="w-full my-[30px] border border-[#acb8b6]"/>
                                    <h3 className="xs:institutionPage-title-xs institutionPage-title-mobile mb-[30px]">資訊簡介</h3>
                                    <div className="w-full h-full flex flex-col sm:justify-around justify-center text-black sm:text-xl">
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
                                    <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                    <h3 className="xs:institutionPage-title-xs institutionPage-title-mobile  mb-[30px] mt-[5px]">地圖實景</h3>
                                    {loading ? (
                                        <div className="w-[90%] h-[450px] my-[40px] bg-gray-300 rounded-lg animate-pulse"></div>
                                    ) : (
                                        <InstitutionMap 
                                            institutionDetails={institutionDetails}
                                        />
                                    )}
                                    <hr className="w-full my-[30px] border-solid border border-[#acb8b6]"/>
                                    {loading ? (
                                        <div className="w-[80%] h-[360px] my-[40px] bg-gray-300 rounded-lg animate-pulse"></div>   
                                    ) : (
                                        <InstitutionCarousel
                                            displayedInstitutions={displayedInstitutions}
                                            handleNext={handleNext}
                                            handlePrev={handlePrev}
                                            handleIncrement={handleIncrement}
                                            isAtStart={isAtStart}
                                            isAtEnd={isAtEnd}
                                        />
                                    )}
                                    <div className="w-full h-auto flex items-center">
                                        <button 
                                            onClick={()=>router.push("/search")}
                                            type="button" 
                                            className="common-button w-64 h-11 mx-auto my-16 py-4.5 px-2.5"
                                        >
                                            搜尋更多機構
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    )
}

export default InstitutionPage;
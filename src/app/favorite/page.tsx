"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { useAuth } from "../hooks/useAuth"; 
import useFavorite from "../hooks/useFavorite";

import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import FavoriteDataDisplay from "./FavoriteDataDisplay";
import FavoriteExporter from "./FavoriteExporter";
import HomePage  from "../page"; 

import { FirebaseFavoriteData } from "../lib/types";

import { motion, AnimatePresence } from "framer-motion"; 
import RingLoader from "react-spinners/RingLoader";

const FavoritePage: React.FC = () => {
    const { user } = useAuth();
    const { state, handleRemoveFavorite } = useFavorite(user);

    const [openLoading, setOpenLoading] = useState<boolean>(true);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    
    const [favoriteData, setFavoriteData] = useState<FirebaseFavoriteData[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
          setOpenLoading(false);
        }, 1500);
    
        return () => clearTimeout(timer);
    }, []);

    const handleDeleteClick = (docId: string) => {
        setSelectedId(docId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async (hosp_name: string): Promise<void> => {
        if (!selectedId || !user) return;
    
        try {
            await handleRemoveFavorite(user, hosp_name);
            //確保即時更新本元件的state，重渲染反映在UI
            setFavoriteData(prevData => prevData.filter(item => item.hosp_name !== hosp_name));
        } catch (error) {
            console.error(error);
        } finally {
            setIsConfirmModalOpen(false);
        }
    };

    const handleCloseModal = () => {
        setIsConfirmModalOpen(false);
    };
    
    return ( 
        <>   
            {!user? 
                <HomePage/>
            :( 
                <>
                    { !favoriteData && openLoading ? (
                        <div className="h-screen common-row-flex justify-center bg-[#FFFFFF]">
                            <RingLoader 
                                size="300px" 
                                color="#24657d"
                            />
                        </div>
                    ) : (
                        <AnimatePresence>
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                            >
                                <main className="w-full h-auto common-col-flex justify-center">
                                {selectedId && (
                                    <ConfirmDeleteModal 
                                        isOpen={isConfirmModalOpen} 
                                        handleConfirmDelete={handleConfirmDelete} 
                                        handleCloseModal={handleCloseModal}
                                        hosp_name={favoriteData.find(item => item.id === selectedId)?.hosp_name || ""}
                                    />
                                )}
                                    <div className="relative w-full h-auto flex">
                                        <div className="relative w-full h-[360px] flex flex-col"> 
                                            <Image 
                                                src="/images/favoritePage_banner.jpg" 
                                                alt="favoritePage_banner" 
                                                fill={true} 
                                                className="w-full h-full object-cover"
                                                onLoad={() => setImageLoaded(true)}
                                                style={{backgroundImage: imageLoaded ? "" : "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)"}}
                                            />
                                            <div className="absolute inset-0 w-full h-full bg-gray-900 bg-opacity-20">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[#FFFFFF] text-center sm:text-[56px] xs:text-[48px] text-[37px]">收藏清單</div>  
                                            </div>
                                        </div>  
                                    </div>
                                    <div className="common-col-flex justify-center w-full min-h-screen bg-[#F0F0F0] backdrop-blur-sm my-auto pt-5 pb-10">
                                        <div className="xl:w-full max-w-[1180px] lg:w-[90%] xs:w-[80%] w-[95%] flex md:flex-row flex-col min-h-screen shadow-[0_0_10px_#AABBCC] rounded-lg">
                                            <FavoriteDataDisplay 
                                                user={user}
                                                favoriteData={favoriteData}
                                                setFavoriteData={setFavoriteData}
                                                handleDeleteClick={handleDeleteClick}
                                            />
                                            <FavoriteExporter 
                                                state={state}
                                                isDataEmpty={favoriteData.length === 0}
                                            />
                                        </div>
                                    </div>
                                </main>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </>
            )}
        </> 
    )
};

export default FavoritePage;
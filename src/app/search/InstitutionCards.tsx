import { useState } from "react";
import Image from "next/image";

import { FavoriteState } from "../hooks/useFavorite";

import SignInModal from "../components/auth/SignInModal";
import RegisterModal from "../components/auth/RegisterModal";

import { InstitutionInfo } from "../lib/types";

interface InstitutionCardsProps {
    user: any; 
    loading: boolean;
    postsPerPage: number;
    currentPosts:InstitutionInfo[];
    handleIncrement: (institution: InstitutionInfo) => void;
    setFavoriteHoverState: (hosp_name: string, state: boolean) => void;
    handleAddClick: (institution: InstitutionInfo, userId:string) => void;
    handleRemoveClick: (objectID:string, userId:string) => void;
    favoriteButtonRef: React.RefObject<HTMLButtonElement>;
    loggedFavoriteButtonRef: React.RefObject<HTMLButtonElement>;
    favoriteHover: Record<string, boolean>;
    state: FavoriteState;
}

const InstitutionCards: React.FC<InstitutionCardsProps> = ({
    user,
    loading,
    postsPerPage,
    currentPosts,
    handleIncrement,
    setFavoriteHoverState,
    handleAddClick,
    handleRemoveClick,
    favoriteButtonRef,
    loggedFavoriteButtonRef,
    favoriteHover,
    state
}) => {
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
    const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    return (
        <>
            {!user && isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
            <div className="w-full h-auto grid lg:grid-cols-2 grid-cols-1 lg:gap-x-[1%] gap-0 justify-center items-start m-auto box-border">
            {loading ? (
                Array.from({ length: postsPerPage-12 }, (_, index) => ( 
                    <div key={index} role='status' className='max-w-sm border border-gray-300 rounded-lg p-4'>
                        <div className="w-full h-48 bg-gray-300 rounded-lg mb-5 flex justify-center items-center animate-pulse">
                            <svg 
                                className="w-8 h-8 stroke-gray-400" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" 
                                    stroke="stroke-current" 
                                    strokeWidth="1.6" 
                                    strokeLinecap="round"
                                >
                                </path>
                            </svg>
                        </div>
                        <div className="w-full flex justify-between items-start animate-pulse">
                            <div className="block">
                                <h3 className="h-3 bg-gray-300 rounded-full w-48 mb-4"></h3>
                            </div>
                            <span className="h-2 bg-gray-300 rounded-full w-16"></span>
                        </div>
                    </div>
                ))
            ) : (
            currentPosts.map((institution) => (
                    <div  
                        key={institution.hosp_name} 
                        className="h-[136px] relative lg:fill-two-columns fill-column mb-[15px] border border-gray-300 rounded-sm overflow-hidden bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]"
                    >
                            <button onClick={() => handleIncrement(institution)} className="flex h-full w-full">
                            {institution.imageUrl && (
                                <Image
                                    src={institution.imageUrl}
                                    alt="institution"
                                    width={170}
                                    height={170}
                                    className="w-[170px] h-[170px] object-cover"
                                    unoptimized={true}
                                    onLoad={() => setLoadedImages(prev => ({...prev, [institution.imageUrl]: true}))}
                                    style={loadedImages[institution.imageUrl] ? {} : {backgroundImage: "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)"}}
                                />
                            )}
                            <div className="flex flex-col w-full justify-between p-[15px]">
                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[16px] text-[#3E3A39] font-bold pr-[15px]">{institution.hosp_name}</div>
                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.division}</div>
                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.cancer_screening}</div>
                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-row-flex w-[380px] h-[30px] ">
                                    <Image 
                                        src="/images/eye-regular.svg" 
                                        alt="view" 
                                        width={20} 
                                        height={20} 
                                        className="w-[20px] h-[20px]"
                                    />
                                    <span className="ml-[5px]  text-[14px] text-[#707070]">{institution.view}</span>
                                </div>
                            </div>
                        </button>
                        {!user ? (
                            <>
                                <button
                                    onMouseEnter={() => {console.log(`Mouse entered for ${institution.hosp_name}`); setFavoriteHoverState(institution.hosp_name, true)}}
                                    onMouseLeave={() => { console.log(`Mouse left for ${institution.hosp_name}`); setFavoriteHoverState(institution.hosp_name, false)}}
                                    onClick={() => {
                                        console.log(`Click for ${institution.hosp_name}`);
                                        setFavoriteHoverState(institution.hosp_name, false);
                                        setIsSignInModalVisible(true);
                                    }} 
                                    ref={favoriteButtonRef}
                                    type="button"  
                                    className="absolute top-[5px] left-[130px] z-10"
                                >
                                    <Image 
                                        src={favoriteHover[institution.hosp_name] ? "/images/diamond_selected.png" : "/images/diamond_white.png"} 
                                        alt="favorite" 
                                        width={30} 
                                        height={30} 
                                        className={`w-[30px] h-[30px] rounded-full p-[2px] 
                                                    ${favoriteHover[institution.hosp_name] ? 'favorite-button-add':'favorite-button-remove' }`}
                                    />
                                </button>
                            </>
                        ) : (
                            <>
                                {(() => {
                                    const isFavorited = (institution: InstitutionInfo) => state.favorites.some(item => item.userId === user.uid && item.hosp_name === institution.hosp_name);
                                    const handleHeartClick = isFavorited(institution) ? () => handleRemoveClick(institution.objectID, user.uid) : () => handleAddClick(institution, user.uid);

                                    return (
                                        <button
                                            onMouseEnter={() => {console.log(`Mouse entered for ${institution.hosp_name}`); setFavoriteHoverState(institution.hosp_name, true)}}
                                            onMouseLeave={() => { console.log(`Mouse left for ${institution.hosp_name}`); setFavoriteHoverState(institution.hosp_name, false)}}
                                            onClick={() => {
                                                console.log(`Click for ${institution.hosp_name}`);
                                                setFavoriteHoverState(institution.hosp_name, false);
                                                handleHeartClick();
                                            }}
                                            ref={loggedFavoriteButtonRef}
                                            type="button" 
                                            className="absolute top-[5px] left-[130px] z-10" 
                                        >
                                            <Image 
                                                src={isFavorited(institution) || favoriteHover[institution.hosp_name] ? "/images/diamond_selected.png" : "/images/diamond_white.png"}
                                                alt="favorite" 
                                                width={30} 
                                                height={30} 
                                                className={`w-[30px] h-[30px] rounded-full p-[2px] 
                                                            ${isFavorited(institution) || favoriteHover[institution.hosp_name] ? 'favorite-button-add':'favorite-button-remove'}`}

                                            />
                                        </button>
                                    );
                                })()}
                            </>
                        )}
                    </div>
            ))
        )}
            </div>
        </>
    );
};

export default InstitutionCards;
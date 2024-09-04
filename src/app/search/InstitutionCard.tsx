import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { FavoriteState } from "../hooks/useFavorite";
import { UserType } from "../hooks/useAuth"; 
import { InstitutionInfo } from "../lib/types";

import SignInModal from "../components/auth/SignInModal";
import RegisterModal from "../components/auth/RegisterModal";

interface InstitutionCardsProps {
    user: UserType | null;
    state: FavoriteState;
    institution: InstitutionInfo;
    handleIncrement: (institution: InstitutionInfo) => void;
    handleAddFavorite: (user: UserType | null, institution: InstitutionInfo)  => void;
    handleRemoveFavorite: (user: UserType | null, docId: string)=> void;
}

const InstitutionCard: React.FC<InstitutionCardsProps> = ({
    user,
    state,
    institution,
    handleIncrement,
    handleAddFavorite,
    handleRemoveFavorite
}) => {
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
    const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);    
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [favoriteHover, setFavoriteHover] = useState<Record<string, boolean>>({});

    const favoriteButtonRef = useRef<HTMLButtonElement>(null);
    const loggedFavoriteButtonRef = useRef<HTMLButtonElement>(null);

    
    useEffect(() => {
        console.log("updated:", favoriteHover);
    }, [favoriteHover]);

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

    return (
        <>
            {!user && isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
            <div className="h-[136px] relative lg:fill-two-columns fill-column mb-[15px] border border-gray-300 rounded-sm overflow-hidden bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                    <button 
                        onClick={() => handleIncrement(institution)} 
                        className="h-full w-full flex"
                    >
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
                    <div className="w-full flex flex-col justify-between p-[15px]">
                        <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card pr-[15px] text-[16px] text-[#3E3A39] font-bold">{institution.hosp_name}</div>
                        <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.division}</div>
                        <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.cancer_screening}</div>
                        <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px]  h-[30px] common-row-flex">
                            <Image 
                                src="/images/eye-regular.svg" 
                                alt="view" 
                                width={20} 
                                height={20} 
                                className="w-[20px] h-[20px]"
                            />
                            <span className="ml-[5px] text-[14px] text-[#707070]">{institution.view}</span>
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
                            const isFavorited = (institution: InstitutionInfo) => state.favorites.some(item => item.userId ===  user.uid && item.hosp_name === institution.hosp_name);
                            const handleHeartClick = isFavorited(institution) ? () => handleRemoveFavorite(user, institution.hosp_name) : () => handleAddFavorite(user, institution);

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
                                                    ${isFavorited(institution) || favoriteHover[institution.hosp_name] ? "favorite-button-add":"favorite-button-remove"}`}

                                    />
                                </button>
                            );
                        })()}
                    </>
                )}
            </div>
           
        </>
    );
};

export default InstitutionCard;
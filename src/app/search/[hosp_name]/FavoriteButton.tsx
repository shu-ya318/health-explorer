import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { FavoriteState } from "../../hooks/useFavorite";
import { UserType } from "../../hooks/useAuth"; 
import { InstitutionInfo } from "../../lib/types";

import SignInModal from "../../components/auth/SignInModal";
import RegisterModal from "../../components/auth/RegisterModal";

interface FavoriteButtonProps {
    user: UserType | null; 
    state: FavoriteState;
    setFavoriteHoverState: (hosp_name: string, state: boolean) => void;
    handleAddClick: (institution: InstitutionInfo, userId:string) => void;
    handleRemoveClick: (objectID:string, userId:string) => void;
    favoriteHover: Record<string, boolean>;
    institutionDetails:InstitutionInfo;
    institutionName: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
    user,
    state,
    setFavoriteHoverState,
    handleAddClick,
    handleRemoveClick,
    favoriteHover,
    institutionDetails,
    institutionName 
}) => {
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
    const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
    const favoriteButtonRef = useRef<HTMLButtonElement>(null);
    const loggedFavoriteButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!user && favoriteButtonRef.current) {
            favoriteButtonRef.current.focus();
        } else if (user && loggedFavoriteButtonRef.current) {
            loggedFavoriteButtonRef.current.focus();
        }
    }, [user]);

    return (
        <>
            {! user && isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
            <div className="w-full common-col-flex justify-between">
                {!user ? (
                    <>
                        <button 
                            ref={favoriteButtonRef}
                            type="button" 
                            onMouseEnter={() => {console.log(`Mouse entered for ${institutionName}`); setFavoriteHoverState(institutionName, true)}}
                            onMouseLeave={() => {console.log(`Mouse left for ${institutionName}`); setFavoriteHoverState(institutionName, false)}} 
                            onClick={() => {
                                console.log(`Click for ${institutionName}`);
                                setFavoriteHoverState(institutionName, false);
                                setIsSignInModalVisible(true);
                            }}
                        >
                            <Image 
                                src={favoriteHover[institutionName] ? "/images/diamond_selected.png" : "/images/diamond_white.png"} 
                                alt="favorite" 
                                width={40} 
                                height={40} 
                                className={`rounded-full p-[2px] mt-[20px] 
                                            ${favoriteHover[institutionName] ? 'bg-[#FFFFFF]  common-border border  shadow-[0_0_3px_#2D759E]':'border-none shadow-none bg-[#0000004d]' }`}
                            />
                        </button>
                    </>
                ) : (
                    <>
                        {(() => {
                            const isFavorited = state.favorites.some(item => item.userId === user.uid && item.hosp_name === institutionName);
                            const handleHeartClick = isFavorited ? () => handleRemoveClick(institutionName, user.uid) : () => handleAddClick(institutionDetails, user.uid);
                            return (
                                <button 
                                    ref={loggedFavoriteButtonRef}
                                    type="button" 
                                    onMouseEnter={() => {console.log(`Mouse entered for ${institutionName}`); setFavoriteHoverState(institutionName, true)}}
                                    onMouseLeave={() => { console.log(`Mouse left for ${institutionName}`); setFavoriteHoverState(institutionName, false)}} 
                                    onClick={() => {
                                        console.log(`Click for ${institutionName}`);
                                        setFavoriteHoverState(institutionName, false);
                                        handleHeartClick();
                                    }}
                                >
                                    <Image 
                                        src={isFavorited || favoriteHover[institutionName]? "/images/diamond_selected.png" : "/images/diamond_white.png"}  
                                        alt="favorite"
                                        width={36} 
                                        height={36} 
                                        className={`rounded-full p-[2px] mt-[20px] 
                                                    ${isFavorited || favoriteHover[institutionName] ?'bg-[#FFFFFF]  common-border border shadow-[0_0_3px_#2D759E]':'border-none shadow-none bg-[#0000004d]'}`} 
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

export default FavoriteButton;
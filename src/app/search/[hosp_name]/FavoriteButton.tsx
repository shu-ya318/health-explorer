import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { useAuth } from "../../hooks/useAuth";
import useFavorite from "../../hooks/useFavorite";

import SignInModal from "../../components/auth/SignInModal";
import RegisterModal from "../../components/auth/RegisterModal";

import { InstitutionInfo } from "../../lib/types";

interface FavoriteButtonProps {
    institutionDetails:InstitutionInfo;
    institutionName: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
    institutionDetails,
    institutionName,
}) => {
    const { user } = useAuth();
    const { state, handleAddFavorite, handleRemoveFavorite} = useFavorite(user);

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
            {!user && isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
            <div className="w-full common-col-flex justify-between">
                {!user ? (
                    <>
                        <button
                            onClick={() => {setIsSignInModalVisible(true)}} 
                            ref={favoriteButtonRef}
                            type="button"
                        >
                            <Image 
                                src="/images/diamond_white.png" 
                                alt="favorite" 
                                width={40} 
                                height={40} 
                                className="mt-[20px] p-[2px] rounded-full favorite-button-remove"
                            />
                        </button>
                    </>
                ) : (
                    <>
                        {(() => {
                            const isFavorited = state.favorites.some(item => item.userId === user.uid && item.hosp_name === institutionName);
                            const handleFavoriteClick = isFavorited ? () => handleRemoveFavorite(user, institutionName) : () => handleAddFavorite(user, institutionDetails);
                            return (
                                <button 
                                    onClick={() => {handleFavoriteClick()}}
                                    ref={loggedFavoriteButtonRef}
                                    type="button"
                                >
                                    <Image 
                                        src={isFavorited ? "/images/diamond_selected.png" : "/images/diamond_white.png"}  
                                        alt="favorite"
                                        width={40} 
                                        height={40} 
                                        className={`rounded-full p-[2px] mt-[20px] 
                                                    ${isFavorited ?"favorite-button-add":"favorite-button-remove"}`} 
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
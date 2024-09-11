import { useState, useRef } from "react";
import Image from "next/image";

import { useAuth } from "../hooks/useAuth";
import useFavorite from "../hooks/useFavorite";
import { useInstitution }  from "../hooks/useInstitution";

import SignInModal from "../components/auth/SignInModal";
import RegisterModal from "../components/auth/RegisterModal";

import { InstitutionInfo } from "../lib/types";

interface InstitutionCardsProps {
    institution: InstitutionInfo;
}

const InstitutionCard: React.FC<InstitutionCardsProps> = ({
    institution,
}) => {
    const { user } = useAuth();
    const { state, handleAddFavorite, handleRemoveFavorite} = useFavorite(user);
    const { handleIncrement } = useInstitution();

    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
    const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);    
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const favoriteButtonRef = useRef<HTMLButtonElement>(null);
    const loggedFavoriteButtonRef = useRef<HTMLButtonElement>(null);
    

    return (
        <>
            {!user && isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
            <section className="relative h-[136px] lg:fill-two-columns fill-column mb-[15px] border border-gray-300 rounded-sm overflow-hidden bg-[#FFFFFF] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                    <button 
                        onClick={() => handleIncrement(institution)}
                        type="button" 
                        className="w-full h-full flex"
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
                    <section className="w-full flex flex-col justify-between p-[15px]">
                        <div className="xl:w-[380px] xs:w-[300px] xxs:w-[168px] w-[100px] common-card pr-[15px] text-[16px] text-[#3E3A39] font-bold">{institution.hosp_name}</div>
                        <div className="xl:w-[380px] xs:w-[300px] xxs:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.division}</div>
                        <div className="xl:w-[380px] xs:w-[300px] xxs:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.cancer_screening}</div>
                        <div className="xl:w-[380px] xs:w-[300px] xxs:w-[168px] w-[100px]  h-[30px] common-row-flex">
                            <Image 
                                src="/images/eye-regular.svg" 
                                alt="view" 
                                width={20} 
                                height={20} 
                                className="w-[20px] h-[20px]"
                            />
                            <span className="ml-[5px] text-[14px] text-[#707070]">{institution.view}</span>
                        </div>
                    </section>
                </button>
                {!user ? (
                    <>
                        <button
                            onClick={() => setIsSignInModalVisible(true)}
                            ref={favoriteButtonRef}
                            type="button"  
                            className="absolute top-[5px] left-[130px] z-10"
                        >
                            <Image 
                                src="/images/diamond_white.png"
                                alt="favorite" 
                                width={30} 
                                height={30} 
                                className="w-[30px] h-[30px] p-[2px] rounded-full favorite-button-remove"
                            />
                        </button>
                    </>
                ) : (
                    <>
                        {(() => {
                            const isFavorited = (institution: InstitutionInfo) => state.favorites.some(item => item.userId ===  user.uid && item.hosp_name === institution.hosp_name);
                            const handleFavoriteClick = isFavorited(institution) ? () => handleRemoveFavorite(user, institution.hosp_name) : () => handleAddFavorite(user, institution);

                            return (
                                <button
                                    onClick={() => {handleFavoriteClick()}}
                                    ref={loggedFavoriteButtonRef}
                                    type="button" 
                                    className="absolute top-[5px] left-[130px] z-10" 
                                >
                                    <Image 
                                        src={isFavorited(institution) ? "/images/diamond_selected.png" : "/images/diamond_white.png"}
                                        alt="favorite" 
                                        width={30} 
                                        height={30} 
                                        className={`w-[30px] h-[30px] rounded-full p-[2px] 
                                                    ${isFavorited(institution) ? "favorite-button-add":"favorite-button-remove"}`}

                                    />
                                </button>
                            );
                        })()}
                    </>
                )}
            </section>
        </>
    );
};

export default InstitutionCard;
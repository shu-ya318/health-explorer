import { useState } from "react";
import Image from "next/image";
import { InstitutionInfo } from "../../lib/types";

interface InstitutionCarouselProps {
    displayedInstitutions: InstitutionInfo[];
    handleNext: () => void;
    handlePrev: () => void;
    handleIncrement: (institution: InstitutionInfo) => Promise<void>;
    isAtStart: boolean;
    isAtEnd: boolean;
}

const InstitutionCarousel: React.FC<InstitutionCarouselProps> = ({ 
    displayedInstitutions, 
    handleNext, 
    handlePrev, 
    handleIncrement, 
    isAtStart, 
    isAtEnd 
}) => {
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    return (
        <div className="w-full">
            <h3 className="xs:institutionPage-title-xs institutionPage-title-mobile my-[10px]">您可能也想比較...</h3>
            <div className="relative w-full common-row-flex justify-between mt-[50px]">
                <button
                    onClick={handlePrev}
                    type="button" 
                    id="left-arrow"
                    disabled={isAtStart}
                    className={`w-9 h-full common-row-flex justify-center  
                                ${isAtStart ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <Image 
                        src="/images/left_arrow.png" 
                        alt="left-arrow-icon" 
                        width={46} 
                        height={46} 
                    />
                </button>
                <div className="md:w-[80%] xs:w-[95%] w-[70%] h-auto grid grid-cols-1 lg:gap-x-[1%] gap-0 justify-center items-start m-auto box-border">
                    {displayedInstitutions.map(institution => (   
                        <div  
                            key={institution.hosp_name} 
                            className="relative w-full xs:w-full xs:h-[136px]h-[300px] fill-column mb-[15px] border border-gray-300 rounded-sm overflow-hidden bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]"
                        >
                            <button 
                                onClick={() => handleIncrement(institution)} 
                                type="button"
                                className="w-full h-full flex xs:flex-row flex-col"
                            >
                                {institution.imageUrl && (
                                    <Image
                                        src={institution.imageUrl}
                                        alt="institution"
                                        width={170} 
                                        height={170} 
                                        onLoad={() => setLoadedImages(prev => ({...prev, [institution.imageUrl]: true}))}
                                        style={loadedImages[institution.imageUrl] ? {} : {backgroundImage: "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)"}}
                                        className="xs:w-[170px] xs:h-[170px] w-[300px] h-[150px] common-bg-image"
                                    />
                                )}
                                <div className="w-full max-w-[700px] flex flex-col justify-between p-[15px]">
                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px]  w-[400px] pr-[15px] common-card text-[16px] text-[#3E3A39] font-bold">{institution.hosp_name}</div>
                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px] w-[400px] common-card text-[14px] text-[#595959]">{institution.division}</div>
                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px] w-[400px] common-card text-[14px] text-[#595959]">{institution.cancer_screening}</div>
                                    <div className="xl:w-[380px] sm:w-[300px] xs:w-[180px] w-[400px] h-[30px] common-row-flex">
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
                        </div>
                    ))}
                </div>   
                <button
                    type="button" 
                    id="right-arrow"
                    onClick={handleNext}
                    disabled={isAtEnd}
                    className={`w-9 h-full common-row-flex justify-center 
                                ${isAtEnd ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <Image 
                        src="/images/right_arrow.png" 
                        alt="right-arrow-icon" 
                        width={46} 
                        height={46} 
                    />
                </button>
            </div>
        </div>
    );
};

export default InstitutionCarousel;
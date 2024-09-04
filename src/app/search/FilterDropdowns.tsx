import Image from "next/image";

interface FilterDropdownsProps {
    institutions: string[];
    divisions: string[];
    districts: string[];
    isOpenInstitutions: boolean;
    isOpenDivisions: boolean;
    isOpenDistricts: boolean;
    toggleDropdowns: (type: "institutions" | "divisions" | "districts") => void;
    handleSelectFilter: (value: string) => void;
}

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({ 
    institutions, 
    divisions, 
    districts,
    isOpenInstitutions,
    isOpenDivisions,
    isOpenDistricts,
    toggleDropdowns, 
    handleSelectFilter 
}) => {

    return (
        <div className="mx-w-screen-md h-9 flex flex-row justify-center mb-[20px]">
            <div className="sm:w-[150px] w-[100px] py-1 bg-2 bg-[#E0E0E0] rounded-l-md text-black text-center text-[16px]">排序:</div>
            <div className="relative sm:w-36 w-20">
                <button
                    onClick={() => toggleDropdowns("institutions")}
                    type="button"
                    className={`searchPage-label ${isOpenInstitutions ? "bg-[#2D759E] text-[#ffffff]" : "searchPage-label-notOpened"}`}
                >
                    依機構
                    <Image src="/images/down_small_line.svg" alt="institution" width={18} height={18} className="w-[18px] h-[18px]"/>
                </button>
                {isOpenInstitutions && (
                    <ul className="lg:searchPage-label-optionsGrid-lg md:searchPage-label-optionsGrid-md xs:searchPage-label-optionsGrid-xs xxs:searchPage-label-optionsGrid-xxs searchPage-label-optionsGrid-mobile">
                        {institutions.map((institution) => (
                            <li 
                                onClick={() => handleSelectFilter(institution)}
                                key={institution} 
                                className="searchPage-label-option py-2 md:text-center text-left"
                            >
                                {institution}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="relative sm:w-36 w-20">
                <button
                    onClick={() => toggleDropdowns("divisions")}
                    type="button"
                    className={`searchPage-label 
                                ${isOpenDivisions ? "bg-[#2D759E] text-[#ffffff]" : "searchPage-label-notOpened"}`}
                >
                    依科別
                    <Image 
                        src="/images/down_small_line.svg" 
                        alt="division" 
                        width={18} 
                        height={18} 
                        className="w-[18px] h-[18px]"
                    />
                </button>
                {isOpenDivisions && (
                    <ul className="lg:searchPage-label-optionsGrid-lg md:searchPage-label-optionsGrid-md xs:searchPage-label-optionsGrid-xs xxs:searchPage-label-optionsGrid-xxs searchPage-label-optionsGrid-mobile">
                        {divisions.map((division) => (
                            <li 
                                onClick={() => handleSelectFilter(division)}
                                key={division} 
                                className="searchPage-label-option py-1 md:text-center text-left" 
                            >
                                {division}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="relative sm:w-36 w-20">
                <button
                    onClick={() => toggleDropdowns("districts")}
                    type="button"
                    className={`rounded-r-md searchPage-label 
                                ${isOpenDistricts ? "bg-[#2D759E] text-[#ffffff]" : "searchPage-label-notOpened"}`} 
                >
                    依地區
                    <Image 
                        src="/images/down_small_line.svg" 
                        alt="district" 
                        width={18} 
                        height={18} 
                        className="w-[18px] h-[18px]"
                    />
                </button>
                {isOpenDistricts && (
                    <ul className="lg:searchPage-label-optionsGrid-lg md:searchPage-label-optionsGrid-md xs:searchPage-label-optionsGrid-xs xxs:searchPage-label-optionsGrid-xxs searchPage-label-optionsGrid-mobile">
                        {districts.map((district) => (
                            <li 
                                onClick={() => handleSelectFilter(district)}
                                key={district} 
                                className="searchPage-label-option py-1 md:text-center text-left" 
                            >
                                {district}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default FilterDropdowns;
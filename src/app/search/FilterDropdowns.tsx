import Image from "next/image";

interface FilterDropdownsProps {
    isOpenInstitutions: boolean;
    isOpenDivisions: boolean;
    isOpenDistricts: boolean;
    toggleDropdowns: (type: "institutions" | "divisions" | "districts") => void;
    handleSelectFilter: (value: string) => Promise<void>;
}

const institutions = [
    "衛生所", "診所", "醫院"
];

const divisions = [
    "婦產科", "牙醫一般科", "耳鼻喉科",
    "皮膚科", "眼科", "骨科",
    "精神科", "心理諮商及治療科", "家庭醫學科",
    "泌尿科", "內科", "外科"
];

const districts = [
    "板橋區", "三重區", "中和區", "永和區", "新莊區",
    "新店區", "樹林區", "鶯歌區", "三峽區", "淡水區",
    "汐止區", "瑞芳區", "土城區", "蘆洲區", "五股區",
    "泰山區", "林口區", "深坑區", "石碇區", "坪林區",
    "三芝區", "石門區", "八里區", "平溪區", "雙溪區",
    "貢寮區", "金山區", "萬里區", "烏來區"
];

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({ 
    isOpenInstitutions,
    isOpenDivisions,
    isOpenDistricts,
    toggleDropdowns, 
    handleSelectFilter 
}) => {

    return (
        <div className="hidden md:max-w-screen-md md:h-9 md:common-row-flex md:justify-center md:mb-[20px]">
            <div className="w-[150px] h-full flex bg-2 bg-[#E0E0E0] rounded-l-md text-black text-center text-[16px]">
                <div className="m-auto">排序:</div>
            </div>
            <div className="relative w-[144px] h-full">
                <button
                    onClick={() => toggleDropdowns("institutions")}
                    type="button"
                    className={`searchPage-label box-border ${isOpenInstitutions ? "bg-[#2D759E] text-[#ffffff]" : "searchPage-label-notOpened"}`}
                >
                    依機構
                    <Image 
                        src="/images/down_small_line.svg" 
                        alt="institution" 
                        width={18} 
                        height={18} 
                        className="w-[18px] h-[18px]"
                    />
                </button>
                {isOpenInstitutions && (
                    <ul className="lg:searchPage-label-optionsGrid-lg searchPage-label-optionsGrid">
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
            <div className="relative w-[144px] h-full">
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
                    <ul className="lg:searchPage-label-optionsGrid-lg searchPage-label-optionsGrid">
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
            <div className="relative w-[144px] h-full">
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
                    <ul className="lg:searchPage-label-optionsGrid-lg searchPage-label-optionsGrid">
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
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Search {
    filter: string;
    description: string;
    image: string;
    icon: string;
}

interface InstitutionSearchSectionProps {
    handleSearchClick: (filter: string) => void;
}

const searches: Search[] = [
    { description: "依行政區", filter: "蘆洲區", image: "/images/building.jpg", icon: "/images/building-solid.svg" },
    { description: "依科別", filter: "家庭醫學科", image: "/images/division.jpg", icon: "/images/stethoscope-solid.svg" },
    { description: "依癌篩項目", filter: "子宮頸癌", image: "/images/cancer.jpg", icon: "/images/magnifying-glass-plus-solid.svg" },
    { description: "依機構類型", filter: "醫院", image: "/images/institution.jpg", icon: "/images/hospital-regular.svg" }
];

const InstitutionSearchSection: React.FC<InstitutionSearchSectionProps> = ({ handleSearchClick }) => {
    const router = useRouter();

    return (
        <div className="w-full common-row-flex justify-center">
            <div  
                data-aos="fade-up"
                className="common-page-layout justify-between xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] xl:p-[20px] py-[20px] lg:my-20 my-20 backdrop-blur-[5px]"
            >
                <div className="mb-[30px] common-title xs:text-[32px] text-[28px]">醫療機構搜尋分類</div>
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 xl:gap-40 lg:gap-20 md:gap-x-52 sm:gap-y-8 sm:gap-x-32 gap-y-10 gap-x-0">
                {searches.map((search, index) => (
                <button
                    onClick={() => handleSearchClick(search.filter)}  
                    key={index}
                    className="common-col-flex justify-between" 
                >
                    <div className="overflow-hidden w-[165px] h-[165px] p-[4px] bg-[#FFFFFF] border-[4px] common-border rounded-full">
                    <div className="relative transition-all duration-300 hover:scale-110">
                        <Image  
                        src={search.image} 
                        alt="icon" 
                        width={148} 
                        height={148} 
                        className="w-[148px] h-[148px] rounded-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-20 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Image  
                            src={search.icon} 
                            alt="icon" 
                            width={75} 
                            height={85} 
                            className="w-[75px] h-[85px] object-contain"
                        />
                        </div>  
                    </div>  
                    </div>
                    <div className="homePage-subtitle">{search.description}</div>
                </button>
                ))}
            </div>
            <button
                onClick={()=>router.push("/search")}  
                type="button" 
                className="w-52 h-11 common-button mt-[30px] mb-5 py-4.5 px-2.5"
            >
                立即搜尋更多
            </button>
            </div>
        </div>
  );
}

export default InstitutionSearchSection;
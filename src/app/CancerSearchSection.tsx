import { useRouter } from "next/navigation";
import Image from "next/image";

interface Cancer {
  filter: string;
  image: string;
  icon: string;
}

interface CancerSearchSectionProps {
  handleSearchClick: (filter: string) => void;
}

const cancers: Cancer[] = [
    { filter: "子宮頸癌", image: "/images/cervical.jpg", icon: "/images/cervicalCancer.png"},
    { filter: "乳癌", image: "/images/breast.jpg", icon: "/images/breastCancer.png" },
    { filter: "大腸癌", image: "/images/colorectal.jpg", icon: "/images/colorectalCancer.png"},
    { filter: "口腔癌", image: "/images/oral.jpg", icon: "/images/oralCancer.png"},
    { filter: "肺癌", image: "/images/lung.jpg", icon: "/images/lungCancer.png"}
];

const CancerSearchSection: React.FC<CancerSearchSectionProps> = ({ handleSearchClick }) => {
  const router = useRouter();

  return (
    <div className="w-full h-auto common-col-flex justify-center">
        <div 
            data-aos="fade-down" 
            className="xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] common-page-layout justify-between xl:p-[20px] py-[20px] mb-0 mt-20 backdrop-blur-[5px]"
        >
            <div  className="mb-[30px] common-title xs:text-[32px] text-[28px]">癌篩機構搜尋分類</div>
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 xl:gap-20 lg:gap-[29px] md:gap-x-14 sm:gap-y-8 sm:gap-x-3 gap-y-10 gap-x-0">
            {cancers.map((cancer, index) => (
            <button
                onClick={() => handleSearchClick(cancer.filter)}  
                key={index}
                className="common-col-flex justify-between" 
            >
                <div className="w-[160px] h-[160px] p-[4px] overflow-hidden bg-[#FFFFFF] border-[4px] rounded-full common-border">
                <div className="relative transition-all duration-300 hover:scale-110">
                    <Image  
                    src={cancer.image} 
                    alt="cancer" 
                    width={145} 
                    height={145} 
                    className="w-auto h-auto rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-45 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image  
                        src={cancer.icon} 
                        alt="cancer_icon" 
                        width={80} 
                        height={85} 
                        className="w-auto h-auto object-cover"
                    />
                    </div>  
                </div>  
                </div>
                <div className="homePage-subtitle">{cancer.filter}</div>
            </button>
            ))}
            </div>
            <button
                onClick={()=>router.push("/cancerScreening")}  
                type="button"  
                className="w-52 h-11 common-button mt-[30px] mb-5 py-4.5 px-2.5" 
            >
                立即檢測資格
            </button>
        </div>
    </div>
  );
}

export default CancerSearchSection;
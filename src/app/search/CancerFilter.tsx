interface CancerFilterProps {
    handleCancerFilter: (filter: string) => void;
}

const cancers = [
    { filter: "子宮頸癌", image: "/images/cervicalCancer.png" },
    { filter: "乳癌", image: "/images/breastCancer.png" },
    { filter: "大腸癌", image: "/images/colorectalCancer.png" },
    { filter: "口腔癌", image: "/images/oralCancer.png" },
    { filter: "肺癌", image: "/images/lungCancer.png" }
];

const CancerFilter: React.FC<CancerFilterProps> = ({ 
    handleCancerFilter 
}) => {
    return (
        <section 
            style={{ bottom: "-165px" }} 
            className="absolute inset-x-0 lg:w-full max-w-[760px] w-[95%] md:min-h-[200px] h-auto common-page-layout justify-around md:mb-[60px] mb-[80px] mx-auto xs:px-[20px] px-0 common-border border"
        > 
            <div className="mt-[10px] common-title xs:text-[24px] text-[20px]">依癌篩資格搜尋</div>
            <div className="grid md:grid-cols-5 grid-cols-3 md:gap-x-16 xs:gap-x-20 xxs:gap-x-12 gap-x-10">
                {cancers.map((cancer, index) => (
                    <button 
                        onClick={() => handleCancerFilter(cancer.filter)}
                        key={index}
                        type="button" 
                        className="min-w-[80px] common-col-flex justify-between transition-transform duration-300 hover:scale-110 hover:rounded-lg hover:shadow-lg hover:shadow-gray-400 hover:bg-gradient-to-b from-[#FFFFFF] via-[#C3D8EA] to-[#77ACCC]" 
                    >
                        <div 
                            className="w-full h-[100px] common-bg-image" 
                            style={{ backgroundImage: `url(${cancer.image})` }}
                        ></div>
                        <div className="w-full mb-[10px] xs:text-[20px] text-[14px] text-[#252525] text-center font-bold">{cancer.filter}</div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CancerFilter;


interface Cancer {
    filter: string;
    image: string;
}

interface CancerFilterProps {
    cancers: Cancer[];
    handleCancerFilter: (filter: string) => void;
}

const CancerFilter: React.FC<CancerFilterProps> = ({ 
    cancers, 
    handleCancerFilter 
}) => {
    return (
        <div 
            style={{ bottom: "-165px" }} 
            className="absolute inset-x-0 lg:w-full max-w-[760px] w-[95%] md:min-h-[200px] h-auto common-page-layout justify-around md:mb-[60px] mb-[80px] mx-auto px-[20px] common-border border"
        > 
            <div className="mt-[10px] common-title text-[24px]">依癌篩資格搜尋</div>
            <div className="grid md:grid-cols-5 grid-cols-3 md:gap-x-16 xs:gap-x-20 xss:gap-x-12 gap-x-10">
                {cancers.map((cancer, index) => (
                    <button 
                        onClick={() => handleCancerFilter(cancer.filter)}
                        key={index}
                        type="button" 
                        className="common-col-flex justify-between transition-transform duration-300 hover:scale-110 hover:rounded-lg hover:shadow-lg hover:shadow-gray-400 hover:bg-gradient-to-b from-[#FFFFFF] via-[#C3D8EA] to-[#77ACCC]" 
                    >
                        <div 
                            className="w-full h-[100px] common-bg-image" 
                            style={{ backgroundImage: `url(${cancer.image})` }}
                        ></div>
                        <div className="w-full mb-[10px] xs:text-[20px] text-[14px] text-[#252525] text-center font-bold">{cancer.filter}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CancerFilter;

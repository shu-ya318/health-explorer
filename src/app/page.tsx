'use client';
import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { motion, AnimatePresence } from "framer-motion"; 
import PuffLoader from "react-spinners/PuffLoader";


interface Search {
  description: string;
  image: string;
}

interface Cancer {
  title: string;
  target: string;
  frequency: string;
  image: string;
}


const HomePage: React.FC = (): React.ReactElement | null  => {
  const router = useRouter();
 
  const searches = [
    { description: '依行政區', filter: '蘆洲區', image: '/images/building.jpg', icon: '/images/building-solid.svg' },
    { description: '依科別', filter: '家庭醫學科', image: '/images/division.jpg', icon: '/images/stethoscope-solid.svg' },
    { description: '依癌篩項目', filter: '子宮頸癌', image: '/images/cancer.jpg', icon: '/images/magnifying-glass-plus-solid.svg' },
    { description: '依機構類型', filter: '醫院', image: '/images/institution.jpg', icon: '/images/hospital-regular.svg' }
  ];
  const cancers = [
    { filter: '子宮頸癌', image:"/images/cervical.jpg", icon:"/images/cervicalCancer.png"},
    { filter: '乳癌', image: "/images/breast.jpg", icon:"/images/breastCancer.png" },
    { filter: '大腸癌', image:"/images/colorectal.jpg", icon:"/images/colorectalCancer.png"},
    { filter: '口腔癌', image:"/images/oral.jpg", icon:"/images/oralCancer.png"},
    { filter: '肺癌', image:"/images/lung.jpg", icon:"/images/lungCancer.png"}
  ];

  const [openLoading, setOpenLoading] = useState<boolean>(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration : 1000
    });
  }, []);


  const scrollDown = () => {
    window.scrollTo({
      top: 700,
      behavior: 'smooth'
    });
  };

  
  const handleSearchClick = (filter: string) => {
    router.push(`/search?filter=${filter}`);
  };


  if (openLoading) {
    return (
      <div className="common-row-flex justify-center h-screen bg-[#1e94b4]">
        <PuffLoader size="300px" color="#FFFFFF"/>
      </div>
    );
  }

  return ( 
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="relative w-full h-[750px] common-bg-image bg-[url('/images/homeBanner.png')]">
          <div className="absolute top-[77%] lg:left-[55%] md:left-[57%] sm:left-[61%] xss:left-[60%] left-[65%] -translate-x-[80%] -translate-y-[80%] common-col-flex justify-between">
            <div data-aos="fade-up" className="mt-22 cursor-pointer" onClick={ scrollDown }>
              <span className="sm:text-[50px] xss:text-[30px] text-[26px] text-[#FFFFFF] text-shadow-[2px 2px 8px rgba(0,0,0,0.8)]">立即探索</span>
              <br/>
              <Image src="/images/angles-down-solid.svg" alt="scroll-down" width={36} height={66} className="w-[36px] h-[66px] mx-auto mt-4 animate-bounce" />
            </div>
          </div>
        </div>
        {/*拆子元件*/}
        <div className="flex flex-col w-full h-auto bg-gradient-to-b from-[#FFFFFF] via-[#C3D8EA] to-[#77ACCC]">
          <div className="common-row-flex justify-center w-full">
          <div  
            data-aos="fade-right" 
            className="common-page-layout justify-between xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] xl:p-[20px] py-[20px] lg:my-20 mb-0 mt-20 backdrop-blur-[5px]"
          >
            <div className="mb-[30px] common-title xs:text-[32px] text-[28px]">醫療機構搜尋分類</div>
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 xl:gap-40 lg:gap-20 md:gap-x-52 sm:gap-y-8 sm:gap-x-32 gap-y-10 gap-x-0">
              {searches.map((search, index) => (
                <button  
                  key={index}
                  className="common-col-flex justify-between" 
                  onClick={() => handleSearchClick(search.filter)}
                >
                  <div className="overflow-hidden w-[165px] h-[165px] p-[4px] bg-[#FFFFFF] border-[4px] rounded-full common-border">
                    <div className="relative transition-all duration-300 hover:scale-110">
                      <Image  src={search.image} alt="icon" width={150} height={148} className="w-auto h-[148px] rounded-full object-cover"/>
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-20 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Image  src={search.icon} alt="icon" width={75} height={85} className="object-contain"/>
                      </div>  
                    </div>  
                  </div>
                  <div className="homePage-subtitle">{search.description}</div>
                </button>
              ))}
            </div>
            <button 
              type="button" 
              className="common-button mt-[30px] w-52 h-11 py-4.5 px-2.5 mb-5"
              onClick={()=>router.push('/search')} 
            >
              立即搜尋更多
            </button>
          </div>
          </div>
          <div className="common-col-flex justify-center w-full">
          <div data-aos="fade-left" className="common-page-layout justify-between xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] xl:p-[20px] py-[20px] my-20 backdrop-blur-[5px] ">
            <div  className="mb-[30px] common-title xs:text-[32px] text-[28px]">癌症篩檢搜尋分類</div>
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 xl:gap-20 lg:gap-[29px] md:gap-x-14 sm:gap-y-8 sm:gap-x-3 gap-y-10 gap-x-0">
              {cancers.map((cancer, index) => (
                <button  
                    key={index}
                    className="common-col-flex justify-between" 
                    onClick={() => handleSearchClick(cancer.filter)}
                >
                  <div className="overflow-hidden w-[160px] h-[160px] p-[4px] bg-[#FFFFFF] border-[4px] rounded-full common-border">
                    <div className="relative transition-all duration-300 hover:scale-110">
                      <Image  src={cancer.image} alt="icon" width={145} height={145} className="rounded-full object-cover"/>
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-45 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Image  src={cancer.icon} alt="icon" width={80} height={85} className="object-cover"/>
                      </div>  
                    </div>  
                  </div>
                  <div className="homePage-subtitle">{cancer.filter}</div>
                </button>
              ))}
            </div>
            <button 
                type="button"  
                className="common-button mt-[30px] w-52 h-11 py-4.5 px-2.5  mb-5" 
                onClick={()=>router.push('/cancerScreening')} 
            >
              立即查詢資格
            </button>
          </div>
          </div>
        </div>
        
      </motion.div>
    </AnimatePresence>
  )
}

export default HomePage;

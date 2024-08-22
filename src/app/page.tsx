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
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: "#1e94b4" }}>
        <PuffLoader size="300px" color="#FFFFFF"/>
      </div>
    );
  }

  return ( 
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        
        <div className="relative w-full h-[750px] bg-[url('/images/homeBanner.png')] bg-cover bg-center bg-no-repeat">
          <div className="absolute top-[77%] left-[55%] -translate-x-[80%] -translate-y-[80%] flex flex-col justify-between">
            <div className="text-center mt-22 cursor-pointer"  data-aos="fade-up" onClick={ scrollDown }>
              <span className="font-bold text-[50px] text-[#FFFFFF]  text-shadow-[2px 2px 8px rgba(0,0,0,0.8)]">立即探索</span>
              <br/>
              <Image src="/images/angles-down-solid.svg" alt="scroll-down" width={36} height={66} className="mx-auto w-[36px] h-[66px] mt-4 animate-bounce" />
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-gradient-to-b  from-[#FFFFFF] via-[#C3D8EA] to-[#77ACCC]">
          <div className="flex flex-col justify-center items-center">
          <div  data-aos="fade-right" className="max-w-[1200px] w-[92%] bg-[#FCFCFC]  backdrop-blur-[5px] rounded-[10px] shadow-[0_0_8px_rgb(0,0,0)] flex flex-col justify-between items-center p-[20px] my-20">
            <div className="text-[32px] font-bold mb-[30px] text-[#2D759E]">醫療機構搜尋分類</div>
            <div className="grid grid-cols-4 gap-40">
              {searches.map((search, index) => (
                <button  
                  key={index}
                  className="flex flex-col justify-between" 
                  onClick={() => handleSearchClick(search.filter)}
                >
                  <div className="overflow-hidden w-[165px] h-[165px] p-[4px] bg-[#FFFFFF] border-[4px] border-solid border-[#2D759E] rounded-full">
                    <div className="relative transition-all duration-300 hover:scale-110">
                      <Image  src={search.image} alt="icon" width={150} height={148} className="w-auto h-[148px] rounded-full object-cover"/>
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-20 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Image  src={search.icon} alt="icon" width={75} height={85} className="object-contain"/>
                      </div>  
                    </div>  
                  </div>
                  <div className="w-full text-center text-[24px] text-[#252525] hover:text-[#2D759E] font-bold mt-[15px]">{search.description}</div>
                </button>
              ))}
            </div>
            <button 
              type="button" 
              className="mt-[30px] w-52 bg-[#5B98BC] rounded-lg py-4.5 px-2.5  h-11  mb-5 hover:bg-[#2D759E]  font-bold text-white text-center text-[20px] transition-all duration-300 hover:scale-105"
              onClick={()=>router.push('/search')} 
            >
              立即搜尋更多
            </button>
          </div>
          </div>
          <div className="flex flex-col justify-center items-center">
          <div data-aos="fade-left" className="max-w-[1200px] w-[92%] bg-[#FCFCFC] backdrop-blur-[5px] rounded-[10px] shadow-[0_0_8px_rgb(0,0,0)] flex flex-col justify-between items-center p-[20px] my-20">
            <div  className="text-[32px] font-bold mb-[30px] text-[#2D759E]">癌症篩檢搜尋分類</div>
            <div className="grid grid-cols-5 gap-20">
              {cancers.map((cancer, index) => (
                <button  
                    key={index}
                    className="flex flex-col justify-between" 
                    onClick={() => handleSearchClick(cancer.filter)}
                >
                  <div className="overflow-hidden w-[160px] h-[160px] p-[4px]  bg-[#FFFFFF] border-[4px] border-solid border-[#2D759E] rounded-full">
                    <div className="relative transition-all duration-300 hover:scale-110">
                      <Image  src={cancer.image} alt="icon" width={145} height={145} className="rounded-full object-cover"/>
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-45 rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Image  src={cancer.icon} alt="icon" width={80} height={85} className="object-cover"/>
                      </div>  
                    </div>  
                  </div>
                  <div className="w-full text-center text-[24px] text-[#252525] hover:text-[#2D759E] font-bold mt-[15px]">{cancer.filter}</div>
                </button>
              ))}
            </div>
            <button 
                type="button"  
                className="mt-[30px] w-52 rounded-md py-4.5 px-2.5  h-11  mt-5 mb-5  bg-[#5B98BC] rounded-lg hover:bg-[#2D759E]  font-bold text-white text-center text-[20px] transition-all duration-300 hover:scale-110" 
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

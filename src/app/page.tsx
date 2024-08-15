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
    { description: '依行政區', filter: '蘆洲區', image: '/images/building-solid.svg' },
    { description: '依科別', filter: '家庭醫學科', image: '/images/stethoscope-solid.svg' },
    { description: '依癌篩項目', filter: '子宮頸癌', image: '/images/magnifying-glass-plus-solid.svg' },
    { description: '依機構類型', filter: '醫院', image: '/images/hospital-regular.svg' }
  ];
  const cancers = [
    { filter: '子宮頸癌', image:"/images/cervicalCancer.png"},
    { filter: '乳癌', image: "/images/breastCancer.png" },
    { filter: '大腸癌', image:"/images/colorectalCancer.png"},
    { filter: '口腔癌', image:"/images/oralCancer.png"},
    { filter: '肺癌', image:"/images/lungCancer.png"}
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
      top: 600,
      behavior: 'smooth'
    });
  };

  
  const handleSearchClick = (filter: string) => {
    router.push(`/search?filter=${filter}`);
  };


  if (openLoading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#24657d' }}>
        <PuffLoader size="300px" color="#FFFFFF"/>
      </div>
    );
  }

  return (       
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="relative w-full h-[640px] bg-[url('/images/homeBanner.webp')] bg-cover bg-center">
          <div className="absolute top-[65%] left-[27%] -translate-x-[80%] -translate-y-[80%] flex flex-col justify-between">
            <div className="flex flex-col animate__animated  animate__backInLeft animate__slow">
              <h1 className="text-center text-[50px] font-bold text-white">健康探索者</h1>
              <h3 className="text-center text-[30px] font-medium text-white">診救健康醫起來</h3>
            </div>
            <div className="text-center mt-20 cursor-pointer"  data-aos="fade-up" onClick={ scrollDown }>
              <span className="font-semibold text-xl text-black">往下看更多</span>
              <br/>
              <Image src="/images/angles-down-solid.svg" alt="scroll-down" width={36} height={36} className="mx-auto w-9 h-9 mt-10 animate-bounce" />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-gradient-to-b  from-[#eff4f5] via-[#c8d6da] to-[#a7bdc1]">
          <div  data-aos="fade-right" className="max-w-[1200px] w-[92%] bg-white backdrop-blur-[10px] rounded-[10px] shadow-[0_0_8px_rgb(0,0,0)] flex flex-col justify-between items-center p-[20px] my-20">
            <div className="text-[30px] font-bold mb-[30px] text-[#003E3E]">醫療機構搜尋分類</div>
            <div className="grid grid-cols-4 gap-40">
              {searches.map((search, index) => (
                  <button 
                    key={index} 
                    className="flex flex-col justify-between  p-[10px] text-[#336666] hover:bg-[#F0FFF0] rounded-[10px] transition-transform duration-300 hover:scale-110 hover:bg-gradient-to-b  from-[#eff4f5] via-[#c8d6da] to-[#a7bdc1] hover:shadow-lg hover:shadow-gray-400" 
                    onClick={() => handleSearchClick(search.filter)}
                  >
                    <div className="w-full h-[100px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${search.image})` }}></div>
                    <hr className="w-full border-solid border-2 border-[#acb8b6] mt-[50px]"/>
                    <div className="w-full text-center text-2xl font-bold py-5 text-[#013f5b]">{search.description}</div>
                  </button>
              ))}
            </div>
            <button 
              type="button" 
              className="w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-11  mt-5 mb-5 hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]"
              onClick={()=>router.push('/search')} 
            >
              搜尋更多
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-gradient-to-b  from-[#a7bdc1] via-[#c8d6da] to-[#eff4f5]">
          <div data-aos="fade-left" className="max-w-[1200px] w-[92%] bg-white backdrop-blur-[10px] rounded-[10px] shadow-[0_0_8px_rgb(0,0,0)] flex flex-col justify-between items-center p-[20px] my-20">
            <div  className="text-[30px] font-bold mb-[30px] text-[#003E3E]">癌症篩檢搜尋分類</div>
            <div className="grid grid-cols-5 gap-20">
              {cancers.map((cancer, index) => (
                  <button  
                    key={index} 
                    className="flex flex-col justify-between  p-[10px] text-[#336666] hover:bg-[#F0FFF0] rounded-[10px] transition-transform duration-300 hover:scale-110 hover:bg-gradient-to-b  from-[#eff4f5] via-[#c8d6da] to-[#a7bdc1] hover:shadow-lg hover:shadow-gray-400" 
                    onClick={() => handleSearchClick(cancer.filter)}
                  >
                    <div className="w-[120px] h-[150px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${cancer.image})` }}></div>
                    <hr className="w-full border-solid border-2 border-[#acb8b6] mt-[50px]"/>
                    <div className="w-full text-center text-2xl text-[#013f5b] font-bold py-10 ">{cancer.filter}</div>
                  </button>
                ))}
            </div>
            <button 
                type="button" 
                className="w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-11  mt-5 mb-5 hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]" 
                onClick={()=>router.push('/cancerScreening')} 
            >
                查詢免費癌篩資格
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default HomePage;

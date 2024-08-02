'use client';
import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';                //主應用程式勿用'next/router';
import organizeInstitutionData  from "./api/fetchOpenData";
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { motion, AnimatePresence } from "framer-motion"; 
import PuffLoader from "react-spinners/puffLoader";


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

   //可能改 搜尋頁標籤?
  const searches = [
    { description: "依行政區", image: "/images/building-solid.svg" },
    { description: "依科別", image: "/images/stethoscope-solid.svg" },
    { description: "依癌篩項目", image: "/images/person-cane-solid.svg" },
    { description: "依機構類型", image: "/images/hospital-regular.svg" }
  ];
  const cancers = [
    { title: "子宮頸癌", target:'30歲以上婦女', frequency:'每年1次', image: "/images/building-solid.svg" },
    { title: "卵巢癌", target:'45至69歲婦女、40-44歲二等血親乳癌史', frequency:'每2年1次', image: "/images/building-solid.svg" },
    { title: "大腸癌", target:'50至74歲民眾', frequency:'每2年1次', image: "/images/building-solid.svg" },
    { title: "口腔癌", target:'30歲以上有嚼檳榔(含已戒檳榔)或吸菸之民眾、18歲以上有嚼檳榔(含已戒檳榔)之原住民', frequency:'每2年1次', image: "/images/building-solid.svg" },
    { title: "肺癌", target:'具肺癌家族史或重度吸菸史之民眾', frequency:'每2年1次', image: "/images/building-solid.svg" }
  ];
  const [openLoading, setOpenLoading] = useState<boolean>(true);


  useEffect(() => {
    setTimeout(() => {
      setOpenLoading(false);
    }, 3000);
  }, []);


  useEffect(() => {
    AOS.init({
      duration : 2000
    });
  }, []);

  if (openLoading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#24657d' }}>
        <PuffLoader size="300" color="#FFFFFF"/>
      </div>
    );
  }

  return (       
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {/* 實際內容 */}
        <div className="relative w-full h-[640px] bg-[url('/images/homeBanner.webp')] bg-cover bg-center">
          <div className="absolute top-[65%] left-[27%] -translate-x-[80%] -translate-y-[80%] flex flex-col justify-between">
            <div className="flex flex-col animate__animated  animate__backInLeft animate__slow">
              <h1 className="text-center text-[50px] font-bold text-white">健康探索者</h1>
              <h3 className="text-center text-[30px] font-medium text-white">診救健康醫起來</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-gradient-to-b  from-[#eff4f5] via-[#c8d6da] to-[#a7bdc1]">
          <div  data-aos="fade-right" className="max-w-[1200px] w-[92%] bg-white/50 backdrop-blur-[3px] rounded-[10px] shadow-[0_0_5px_rgb(0,0,0)] flex flex-col justify-between items-center p-[20px] my-20">
            <div className="text-[30px] font-bold mb-[30px] text-[#014c68]">醫療機構搜尋</div>
            <div className="grid grid-cols-4 gap-40">
              {searches.map((search, index) => (
                  <div key={index} className="flex flex-col justify-between  p-[10px] text-[#0e4b66]">
                    <div className="w-full h-[100px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${search.image})` }}></div>
                    <div className="text-center text-lg font-bold py-10 ">{search.description}</div>
                  </div>
              ))}
            </div>
            <button 
              type="button" 
              className="w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-9  mt-5 mb-5 hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]"
              onClick={()=>router.push('/Search')} >
              搜尋更多
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-gradient-to-b  from-[#a7bdc1] via-[#c8d6da] to-[#eff4f5]">
          <div data-aos="fade-left" className="max-w-[1200px] w-[92%] bg-white/50 backdrop-blur-[3px] rounded-[10px] shadow-[0_0_5px_rgb(0,0,0)] flex flex-col justify-between items-center p-[20px] my-20">
            <div  className="text-[30px] font-bold mb-[30px] text-[#014c68]">癌症篩檢資訊</div>
            <div className="grid grid-cols-5 gap-20">
              {cancers.map((cancer, index) => (
                  <div key={index} className="flex flex-col justify-between  p-[10px]">
                    <div className="w-full h-[100px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${cancer.image})` }}></div>
                    <div className="w-full text-center text-lg text-[#0e4b66] font-bold py-10 ">{cancer.title}</div>
                    <ul className="w-full flex flex-col justify-center">
                      <li key={index} className="flex items-center mb-2">
                        <div className="mr-2">
                          <Image src="/images/person-cane-solid.svg" alt="icon" width={10} height={10} />
                        </div>
                        <span className="text-black">{cancer.frequency}</span>
                      </li>
                      <li key={index} className="flex items-center mb-2 text-black">
                        <div className="mr-2">
                          <Image src="/images/person-cane-solid.svg" alt="icon" width={10} height={10} />
                        </div>
                        <span>{cancer.target}</span>
                      </li>
                    </ul>
                  </div>
                ))}
            </div>
            <button 
                type="button" 
                className="w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-9  mt-10 mb-5 hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]" >
                查詢更多
            </button>
          </div>
        </div>
        {/* 
        <div className="flex justify-center items-center bg-[url('/images/homeBanner.webp')] bg-cover bg-center">
          <div className="relative max-w-[1200px] w-full h-[600px]">
            <h1 className="absolute top-[15%] left-[46%] -translate-x-[80%] -translate-y-[100%] max-w-[1200px] w-full text-center text-[60px] font-bold text-white">
              健康探索者
            </h1>
            <h3 className="absolute top-[21%] left-[46%] -translate-x-[80%] -translate-y-[100%] max-w-[1200px] w-full text-center text-[40px] font-medium text-white">
              診救健康醫起來
            </h3>
          </div>
        </div>
        */}

        {/*  

          */}
          {/*  */}
      </motion.div>
    </AnimatePresence>
  )
}

export default HomePage;

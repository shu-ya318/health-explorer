"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import CancerSearchSection from "./CancerSearchSection";
import InstitutionSearchSection from "./InstitutionSearchSection";

import { initInstitutionData } from "./api/initInstitutionData";

import { motion, AnimatePresence } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import AOS from "aos";
import "aos/dist/aos.css";
import "animate.css";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [openLoading, setOpenLoading] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        await initInstitutionData();
      } catch (error) {
        console.error("Failed to initialize institution data:", error);
      }
    };

    loadData();
  }, []);

  const scrollDown = () => {
    window.scrollTo({
      top: 700,
      behavior: "smooth",
    });
  };

  const handleSearchClick = (filter: string) => {
    router.push(`/search?filter=${filter}`);
  };

  if (openLoading) {
    return (
      <div className="common-row-flex justify-center h-screen bg-[#1E94B4]">
        <PuffLoader size="300px" color="#FFFFFF" data-testid="loader" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <section className="relative w-full h-[750px]">
          <Image
            src="/images/homeBanner.png"
            alt="homeBanner"
            fill={true}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            style={{
              backgroundImage: imageLoaded
                ? ""
                : "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)",
            }}
          />
          <div className="absolute top-[77%] lg:left-[55%] md:left-[57%] sm:left-[61%] xxs:left-[60%] left-[65%] -translate-x-[80%] -translate-y-[80%] common-col-flex justify-between">
            <button
              onClick={scrollDown}
              data-aos="fade-up"
              aria-label="開始探索" 
              role="button"
              className="mt-22 cursor-pointer sm:text-[50px] xxs:text-[30px] text-[26px] text-[#FFFFFF] text-shadow-[2px 2px 8px rgba(0,0,0,0.8)]"
            >
              開始探索
              <br />
              <Image
                src="/images/angles-down-solid.svg"
                alt="scroll-down"
                width={36}
                height={66}
                className="w-[36px] h-[66px] mx-auto mt-4 animate-bounce"
              />
            </button>
          </div>
        </section>
        <section className="w-full h-auto flex flex-col bg-gradient-to-b from-[#FFFFFF] via-[#C3D8EA] to-[#77ACCC]">
          <CancerSearchSection handleSearchClick={handleSearchClick} />
          <InstitutionSearchSection handleSearchClick={handleSearchClick} />
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomePage;

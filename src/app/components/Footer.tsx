"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../hooks/useAuth";

import SignInModal from "./auth/SignInModal";
import RegisterModal from "./auth/RegisterModal";

const Footer: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);

  const handleFavoriteClick = () => {
    if (user) {
      router.push("/favorite");
    } else {
      setIsSignInModalVisible(true);
    }
  };

  return (
    <footer className="w-full common-row-flex justify-center bg-[#4D8EB4] text-white text-lg">
      <div className="max-w-[1200px] w-full lg:w-[90%] md:w-[80%] flex sm:flex-row common-col-flex justify-between items-start mx-auto p-[15px]">
        <section className="common-row-flex justify-center my-auto sm:mr-10 mr-4 text-xl transition-all duration-300 hover:scale-110">
          <Link
            href="/"
            className="relative common-row-flex mt-2 no-underline font-bold cursor-pointer hover:text-[#ACB8B6]"
          >
            <Image
              src="/images/LOGO.png"
              alt="Logo"
              width={46}
              height={46}
              className="relative z-0 w-[46px] h-[46px] sm:mr-2 mr-4 object-cover"
            />
            <div className="common-col-flex mr-[5px]">
              <ruby className="text-[20px] text-center">
                健康探索者
                <rt className="text-[14px]">HealthExplorer</rt>
              </ruby>
            </div>
          </Link>
        </section>
        <section className="flex flex-col justify-start items-start my-auto ml-[50px] sm:ml-0 py-[20px] transition-all duration-300">
          <button
            onClick={handleFavoriteClick}
            type="button"
            className="mb-2.5 mr-2.5 text-white no-underline transition-colors cursor-pointer hover:text-[#ACB8B6] hover:scale-105"
          >
            我的收藏
          </button>
          {isSignInModalVisible && (
            <SignInModal
              onClose={() => setIsSignInModalVisible(false)}
              onShowRegister={() => setIsRegisterModalVisible(true)}
            />
          )}
          {isRegisterModalVisible && (
            <RegisterModal
              onClose={() => setIsRegisterModalVisible(false)}
              onShowSignIn={() => setIsSignInModalVisible(true)}
            />
          )}
          <Link
            href="/search"
            className="mb-2.5 mr-2.5 text-white no-underline transition-colors cursor-pointer hover:text-[#ACB8B6] hover:text-[#ACB8B6] hover:scale-105"
          >
            醫療機構搜尋
          </Link>
        </section>
        <section className="flex flex-col justify-start sm:items-start my-auto ml-[10px] sm:ml-0 py-[10px]">
          <Link
            href="https://github.com/shu-ya318/health-explorer"
            target="_blank"
            className="flex items-center shrink-0 mb-2.5 sm:mr-7 text-white no-underline transition-colors cursor-pointer hover:text-[#ACB8B6] transition-all duration-300 hover:scale-105"
          >
            <Image
              src="/images/github.svg"
              alt="GitHub"
              width={28}
              height={28}
              className="w-[28px] h-[28px] mr-2.5"
            />
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/%E6%B7%91%E9%9B%85-%E8%AC%9D-9906772b1"
            target="_blank"
            className="flex items-center shrink-0 mb-2.5 sm:mr-7 text-white no-underline transition-colors cursor-pointer hover:text-[#ACB8B6] transition-all duration-300 hover:scale-105"
          >
            <Image
              src="/images/linkedin.jpg"
              alt="Linkedin"
              width={28}
              height={28}
              className="w-[28px] h-[28px] mr-2.5"
            />
            Linkedin
          </Link>
          <Link
            href="https://www.cakeresume.com/s--hAKER31rB2GiSmznKiXPwg--/funghi0983524367"
            target="_blank"
            className="flex items-center shrink-0 mb-2.5 sm:mr-7 text-white no-underline transition-colors cursor-pointer hover:text-[#ACB8B6] transition-all duration-300 hover:scale-105"
          >
            <Image
              src="/images/cake.png"
              alt="Cake"
              width={28}
              height={28}
              className="w-[28px] h-[28px] mr-2.5 rounded-3xl"
            />
            Cake
          </Link>
        </section>
      </div>
    </footer>
  );
};

export default Footer;

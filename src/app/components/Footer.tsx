'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '../contexts/AuthContext';
// import SigninModal from '../components/SigninModal';
// import RegisterModal from '../components/RegisterModal';


const Footer: React.FC = () => {
   /*未 LOGO圖
     點收藏頁  驗證 、顯登入modal
     改連結
   */
    return (
      <footer className="bg-[#24657d] flex justify-center items-center text-white text-lg p-[50px_0]">
        <div className="w-11/12 max-w-[1200px] flex justify-between items-start p-2.5">
          <div className="text-xl flex flex-row justify-center items-center mr-10">
            <Image src="/path/to/facebook/logo.svg" alt="LOGO" width={60} height={60} className="mr-2.5" />
            <Link href='/' className="text-white no-underline  font-bold hover:text-[#acb8b6] transition-colors cursor-pointer flex items-start shrink-0">
              健康探索者
            </Link>
          </div>
          <div className="flex flex-col justify-start items-start">
            <Link href='/search' className="mb-2.5 mr-2.5 text-white no-underline hover:text-[#acb8b6] transition-colors cursor-pointer">
              醫療機構搜尋
            </Link>
            <Link href='/collection' className="mb-2.5 mr-2.5 text-white no-underline hover:text-[#acb8b6] transition-colors cursor-pointer">
              我的收藏
            </Link>
          </div>
            <div className="flex flex-col justify-start items-start">
                <Link href='#' target="_blank" className="mb-2.5 mr-7.5 text-white no-underline  transition-colors cursor-pointer flex items-center shrink-0 hover:text-[#acb8b6]">
                    <Image src="/path/to/github/logo.svg" alt="GitHub" width={24} height={24} className="mr-2.5"  />
                    GitHub
                </Link>
                <Link href='#' target="_blank" className="mb-2.5 mr-7.5 text-white no-underline  transition-colors cursor-pointer flex items-center shrink-0 hover:text-[#acb8b6]">
                    <Image src="/path/to/facebook/logo.svg" alt="Lindln" width={24} height={24} className="mr-2.5" />
                    Lindln
                </Link>
                <Link href='#' target="_blank" className="mb-2.5 mr-7.5 text-white no-underline  transition-colors cursor-pointer flex items-center shrink-0 hover:text-[#acb8b6]">
                    <Image src="/path/to/blogger/logo.svg" alt="Cakeresume" width={24} height={24} className="mr-2.5" />
                    Cakeresume
                </Link>
            </div>
        </div>
         {/* 
        {isLoginModalVisible && <LoginModal onClose={() => setIsLoginModalVisible(false)} onShowRegister={setIsRegisterModalVisible} />}
        {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowLogin={setIsLoginModalVisible} />}
         */} 
    </footer>
    );
  }
  
  export default Footer;
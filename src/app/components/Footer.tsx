'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, MouseEvent} from 'react'; 
import { useRouter } from 'next/navigation'; 
import { useAuth } from '../hooks/useAuth';
import SignInModal from './auth/SignInModal';
import RegisterModal from './auth/RegisterModal';


const Footer: React.FC = () => {
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();


  const handleFavoriteClick = () => {
    if (user) {
      router.push('/favorite'); 
    } else {
      setIsSignInModalVisible(true);
    }
  };


    return (
      <footer className="common-row-flex justify-center w-full bg-[#4D8EB4] text-white text-lg">
        <div className="flex sm:flex-row  common-col-flex justify-between items-start max-w-[1200px] w-full lg:w-[90%] md:w-[80%] p-[15px] mx-auto">
          <div className="common-row-flex justify-center my-auto sm:mr-10 mr-4 text-xl transition-all duration-300 hover:scale-110">
            <Link 
                href='/' 
                className="common-row-flex relative  mt-2 no-underline font-bold cursor-pointer hover:text-[#acb8b6] "
              >
                  <Image src="/images/LOGO.png" alt="Logo" width={46} height={46} className="relative z-0 sm:mr-2 mr-4"/>
                  <div className="common-col-flex  mr-[5px]">
                    <ruby className="text-[20px] text-center">
                      健康探索者 
                      <rt className="text-[14px]">HealthExplorer</rt>
                    </ruby>
                  </div>
              </Link>
          </div>
          <div className="flex flex-col justify-start items-start my-auto py-[20px] ml-[50px] sm:ml-0 transition-all duration-300">
            <button  
              className="mb-2.5 mr-2.5 text-white no-underline transition-colors cursor-pointer hover:text-[#acb8b6] hover:scale-105"
              onClick={handleFavoriteClick}
            >
              我的收藏
            </button >
            {isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
            <Link href='/search' className="mb-2.5 mr-2.5 text-white no-underline hover:text-[#acb8b6] transition-colors cursor-pointer hover:text-[#acb8b6] hover:scale-105">
              醫療機構搜尋
            </Link>
          </div>
            <div className="flex flex-col justify-start sm:items-start my-auto ml-[10px] sm:ml-0 py-[10px]">
                <Link href='https://github.com/shu-ya318/health-explorer' target="_blank" className="mb-2.5 sm:mr-7 text-white no-underline transition-colors cursor-pointer flex items-center shrink-0 hover:text-[#acb8b6] transition-all duration-300 hover:scale-105">
                    <Image src="/images/github.svg"   alt="GitHub" width={28} height={28} className="mr-2.5"  />
                    GitHub
                </Link>
                <Link href='#' target="_blank" className="mb-2.5 sm:mr-7 text-white no-underline  transition-colors cursor-pointer flex items-center shrink-0 hover:text-[#acb8b6] transition-all duration-300 hover:scale-105">
                    <Image src="/images/lindln.jpg" alt="Lindln" width={28} height={28} className="mr-2.5" />
                    Lindln
                </Link>
                <Link href='#' target="_blank" className="mb-2.5 sm:mr-7 text-white no-underline  transition-colors cursor-pointer flex items-center shrink-0 hover:text-[#acb8b6] transition-all duration-300 hover:scale-105">
                    <Image src="/images/cake.jpg" alt="Cakeresume" width={28} height={28} className="mr-2.5  rounded-3xl" />
                    Cakeresume
                </Link>
            </div>
        </div>
    </footer>
    );
  }
  
  export default Footer;
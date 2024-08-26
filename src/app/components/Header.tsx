'use client';
import { useState, useEffect, useRef} from 'react'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth'; 
import SignInModal from './auth/SignInModal';
import RegisterModal from './auth/RegisterModal';
import 'animate.css';
import ProgressBar from '../hooks/useReadingProgress';


const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [ismenuBarVisible, setIsMenuBarVisible] = useState(false);
  const menuDivRef = useRef<HTMLDivElement>(null); 


useEffect(() => {
  function handler(e: Event): void {
    console.log("Event triggered", e);
    if (typeof window !== 'undefined' && typeof MouseEvent !== 'undefined') {
      if (e instanceof MouseEvent) {
        const target = e.target as HTMLElement;

        if (menuDivRef.current && !menuDivRef.current.contains(target)) {
          if (ismenuBarVisible) {
            setIsMenuBarVisible(false);
            console.log("Menu closed due to click outside.");
          }
        }
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }
  console.log("ismenuBarVisible:", ismenuBarVisible);
}, [ismenuBarVisible, setIsMenuBarVisible]);

const toggleMenuBar = (e: React.MouseEvent) => {
  e.stopPropagation();
  setIsMenuBarVisible(prev => !prev);
};


  const handleFavoriteClick = () => {
    if (user) {
      router.push('/favorite'); 
    } else {
      setIsSignInModalVisible(true);
    }
  };


  const handleLogout = async () => {
    try {
      await logout();
      alert('您已成功登出!感謝您的使用!');
    } catch (error) {
      console.error(error);
      alert('登出失敗!請稍後再試!');
    }
    setIsSignInModalVisible(false);
    setIsRegisterModalVisible(false);
  };


  return (
    <>
      <header className="common-row-flex justify-between fixed inset-x-0 top-0 z-20 w-screen h-[60px] border bg-[#FFFFFF] border-solid border-[#9FC5DF]">
        <div className="common-row-flex justify-between  max-w-[1200px] w-screen lg:w-[90%] md:w-[80%] px-[10px] mx-auto text-[#1e94b4]">
            <Link 
              href='/' 
              className="common-row-flex relative mt-2 no-underline font-bold cursor-pointer animate__animated animate__backInLeft animate__slow"
            >
                <Image src="/images/LOGO.png" alt="Logo" width={46} height={46} className="relative z-0 mr-2"/>
                <div className="absolute w-full h-full top-0 left-0  opacity-0 z-10 bg-white transition-opacity duration-300 hover:opacity-40"></div>
                <div className="common-col-flex  mr-[5px] hover:text-[#9FC5DF]">
                  <ruby className="text-[20px] text-center">
                    健康探索者 
                    <rt className="text-[14px]">HealthExplorer</rt>
                  </ruby>
                </div>
            </Link>
             <button 
              className={`md:hidden menu-button-selector ${ismenuBarVisible ? 'hidden' : 'block'} absolute top-[15px] right-[20px] w-[25px] h-[25px]`}
              onClick={toggleMenuBar}
            >
              <Image  src="/images/bars-solid.svg" alt="menu" width={25} height={25} />
            </button>
            <div className={`md:hidden  ${ismenuBarVisible ? 'absolute fixed inset-0 z-40 w-screen h-screen flex bg-black bg-opacity-30' : 'hidden'}`}></div>
            <div 
              ref={menuDivRef}
              className={`md:common-row-flex md:justify-between no-underline font-bold ${ismenuBarVisible ? 'absolute top-0 right-0 z-50 w-44 h-screen common-col-flex pt-20 bg-[white] shadow-[0_0_3px_#1e94b4]' : 'hidden'}`}
            >
              <button 
                type="button" 
                className="header-button group"
                onClick={handleFavoriteClick}
              >
                <span className="w-52 h-32 header-button-anime group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                <span className="header-button-text group-hover:text-white">我的收藏</span>
              </button>
              {!user ? (
                  <>
                    <button 
                      type="button" 
                      className="header-button group"
                      onClick={() => setIsSignInModalVisible(true)} 
                    >
                      <span className="w-52 h-32 header-button-anime group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                      <span className="header-button-text group-hover:text-white">登入</span>
                    </button>
                    {isSignInModalVisible && <SignInModal  onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                    <button 
                      type="button" 
                      className="header-button group"
                      onClick={() => setIsRegisterModalVisible(true)}
                    >
                      <span className="w-52 h-32 header-button-anime group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                      <span className="header-button-text group-hover:text-white">註冊</span>
                    </button>
                    {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                  </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="header-button group"
                    onClick={handleLogout}
                  >
                    <span className="w-56 h-48 header-button-anime group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="header-button-text group-hover:text-white">登出</span>
                  </button>
                </>
              )}
            </div>
        </div>
      </header>
      <ProgressBar /> 
    </>
    );
  }
  export default Header;
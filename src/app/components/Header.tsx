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
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);
  const [isLogoutToastVisible, setIsLogoutToastVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const [ismenuBarVisible, setIsMenuBarVisible] = useState(false);
  const menuDivRef = useRef<HTMLDivElement>(null); 
  const toastRef = useRef<HTMLDivElement>(null);
  const signInButtonRef = useRef<HTMLButtonElement>(null);
  const registerButtonRef = useRef<HTMLButtonElement>(null);
  const logoutButtonRef = useRef<HTMLButtonElement>(null);
  const myFavoriteButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    function handler(e: Event): void {
      if (typeof window !== 'undefined' && typeof MouseEvent !== 'undefined') {
        if (e instanceof MouseEvent) {
          const target = e.target as HTMLElement;

          if (menuDivRef.current && !menuDivRef.current.contains(target)) {
            if (ismenuBarVisible) {
              setIsMenuBarVisible(false);
            }
          }

          if (isLogoutToastVisible && toastRef.current && !toastRef.current.contains(target)) { 
            closeToast(); 
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
  }, [ismenuBarVisible, setIsMenuBarVisible, isLogoutToastVisible]);


  const toggleMenuBar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuBarVisible(prev => !prev);
  };


  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    logoutButtonRef.current?.blur();
    try {
      await logout();
      setIsLogoutToastVisible(true);
      setLogoutMessage('您已成功登出!');
      setIsMenuBarVisible(false);
    } catch (error) {
      console.error(error);
      setLogoutMessage('登出失敗，請稍後再試!');
    } finally {
      setIsSignInModalVisible(false);
      setIsRegisterModalVisible(false);
    }
  };
  const closeToast = () => {
    setIsLogoutToastVisible(false);
    setLogoutMessage(null); 
  };

  const handleSignInClick = () => {
    console.log('SignIn button was clicked');
    signInButtonRef.current?.blur();
    setIsSignInModalVisible(true);
  };

const handleRegisterClick = () => {
    registerButtonRef.current?.blur();
    setIsRegisterModalVisible(true);
  };


  const handleFavoriteClick = () => {
    if (user) {
      router.push('/favorite'); 
    } else {
      myFavoriteButtonRef.current?.blur();
      setIsSignInModalVisible(true);
    }
  };


  return (
    <>
      <header className="common-col-flex justify-between fixed inset-x-0 top-0 z-20 w-screen h-[60px] border bg-[#FFFFFF] border-solid border-[#9FC5DF]">
        <ProgressBar /> 
        <div className="relative common-row-flex justify-between max-w-[1200px] w-screen lg:w-[90%] md:w-[80%] px-[10px] mx-auto text-[#1e94b4]">
            <Link 
              href='/' 
              className="common-row-flex relative mt-2 no-underline font-bold cursor-pointer animate__animated animate__backInLeft animate__slow"
            >
                <Image src="/images/LOGO.png" alt="Logo" width={45} height={45} className="relative z-0 w-[45px] h-[45px] mr-2 object-cover"/>
                <div className="absolute w-full h-full top-0 left-0  opacity-0 z-10 bg-white transition-opacity duration-300 hover:opacity-40"></div>
                <div className="common-col-flex  mr-[5px] hover:text-[#9FC5DF]">
                  <ruby className="text-[20px] text-center">
                    健康探索者 
                    <rt className="text-[14px]">HealthExplorer</rt>
                  </ruby>
                </div>
            </Link>
            {isLogoutToastVisible && logoutMessage && (
              <div
                ref={toastRef}  
                className="z-50  xs:w-full xs:max-w-[160px] max-w-[100px] h-[40px] common-row-flex m-auto px-3 bg-white rounded-xl border border-[#2D759E] shadow-sm gap-4"
              >
                <div  className="my-auto text-[#2D759E] text-center xs:text-[14px] text-[12px]">{logoutMessage}</div>
                <button type="button" className="inline-flex flex-shrink-0 justify-center text-gray-400 transition-all duration-150 " onClick={closeToast}>
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 17L7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
             <button 
              className={`md:hidden menu-button-selector ${ismenuBarVisible ? 'hidden' : 'block'} absolute top-[15px] right-[20px] w-[25px] h-[25px]`}
              onClick={toggleMenuBar}
            >
              <Image src="/images/bars-solid.svg" alt="menu" width={25} height={25} className="w-[25px] h-[25px]"/>
            </button>
            <div className={`md:hidden  ${ismenuBarVisible ? 'absolute fixed inset-0 z-40 w-screen h-screen flex bg-black bg-opacity-30' : 'hidden'}`}></div>
            <div 
              ref={menuDivRef}
              className={`md:common-row-flex md:justify-between no-underline ${ismenuBarVisible ? 'absolute top-0 right-0 z-50 w-44 h-screen common-col-flex pt-20 bg-[white] shadow-[0_0_3px_#1e94b4]' : 'hidden'}`}
            >
              {!user ? (
                  <>
                    <button 
                      ref={signInButtonRef}
                      type="button" 
                      className={`flex justify-center w-[52px] h-[35px] ${!isSignInModalVisible ? 'hover:text-[#2D759E] hover:font-semibold' : ''}`}
                      onClick={handleSignInClick}
                    >
                      <span className="m-auto text-[#2598B6] text-center">登入</span>
                    </button>
                    {isSignInModalVisible && <SignInModal  onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                    <button 
                      ref={registerButtonRef}
                      type="button" 
                      className={`flex justify-center w-[52px] h-[35px] ${!isRegisterModalVisible ? 'hover:text-[#2D759E] hover:font-semibold' : ''}`}
                      onClick={handleRegisterClick}
                    >
                      <span className="m-auto text-[#2598B6] text-center hover:text-[#2D759E]">註冊</span>
                    </button>
                    {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                  </>
              ) : (
                <>
                  <button 
                    ref={logoutButtonRef}
                    type="button" 
                    className="flex justify-center w-[75px] h-[35px]  hover:text-[#2D759E] hover:font-semibold"
                    onClick={handleLogout}
                  >
                    <span className="m-auto text-[#2598B6] text-center">登出</span>
                  </button>
                </>
              )}
               <button 
                  ref={myFavoriteButtonRef}
                  type="button" 
                  className={`flex justify-center w-[75px] h-[35px] ${!isSignInModalVisible ? 'hover:text-[#2D759E] hover:font-semibold' : ''}`}
                  onClick={handleFavoriteClick}
                >                  
                <span className="m-auto text-[#2598B6] text-center"> 我的收藏 </span>
              </button>
            </div>
        </div>
      </header>
    </>
    );
  }
  export default Header;
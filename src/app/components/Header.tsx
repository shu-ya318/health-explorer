"use client";

import { useState, useRef, useEffect} from "react"; 

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../hooks/useAuth"; 

import SignInModal from "./auth/SignInModal";
import RegisterModal from "./auth/RegisterModal";
import ProgressBar from "./ProgressBar";

import "animate.css";

const Header: React.FC = () => {
  const router = useRouter();
  const { user, logOut } = useAuth();

  const [logOutMessage, setLogOutMessage] = useState<string | null>(null);
  const [isLogOutToastVisible, setIsLogOutToastVisible] = useState<boolean>(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState<boolean>(false);
  const [isMenuBarVisible, setIsMenuBarVisible] = useState<boolean>(false);  

  const logOutButtonRef = useRef<HTMLButtonElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const signInButtonRef = useRef<HTMLButtonElement>(null);
  const registerButtonRef = useRef<HTMLButtonElement>(null);
  const myFavoriteButtonRef = useRef<HTMLButtonElement>(null);
  const menuDivRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    function handler(event: MouseEvent): void {
      if (typeof window !== "undefined" && typeof MouseEvent !== "undefined") {
        if (event instanceof MouseEvent) {
          const target = event.target as HTMLElement;

          //menu、toast功能均分別指定點擊元素以外範圍會關閉
          if (isMenuBarVisible && menuDivRef.current && !menuDivRef.current.contains(target)) {
            if (isMenuBarVisible) {
              setIsMenuBarVisible(false);
            }
          }

          if (isLogOutToastVisible && isLogOutToastVisible && toastRef.current && !toastRef.current.contains(target)) { 
            closeToast(); 
          }
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("click", handler);
      return () => {
        window.removeEventListener("click", handler);
      };
    }
  }, [isMenuBarVisible, setIsMenuBarVisible, isLogOutToastVisible]);

  const toggleMenuBar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsMenuBarVisible(prev => !prev);
  };


  const handleLogOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
    logOutButtonRef.current?.blur();
    event.preventDefault();

    try {
      await logOut();
      setIsMenuBarVisible(false);
      setLogOutMessage("您已成功登出!");
      setIsLogOutToastVisible(true);
    } catch (error) {
      console.error(error);
      setLogOutMessage("登出失敗，請稍後再試!");
    } finally {
      //為了解決UI延遲渲染，誤觸發登入跟註冊按鈕跳出modal
      setIsSignInModalVisible(false);
      setIsRegisterModalVisible(false);
    }
  };

  const closeToast = () => {
    setIsLogOutToastVisible(false);
    setLogOutMessage(null); 
  };


  const handleSignInClick = () => {
    signInButtonRef.current?.blur();
    setIsSignInModalVisible(true);
  };

const handleRegisterClick = () => {
    registerButtonRef.current?.blur();
    setIsRegisterModalVisible(true);
  };

  const handleFavoriteClick = () => {
    if (user) {
      router.push("/favorite"); 
    } else {
      myFavoriteButtonRef.current?.blur();
      setIsSignInModalVisible(true);
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 w-screen h-[60px] common-col-flex justify-between bg-[#FFFFFF] border border-solid border-[#9FC5DF]">
        <ProgressBar /> 
        <div className="relative max-w-[1200px] w-screen lg:w-[90%] md:w-[80%] common-row-flex justify-between mx-auto px-[10px] text-[#1e94b4]">
            <Link 
              href='/' 
              className="relative common-row-flex mt-2 no-underline font-bold cursor-pointer animate__animated animate__backInLeft animate__slow"
            >
                <Image 
                  src="/images/LOGO.png" 
                  alt="Logo" 
                  width={45} 
                  height={45} 
                  className="relative z-0 w-[45px] h-[45px] mr-2 object-cover"
                />
                <div className="absolute top-0 left-0  z-10 w-full h-full opacity-0 bg-white transition-opacity duration-300 hover:opacity-40"></div>
                <div className="common-col-flex  mr-[5px] hover:text-[#9FC5DF]">
                  <ruby className="text-[20px] text-center">
                    健康探索者 
                    <rt className="text-[14px]">HealthExplorer</rt>
                  </ruby>
                </div>
            </Link>
            {isLogOutToastVisible && logOutMessage && (
              <div
                ref={toastRef}  
                className="z-50 xs:w-full xs:max-w-[160px] max-w-[100px] h-[40px] common-row-flex m-auto px-3 bg-white rounded-xl border border-[#2D759E] shadow-sm gap-4"
              >
                <div  className="my-auto text-[#2D759E] text-center xs:text-[14px] text-[12px]">{logOutMessage}</div>
                <button 
                  onClick={closeToast}
                  type="button" 
                  className="inline-flex flex-shrink-0 justify-center text-gray-400 transition-all duration-150" 
                >
                  <span className="sr-only">Close</span>
                  <svg 
                    className="w-6 h-6" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M7 17L17 7M17 17L7 7" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </button>
              </div>
            )}
              <button 
                onClick={toggleMenuBar}
                type="button"
                className={`absolute top-[15px] right-[20px] w-[25px] h-[25px] md:hidden menu-button-selector ${isMenuBarVisible ? 'hidden' : 'block'}`}
              >
              <Image 
                src="/images/bars-solid.svg" 
                alt="menu" 
                width={25} 
                height={25} 
                className="w-[25px] h-[25px]"
              />
            </button>
            <div className={`md:hidden  ${isMenuBarVisible ? 'absolute fixed inset-0 z-40 w-screen h-screen flex bg-black bg-opacity-30' : 'hidden'}`}></div>
            <div 
              ref={menuDivRef}
              className={`md:common-row-flex md:justify-between no-underline ${isMenuBarVisible ? 'absolute top-0 right-0 z-50 w-44 h-screen common-col-flex pt-20 bg-[white] shadow-[0_0_3px_#1e94b4]' : 'hidden'}`}
            >
              {!user ? (
                <>
                  <button 
                    onClick={handleSignInClick}
                    ref={signInButtonRef}
                    type="button" 
                    className="flex justify-center w-[52px] h-[35px] hover:text-[#2D759E] hover:font-semibold"
                  >
                    <span className="m-auto text-[#2598B6] text-center">登入</span>
                  </button>
                  {isSignInModalVisible && ( 
                    <SignInModal  
                      onClose={() => setIsSignInModalVisible(false)} 
                      onShowRegister={() => setIsRegisterModalVisible(true)} 
                    />
                  )}
                  <button 
                    onClick={handleRegisterClick}
                    ref={registerButtonRef}
                    type="button" 
                    className={`flex justify-center w-[52px] h-[35px] ${!isRegisterModalVisible ? 'hover:text-[#2D759E] hover:font-semibold' : ''}`}
                  >
                    <span className="m-auto text-[#2598B6] text-center hover:text-[#2D759E]">註冊</span>
                  </button>
                  {isRegisterModalVisible && ( 
                    <RegisterModal 
                      onClose={() => setIsRegisterModalVisible(false)}
                      onShowSignIn={() => setIsSignInModalVisible(true)} 
                    />
                  )}
                </>
              ) : (
                <>
                  <button 
                    onClick={handleLogOut}
                    ref={logOutButtonRef}
                    type="button" 
                    className="flex justify-center w-[50px] h-[35px] hover:text-[#2D759E] hover:font-semibold"
                  >
                    <span className="m-auto text-[#2598B6] text-center">登出</span>
                  </button>
                </>
              )}
                <button 
                  onClick={handleFavoriteClick}
                  ref={myFavoriteButtonRef}
                  type="button" 
                  className={`flex justify-center w-[70px] h-[35px] ${!isSignInModalVisible ? 'hover:text-[#2D759E] hover:font-semibold' : ''}`}
                >                  
                <span className="m-auto text-[#2598B6] text-center">我的收藏</span>
              </button>
            </div>
        </div>
      </header>
    </>
  );
}

export default Header;
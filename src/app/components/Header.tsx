'use client';
import { useState, MouseEvent} from 'react'; 
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
      setIsSignInModalVisible(false);
      setIsRegisterModalVisible(false);
    } catch (error) {
      console.error(error);
      alert('登出失敗!請稍後再試!');
    }
  };


  return (
    <>
      <header className="common-row-flex justify-between fixed inset-x-0 top-0 z-30 w-screen h-[60px] border bg-[#FFFFFF] border-solid border-[#9FC5DF]">
        <div className="common-row-flex justify-between  max-w-[1200px] w-screen px-[10px] mx-auto text-[#1e94b4]">
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
            <div className="common-row-flex justify-between pt-[13px]">
              <div className="common-row-flex no-underline font-bold cursor-pointer mb-[10px]">
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
        </div>
      </header>
      <ProgressBar /> 
    </>
    );
  }
  //<ProgressBar />   換算 rwd似乎會讓寬度爆版
  export default Header;
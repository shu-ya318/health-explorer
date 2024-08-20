'use client';
import { useState, MouseEvent} from 'react'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth'; 
import SignInModal from './auth/SignInModal';
import RegisterModal from './auth/RegisterModal';
import 'animate.css';


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
    <header className="bg-[#FFFFFF] flex flex-col items-center">
      <div className="w-full px-[5%] justify-center  flex flex-col justify-between items-center h-[115px] text-[#1e94b4]">
          <Link 
            href='/' 
            className="relative flex items-center no-underline font-bold mt-4 cursor-pointer animate__animated  animate__backInLeft animate__slow border border-solid border-[#FFFFFF]"
          >
              <Image src="/images/LOGO.png" alt="Logo" width={56} height={56} className="mr-2 relative z-0"/>
              <div className=" absolute w-full h-full top-0 left-0 bg-white opacity-0 z-10 transition-opacity duration-300 hover:opacity-40 "></div>
              <div className="flex flex-col hover:text-[#9FC5DF] mr-[5px]">
                <ruby className="text-[24px] text-center">
                  健康探索者 
                  <rt className="text-[14px]">HealthExplorer</rt>
                </ruby>
              </div>
          </Link>
          <div className="flex items-center no-underline font-bold cursor-pointer mb-[5px]">
          <button 
            type="button" 
            className="relative inline-flex items-center justify-start overflow-hidden font-medium transition-all rounded  group py-1.5 px-2.5"
            onClick={handleFavoriteClick}
          >
            <span className="w-52 h-32 rounded bg-[#9FC5DF] absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left  transition-colors duration-300 ease-in-out group-hover:text-white">我的收藏</span>
          </button>
            <hr className="h-[30%] border border-[#e6e6e6] mx-[5px]"/>
            {!user ? (
                 <>
                  <button 
                    type="button" 
                    className="relative inline-flex items-center justify-start overflow-hidden font-medium transition-all rounded  group py-1.5 px-2.5"
                    onClick={() => setIsSignInModalVisible(true)} 
                  >
                    <span className="w-52 h-32 rounded bg-[#9FC5DF] absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left  transition-colors duration-300 ease-in-out group-hover:text-white">登入</span>
                  </button>
                  {isSignInModalVisible && <SignInModal  onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                  <hr className="h-[30%] border border-[#e6e6e6] mx-[5px]"/>
                  <button 
                    type="button" 
                    className="relative inline-flex items-center justify-start overflow-hidden font-medium transition-all rounded  group py-1.5 px-2.5"
                    onClick={() => setIsRegisterModalVisible(true)}
                  >
                    <span className="w-52 h-32 rounded bg-[#9FC5DF] absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left  transition-colors duration-300 ease-in-out group-hover:text-white">註冊</span>
                  </button>
                  {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                 </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="relative inline-flex items-center justify-start overflow-hidden font-medium transition-all rounded  group py-1.5 px-2.5"
                    onClick={handleLogout}
                  >
                    <span className="w-56 h-48 rounded bg-[#9FC5DF] absolute bottom-0 left-0 translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left  transition-colors duration-300 ease-in-out group-hover:text-white">登出</span>
                  </button>
                </>
              )}
          </div>
      </div>
    </header>
    );
  }
  
  export default Header;
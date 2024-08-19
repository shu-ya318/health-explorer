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
    <header className="bg-[#FFFFFF] flex flex-col   items-center">
      <div className="w-full px-[5%] justify-center  flex flex-col justify-between items-center  h-[130px] text-[#1e94b4] border border-solid border-[#FFFFFF]">
          <Link 
            href='/' 
            className="flex items-center no-underline font-bold   mt-4 cursor-pointer animate__animated  animate__backInLeft animate__slow"
          >
              <Image src="/images/LOGO.png" alt="Logo" width={56} height={56} className="mr-4 border border-solid rounded-lg border-[#50bfd9]"/>
              <div className="flex flex-col hover:text-[#B0DFEB]">
              <ruby className="text-[24px] text-center">
                健康探索者 
                <rt className="text-[12px]">HealthExplorer</rt>
              </ruby>
              </div>
          </Link>
          <div className="flex items-center no-underline font-bold cursor-pointer">
            <button  
              type="button" 
              className="font-bold cursor-pointer my-2.5 px-2.5 h-9 flex items-center hover:text-[#acb8b6] mr-30" 
              onClick={handleFavoriteClick}
            >
              我的收藏
            </button >
            <hr className="h-[20%] border border-[#e6e6e6] ml-[10px]"/>
            {!user ? (
                 <>
                  <button 
                    type="button" 
                    className="rounded-md my-2.5 px-2 h-9 flex items-center hover:bg-[#acb8b6] hover:text-white mr-3 ml-3" 
                    onClick={() => setIsSignInModalVisible(true)} 
                  >
                    登入
                  </button>
                  {isSignInModalVisible && <SignInModal  onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                  <hr className="h-[20%] border border-[#e6e6e6] mr-[10px]"/>
                  <button 
                    type="button" 
                    className="rounded-md my-2.5 px-2 h-9 flex items-center hover:text-black"
                    onClick={() => setIsRegisterModalVisible(true)}
                  >
                    註冊
                  </button>
                  {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                 </>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="text-black bg-[#ffffff] rounded-md my-2.5 px-2.5 h-9 flex items-center hover:bg-[#acb8b6] hover:text-white mr-3 ml-3" 
                    onClick={handleLogout}
                  >
                    登出
                  </button>
                </>
              )}
          </div>
      </div>
    </header>
    );
  }
  
  export default Header;
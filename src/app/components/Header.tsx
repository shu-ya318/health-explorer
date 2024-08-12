'use client';
import { useState, MouseEvent} from 'react'; 
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; 
import SignInModal from './auth/SignInModal';
import RegisterModal from './auth/RegisterModal';


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);


  const handleLogout = async () => {
    try {
      await logout();
      alert('您已成功登出!感謝您的使用!');
      setIsSignInModalVisible(false);
    } catch (error) {
      console.error(error);
      alert('登出失敗!請稍後再試!');
    }
  };


  return (
    <header className="bg-[#24657d] flex justify-center text-white  items-center">
      <div className="w-11/12 max-w-[1200px] flex justify-between items-center px-5 h-14  text-base">
          <div className="flex items-center text-white no-underline font-bold cursor-pointer">
              <Image src="/images/LOGO.webp" alt="Logo" width={47} height={47} className="mr-2.5" />
              <Link href='/' className="hover:text-[#acb8b6]">健康探索者</Link>
          </div>
          <div className="flex items-center text-white no-underline font-bold cursor-pointer">
            <p className="text-white font-bold cursor-pointer my-2.5 px-2.5 h-9 flex items-center hover:text-[#acb8b6] mr-30" >我的收藏</p>
            {!user ? (
                 <>
                  <button 
                    type="button" 
                    className="text-black bg-[#ffffff] rounded-md my-2.5 px-2.5 h-9 flex items-center hover:bg-[#acb8b6] hover:text-white mr-3 ml-3" 
                    onClick={() => setIsSignInModalVisible(true)} 
                  >
                    登入
                  </button>
                  {isSignInModalVisible && <SignInModal  onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                  <button 
                    type="button" 
                    className="text-white bg-[#acb8b6] rounded-md my-2.5 px-2.5 h-9 flex items-center hover:bg-[#ffffff] hover:text-black"
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
'use client';
import { useState, MouseEvent} from 'react';    //import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
/* import SigninModal from '../components/SigninModal';
import RegisterModal from '../components/RegisterModal';
import { auth, signOut } from '../../lib/firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../store/slices/userSlice';
import { RootState } from '@/store/types/storeTypes';
import useRequireAuth from '@/hooks/useRequireAuth';  */


const Header: React.FC = () => {
  //const router = useRouter();

  
  return (
    <header className="bg-[#24657d] flex justify-center text-white  items-center">
      <div className="w-11/12 max-w-[1200px] flex justify-between items-center px-5 h-14  text-base">
          <div className="flex items-center text-white no-underline font-bold cursor-pointer">
              <Image src="/images/LOGO.webp" alt="Logo" width={47} height={47} className="mr-2.5" />
              <Link href='/' className="hover:text-[#acb8b6]">健康探索者</Link>
          </div>
          <div className="flex items-center text-white no-underline font-bold cursor-pointer">
            <p className="text-white font-bold cursor-pointer my-2.5 px-2.5 h-9 flex items-center hover:text-[#acb8b6] mr-30" >我的收藏</p>
            <button type="button" className="text-black bg-[#ffffff] rounded-md my-2.5 px-2.5 h-9 flex items-center hover:bg-[#acb8b6] hover:text-white mr-3 ml-3" >登入</button>
            <button type="button" className="text-white bg-[#acb8b6] rounded-md my-2.5 px-2.5 h-9 flex items-center hover:bg-[#ffffff] hover:text-black">註冊</button>
          </div>
            {/* 
          <IoMenu className={`${menuVisible ? 'block' : 'hidden'} absolute right-5 top-3.5 text-white w-7.5 h-7.5 cursor-pointer md:hidden`} onClick={toggleMenu} />
          <div className={`flex items-center md:flex ${menuVisible ? 'flex flex-col absolute top-0 right-0 bg-[#1D445D] w-45 h-screen z-10 pt-5' : 'hidden'}`}>
              <span className="text-white font-bold cursor-pointer my-2.5 px-2.5 h-9 flex items-center hover:bg-[#37B2D6] hover:rounded-md" onClick={handleDesignLinkClick}>Select Gifts</span>
              {isLoggedIn && (
                  <>
                      <Link href='/cart' className="text-white font-bold cursor-pointer my-2.5 px-2.5 h-9 flex items-center hover:bg-[#37B2D6] hover:rounded-md">Shopping Cart</Link>
                      <Link href='/order-information' className="text-white font-bold cursor-pointer my-2.5 px-2.5 h-9 flex items-center hover:bg-[#37B2D6] hover:rounded-md">Order History</Link>
                      <span className="text-black bg-white rounded-md my-2.5 px-2.5 h-9 flex items-center hover:bg-[#37B2D6] hover:text-white" onClick={handleSignOut}>Log Out</span>
                  </>
              )}
            */} 
              {/* {!isLoggedIn && ( 
                  <>
                      <span className="text-black bg-white rounded-md my-2.5 px-2.5 h-9 flex items-center hover:bg-[#37B2D6] hover:text-white" onClick={handleLoginModal}>Log In</span>
                      {isLoginModalVisible && <LoginModal onClose={() => setIsLoginModalVisible(false)} onShowRegister={setIsRegisterModalVisible} />}
                      <span className="bg-[#74838D] rounded-md text-white my-2.5 px-2.5 h-9 flex items-center hover:bg-[#ff7878]" >Register</span>
                      {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)}  />}
                  </>
                )} */}
      </div>
    </header>
    );
  }
  
  export default Header;
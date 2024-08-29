'use client';
import { useState, useRef, useEffect, MouseEvent} from 'react';
import { useAuth } from '../../hooks/useAuth';         
import { UserCredential,AuthError }from 'firebase/auth';
import Image from 'next/image';


interface SignInModalProps {
    onClose: () => void;
    onShowRegister: (visible: boolean) => void;
}


const defaultEmail = 'test1@healthExplorer.com';
const defaultPassword = 'healthExplorer';


const SignInModal: React.FC<SignInModalProps> = ({ onClose, onShowRegister }) => {
    const { user, signin} = useAuth();
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState(defaultPassword);
    const [signInMessage, setSignInMessage] = useState<string | null>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);


    const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const emailInput = document.getElementById('email-signin') as HTMLInputElement;
        const passwordInput = document.getElementById('password-signin') as HTMLInputElement;
        if (!emailInput.value ||  !passwordInput.value) {
          setSignInMessage('欄位不可空白!'); 
          return;
        }
    
        setSignInMessage(''); 
    
        try {
          const response = await signin(emailInput.value, passwordInput.value);
          emailInput.value= '';
          passwordInput.value= '';
        } catch (err) {
          setSignInMessage('請輸入正確信箱及密碼!若無會員，請先註冊!'); 
        }
      };


    return (
        <div className="fixed inset-0 common-row-flex justify-center bg-black bg-opacity-30 z-50" onClick={onClose}>
            <div className="flex max-w-[900px] md:w-[92%] w-[85%] h-[490px] rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
                <div className="w-1/2 sm:common-col-flex hidden justify-center p-7 rounded-l-lg bg-[#4b96af] backdrop-blur-sm">
                    <div className="md:w-[300px] md:h-[300px] sm:w-[250px] sm:h-[250px] mb-2.5 common-bg-image bg-[url('/images/LOGO.png')]"></div>
                    <div className="text-white text-3xl font-bold mt-4">健康探索者</div>
                </div>
                <div className="relative sm:w-1/2 xs:w-[90%] w-[85%] common-col-flex p-7 rounded-lg sm:rounded-l-none sm:rounded-r-lg backdrop-blur-sm bg-white bg-opacity-70">
                    <Image 
                        src="/images/xmark-solid.svg"
                        alt="close" width={20} height={20}
                        className="absolute top-2.5 right-2.5 w-[20px] h-[20px] text-gray-600 hover:text-red-500 cursor-pointer" 
                        onClick={onClose} 
                    />
                    <div className="text-3xl font-bold text-[#1A5665] mb-[35px]">登入會員</div>
                    <div className="common-row-flex w-full mb-[35px]">
                        <label htmlFor="email-signin" className="common-row-flex flex-shrink-0 w-[60px] pr-2.5 text-black">Email:</label>
                        <input 
                            ref={firstInputRef} 
                            type="email" 
                            placeholder="請輸入Email" 
                            id="email-signin"
                            value={email}
                            className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[13px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="common-row-flex w-full mb-[65px]">
                        <label htmlFor="password-signin" className="common-row-flex flex-shrink-0 w-[60px] pr-2.5 text-black">密碼:</label>
                        <input 
                            type="password" 
                            placeholder="請輸入密碼" 
                            id="password-signin"
                            value={password}
                            className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[13px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full h-[44px] mb-[20px] rounded-lg bg-[#5B98BC]  hover:bg-[#2D759E] font-bold text-white text-center text-[20px]"
                        onClick={handleSignIn}
                    >
                        登入
                    </button>
                    <div className="common-col-flex justify-center w-full mt-[15px] text-base">
                        <span 
                            className="cursor-pointer text-[#5B98BC] hover:text-[#2D759E] text-center text-[18px]"
                            onClick={() => {
                                onClose();
                                onShowRegister(true);
                            }}
                        >
                        尚無會員?點此註冊
                        </span>
                    </div>
                    {signInMessage && <div className="common-col-flex justify-center w-full text-lg mt-[30px] text-red-500 font-bold">{signInMessage}</div>}
                </div>
            </div>
        </div>
    )

};

export default SignInModal;
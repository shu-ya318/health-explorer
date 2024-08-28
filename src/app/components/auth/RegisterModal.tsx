'use client';
import { useState, MouseEvent} from 'react';
import { useAuth } from '../../hooks/useAuth';         
import { UserCredential,AuthError }from 'firebase/auth';
import Image from 'next/image';


interface RegisterModalProps {
    onClose: () => void;
    onShowSignIn: (visible: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onShowSignIn}) => {
    const { user, register} = useAuth();
    const [rigisterMessage, setRigisterMessage] = useState<string | null>(null);


    const handleRegister = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const emailInput = document.getElementById('email-register') as HTMLInputElement;
        const passwordInput = document.getElementById('password-register') as HTMLInputElement;
        if (!emailInput.value ||  !passwordInput.value) {
            setRigisterMessage('欄位不可空白!'); 
          return;
        }
    
        setRigisterMessage(''); 
    
        try {
          const response = await register(emailInput.value, passwordInput.value);
        } catch (error) {
          const err = error as AuthError;
          if (err.code === 'auth/email-already-in-use') {
            setRigisterMessage('email已被註冊,請登入或使用其他email註冊!');
          } else if (err.code === 'auth/invalid-email') {
            setRigisterMessage('請輸入有效格式的email!');
          } else if (err.code === 'auth/weak-password') {
            setRigisterMessage('密碼強度至少需要6個字元!');
          } else {
            setRigisterMessage(`註冊發生未知錯誤，請稍後再試!`);
          }
        }
    };


    return (
        <div className="fixed  inset-0 common-row-flex justify-center bg-black bg-opacity-30 z-50" onClick={onClose}>
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
                    <div className="text-3xl font-bold text-[#1A5665] mb-[35px]">註冊會員</div>
                    <div className="common-row-flex w-full mb-[35px]">
                        <label htmlFor="email-register" className="common-row-flex flex-shrink-0 w-[60px] pr-2.5 text-black">Email:</label>
                        <input 
                            type="email" 
                            placeholder="請輸入Email" 
                            id="email-register"
                            className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[14px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
                        />
                    </div>
                    <div className="common-row-flex w-full mb-[65px]">
                        <label htmlFor="password-register" className="common-row-flex flex-shrink-0 w-[60px] pr-2.5 text-black">密碼:</label>
                        <input 
                            type="password" 
                            placeholder="請輸入6個字元以上密碼" 
                            id="password-register"
                            className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[14px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full h-[44px] mb-[20px] rounded-lg bg-[#5B98BC]  hover:bg-[#2D759E] font-bold text-white text-center text-[20px]"
                        onClick={handleRegister}
                    >
                    註冊
                    </button>
                    <div className="common-col-flex justify-center w-full mt-[15px] text-base">
                        <span 
                            className="cursor-pointer text-[#5B98BC] hover:text-[#2D759E] text-center text-[18px]"
                            onClick={() => {
                                onClose();
                                onShowSignIn(true);
                            }}
                        >
                        已有會員?點此登入
                        </span>
                      {rigisterMessage && <div className="common-col-flex justify-center w-full text-lg mt-[30px] text-red-500 font-bold">{rigisterMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RegisterModal;
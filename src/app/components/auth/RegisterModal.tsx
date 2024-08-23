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
        <div className="fixed common-row-flex justify-center inset-0 bg-black bg-opacity-30 z-50" onClick={onClose}>
            <div className="flex max-w-[926px] w-[92%] h-[490px] rounded-lg shadow-lg" onClick={e => e.stopPropagation()}>
                <div className="common-col-flex justify-center w-1/2 bg-[#4b96af] backdrop-blur-sm p-7 rounded-l-lg">
                    <div className="w-[300px] h-[300px] mb-2.5 common-bg-image bg-[url('/images/LOGO.png')]"></div>
                    <div className="text-white text-3xl font-bold mt-4">健康探索者</div>
                </div>
                <div className="relative common-col-flex w-1/2 p-7 backdrop-blur-sm rounded-r-lg bg-white bg-opacity-70">
                    <Image 
                        src="/images/xmark-solid.svg"
                        alt="close" width={20} height={20}
                        className="absolute top-2.5 right-2.5 w-7 h-7 text-gray-600 hover:text-red-500 cursor-pointer" 
                        onClick={onClose} 
                    />
                    <div className="text-3xl font-bold text-[#1A5665] mb-[35px]">註冊會員</div>
                    <div className="common-row-flex w-full mb-[35px]">
                        <label htmlFor="email" className="common-row-flex flex-shrink-0 w-[60px] pr-2.5 text-black">Email:</label>
                        <input 
                            type="email" 
                            placeholder="請輸入Email" 
                            id="email-register"
                            className="w-full h-9 px-3.5 border-none bg-[#FFFFFF] leading-5 text-base text-gray-600 font-medium focus:outline-none focus:border-[#36B2D7]"
                        />
                    </div>
                    <div className="common-row-flex w-full mb-[65px]">
                        <label htmlFor="password" className="common-row-flex flex-shrink-0 w-[60px] pr-2.5 text-black">密碼:</label>
                        <input 
                            type="password" 
                            placeholder="請輸入6個字元以上密碼" 
                            id="password-register"
                            className="w-full h-9 px-3.5 border-none bg-[#FFFFFF] leading-5 text-base text-gray-600 font-medium focus:outline-none focus:border-[#36B2D7]"
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
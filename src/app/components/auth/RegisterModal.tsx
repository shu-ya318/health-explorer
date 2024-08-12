'use client';
import { useState, MouseEvent} from 'react';
import { useAuth } from '../../contexts/AuthContext';         
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" onClick={onClose}>
            <div className="max-w-[926px] w-[92%] rounded-lg shadow-lg h-[490px] flex" onClick={e => e.stopPropagation()}>
                <div className="bg-[#4b96af] backdrop-blur-sm p-7 rounded-l-lg flex flex-col justify-center items-center w-1/2">
                    <div style={{ backgroundImage: "url('/images/logo.webp')"}}
                         className="w-[300px] h-[300px] bg-cover bg-center mb-2.5"></div>
                    <div className="text-white text-3xl font-bold mt-4">健康探索者</div>
                </div>
                <div className="p-7 rounded-r-lg bg-white bg-opacity-70 backdrop-blur-sm flex flex-col items-center w-1/2 relative">
                    <Image 
                        src="/images/xmark-solid.svg"
                        alt="close" width={20} height={20}
                        className="absolute top-2.5 right-2.5 w-7 h-7 text-gray-600 hover:text-red-500 cursor-pointer" 
                        onClick={onClose} 
                    />
                    <div className="text-3xl font-bold text-[#1A5665] mb-[35px]">註冊會員</div>
                    <div className="w-full flex items-center mb-[35px]">
                        <label htmlFor="email" className="flex-shrink-0 flex items-center pr-2.5 text-black">Email:</label>
                        <input 
                            type="email" 
                            placeholder="請輸入Email" 
                            id="email-register"
                            className="w-full h-9 bg-[#FFFFFF] border-none px-3.5 text-base font-medium leading-5 text-gray-600 focus:outline-none focus:border-[#36B2D7]"
                        />
                    </div>
                    <div className="w-full flex items-center mb-[65px]">
                        <label htmlFor="password" className="flex-shrink-0 flex items-center pr-2.5 text-black">密碼:</label>
                        <input 
                            type="password" 
                            placeholder="請輸入6個字元以上密碼" 
                            id="password-register"
                            className="w-full h-9 bbg-[#FFFFFF] border-none px-3.5 text-base font-medium leading-5 text-gray-600 focus:outline-none focus:border-[#36B2D7]"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="bg-[#1A5665] text-white w-full h-12 rounded-md text-xl mb-5  border-none hover:bg-[#acb8b6] active:bg-[#3686A5]"
                        onClick={handleRegister}
                    >
                    註冊
                    </button>
                    <div className="text-base w-full flex flex-col justify-center mt-[15px]">
                        <span 
                            className="cursor-pointer text-[#1A5665] hover:text-[#29879e] text-center text-[18px]"
                            onClick={() => {
                                onClose();
                                onShowSignIn(true);
                            }}
                        >
                        已有會員?點此登入
                        </span>
                      {rigisterMessage && <div className="text-lg flex justify-center w-full text-black mt-[30px]  text-[#EA0000]">{rigisterMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RegisterModal;
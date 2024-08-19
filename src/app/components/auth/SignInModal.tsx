'use client';
import { useState, MouseEvent} from 'react';
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" onClick={onClose}>
            <div className="max-w-[926px] w-[92%] rounded-lg shadow-lg h-[490px] flex" onClick={e => e.stopPropagation()}>
                <div className="bg-[#4b96af] backdrop-blur-sm p-7 rounded-l-lg flex flex-col justify-center items-center w-1/2">
                    <div style={{ backgroundImage: "url('/images/logo.jpg')"}}
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
                    <div className="text-3xl font-bold text-[#1A5665] mb-[35px]">登入會員</div>
                    <div className="w-full flex items-center mb-[35px]">
                        <label htmlFor="email" className="flex-shrink-0 flex items-center pr-2.5 text-black">Email:</label>
                        <input 
                            type="email" 
                            placeholder="請輸入Email" 
                            id="email-signin"
                            value={email}
                            className="w-full h-9 bg-[#FFFFFF] border-none px-3.5 text-base font-medium leading-5 text-gray-600 focus:outline-none focus:border-[#36B2D7]"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="w-full flex items-center mb-[65px]">
                        <label htmlFor="password" className="flex-shrink-0 flex items-center pr-2.5 text-black">密碼:</label>
                        <input 
                            type="password" 
                            placeholder="請輸入密碼" 
                            id="password-signin"
                            value={password}
                            className="w-full h-9 bbg-[#FFFFFF] border-none px-3.5 text-base font-medium leading-5 text-gray-600 focus:outline-none focus:border-[#36B2D7]"
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="bg-[#1A5665] text-white w-full h-12 rounded-md text-xl mb-5  border-none hover:bg-[#acb8b6] active:bg-[#3686A5]"
                        onClick={handleSignIn}
                    >
                        登入
                    </button>
                    <div className="text-base w-full flex flex-col justify-center mt-[15px]">
                        <span 
                            className="cursor-pointer text-[#1A5665] hover:text-[#29879e] text-center text-[18px]"
                            onClick={() => {
                                onClose();
                                onShowRegister(true);
                            }}
                        >
                        尚無會員?點此註冊
                        </span>
                    </div>
                    {signInMessage && <div className="text-base w-full flex justify-center mt-[30px]  text-[#EA0000]">{signInMessage}</div>}
                </div>
            </div>
        </div>
    )

};

export default SignInModal;
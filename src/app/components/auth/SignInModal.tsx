import { 
    useState, 
    useRef, 
    useEffect
} from "react";
import Image from "next/image";

import { useAuth } from "../../hooks/useAuth";         
import { AuthError }from "firebase/auth";

interface SignInModalProps {
    onClose: () => void;
    onShowRegister: (visible: boolean) => void;
}

const defaultEmail = "test1@healthExplorer.com";
const defaultPassword = "healthExplorer";

const SignInModal: React.FC<SignInModalProps> = ({ 
    onClose, 
    onShowRegister 
}) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState<string>(defaultEmail);
    const [password, setPassword] = useState<string>(defaultPassword);
    const [signInMessage, setSignInMessage] = useState<string | null>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const emailInput = document.getElementById("email-signin") as HTMLInputElement;
        const passwordInput = document.getElementById("password-signin") as HTMLInputElement;

        if (!emailInput.value || !passwordInput.value) {
          setSignInMessage("欄位不可空白!"); 
          return;
        }
    
        setSignInMessage(""); 
    
        try {
          await signIn(emailInput.value, passwordInput.value);
          emailInput.value= "";
          passwordInput.value= "";
        } catch (error) {
          const err = error as AuthError;
          if (err.code === "auth/invalid-credential") {
           setSignInMessage("請輸入正確信箱及密碼!若無會員，請先註冊!"); 
          } else {
            setSignInMessage("登入發生未知錯誤，請稍後再試!");
          }
        }
    };

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-50 common-row-flex justify-center bg-black bg-opacity-30" 
        >
            <div 
                onClick={event => event.stopPropagation()}
                className="max-w-[900px] md:w-[92%] w-[85%] h-[490px] flex rounded-lg shadow-lg" 
            >
                <div className="w-1/2 sm:common-col-flex hidden justify-center p-7 rounded-l-lg bg-[#4b96af] backdrop-blur-sm">
                    <div className="md:w-[300px] md:h-[300px] sm:w-[250px] sm:h-[250px] mb-2.5 common-bg-image bg-[url('/images/LOGO.png')]"></div>
                    <div className="mt-4 text-white text-3xl font-bold">健康探索者</div>
                </div>
                <div className="relative sm:w-1/2 xs:w-[90%] w-[85%] common-col-flex mx-auto p-7 rounded-lg sm:rounded-l-none sm:rounded-r-lg backdrop-blur-sm bg-white bg-opacity-70">
                    <Image 
                        onClick={onClose} 
                        src="/images/xmark-solid.svg"
                        alt="close" width={20} height={20}
                        className="absolute top-2.5 right-2.5 w-[20px] h-[20px] text-gray-600 hover:text-red-500 cursor-pointer" 
                    />
                    <div className="mb-[35px] text-3xl text-[#1A5665] font-bold">登入會員</div>
                    <div className="w-full common-row-flex mb-[35px]">
                        <label 
                            htmlFor="email-register" 
                            className="common-row-flex flex-shrink-0 w-[60px] pr-2.5 text-black"
                        >
                            Email:
                        </label>
                        <input 
                            ref={firstInputRef} 
                            type="email" 
                            placeholder="請輸入Email" 
                            id="email-signin"
                            className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[13px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)} 
                        />
                    </div>
                    <div className="w-full common-row-flex mb-[65px]">
                        <label 
                            htmlFor="password-register" 
                            className="w-[60px] common-row-flex flex-shrink-0 pr-2.5 text-black"
                        >
                            密碼:
                        </label>
                        <input 
                            onChange={(event) => setPassword(event.target.value)} 
                            value={password}
                            type="password" 
                            placeholder="請輸入密碼" 
                            id="password-signin"
                            className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[13px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
                        />
                    </div>
                    <button 
                        onClick={handleSignIn}
                        type="button" 
                        className="w-full h-[44px] mb-[20px] rounded-lg bg-[#5B98BC] hover:bg-[#2D759E] font-bold text-white text-center text-[20px]"
                    >
                        登入
                    </button>
                    <div className="w-full common-col-flex justify-center mt-[15px] text-base">
                        <span 
                            onClick={() => {
                                onClose();
                                onShowRegister(true);
                            }}
                            className="text-center text-[18px] text-[#5B98BC] hover:text-[#2D759E] cursor-pointer "
                        >
                            尚無會員?點此註冊
                        </span>
                    </div>
                    {signInMessage && (
                        <div className="w-full common-col-flex justify-center mt-[30px] text-lg text-red-500 font-bold">{signInMessage}</div>
                    )}
                </div>
            </div>
        </div>
    )

};

export default SignInModal;
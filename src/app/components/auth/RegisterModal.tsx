import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { useAuth } from "../../hooks/useAuth";

import { AuthError } from "firebase/auth";

interface RegisterModalProps {
  onClose: () => void;
  onShowSignIn: (visible: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  onClose,
  onShowSignIn,
}) => {
  const { register } = useAuth();

  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleRegister = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    event.preventDefault();

    const emailInput = document.getElementById(
      "email-register"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password-register"
    ) as HTMLInputElement;

    if (!emailInput.value || !passwordInput.value) {
      setRegisterMessage("欄位不可空白!");
      return;
    }

    setRegisterMessage("");

    try {
      await register(emailInput.value, passwordInput.value);
      emailInput.value = "";
      passwordInput.value = "";
    } catch (error) {
      const err = error as AuthError;
      if (err.code === "auth/email-already-in-use") {
        setRegisterMessage("email已被註冊,請登入或使用其他email註冊!");
      } else if (err.code === "auth/invalid-email") {
        setRegisterMessage("請輸入有效格式的email!");
      } else if (err.code === "auth/weak-password") {
        setRegisterMessage("密碼強度至少6個字元!");
      } else {
        setRegisterMessage("註冊發生未知錯誤，請稍後再試!");
      }
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 common-row-flex justify-center bg-black bg-opacity-30"
    >
      <form
        onClick={(event) => event.stopPropagation()}
        className="max-w-[900px] md:w-[92%] w-[85%] h-[490px] flex mx-auto rounded-lg shadow-lg"
      >
        <div className="w-1/2 sm:common-col-flex hidden justify-center p-7 rounded-l-lg bg-[#4B96AF] backdrop-blur-sm">
          <div className="md:w-[300px] md:h-[300px] sm:w-[250px] sm:h-[250px] mb-2.5 common-bg-image bg-[url('/images/LOGO.png')]"></div>
          <div className="mt-4 text-white text-3xl font-bold">健康探索者</div>
        </div>
        <div className="relative sm:w-1/2 xs:w-[90%] w-[85%] common-col-flex mx-auto p-7 rounded-lg sm:rounded-l-none sm:rounded-r-lg backdrop-blur-sm bg-white bg-opacity-70">
          <Image
            onClick={onClose}
            src="/images/xmark-solid.svg"
            alt="close"
            width={20}
            height={20}
            className="absolute top-2.5 right-2.5 w-[20px] h-[20px] text-gray-600 hover:text-red-500 cursor-pointer"
          />
          <div className="mb-[35px] text-3xl font-bold text-[#1A5665]">
            註冊會員
          </div>
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
              autoComplete="email"
              placeholder="請輸入Email"
              id="email-register"
              className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[14px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
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
              type="password"
              autoComplete="current-password"
              placeholder="請輸入6個字元以上密碼"
              id="password-register"
              className="w-full h-9 md:px-3.5 px-[5px] bg-[#FFFFFF] leading-5 md:text-base text-[14px] text-gray-600 font-medium border-none focus:outline-none focus:border-[#36B2D7]"
            />
          </div>
          <button
            onClick={handleRegister}
            type="button"
            className="w-full h-[44px] mb-[20px] rounded-lg bg-[#5B98BC] hover:bg-[#2D759E] font-bold text-white text-center text-[20px]"
          >
            註冊
          </button>
          <div className="w-full common-col-flex justify-center mt-[15px] text-base">
            <span
              onClick={() => {
                onClose();
                onShowSignIn(true);
              }}
              className="text-center text-[18px] text-[#5B98BC] hover:text-[#2D759E] cursor-pointer"
            >
              已有會員?點此登入
            </span>
          </div>
          {registerMessage && (
            <div className="w-full common-col-flex justify-center mt-[30px] text-lg text-red-500 font-bold">
              {registerMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterModal;

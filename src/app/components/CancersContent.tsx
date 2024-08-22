'use client';
import { useState } from 'react';
import Image from 'next/image';

interface CancersContextProps {
    id: string;
    title: string;
    isLast: boolean;
    handleNextClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setAnswer: (value: string | number) => void;
    itemOptions: string;
    progress: number; 
}


const CancersContext: React.FC<CancersContextProps> = ({ id, title, isLast, handleNextClick, setAnswer, itemOptions, progress}): React.ReactElement | null => {
    const [inputYear, setInputYear] = useState('');
    const [showClick, setShowClick] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);


    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const index = parseInt(e.target.value, 10);
        setSelectedOption(index);
        setShowClick(true);
        setAnswer(index);
    };


    const handleYearInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const year = e.target.value;
        const yearInt = parseInt(year, 10);
        if (!isNaN(yearInt) && year.length <= 3) {
            setInputYear(year);
            setAnswer(yearInt);
            setShowClick(true);
        } else if (year.length === 0) {
            setInputYear('');
            setShowClick(false);
        }
    };


    return (
        <>
            <main className="w-full h-auto flex flex-col  justify-center items-center bg-[#FCFCFC]">
                <div className="w-[70%] h-[870px] my-[150px]  flex flex-col items-center mb-[40px] mt-[100px] bg-[#FFFFFF] border-solid border-2 border-[#2D759E] rounded-lg shadow-[0_0_5px_#AABBCC] text-black "> 
                    <div className="w-full h-[400px]" style={{ backgroundImage: `url('images/cancerScreeningForm_banner.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div   className="w-[80%] flex  items-center h-[40px] my-[20px] justify-between">
                        <div  className="w-full bg-[#e9ecef] rounded-lg flex">
                            <div className="relative h-[30px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-lg"   style={{ width: `${progress}%`}}>
                                <div className="text-[18px] text-center font-bold text-white">{Math.round(progress)}%</div>
                                <Image  className="absolute bottom-0 top-[-15px] right-[-35px]" src="/images/pen.png" alt="progess" width={65} height={65} />
                            </div>
                        </div>
                    </div>  
                    <div className="w-full flex flex-col justify-center items-center mx-auto mb-[20px] text-[#1D445D] px-[60px] ">
                        <h2 className="font-bold mb-[20px] mt-[10px] text-2xl">{title}</h2>
                        {id === "1" && (
                            <input 
                                className="border-solid border-2 border-[#2D759E] rounded-md w-[230px] h-[35px] mt-[50px] mb-[70px]"
                                type="text"
                                value={inputYear}
                                onChange={handleYearInput}
                                placeholder="請輸入出生民國年份"
                            />
                        )}
                        {itemOptions && (
                            <div className="w-[450px] flex flex-col justify-between mx-auto  text-[20px] mb-[20px]">
                                {itemOptions.split(";").map((element: string, index: number) => (
                                    <div 
                                        key={`${element}-${index}`} 
                                        className={`mb-[20px] block border rounded-lg transition-all duration-300 ${selectedOption === index + 1 ? 'bg-[#5B98BC] text-white' : 'border-gray-300'}`}
                                    >
                                         <label className="flex items-center py-[10px] ">
                                            <input type="radio"
                                                className={`mx-2 my-auto transform transition-transform duration-300 ${selectedOption === index + 1 ? 'scale-150' : 'scale-100'}`}
                                                name={id}
                                                value={index + 1}
                                                onChange={handleOptionChange} 
                                            />
                                            <h5 className={`text-[18px] font-bold my-auto ${selectedOption === index + 1 ? 'text-white' : 'text-gray-500'}`}> {element}</h5>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center ">
                                    <button 
                                        className="mx-auto mb-6  w-[150px]  rounded-lg py-4.5 px-2.5  h-9  bg-[#5B98BC] hover:bg-[#2D759E] font-bold text-white text-center text-[14px]"
                                        style={{ display: showClick ? "block" : "none" }}
                                        onClick={handleNextClick}
                                    >
                                        {isLast ? "Finish" : "Next"}
                                    </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CancersContext;
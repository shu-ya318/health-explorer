'use client';
import { useState } from 'react';


interface CancersContextProps {
    id: string;
    title: string;
    isLast: boolean;
    handleNextClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setAnswer: (value: string | number) => void;
    itemOptions: string;
}


const CancersContext: React.FC<CancersContextProps> = ({ id, title, isLast, handleNextClick, setAnswer, itemOptions}): React.ReactElement | null => {
    const [inputYear, setInputYear] = useState('');
    const [showClick, setShowClick] = useState(false);
    

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setShowClick(true); 
        setAnswer(e.target.value);
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
            <main className="w-full h-auto flex flex-col  justify-center items-center flex-grow  bg-[#F0F0F0] text-black" >
                <div className="w-[1280px] h-auto mt-[100px] bg-[#ffffff] flex flex-col items-center my-[50px] border-solid border-2 border-[#6898a5] shadow-[0_0_5px_#AABBCC] text-black"> 
                    <div className="w-full flex flex-col justify-between mx-auto my-[30px]">
                          <h2 className="font-bold mb-[40px] text-center text-2xl">{title}</h2>
                        {id === "1" && (
                            <input 
                                className="border-solid border border-[#6898a5] rounded-md w-[230px] h-[35px] mx-auto my-[30px]"
                                type="text"
                                value={inputYear}
                                onChange={handleYearInput}
                                placeholder="請輸入出生民國年份"
                            />
                        )}
                        {itemOptions && (
                            <div className="w-[400px] flex flex-col justify-between mx-auto mt-[10px] text-[22px]">
                                {itemOptions.split(";").map((element: string, index: number) => (
                                    <div key={`${element}-${index}`} className="mb-[40px]">
                                        <label>
                                            <input type="radio" name={id} value={index + 1} onChange={handleOptionChange} />
                                            {element}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center ">
                                    <button 
                                        className="mx-auto my-6  w-[150px] bg-[#24657d] rounded-md py-4.5 px-2.5  h-9  hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[14px]"
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
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
            <main className="w-full h-auto common-col-flex justify-center bg-[#FCFCFC]">
                <div className="xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] common-col-flex h-[870px] my-[150px] mb-[40px] mt-[100px] bg-[#FFFFFF] common-border border-2 rounded-lg shadow-[0_0_5px_#AABBCC] text-black"> 
                    <div className="w-full h-[400px] aspect-square" style={{ backgroundImage: `url('images/cancerScreeningForm_banner.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div   className=" common-row-flex justify-between md:w-[90%] xs:w-[85%] w-[78%] h-[40px] my-[20px]">
                        <div  className="flex w-full bg-[#e9ecef] rounded-lg">
                            <div className="relative h-[30px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-lg"   style={{ width: `${progress}%`}}>
                                <div className="text-[18px] text-center text-white font-bold">{Math.round(progress)}%</div>
                                <Image  className="absolute bottom-0 top-[-15px] right-[-35px]" src="/images/pen.png" alt="progess" width={65} height={65} />
                            </div>
                        </div>
                    </div>  
                    <div className=" w-full common-col-flex justify-center rmx-auto mb-[20px] md:px-[60px] px-0 text-[#1D445D] ">
                        <h2 className="md:w-full w-[80%] mb-[25px] mt-[10px] lg:text-2xl sm:text-[22px] text-[18px] text-center font-bold">{title}</h2>
                        {id === "1" && (
                            <input 
                                className="lg:w-[20%] md:w-[38%] xs:w-[45%] w-[55%] min-w-[157px] h-[35px] mt-[50px] mb-[75px] border-2 common-border rounded-lg"
                                type="text"
                                value={inputYear}
                                onChange={handleYearInput}
                                placeholder="請輸入出生民國年份"
                            />
                        )}
                        {itemOptions && (
                            <div className="md:w-[60%] w-[80%] flex flex-col justify-between mx-auto  mb-[20px] text-[20px]">
                                {itemOptions.split(";").map((element: string, index: number) => (
                                    <div 
                                        key={`${element}-${index}`} 
                                        className={`mb-[20px] block border rounded-lg transition-all duration-300 ${selectedOption === index + 1 ? 'bg-[#5B98BC] text-white' : 'border-gray-300'}`}
                                    >
                                         <label className="common-row-flex py-[10px] ">
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
                        <div className="common-row-flex">
                                    <button 
                                        className="w-[150px] h-9 mx-auto mb-6 py-4.5 px-2.5 common-button"
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
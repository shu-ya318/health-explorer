import { useState } from "react";
import Image from "next/image";

interface CancersContentProps {
    id: string;
    title: string;
    isLast: boolean;
    handleNextClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleSetAnswer: (value: string | number) => void;
    itemOptions: string[];
    progress: number; 
    handleFinishClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
    loading:boolean;
}
const CancersContent: React.FC<CancersContentProps> = ({ 
    id, 
    title, 
    isLast, 
    handleNextClick, 
    handleSetAnswer, 
    itemOptions, 
    progress,
    handleFinishClick,
    loading
}) => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [inputYear, setInputYear] = useState<string>("");
    const [showClick, setShowClick] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const index = parseInt(event.target.value, 10);
        setSelectedOption(index);
        setShowClick(true);
        handleSetAnswer(index);
    };

    const handleYearInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const year = event.target.value;
        const yearInt = parseInt(year, 10);

        if (!isNaN(yearInt) && year.length <= 3) {
            setInputYear(year);
            handleSetAnswer(yearInt);
            setShowClick(true);
        } else if (year.length === 0) {
            setInputYear("");
            setShowClick(false);
        }
    };

    const renderOptions = (options: string[]) => {
        return options.map((option, index) => (
            <div
                key={`${option}-${index}`}
                className={`mb-[20px] block border rounded-lg transition-all duration-300 
                            ${selectedOption === index + 1 ? "bg-[#5B98BC] text-white" : "border-gray-300"}`}
            >
                <label className="common-row-flex py-[10px]">
                    <input
                        type="radio"
                        className={`mx-2 my-auto transform transition-transform duration-300 
                                    ${selectedOption === index + 1 ? "scale-150" : "scale-100"}`}
                        name={id}
                        value={index + 1}
                        onChange={handleOptionChange}
                    />
                    <h5 className={`text-[18px] font-bold my-auto 
                        ${selectedOption === index + 1 ? "text-white" : "text-gray-500"}`}>{option}</h5>
                </label>
            </div>
        ));
    };

    return (
        <>
            <main className="w-full h-auto common-col-flex justify-center bg-[#FCFCFC]">
                <div className="xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] common-col-flex h-[870px] my-[150px] mb-[40px] mt-[100px] bg-[#FFFFFF] common-border border-2 rounded-lg shadow-[0_0_5px_#AABBCC] text-black">
                    <div className="relative w-full h-[400px]">
                        <Image 
                            src="/images/cancerScreeningForm_banner.jpg" 
                            alt="cancerScreeningForm_banner" 
                            fill={true}
                            className="w-full h-full object-cover rounded-t-md"
                            onLoad={() => setImageLoaded(true)}
                            style={{backgroundImage: imageLoaded ? "" : "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)"}}
                        />
                    </div>
                    <div className="md:w-[90%] xs:w-[85%] w-[78%] h-[40px] common-row-flex justify-between my-[20px]">
                        <div className="flex w-full bg-[#e9ecef] rounded-lg">
                            <div
                                className="relative h-[30px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-lg"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="pl-[10px] text-[18px] text-center text-white font-bold">{Math.round(progress)}%</div>
                                <Image
                                    src="/images/pen.png"
                                    alt="progress"
                                    width={65}
                                    height={65}
                                    className="absolute bottom-0 top-[-15px] right-[-35px]"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full common-col-flex justify-center mx-auto mb-[20px] md:px-[60px] px-0 text-[#1D445D]">
                        <h2 className="md:w-full w-[80%] mb-[25px] mt-[10px] lg:text-2xl sm:text-[22px] text-[18px] text-center font-bold">{title}</h2>
                        {id === "1" && (
                            <input
                                type="text"
                                placeholder="請輸入出生民國年份"
                                className="lg:w-[20%] md:w-[38%] xs:w-[45%] w-[55%] min-w-[157px] h-[35px] mt-[50px] mb-[75px] border-2 common-border rounded-lg"
                                value={inputYear}
                                onChange={handleYearInput}
                            />
                        )}
                        {itemOptions && itemOptions.length > 0 && (
                            <div className="md:w-[60%] w-[80%] flex flex-col justify-between mx-auto mb-[20px] text-[20px]">
                                {renderOptions(itemOptions)}
                            </div>
                        )}
                        <div className="common-row-flex">
                            <button
                                onClick={isLast ? handleFinishClick : handleNextClick}
                                type="button"
                                className="w-[150px] h-9 mx-auto mb-6 py-4.5 px-2.5 common-button"
                                style={{ display: showClick ? "block" : "none" }}
                            >
                                {isLast ? "Finish" : "Next"}
                            </button>
                        </div>
                        { loading && ( 
                            <div className="w-full common-col-flex justify-center">正在提交問卷...</div> 
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}

export default CancersContent;
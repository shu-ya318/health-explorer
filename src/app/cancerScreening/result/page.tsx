'use client';
import { useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { InstantResults } from "../../components/AlgoliaSearch/InstantResults";
import Image from 'next/image';
import Link from 'next/link';

/*interface ResultProps {
    answers: (string | number)[];
}*/


const cancers = [
    { filter: '子宮頸癌'},
    { filter: '乳癌'},
    { filter: '大腸癌'},
    { filter: '口腔癌'},
    { filter: '肺癌'}
  ];


const CancerScreeningResultPage: React.FC = (): React.ReactElement | null  => {
    const router = useRouter();
    const [answers, setAnswers] = useState<any[]>([]);

    useEffect(() => {
        const storedAnswers = localStorage.getItem('answers');
        if (storedAnswers) {
            try {
                const parsedAnswers = JSON.parse(storedAnswers).map((item: string) => {
                    const parsedItem = parseInt(item, 10);
                    if (isNaN(parsedItem)) {
                        throw new Error("解析錯誤：答案中包含非數字元素");
                    }
                    return parsedItem;
                });
                setAnswers(parsedAnswers);
                console.log(parsedAnswers);
            } catch (error) {
                console.error("解析存儲的答案時發生錯誤：", error);
            }
        } else {
            console.log('No answers found in local storage.');
        }
    }, []);


    if (!answers || answers.length === 0) {
        return <p>正在加載答案...</p>; 
    }

    

    const birthYear = answers[0] as number;
    const indigenous = answers[1] as number;
    const gender = answers[2] as number;
    const betelNutUsage = answers[3] as number;
    const smoking = answers[4] as number;
    const familyLungCancer = answers[5] as number;
    const familyBreastCancer = answers[6] as number;


    const noQualification = (birthYear > 96 && betelNutUsage === 3 && smoking === 3) ||
                            (birthYear >= 85 && birthYear <= 96 && indigenous === 2) ||
                            (birthYear < 40 && gender === 1);
    
    const oralCancerQualification = (birthYear >= 85 && birthYear <= 96 && indigenous === 1) ||
                                    (birthYear < 85 && (betelNutUsage === 1 || betelNutUsage === 2)) ||
                                    (birthYear < 85 && (smoking === 1 || smoking === 2));

    const lungCancerQualification = ((birthYear >= 40 && birthYear <= 69 && gender === 2 && familyLungCancer === 1) ||
                                     (birthYear >= 40 && birthYear <= 64 && gender === 1 && familyLungCancer === 1) ||
                                     (birthYear >= 40 && birthYear <= 64 && smoking === 1));

    const colorectalCancerQualification = (birthYear >= 40 && birthYear <= 64);

    const cervicalCancerQualification = (birthYear < 85 && gender === 2);

    const breastCancerQualification = ((birthYear >= 45 && birthYear <= 69 && gender === 2) ||
                                       (birthYear >= 70 && birthYear <= 74 && gender === 2 && familyBreastCancer === 1));


    const handleSearchClick = (filter: string) => {
        window.open(`/search?filter=${filter}`, '_blank');
    };                        


    return (
        <>
            <main className="relative w-full h-auto flex flex-col items-center flex-grow">
                <Image src="/images/cancerScreeningResult_banner.jpg" alt="cancerScreeningResult_banner" width={1920} height={1024} className="opacity-90"/>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[800px] h-auto flex flex-col py-7 px-10 border-solid border-2 border-[#6898a5] shadow-[0_0_5px_#AABBCC] rounded-lg bg-[#ffffff] opacity-95">
                    <div className="text-[#1D445D] font-bold text-[28px] text-center">您的檢測結果如下:</div>
                    {noQualification && (
                        <div className="flex h-[250px] w-full justify-between items-center">
                            <div className="flex text-lg  w-[70%] h-full justify-start items-center text-[#1D445D] font-bold ">
                                <Image src="/images/rectangle-xmark-solid.svg" alt="" width={25} height={25} className="mr-[10px]"/>
                                <p className="text-center">您目前無符合的免費癌症篩檢資格</p>
                            </div>
                            <button 
                                type="button"  
                                className="flex items-center justify-center w-[200px] px-[5px] bg-[#24657d] rounded-md h-11 hover:bg-[#7199a1]  font-bold text-white text-center text-[18px] transition-all duration-300 hover:scale-110 hover:text-black" 
                                onClick={() => handleSearchClick("醫院")} 
                            >
                                <Image className="w-auto h-auto mr-[5px]" src="/images/search.png" alt="Search" width={40} height={40}/>
                                自費篩檢醫院
                            </button>
                            <button 
                                type="button"  
                                className="w-[200px] bg-[#24657d] rounded-md py-4.5 px-4  h-11 ml-[15px] bg-[#acb8b6]  font-bold text-white text-center text-[18px] transition-all duration-300 hover:scale-110 hover:text-black" 
                                onClick={()=>router.push('/cancerScreening')} 
                            >
                                改替親友查詢
                            </button>
                        </div>
                    )}
                    {/*符合資格*/}
                    {oralCancerQualification && (
                        <div className="flex h-[130px] w-full justify-between items-center">
                            <div className="flex text-lg  w-[70%] h-full justify-start items-center text-[#1D445D] font-bold">
                                <Image src="/images/square-check-regular.svg" alt="" width={25} height={25} className="mr-[10px]"/>
                                <p className="text-center">每<strong className="mx-[6px]">2</strong>年可進行一次免費口腔癌篩檢。</p>
                            </div>
                            <button 
                                type="button"  
                                className="flex items-center justify-center w-[200px] bg-[#24657d] rounded-md h-11 hover:bg-[#7199a1]  font-bold text-white text-center text-[18px] transition-all duration-300 hover:scale-110 hover:text-black" 
                                onClick={()=>handleSearchClick(cancers[3].filter)} 
                            >
                                <Image className="w-auto h-auto mr-[5px]" src="/images/search.png" alt="Search" width={40} height={40}/>
                                口腔癌篩檢機構
                            </button>
                        </div>
                    )}
                    {lungCancerQualification && (
                        <div className="flex h-[130px] w-full justify-between items-center">
                            <div className="flex text-lg  w-[70%] h-full justify-start items-center text-[#1D445D] font-bold ">
                                <Image src="/images/square-check-regular.svg" alt="" width={25} height={25} className="mr-[10px]"/>
                                <p className="text-center">每<strong className="mx-[6px]">2</strong>年可進行一次免費肺癌篩檢。</p>
                            </div>
                            <button 
                                type="button"  
                                className="flex items-center justify-center w-[200px] bg-[#24657d] rounded-md h-11 hover:bg-[#7199a1]  font-bold text-white text-center text-[18px] transition-all duration-300 hover:scale-110 hover:text-black" 
                                onClick={()=>handleSearchClick(cancers[4].filter)} 
                            >
                                <Image className="w-auto h-auto mr-[8px]" src="/images/search.png" alt="Search" width={40} height={40}/>
                                肺癌篩檢機構
                            </button>
                        </div>
                    )}
                    { cervicalCancerQualification && (
                        <div className="flex h-[130px] w-full justify-between items-center">
                            <div className="flex text-lg  w-[70%] h-full justify-start items-center text-[#1D445D] font-bold ">
                                <Image src="/images/square-check-regular.svg" alt="" width={25} height={25} className="mr-[10px]"/>
                                <p className="text-center">每<strong className="mx-[6px]">1</strong>年可進行一次免費子宮頸癌篩檢。</p>
                            </div>
                            <button 
                                type="button"  
                                className="flex items-center justify-center w-[200px] bg-[#24657d] rounded-md h-11 hover:bg-[#7199a1]  font-bold text-white text-center text-[18px] transition-all duration-300 hover:scale-110 hover:text-black" 
                                onClick={()=>handleSearchClick(cancers[0].filter)} 
                            >
                                <Image className="w-auto h-auto mr-[1px]" src="/images/search.png" alt="Search" width={40} height={40}/>
                                子宮頸癌篩檢機構
                            </button>
                        </div>
                    )}
                    { colorectalCancerQualification && (
                        <div className="flex h-[130px] w-full justify-between items-center">
                            <div className="flex text-lg  w-[70%] h-full justify-start items-center text-[#1D445D] font-bold ">
                                <Image src="/images/square-check-regular.svg" alt="" width={25} height={25} className="mr-[10px]"/>
                                <p className="text-center">每<strong className="mx-[6px]">2</strong>年可進行一次免費大腸癌篩檢。</p>
                            </div>
                            <button 
                                type="button"  
                                className="flex items-center justify-center w-[200px] bg-[#24657d] rounded-md h-11 hover:bg-[#7199a1]  font-bold text-white text-center text-[18px] transition-all duration-300 hover:scale-110 hover:text-black" 
                                onClick={()=>handleSearchClick(cancers[2].filter)} 
                            >
                                <Image className="w-auto h-auto mr-[5px]" src="/images/search.png" alt="Search" width={40} height={40}/>
                                大腸癌篩檢機構
                            </button>
                        </div>
                    )}
                    { breastCancerQualification && (
                        <div className="flex h-[130px] w-full justify-between items-center">
                            <div className="flex text-lg  w-[70%] h-full justify-start items-center text-[#1D445D] font-bold ">
                                <Image src="/images/square-check-regular.svg" alt="" width={25} height={25} className="mr-[10px]"/>
                                <p className="text-center">每<strong className="mx-[6px]">2</strong>年可進行一次免費乳癌篩檢。</p>
                            </div>
                            <button 
                                type="button"  
                                className="flex items-center justify-center w-[200px] bg-[#24657d] rounded-md h-11 hover:bg-[#7199a1]  font-bold text-white text-center text-[18px] transition-all duration-300 hover:scale-110 hover:text-black" 
                                onClick={()=>handleSearchClick(cancers[1].filter)} 
                            >
                                <Image className="w-auto h-auto mr-[5px]" src="/images/search.png" alt="Search" width={40} height={40}/>
                                乳癌篩檢機構
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default CancerScreeningResultPage;  
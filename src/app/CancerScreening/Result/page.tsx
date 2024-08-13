'use client';
import { useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { InstantResults } from "../../components/AlgoliaSearch/InstantResults";


interface ResultProps {
    answers: (string | number)[];
}


const cancer = [
    { filter: '子宮頸癌'},
    { filter: '乳癌'},
    { filter: '大腸癌'},
    { filter: '口腔癌'},
    { filter: '肺癌'}
  ];


const CancerScreeningResultPage: React.FC<ResultProps> = () => {
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
        router.push(`/Search?filter=${filter}`);
    };


    return (
        <div className="w-full h-auto py-[30px] flex flex-col justify-center items-center bg-[#F0F0F0]">
            <h2 className="text-black text-2xl font-bold mb-[30px]">結果顯示如下:</h2>
            {noQualification && (
                <div className="flex p-4 ">
                    <p className="text-xl text-center text-black">您目前無符合的免費癌症篩檢資格，若有自費需求請洽各大醫院。</p>
                    <button 
                        className="mx-auto my-16  w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-11  hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]" 
                        onClick={() => router.push(`/Search`)}>
                        開始搜尋醫院
                    </button>
                </div>
            )}
            {oralCancerQualification && (
                <div className="p-4 text-center">
                    <p className="p-4 text-center text-black">每2年可免費篩檢1次。</p>
                    <button 
                        className="mt-4 p-2 bg-blue-500 text-white" 
                        onClick={() => handleSearchClick(cancer[3].filter)}>
                        口腔癌篩檢
                    </button>
                </div>
            )}
            {lungCancerQualification && (
                <div className="p-4 text-center">
                    <p className="p-4 text-center text-black">每2年可免費篩檢1次。</p>
                    <button 
                        className="mt-4 p-2 bg-blue-500 text-white" 
                        onClick={() => handleSearchClick(cancer[4].filter)}
                    >
                        肺癌篩檢
                    </button>
                </div>
            )}
            {colorectalCancerQualification && (
                <div className="p-4 text-center">
                    <p className="p-4 text-center text-black">每2年可免費篩檢1次。</p>
                    <button 
                        className="mt-4 p-2 bg-blue-500 text-white" 
                        onClick={() => handleSearchClick(cancer[2].filter)}
                    >
                        大腸癌篩檢
                    </button>
                </div>
            )}
            {cervicalCancerQualification && (
                <div className="p-4 text-center">
                    <p className="p-4 text-center text-black">每1年可免費篩檢1次。</p>
                    <button 
                        className="mt-4 p-2 bg-blue-500 text-white" 
                        onClick={() => handleSearchClick(cancer[0].filter)}
                    >
                        子宮頸癌篩檢
                    </button>
                </div>
            )}
            {breastCancerQualification && (
                <div className="p-4 text-center">
                    <p className="p-4 text-center text-black">每2年可免費篩檢1次。</p>
                    <button 
                        className="mt-4 p-2 bg-blue-500 text-white" 
                        onClick={() => handleSearchClick(cancer[1].filter)}
                    >
                        乳癌篩檢
                    </button>
                </div>
            )}
            <InstantResults />
        </div>
    );
}



export default CancerScreeningResultPage;   
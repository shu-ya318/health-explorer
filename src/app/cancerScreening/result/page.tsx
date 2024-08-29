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
            <main className=" w-full h-auto common-col-flex justify-center bg-[#FCFCFC]">
                <div className="xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] h-auto common-col-flex my-[150px] mb-[40px] bg-[#FFFFFF] common-border border-2 rounded-lg shadow-[0_0_5px_#AABBCC] text-black"> 
                    <div className=" w-full flex h-[440px] common-bg-image rounded-t-lg" style={{ backgroundImage: `url('../images/cancerScreeningResult_banner.jpg')` }}></div>
                    <div className="w-full  my-[20px] text-[#1D445D] text-[28px] text-center font-bold">您的檢測結果如下:</div>
                    {noQualification && (
                        <div className="common-col-flex justify-between w-full mx-auto px-[40px] mb-[40px]">  
                            <div className="animate-flip flex flex-col w-[200px] h-[330px] py-[10px] justify-around rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB]">
                                    <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                                    <div className="text-[18px]">很抱歉...</div>
                                    <div className="text-[24px]">您尚無免費資格</div>
                                </div>  
                                <div className="w-[140px] h-[140px] mx-auto rounded-lg bg-[#f0ffff] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url('../images/notFound.png')` }}></div>  
                                <button  
                                    className="cancerResult-button shadow-xs"
                                    onClick={() => handleSearchClick("醫院")} 
                                >
                                    查詢自費醫院
                                </button>  
                            </div>  
                        </div>
                    )}
                    <div className="w-full common-row-flex flex-wrap justify-center mx-auto px-[40px] mb-[40px]">  
                        { oralCancerQualification && (
                            <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                                 <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                                 <div className="text-[18px]">每<strong className="text-[24px] mx-[5px]">2</strong>年可篩檢:</div>
                                 <div className="text-[24px] text-center">口腔癌</div>
                                </div>  
                                <div className="w-[130px] h-[130px] mx-auto rounded-lg bg-[#f0ffff] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url('../images/oralCancer.png')` }}></div>  
                                <button  
                                    className="cancerResult-button shadow-xs"
                                    onClick={()=>handleSearchClick(cancers[3].filter)} 
                                >
                                    挑選機構
                                </button>
                            </div>  
                        )}
                        { lungCancerQualification && (
                            <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] xl:py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                                 <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                                    <div className="text-[18px]  ">每<strong className="text-[24px] mx-[5px]">2</strong>年可篩檢:</div>
                                    <div className="text-[24px] text-center">肺癌</div>
                                </div>  
                                <div className="mx-auto w-[130px] h-[130px] rounded-lg bg-[#f0ffff] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url('../images/lungCancer.png')` }}></div>  
                                <button  
                                    className="cancerResult-button shadow-xs"
                                    onClick={()=>handleSearchClick(cancers[4].filter)} 
                                >
                                    挑選機構
                                </button>
                            </div>  
                        )}
                        { cervicalCancerQualification && (
                            <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                                 <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                                 <div className="text-[18px]  ">每<strong className="text-[24px] mx-[5px]">1</strong>年可篩檢:</div>
                                 <div className="text-[24px] text-center">子宮頸癌</div>
                                </div>  
                                <div className="mx-auto w-[130px] h-[130px] rounded-lg bg-[#f0ffff] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url('../images/cervicalCancer.png')` }}></div>  
                                <button  
                                    className="cancerResult-button shadow-xs"
                                    onClick={()=>handleSearchClick(cancers[0].filter)} 
                                >
                                    挑選機構
                                </button>
                            </div>  
                        )}
                        { breastCancerQualification && (
                            <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                                 <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                                    <div className="text-[18px]  ">每<strong className="text-[24px] mx-[5px]">2</strong>年可篩檢:</div>
                                    <div className="text-[24px] text-center">乳癌</div>
                                </div>  
                                <div className="mx-auto w-[130px] h-[130px] rounded-lg bg-[#f0ffff] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url('../images/breastCancer.png')` }}></div>  
                                <button  
                                    className="cancerResult-button shadow-xs"
                                    onClick={()=>handleSearchClick(cancers[1].filter)} 
                                >
                                    挑選機構
                                </button>
                            </div>  
                        )}
                        { colorectalCancerQualification && (
                            <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                                 <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                                    <div className="text-[18px]  ">每<strong className="text-[24px] mx-[5px]">2</strong>年可篩檢:</div>
                                    <div className="text-[24px] text-center">大腸癌</div>
                                </div>  
                                <div className="mx-auto w-[130px] h-[130px] rounded-lg bg-[#f0ffff] bg-no-repeat bg-contain bg-center" style={{ backgroundImage: `url('../images/colorectalCancer.png')` }}></div>  
                                <button  
                                    className="cancerResult-button shadow-xs"
                                    onClick={()=>handleSearchClick(cancers[2].filter)} 
                                >
                                    挑選機構
                                </button>
                            </div>  
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
export default CancerScreeningResultPage;  
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

import CancersContext from "./CancersContent";

interface SurveyItem {
    id: string;
    title: string;
    itemOptions: string[];
}

const surveyItems: SurveyItem[] = [
    { id: "1", title: "1.您的出生民國年份?", itemOptions: [] },
    { id: "2", title: "2.您是否為原住民?", itemOptions: ["是", "否"] },
    { id: "3", title: "3.您的性別?", itemOptions: ["男性", "女性"] },
    { id: "4", title: "4.您是否有嚼檳榔的習慣?", itemOptions: ["目前已戒掉", "有", "無"] },
    { id: "5", title: "5.您是否有抽菸的習慣?", itemOptions: ["1天抽1包以上", "1天只抽幾支", "無"] },
    { id: "6", title: "6.您是否有肺癌家族史(父母、子女、兄弟姊妹曾罹患肺癌)?", itemOptions: ["有", "無"] },
    { id: "7", title: "7.您是否有乳癌家族史(父母、子女、兄弟姊妹曾罹患乳癌)?", itemOptions: ["有", "無", "非女性"] }
];

const CancerScreeningPage: React.FC = () => {
    const router = useRouter();

    const [groupNum, setGroupNum] = useState<number>(1);
    const [isLast, setIsLast] = useState<boolean>(false);
    const [answers, setAnswers] = useState<(string | number)[]>([]); 
    const [finished, setFinished] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    useEffect(()=>{
        if (finished && answers.length === surveyItems.length) {
            localStorage.setItem("answers", JSON.stringify(answers));
            router.push("/cancerScreening/result");
        }
    },[finished, router, answers]);
    
    const handleNextClick = (event: React.MouseEvent) => {
        event.preventDefault();

        setGroupNum(prevGroupNum => {
            let newGroupNum = prevGroupNum + 1;
    
            if (surveyItems.length === newGroupNum) {
                setIsLast(true);
            }
            if (isLast) {
                setFinished(true);
                return prevGroupNum;
            }
            return newGroupNum;
        });

        if (!isLast && groupNum >= 1) {
            setProgress(prevProgress => {
                const newProgress = Math.round(prevProgress + 16.5);
                return newProgress > 100 ? 100 : newProgress;
            });
        }
    };

    const handleSetAnswer = (value: string | number) => {
        const newAnswers = [...answers];
        newAnswers[groupNum - 1] = value;
        setAnswers(newAnswers);
    };

    return (     
        <>  
            <CancersContext 
                key={groupNum} 
                handleNextClick={handleNextClick} 
                handleSetAnswer={handleSetAnswer} 
                progress={progress}  
                isLast={isLast}
                {...surveyItems[groupNum - 1]}
            />
        </>
    )
};

export default CancerScreeningPage;
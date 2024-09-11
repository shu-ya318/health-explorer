"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 

import CancersContent from "./CancersContent";

import { db } from "../lib/firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

interface SurveyItem {
    id: string;
    title: string;
    itemOptions: string[];
}

const surveyItems: SurveyItem[] = [
    { id: "1", title: "1.您的出生民國年份?", itemOptions: [] },
    { id: "2", title: "2.您是否為原住民?", itemOptions: ["是", "否"] },
    { id: "3", title: "3.您的性別?", itemOptions: ["女性", "男性"] },
    { id: "4", title: "4.您是否有嚼檳榔的習慣?", itemOptions: ["目前已戒掉", "有", "無"] },
    { id: "5", title: "5.您是否有抽菸的習慣?", itemOptions: ["1天抽20支以上", "1天最多抽10幾支", "無"] },
    { id: "6", title: "6.您是否有肺癌家族史(父母、子女、兄弟姊妹曾罹患肺癌)?", itemOptions: ["有", "無"] },
    { id: "7", title: "7.您是否有乳癌家族史(父母、子女、兄弟姊妹曾罹患乳癌)?", itemOptions: ["有", "無"] }
];

const CancerScreeningPage: React.FC = () => {
    const router = useRouter();

    const [groupNum, setGroupNum] = useState<number>(1);
    const [isLast, setIsLast] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [answers, setAnswers] = useState<(string | number)[]>([]); 
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleNextClick = (event: React.MouseEvent) => {
        event.preventDefault();

        setGroupNum(prevGroupNum => {
            let newGroupNum = prevGroupNum + 1; //前往下題
    
            if (surveyItems.length === newGroupNum) {
                setIsLast(true);               //顯示最後一題(尚未切換finish狀態)
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

    const handleFinishClick = async (): Promise<void> => {
        if ( isLast&& !finished && answers.length === surveyItems.length ) {  //先檢查是最後一題且已作答完畢
            setFinished(true); //避免重複提交
            setLoading(true);
        
            const testerId = uuidv4();
            sessionStorage.setItem("testerId", testerId);

            try {
                const docData = {
                    testerId: testerId,
                    birthYear: answers[0],
                    indigenous: answers[1],
                    gender: answers[2],
                    betelNutUsage: answers[3],
                    smoking: answers[4],
                    familyLungCancer: answers[5],
                    familyBreastCancer: answers[6],
                };
                const newDocRef = doc(collection(db, "cancerScreening"));
                await setDoc(newDocRef, docData);   //寫入時，選中第一個選項則值為1
                router.push("/cancerScreening/result");
            } catch (error) {
                console.error("Error writing document: ", error);
                setFinished(false);  //若提交錯誤，允許重點擊再次提交
            } finally {
                setLoading(false);
            }
        }
    };

    return (     
        <>  
            <CancersContent 
                key={groupNum} 
                handleNextClick={handleNextClick} 
                handleSetAnswer={handleSetAnswer} 
                progress={progress}  
                isLast={isLast}
                loading={loading}
                {...surveyItems[groupNum - 1]}
                handleFinishClick={handleFinishClick}
            />
        </>
    )
};

export default CancerScreeningPage;
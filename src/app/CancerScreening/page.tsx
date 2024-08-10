'use client';
import CancersContext from '../components/CancersContext';
import { useRouter } from 'next/navigation'; 
import {useState, useEffect} from 'react';


const surveyItems = [
    {id:"1",title:"第一題:您的出生民國年份?",itemOptions:""},
    {id:"2",title:"第二題:您是否為原住民?",itemOptions:"是;否"},
    {id:"3",title:"第三題:您的性別?",itemOptions:"男性;女性"},
    {id:"4",title:"第四題:您是否有嚼檳榔的習慣?",itemOptions:"曾經有，目前已戒掉;有;無"},
    {id:"5",title:"第五題:您是否有抽菸的習慣?",itemOptions:"1天抽1包以上;1天只抽幾支;無"},
    {id:"6",title:"第六題:您是否有肺癌家族史(父母、子女、兄弟姊妹曾罹患肺癌)?",itemOptions:"有;無"},
    {id:"7",title:"第七題:您是否有乳癌家族史(父母、子女、兄弟姊妹曾罹患乳癌)?",itemOptions:"有;無;非女性"},
]


const CancerScreeningPage: React.FC = (): React.ReactElement | null  => {
    const router = useRouter();
    const [groupNum, setGroupNum] = useState<number>(1);
    const [isLast, setIsLast] = useState<boolean>(false);
    const [answers, setAnswers] = useState<any[]>([]);
    const [finished, setFinished] = useState<boolean>(false);


    useEffect(()=>{
        if (finished && answers.length === surveyItems.length) {
            localStorage.setItem('answers', JSON.stringify(answers));
            router.push('/CancerScreening/Result');
        }
    },[finished, router, answers]);

    
    const handleNextClick = (e: React.MouseEvent) => {
        e.preventDefault();

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
    };


    const handleSetAnswer = (value: any) => {
        const newAnswers = [...answers];
        newAnswers[groupNum - 1] = value;
        setAnswers(newAnswers);
    };


    return (     
        <>  
            <CancersContext 
                key={groupNum} 
                handleNextClick={handleNextClick} 
                setAnswer={handleSetAnswer} 
                isLast={isLast}
                {...surveyItems[groupNum - 1]}
            />
        </>
    )
};


export default CancerScreeningPage;
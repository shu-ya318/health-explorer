'use client';
import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { db } from '../../lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where, QueryDocumentSnapshot } from 'firebase/firestore';
import { FirebaseInstitutionData } from '../../lib/types.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
// import type { NextApiRequest, NextApiResponse } from 'next';
// 暫用靜態圖


/*type ResponseData = {
    lat?: number;
    lng?: number;
    error?: string;
  };*/


const Institution: React.FC = (): React.ReactElement | null  => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 

    const router = useRouter();
    const [loading,setLoading] = useState(true);
    // const pathname = usePathname();  會錯誤地取得null
    const [institutionData, setInstitutionData] = useState<FirebaseInstitutionData| null>(null);
    

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const encodedHospName = pathSegments.pop() || '';
        const hosp_name = decodeURIComponent(encodedHospName); 

        const fetchInstitutionInfo = async () => {
            try {
                const q = query(collection(db, 'medicalInstitutions'), where('hosp_name', '==', hosp_name));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => doc.data())[0] as FirebaseInstitutionData;
                setInstitutionData(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
            setLoading(false);
        };
        fetchInstitutionInfo();
    }, []);


    return(
        <>
        {institutionData && (
            <>
                <main className="w-full h-auto flex flex-col  justify-center items-center flex-grow  bg-[#F0F0F0]" >
                    <div className="mt-[100px] bg-[#ffffff] w-[1280px] flex flex-col items-center my-[50px] border-solid border-2 border-[#6898a5] shadow-[0_0_5px_#AABBCC]"> 
                        <div className="w-[1200px]">
                            <div className="w-full flex  flex-col items-center">
                                <h3 className="text-3xl text-black font-bold text-center mt-[40px]">{institutionData.hosp_name}</h3>
                                <Image src="/images/heart_line.svg" alt="collection"  width={40} height={40} className="mt-[30px] border-solid border-4 border-[#6898a5] rounded-full" />
                            </div>
                              {/*簡介*/}
                                <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                <h3 className="text-2xl text-black underline decoration-[#6898a5] decoration-4 font-bold mb-[30px]">資訊簡介</h3>
                                <form className="wfull h-full flex flex-col justify-around p-[10px] ml-[10px]">
                                    <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                        <p className="mr-[120px]">電話:</p>
                                        <span className="">{institutionData.tel}</span>
                                    </div>
                                    <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                        <p className="mr-[100px]">行政區:</p>
                                        <span className="">{institutionData.area}</span>
                                    </div>
                                    <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                        <p className="mr-[115px]">地址:</p>
                                        <span className="">{institutionData.hosp_addr}</span>
                                    </div>
                                    <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                        <p className="mr-[120px]">科別:</p>
                                        <span className="">{institutionData.division}</span>
                                    </div>
                                    <div className="w-full flex  h-[24px] text-xl text-black mb-[25px]">
                                        <p className="mr-[40px]">癌症篩檢服務:</p>
                                        <span className="">{institutionData.cancer_screening}</span>
                                    </div>
                                </form>
                                 {/*地圖*/}
                                <hr className="w-full border border-[#acb8b6] my-[30px]"/>
                                <h3 className="text-2xl text-black underline decoration-[#6898a5] decoration-4 font-bold mt-[5px] mb-[30px]">地圖實景</h3>
                                <Image 
                                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(institutionData.hosp_addr)}&zoom=15&size=250x200&key=${apiKey}`} 
                                    alt="institution" 
                                    width={1280} 
                                    height={450} 
                                    className="w-full h-[350px]" 
                                    unoptimized={true}
                                />
                                {/*輪播薦*/}
                                <hr className="w-full border-solid border border-[#acb8b6] my-[30px]"/>
                                {loading ? (
                                    <Skeleton height={320} width={1200} className="my-[40px] mx-auto" />
                                ) : (
                                <div className="w-full">
                                    <h3 className="text-black font-bold text-2xl  underline decoration-[#6898a5] decoration-4 my-[10px]">您可能也想比較...</h3>
                                    <div className="w-full flex justify-between mt-[50px] relative px-[60px]">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex justify-between w-full h-9">
                                            <button id="left-arrow" className="flex justify-center items-center w-9 h-full border-none p-0 bg-transparent transition duration-300 ease-in-out transform-gpu">
                                                <Image src="/images/left_arrow.png" alt="left-arrow-icon" width={46} height={46} />
                                            </button>
                                            <button id="right-arrow" className="flex justify-center items-center w-9 h-full border-none p-0 bg-transparent transition duration-300 ease-in-out transform-gpu">
                                                <Image src="/images/right_arrow.png" alt="right-arrow-icon" width={46} height={46} />
                                            </button>
                                        </div>
                                        {/*暫時測試*/}   
                                        <div className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                                                <div className="relative">
                                                    <Image 
                                                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(institutionData.hosp_addr)}&zoom=15&size=250x200&key=${apiKey}`} 
                                                        alt="institution" 
                                                        width={250} 
                                                        height={200} 
                                                        className="w-full object-cover object-center" 
                                                        unoptimized={true}
                                                    />
                                                    <Image 
                                                        className="absolute top-1.5 right-1.5 z-10 border-solid border-2 border-[#6898a5] rounded-full" 
                                                        src="/images/heart_line.svg" 
                                                        alt="collection" 
                                                        width={40} 
                                                        height={40} 
                                                    />
                                                </div>
                                                <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[5px]">文心診所</div>
                                                <div className="w-full h-[30px] flex items-center justify-end">
                                                    <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                    <span className="ml-2 text-black mr-[10px] mt-[5px]">觀看數:6</span>
                                                </div>
                                        </div>
                                        <div className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                                                <div className="relative">
                                                    <Image 
                                                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(institutionData.hosp_addr)}&zoom=15&size=250x200&key=${apiKey}`} 
                                                        alt="institution" 
                                                        width={250} 
                                                        height={200} 
                                                        className="w-full object-cover object-center" 
                                                        unoptimized={true}
                                                    />
                                                    <Image 
                                                        className="absolute top-1.5 right-1.5 z-10 border-solid border-2 border-[#6898a5] rounded-full" 
                                                        src="/images/heart_line.svg" 
                                                        alt="collection" 
                                                        width={40} 
                                                        height={40} 
                                                    />
                                                </div>
                                                <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[5px]">新北市蘆洲區衛生所</div>
                                                <div className="w-full h-[30px] flex items-center justify-end">
                                                    <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                    <span className="ml-2 text-black mr-[10px] mt-[5px]">觀看數:6</span>
                                                </div>
                                        </div>
                                        <div className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                                                <div className="relative">
                                                    <Image 
                                                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(institutionData.hosp_addr)}&zoom=15&size=250x200&key=${apiKey}`} 
                                                        alt="institution" 
                                                        width={250} 
                                                        height={200} 
                                                        className="w-full object-cover object-center" 
                                                        unoptimized={true}
                                                    />
                                                    <Image 
                                                        className="absolute top-1.5 right-1.5 z-10 border-solid border-2 border-[#6898a5] rounded-full" 
                                                        src="/images/heart_line.svg" 
                                                        alt="collection" 
                                                        width={40} 
                                                        height={40} 
                                                    />
                                                </div>
                                                <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[5px]">常春聯合診所</div>
                                                <div className="w-full h-[30px] flex items-center justify-end">
                                                    <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                    <span className="ml-2 text-black mr-[10px] mt-[5px]">觀看數:6</span>
                                                </div>
                                        </div>
                                        {/*測試結束*/} 
                                        
                                    </div>
                                    <div className="w-full flex justify-center h-[20px] mt-[20px]">
                                        動生
                                    </div>
                                </div>
                            )}
                            {/*返鈕*/}
                            <div className="flex items-center">
                                <button 
                                    className="mx-auto my-16  w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-11  hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]"
                                    onClick={()=>router.push('/Search')}
                                >
                                    搜尋更多機構
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        )}
        </>
    )
}

export default Institution;

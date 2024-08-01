'use client';
import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { db } from '../../lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where, QueryDocumentSnapshot } from 'firebase/firestore';
import { FirebaseInstitutionData } from '../../lib/types.js';


const Institution: React.FC = (): React.ReactElement | null  => {
    const router = useRouter();
    // const pathname = usePathname();  會錯誤地取得null
    const [institutionData, setInstitutionData] = useState<FirebaseInstitutionData| null>(null);
    

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const encodedHospName = pathSegments.pop() || ''; //pathSegments[pathSegments.length - 1];
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
        };
        fetchInstitutionInfo();
    }, []);


    return(
        <>
        {institutionData && (
            <>
                <main className="w-full h-auto flex justify-center items-center flex-grow  bg-[#e6e6e6]" >
                    <div className="w-[1200px] flex flex-col  "> 
                        {/*簡介*/}
                        <div className="w-full h-[400px] flex justify-between mt-5 px-[20px]">
                            <Image src="/images/person-cane-solid.svg" alt="icon" width={450} height={400} className="border-solid border  border-[#6898a5]"/>
                            <form className="w-[600px] h-full flex flex-col justify-around border  border-[#6898a5] rounded-md p-[20px]">
                                <div className="w-full flex  items-center justify-end">
                                    <Image src="/images/placeholder.png" alt="collection"  width={30} height={30} className="mb-[10px]" />
                                </div>
                                <div className="w-full flex  h-[24px] text-base text-black mb-[40px]">
                                    <strong className="mx-[20px]">名稱:</strong>
                                    <span className="">{institutionData.hosp_name}</span>
                                </div>
                                <div className="w-full flex  h-[24px] text-base text-black mb-[40px]">
                                    <strong className="mx-[20px]">電話:</strong>
                                    <span className="">{institutionData.tel}</span>
                                </div>
                                <div className="w-full flex  h-[24px] text-base text-black mb-[40px]">
                                    <strong className="mx-[20px]">行政區:</strong>
                                    <span className="">{institutionData.area}</span>
                                </div>
                                <div className="w-full flex  h-[24px] text-base text-black mb-[40px]">
                                    <strong className="mx-[20px]">地址:</strong>
                                    <span className="">{institutionData.hosp_addr}</span>
                                </div>
                                <div className="w-full flex  h-[24px] text-base text-black mb-[40px]">
                                    <strong className="mx-[20px]">科別:</strong>
                                    <span className="">{institutionData.division}</span>
                                </div>
                                <div className="w-full flex  h-[24px] text-base text-black mb-[40px]">
                                    <strong className="mx-[20px]">癌症篩檢服務:</strong>
                                    <span className="">{institutionData.cancer_screening}</span>
                                </div>
                                <button className="m-auto w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-9  mt-5 hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]">
                                    加入收藏
                                </button>
                            </form>
                        </div>
                        {/*輪播薦*/}
                        <hr className="w-full border-solid border border-[#acb8b6] my-[30px]"/>
                        <div className="w-full">
                            <h3 className="text-black font-bold text-[24px] text-center my-[10px]">您可能也想比較...</h3>
                            <div className="w-full flex justify-between mt-[50px] relative px-[60px]">
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex justify-between w-full h-9">
                                    <button id="left-arrow" className="flex justify-center items-center w-9 h-full border-none p-0 bg-transparent transition duration-300 ease-in-out transform-gpu">
                                        <Image src="/images/left_arrow.png" alt="left-arrow-icon" width={46} height={46} />
                                    </button>
                                    <button id="right-arrow" className="flex justify-center items-center w-9 h-full border-none p-0 bg-transparent transition duration-300 ease-in-out transform-gpu">
                                        <Image src="/images/right_arrow.png" alt="right-arrow-icon" width={46} height={46} />
                                    </button>
                                </div>
                                <div className="h-[320px]  flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-lg">
                                    <div className="relative">
                                        <Image src="/images/placeholder.png" alt="institution" width={250} height={200} className="w-full object-cover object-center" />
                                        <Image src="/images/placeholder.png" alt="collection"  width={30} height={30} className="absolute top-1.5 right-1.5  z-[300]" />
                                    </div>   
                                    <div className="w-full h-[30px]  text-black text-left font-bold m-[10px]">名稱</div>
                                    <div className="w-full h-[30px]  flex  items-center justify-end">
                                        <Image src="/images/placeholder.png" alt="Lindln" width={15} height={15} />
                                        <div className="ml-2 text-black mr-[10px]">觀看數:取點擊累加器值</div>
                                    </div>
                                </div>
                                <div className="h-[320px]  flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-lg">
                                    <div className="relative">
                                        <Image src="/images/placeholder.png" alt="institution" width={250} height={200} className="w-full object-cover object-center" />
                                        <Image src="/images/placeholder.png" alt="collection"  width={30} height={30} className="absolute top-1.5 right-1.5  z-[300]" />
                                    </div>   
                                    <div className="w-full h-[30px]  text-black text-left font-bold m-[10px]">名稱</div>
                                    <div className="w-full h-[30px]  flex  items-center justify-end">
                                        <Image src="/images/placeholder.png" alt="Lindln" width={15} height={15} />
                                        <div className="ml-2 text-black mr-[10px]">觀看數:6</div>
                                    </div>
                                </div>
                                <div className="h-[320px]  flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-lg">
                                    <div className="relative">
                                        <Image src="/images/placeholder.png" alt="institution" width={250} height={200} className="w-full object-cover object-center" />
                                        <Image src="/images/placeholder.png" alt="collection"  width={30} height={30} className="absolute top-1.5 right-1.5  z-[300]" />
                                    </div>   
                                    <div className="w-full h-[30px]  text-black text-left font-bold m-[10px]">名稱</div>
                                    <div className="w-full h-[30px]  flex  items-center justify-end">
                                        <Image src="/images/placeholder.png" alt="Lindln" width={15} height={15} />
                                        <div className="ml-2 text-black mr-[10px]">觀看數:6</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex justify-center h-[20px] mt-[20px]">
                                動生
                            </div>
                        </div>
                        {/*(?)紀錄*/}

                        {/*返鈕*/}
                        <button className="mx-auto my-16  w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-9  hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]">
                            返回搜尋頁面
                        </button>
                    </div>
                </main>
            </>
        )}
        </>
    )
}

export default Institution;

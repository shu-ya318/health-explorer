'use client';
import {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import organizeInstitutionData  from "../api/fetchOpenData";
import {db} from '../lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where , QueryDocumentSnapshot} from 'firebase/firestore';
import {FirebaseInstitutionData} from "../lib/types.js";
import Pagination from '../components/Pagination';

const SearchPage: React.FC = (): React.ReactElement | null  => {
    // const router = useRouter();

    /*單機構
    interface MedicalInstitution {
        id: string;
        image: string[];
        name: string;
        view: number;
    }*/
          
    
    const cancers = ['子宮頸癌', '乳癌', '大腸癌', '口腔癌', '肺癌'];

    const [institutionsData, setInstitutionsData] = useState<FirebaseInstitutionData[]>([]);
    const [selectedCancer, setSelectedCancer] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 12;
    

    useEffect(() => {
        const loadData = async () => {
          
            await organizeInstitutionData();    //先初始化插入資料，之後取值

            try {
            const querySnapshot = await getDocs(collection(db, "medicalInstitutions"));
            const data = querySnapshot.docs.map(doc => {
                const docData = doc.data();
                return {
                hosp_name: docData.hosp_name || '',
                tel: docData.tel || '',
                area: docData.area || '',
                hosp_addr: docData.hosp_addr || '',
                division: docData.division || ''
                } as FirebaseInstitutionData;
            });
            setInstitutionsData(data);
            console.log("Loaded data:", data);
            } catch (error) {
            console.error("Failed to fetch data:", error);
            }
        };
        loadData();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = institutionsData.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (       
        <>
            <main className="w-full h-auto flex flex-col justify-center items-center w-full flex-grow bg-[#ffffff]" >
                <div className="max-w-screen-xl"> 
                    {/*搜*/}
                    <div className="w-full h-10 my-20"> 
                        <div className="flex flex-row max-w-screen-md h-full mx-auto"> 
                            <input
                                id="search-input"
                                className="flex-grow h-full px-4 text-lg font-bold text-gray-500 border-solid border-2 border-[#6898a5] shadow-[0_0_3px_#AABBCC] rounded-l-md"
                                type="text"
                                placeholder="輸入關鍵字搜尋"
                            />
                            <button id="search-button" className="flex w-32 h-full bg-[#24657d] hover:bg-[#7199a1] hover:text-black items-center  justify-center font-bold">
                                <Image className="w-auto h-auto" src="/images/search.png" alt="Search" width={40} height={40}/>
                                搜尋
                            </button>
                            <button id="search-advanced" className="flex  w-32 h-full bg-[#e6e6e6] text-[#6898a5] rounded-r-md border-solid border border-[#6898a5] hover:bg-[#acb8b6] hover:text-white items-center   justify-center font-bold">
                                <Image className="w-auto h-auto" src="/images/search.png" alt="Search" width={25} height={40}/>
                                進階搜尋
                            </button>
                        </div>
                    </div>
                    {/*渲資*/}
                    <div className="h-auto w-full flex flex-col items-start pl-[15px]">
                        <hr className="w-full border-solid border border-[#acb8b6] my-[30px]"/>
                        {/*選標籤*/}
                        <div className="mx-w-screen-md h-9 flex justify-center mb-[20px] ml-[15px]">
                            <div className="w-[150px] bg-2 bg-[#e6e6e6]  rounded-l-md text-black text-center py-1">排序:</div>
                            <button className="w-36 bg-[#ffffff]  border border-[#e6e6e6] hover:bg-[#acb8b6]  hover:text-[#ffffff] text-[#707070] text-center py-1">熱門度</button>
                            <div className="relative w-36">

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="bg-[#ffffff] border border-[#e6e6e6] hover:bg-[#acb8b6] hover:text-[#ffffff] text-[#707070] text-center py-1 w-full h-full"
                            >
                                依癌篩提供
                            </button>
                            {isOpen && (
                                <ul className="absolute z-10 bg-[#ffffff] border border-[#e6e6e6] w-full">
                                    <li className="hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]">子宮頸癌</li>
                                    <li className="hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]">乳癌</li>
                                    <li className="hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]">大腸癌</li>
                                    <li className="hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]">口腔癌</li>
                                    <li className="hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]">肺癌</li>
                                </ul>
                            )}
                            </div>
                        </div>
                        {/*卡片盒*/}
                         <div id="institutions-grid" className="h-auto m-auto grid grid-cols-4 gap-6 p-4 justify-center items-start box-border">
                            {currentPosts.map((institution, index) => (
                               <div key={index} className="h-[320px]  flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-lg">
                                <div className="relative">
                                    <Image src="/images/placeholder.png" alt="institution" width={250} height={200} className="w-full object-cover object-center" />
                                    <Image src="/images/placeholder.png" alt="collection"  width={30} height={30} className="absolute top-1.5 right-1.5  z-[300]" />
                                </div>   
                                <div className="w-full h-[30px]  text-black text-left font-bold m-[10px]">{institution.hosp_name}</div>
                                <div className="w-full h-[30px]  flex  items-center justify-end">
                                    <Image src="/images/placeholder.png" alt="Lindln" width={15} height={15} />
                                    <span className="ml-2 text-black mr-[10px]">觀看數:6</span>
                               </div>
                           </div>
                            ))}
                        </div>
                        <Pagination
                            postsPerPage={postsPerPage}
                            totalPosts={institutionsData.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </main>
        </>
    )
};

export default SearchPage;
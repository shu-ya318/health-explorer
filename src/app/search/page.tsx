'use client';
import {useState, useEffect, useRef, ChangeEvent} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';   
import organizeInstitutionData  from "../api/fetchOpenData";
import {db} from '../lib/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where , QueryDocumentSnapshot} from 'firebase/firestore';
import {FirebaseInstitutionData} from "../lib/types.js";
import Pagination from '../components/Pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
    

const SearchPage: React.FC = (): React.ReactElement | null  => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 
    const cancers = ['子宮頸癌', '乳癌', '大腸癌', '口腔癌', '肺癌'];
    
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [selectedCancer, setSelectedCancer] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const [loading,setLoading] = useState(true);

    const [institutionsData, setInstitutionsData] = useState<FirebaseInstitutionData[]>([]);
    const [searchResults, setSearchResults] = useState<FirebaseInstitutionData[]>([]);
    const [currentData, setCurrentData] = useState<FirebaseInstitutionData[]>([]);    //避用條件渲染，綁定多狀態判斷操作

    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 12;
    

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            await organizeInstitutionData();    //先初始化插入資料，之後取值

            try {
            const querySnapshot = await getDocs(collection(db, 'medicalInstitutions'));
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
            setCurrentData(data); 
            } catch (error) {
            console.error("Failed to fetch data:", error);
            }
            setLoading(false);
        };
        loadData();
    }, []);


    const handleSearch = async (): Promise<void> => {
        const searchTerm = searchInputRef.current?.value.trim();
        if (searchTerm) {
            const filteredData = institutionsData.filter( (institution) =>{
                return institution.hosp_name.includes(searchTerm)           //要傳入institution，且return
            });
            setSearchResults(filteredData);
            setCurrentData(filteredData);
            //在內部馬上console.log(searchResults); 仍顯示初始值  (改外部會取得正確值)
        } else {
            setSearchResults(institutionsData);
            setCurrentData(institutionsData);
        }
        setCurrentPage(1);
    };


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = currentData.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (       
        <>
            <main className="w-full h-auto flex flex-col justify-center items-center w-full flex-grow bg-[#ffffff]" >
                <div className="max-w-screen-xl"> 
                    {/*搜*/}
                    <div className="w-full h-10 my-20"> 
                        <div className="flex flex-row max-w-screen-md h-full mx-auto"> 
                            <input
                                className="flex-grow h-full px-4 text-lg font-bold text-gray-500 border-solid border-2 border-[#6898a5] shadow-[0_0_3px_#AABBCC] rounded-l-md"
                                type="text"
                                placeholder="輸入關鍵字搜尋"
                                ref={searchInputRef}
                            />
                            <button 
                                className="flex w-32 h-full bg-[#24657d] hover:bg-[#7199a1] hover:text-black items-center  justify-center font-bold"
                                onClick={handleSearch}
                            >
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
                        {/*卡片盒+分頁按鈕*/}
                        <div id="institutions-grid" className="h-auto m-auto grid grid-cols-4 gap-6 p-4 justify-center items-start box-border">
                            {loading ? (
                                Array.from({ length: postsPerPage }, (_, index) => (
                                    <Skeleton key={index} height={320} width={250} className="m-[10px]" />
                                ))
                            ) : (
                                currentPosts.map((institution, index) => (
                                    <Link key={index} href={`/Search/${encodeURIComponent(institution.hosp_name)}`}>
                                        <div className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-lg">
                                            <div className="relative">
                                                <Image 
                                                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(institution.hosp_addr)}&zoom=15&size=250x200&key=${apiKey}`} 
                                                    alt="institution" 
                                                    width={250} 
                                                    height={200} 
                                                    className="w-full object-cover object-center" 
                                                    unoptimized={true}
                                                />
                                                <Image className="absolute top-1.5 right-1.5 z-[300]" src="/images/placeholder.png" alt="collection" width={30} height={30} />
                                            </div>
                                            <div className="w-full h-[30px] text-black text-left font-bold m-[10px]">{institution.hosp_name}</div>
                                            <div className="w-full h-[30px] flex items-center justify-end">
                                                <Image src="/images/placeholder.png" alt="Lindln" width={15} height={15} />
                                                <span className="ml-2 text-black mr-[10px]">觀看數:6</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                        {loading ? (
                            <Skeleton height={40} width={528} className="my-[40px]" />
                        ) : (
                            <Pagination
                                postsPerPage={postsPerPage}
                                totalPosts={currentData.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        )}
                    </div>
                </div>
            </main>
        </>
    )
};

export default SearchPage;

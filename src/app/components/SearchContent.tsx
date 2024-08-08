import { FirebaseInstitutionData} from '../lib/types.js';
import {useInstitutions }  from "../contexts/InstitutionsContext";
import {useState, useEffect , useRef, ChangeEvent} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';   
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '../components/Pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const SearchContent: React.FC = (): React.ReactElement | null  => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; 
    const cancers = [
        { filter: '子宮頸癌', image:"/images/cervicalCancer.png"},
        { filter: '乳癌', image: "/images/breastCancer.png" },
        { filter: '大腸癌', image:"/images/colorectalCancer.png"},
        { filter: '口腔癌', image:"/images/oralCancer.png"},
        { filter: '肺癌', image:"/images/lungCancer.png"}
    ];
    const institutions = [
        '衛生所', '診所', '醫院'
    ];
    const divisions = [
        '婦產科', '牙醫一般科', '耳鼻喉科',
        '皮膚科', '眼科', '骨科',
        '精神', '心理諮商及心理治療', '家庭醫學科',
        '泌尿科', '內科', '外科'
    ];
    const districts = [
        '板橋區', '三重區', '中和區', '永和區', '新莊區',
        '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區',
        '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區',
        '泰山區', '林口區', '深坑區', '石碇區', '坪林區',
        '三芝區', '石門區', '八里區', '平溪區', '雙溪區',
        '貢寮區', '金山區', '萬里區', '烏來區'
    ];
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');

    const searchInputRef = useRef<HTMLInputElement>(null);

    const [isOpenInstitutions, setIsOpenInstitutions] = useState(false);
    const [isOpenDivisions, setIsOpenDivisions] = useState(false);
    const [isOpenDistricts, setIsOpenDistricts] = useState(false);

    const {institutionData, loading, views, incrementView} = useInstitutions();
    const [searchResults, setSearchResults] = useState<FirebaseInstitutionData[]>([]);
    const [currentData, setCurrentData] = useState<FirebaseInstitutionData[]>([]);    //此元件專渲染用  //避用條件渲染，綁定多狀態判斷操作

    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 12;
    

    useEffect(() => {
        setCurrentData(institutionData); 
    }, [institutionData]);

    useEffect(() => {
        let filteredData = institutionData;
        if (filter) {
            filteredData = institutionData.filter(institution =>
                institution.hosp_name.includes(filter) ||
                institution.division?.includes(filter) ||
                institution.area?.includes(filter) ||
                institution.cancer_screening?.includes(filter)
            );
        }
        setCurrentData(filteredData);
    }, [filter, institutionData]);


    const handleSearch = async (): Promise<void> => {
        const searchTerm = searchInputRef.current?.value.trim();
        if (searchTerm) {
            const filteredData = institutionData.filter( (institution) =>{
                return institution.hosp_name.includes(searchTerm)           //要傳入institution，且return
            });
            setSearchResults(filteredData);
            setCurrentData(filteredData);
            //內部馬上console.log(searchResults); 仍顯示初始值  (改外部會取得正確值)
        } else {
            setSearchResults(institutionData);
            setCurrentData(institutionData);
        }
        setCurrentPage(1);
    };
    const deleteSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
    }
    

    const handleCancerFilter = (cancerType: string) => {
        const filteredInstitutions = institutionData.filter(institution =>
            institution.cancer_screening?.includes(cancerType)
        );
        setCurrentData(filteredInstitutions);
        setCurrentPage(1);
    };


    const handleInstitutionsClick = (): void => {
        setIsOpenInstitutions(!isOpenInstitutions);
        setIsOpenDivisions(false);
        setIsOpenDistricts(false);
    };
    const handleDivisionsClick = (): void => {
        setIsOpenInstitutions(false);
        setIsOpenDivisions(!isOpenDivisions);
        setIsOpenDistricts(false);
    };
    const handleDistrictsClick = (): void => {
        setIsOpenInstitutions(false);
        setIsOpenDivisions(false);
        setIsOpenDistricts(!isOpenDistricts);
    };
    const handleInstitutionSelect = (institutionName: string): void => {
        const filteredInstitutions = institutionData.filter(institution => institution.hosp_name.includes(institutionName));
        setCurrentData(filteredInstitutions);
        setCurrentPage(1);
        setIsOpenInstitutions(false);
    };


    const handleIncrement = (hosp_name: string, url: string) => {
        incrementView(hosp_name);
        router.push(url); 
    };


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = currentData.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);



    return (
        <main className="w-full h-auto flex flex-col justify-center items-center flex-grow bg-[#ffffff]" >
                <div className="w-[1280px]">
                    {/*搜  flex-row */}
                    <div className="w-full h-10 mt-[60px]  mb-[30px]"> 
                        <div className="flex max-w-screen-md h-full mx-auto"> 
                            <div className="flex relative w-full h-full ">
                                <input
                                    className="flex-grow h-full px-4 text-lg font-bold text-gray-500 border-solid border-2 border-[#6898a5] shadow-[0_0_3px_#AABBCC] rounded-l-md"
                                    type="text"
                                    placeholder="輸入關鍵字搜尋"
                                    ref={searchInputRef}
                                />
                                <button className="hover:scale-110 absolute top-2 right-10 z-10" onClick={deleteSearch}>
                                    <Image className="" src="/images/xmark-solid.svg" alt="close" width={15} height={15} />
                                </button>                               
                            </div>
                            <button 
                                className="flex w-32 h-full bg-[#24657d] hover:bg-[#7199a1] hover:text-black rounded-r-md items-center  justify-center font-bold"
                                onClick={handleSearch}
                            >
                                <Image className="w-auto h-auto" src="/images/search.png" alt="Search" width={40} height={40}/>
                                搜尋
                            </button>
                        </div>
                    </div>
                    {/*癌篩分類*/}
                    <div className="max-w-screen-md h-[220px] flex  flex-col justify-between items-center mb-[60px] mx-auto px-[20px] rounded-lg border-solid border-2 border-[#6898a5] shadow-[0_0_5px_#AABBCC] "> 
                        <div className="text-[#003E3E] text-center font-bold text-2xl mt-[5px]">依癌篩資格搜尋</div>
                        <div  className="flex w-full justify-between mb-[20px]">
                            {cancers.map((cancer, index) => (
                                <button 
                                    key={index} 
                                    className="w-2/12 flex flex-col justify-between text-[#0e4b66] transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-400"
                                    onClick={() => handleCancerFilter(cancer.filter)}
                                >
                                    <div className="w-full h-[100px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${cancer.image})` }}></div>
                                    <hr className="w-9/12 mx-auto border-solid border-2 border-[#acb8b6]"/>
                                    <div className="w-full text-center text-lg text-[#013f5b] font-bold mb-[15px]">{cancer.filter}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/*渲資*/}
                    <div className="h-auto w-full flex flex-col items-start">
                        <p className="text-black ">共有<strong>{currentData.length}</strong>個搜尋結果</p>
                        <hr className="w-full border-solid border border-[#acb8b6] my-[10px]"/>
                        {/*選標籤*/}
                        <div className="mx-w-screen-md h-9 flex justify-center mb-[20px]">
                            <div className="w-[150px] bg-2 bg-[#e6e6e6]  rounded-l-md text-black text-center py-1">排序:</div>
                            <button className="font-bold w-36 bg-[#ffffff]  border border-[#e6e6e6] hover:bg-[#acb8b6]  hover:text-[#ffffff] text-[#707070] text-center py-1">
                                熱門度
                            </button>
                            <div className="relative w-36">
                                <button
                                    onClick={handleInstitutionsClick}
                                    className="flex justify-around items-center  font-bold bg-[#ffffff] border border-[#e6e6e6] hover:bg-[#acb8b6] hover:text-[#ffffff] text-[#707070] text-center py-1 w-full h-full"
                                >
                                    依機構
                                    <Image src="/images/down_small_line.svg" alt="institution" width={25} height={25} />
                                </button>
                                {isOpenInstitutions && (
                                    <ul className="flex flex-col  absolute z-20 bg-[#ffffff] border border-[#e6e6e6] w-[145px]">
                                        {institutions.map((institution) => (
                                            <li key={institution} 
                                                className="z-20 hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]"
                                                onClick={() => handleInstitutionSelect(institution)} 
                                            >
                                                {institution}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-36">
                                <button
                                    onClick={handleDivisionsClick}
                                    className="flex justify-around items-center  font-bold bg-[#ffffff] border border-[#e6e6e6] hover:bg-[#acb8b6] hover:text-[#ffffff] text-[#707070] text-center py-1 w-full h-full"
                                >
                                    依科別
                                    <Image src="/images/down_small_line.svg" alt="division" width={25} height={25} />
                                </button>
                                {isOpenDivisions && (
                                    <ul className="grid grid-cols-3 absolute z-20 bg-[#ffffff] border border-[#e6e6e6] w-[500px]">
                                        {divisions.map((division) => (
                                            <li key={division} className="z-20 hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]">
                                                {division}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-36">
                                <button
                                    onClick={handleDistrictsClick}
                                    className="flex justify-around items-center  font-bold bg-[#ffffff] border border-[#e6e6e6] rounded-r-md hover:bg-[#acb8b6] hover:text-[#ffffff] text-[#707070] text-center py-1 w-full h-full"
                                >
                                    依行政區
                                    <Image src="/images/down_small_line.svg" alt="district" width={25} height={25} />
                                </button>
                                {isOpenDistricts && (
                                    <ul className="grid grid-cols-3 absolute z-20 bg-[#ffffff] border border-[#e6e6e6] w-[500px]">
                                        {districts.map((district) => (
                                            <li key={district} className="z-20 hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]">
                                                {district}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {/*卡片盒+分頁按鈕*/}
                        <div id="institutions-grid" className="w-full h-auto m-auto grid grid-cols-4 gap-20 justify-center items-start box-border mt-[20px]">
                            {loading ? (
                                Array.from({ length: postsPerPage }, (_, index) => (
                                    <Skeleton key={index} height={320} width={250} className="m-[10px]" />
                                ))
                            ) : (
                                currentPosts.map((institution) => (     
                                    <Link 
                                        key={institution.hosp_name} 
                                        href={`/Search/${encodeURIComponent(institution.hosp_name)}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleIncrement(institution.hosp_name, `/Search/${encodeURIComponent(institution.hosp_name)}`);
                                        }}
                                    >
                                        <div className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                                            <div className="relative">     {/* 圖片連結 `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(institution.hosp_addr)}&zoom=15&size=250x200&key=${apiKey}`   */}
                                                <Image 
                                                    src={`http://www.google.com/intl/zh-TW/privacy}`} 
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
                                            <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[10px] pr-[15px]">{institution.hosp_name}</div>
                                            <div className="w-full h-[30px] flex items-center justify-end">
                                                <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                <span className="ml-2 text-black mr-[10px] mt-[5px]">觀看數:{views[institution.hosp_name]}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                        {loading ? (
                            <Skeleton height={50} width={1280} className="my-[40px] mx-[20px]" />
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
    );
};

export default SearchContent;
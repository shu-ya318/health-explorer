import { FirebaseInstitutionData} from '../lib/types.js';
import Pagination from '../components/Pagination';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SearchContentProps {
    searchInputRef: React.RefObject<HTMLInputElement>;
    deleteSearch: () => void; 
    handleSearch: () => Promise<void>;
    cancers: { filter: string; image: string }[];
    handleCancerFilter: (cancerType: string) => void;

    handleInstitutionsClick: () => void; // 新增
    handleDivisionsClick: () => void; // 新增
    handleDistrictsClick: () => void; // 新增
    handleInstitutionSelect: (institutionName: string) => void; // 新增
    isOpenInstitutions: boolean; // 新增
    isOpenDivisions: boolean; // 新增
    isOpenDistricts: boolean; // 新增
    institutions: string[]; // 新增
    divisions: string[]; // 新增
    districts: string[]; // 新增
    
    institutionData: FirebaseInstitutionData[];
    loading: boolean;
    views: Record<string, number>;
    incrementView: (hosp_name: string, url: string) => void; 

    currentPosts: FirebaseInstitutionData[];
    handleIncrement: (hosp_name: string, url: string) => void;
    currentData: FirebaseInstitutionData[];
    paginate: (pageNumber: number) => void;
    currentPage: number;
    postsPerPage: number;
    totalPosts: number;

    logMessage: string;
}

const SearchContent: React.FC<SearchContentProps> = ({
    searchInputRef,
    deleteSearch,
    handleSearch,
    cancers,
    handleCancerFilter,

    handleInstitutionsClick,
    handleDivisionsClick,
    handleDistrictsClick,
    handleInstitutionSelect,
    isOpenInstitutions,
    isOpenDivisions,
    isOpenDistricts,
    institutions,
    divisions,
    districts,

    institutionData,
    loading,
    views,
    incrementView,
    
    handleIncrement,
    currentPosts, 
    currentData,
    paginate,
    currentPage,
    postsPerPage,
    totalPosts,

    logMessage
}) => {
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
                    <p className="text-black">Log Message: {logMessage}</p>
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

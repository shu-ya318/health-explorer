//import {useInstitutions }  from "../contexts/InstitutionsContext";
import {useState, useEffect, ChangeEvent, FormEvent, useRef} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';   
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../lib/firebaseConfig';
import { collection,doc , query, where, orderBy, startAfter, limit, getDocs, addDoc, deleteDoc, DocumentSnapshot, updateDoc, increment, getDoc } from 'firebase/firestore';
import { useFavorite} from '../hooks/useFavorite'; 
import { FirebaseFavoriteData, InstitutionInfo} from '../lib/types';
import algoliasearch,{ SearchIndex }  from 'algoliasearch';
import Pagination from '../components/Pagination';
import { useAuth } from '../hooks/useAuth'; 
import SignInModal from './auth/SignInModal';
import RegisterModal from './auth/RegisterModal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string, 
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);
const index = searchClient.initIndex('Medical_Institutions');

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


const SearchContent: React.FC = (): React.ReactElement | null  => {
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
    const [favoriteHover, setFavoriteHover] = useState<Record<string, boolean>>({});
    const { user } = useAuth();
    const { state, addFavorite, removeFavorite} = useFavorite();

    const router = useRouter();
    const searchParams = useSearchParams();
    const filterValue = decodeURIComponent(searchParams.get('filter') || '');


    const searchInputRef = useRef<HTMLInputElement>(null);
    const [sortByViews, setSortByViews] = useState<boolean>(false);
    const [isOpenInstitutions, setIsOpenInstitutions] = useState(false);
    const [isOpenDivisions, setIsOpenDivisions] = useState(false);
    const [isOpenDistricts, setIsOpenDistricts] = useState(false);

    const [loading,setLoading] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<InstitutionInfo[]>([]); 

    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 20;

    
    useEffect(() => {
        const fetchAndSetData = async () => {
            setLoading(true);
            if (filterValue) {
                let searchOptions = {};

                if (['子宮頸癌', '乳癌', '大腸癌', '口腔癌', '肺癌'].includes(filterValue)) {
                        facetFilters: [[`cancer_screening:${filterValue}`]]
                } else {
                    switch (filterValue) {
                        case '蘆洲區':
                            searchOptions = { filters: `area:"${filterValue}"` };
                            break;
                        case '家庭醫學科':
                            facetFilters: [[`division:${filterValue}`]]
                            break;
                        case '醫院':
                            searchOptions = { query: filterValue };
                            break;
                        default:
                            setLoading(false);
                            return;
                    }
                }

                index.search<InstitutionInfo>(filterValue, searchOptions)
                .then(({ hits }) => {
                    setCurrentData(hits);
                    setLoading(false);
                }).catch(error => {
                    console.error("Search failed: ", error);
                    setLoading(false);
                });
            } else {
                let hits: InstitutionInfo[] = [];
                await index.browseObjects<InstitutionInfo>({
                    batch: (batch:any) => {
                        hits = hits.concat(batch as InstitutionInfo[]);
                    }
                });

                if (hits.length > 0) {
                    setCurrentData(hits);
                } else {
                    console.error('No data found');
                }
                setLoading(false);
            }
        };

        fetchAndSetData().catch(error => {
            console.error('Failed to fetch data:', error);
            setLoading(false);
        });
    }, [filterValue]);

    
    const handleSearch = async (): Promise<void> => {
        const searchTerm = searchInputRef.current?.value.trim();
        setLoading(true);

        index.search<InstitutionInfo>(searchTerm || '')
            .then(({ hits }) => {
                setCurrentData(hits as InstitutionInfo[]);
            }).catch(error => {
                console.error('Search failed:', error);
            });
            setLoading(false);
    };
    const deleteSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
    }


    const handleCancerFilter = async (cancerType: string) => {
        setLoading(true);

        const searchOptions = { query: cancerType };
        index.search<InstitutionInfo>(cancerType, searchOptions)
            .then(({ hits }) => {
                setCurrentData(hits);
                console.log('Search Results on Cancer Type Updated:', hits);
            }).catch(error => {
                console.error('Search failed:', error);
            });
        setLoading(false);
    };


    const toggleDropdowns = (type: 'institutions' | 'divisions' | 'districts'): void => {
        setIsOpenInstitutions(type === 'institutions' ? !isOpenInstitutions : false);
        setIsOpenDivisions(type === 'divisions' ? !isOpenDivisions : false);
        setIsOpenDistricts(type === 'districts' ? !isOpenDistricts : false);
    };
    const handleSelectFilter = (filterType: 'institution' | 'division' | 'district', value: string): void => {
        setLoading(true);
        
        const searchOptions = {facetFilters: [[`cancer_screening:${filterValue}`]]};
        console.error(searchOptions);

        index.search<InstitutionInfo>(value, searchOptions)
        .then(({ hits }) => {
            setCurrentData(hits);
            setLoading(false);
        }).catch(error => {
            console.error("Search failed: ", error);
            setLoading(false);
        });

        setCurrentPage(1);
        setIsOpenInstitutions(false);
        setIsOpenDivisions(false);
        setIsOpenDistricts(false);
    };


    const setFavoriteHoverState = (objectID: string, state: boolean) => {
        setFavoriteHover(prev => ({
            ...prev,
            [objectID]: state
        }));
        console.log(favoriteHover);
    };
    

    const handleAddClick = async (institution: InstitutionInfo, userId:string) => {
        if (!user) return;

        const newRecord: FirebaseFavoriteData = {
            userId: user.uid,
            hosp_name: institution.hosp_name,
            hosp_addr: institution.hosp_addr,
            tel:institution.tel,
            //division: institution.division, 
            //cancer_screening: institution.cancer_screening,
            timestamp: new Date() ,
            imageUrl: institution.imageUrl
        };
        await addFavorite(newRecord);
    };
    const handleRemoveClick = async (objectID:string, userId:string) => {
        if (!user) return;

        const q = query(collection(db, 'favorites'), where("hosp_name", "==", objectID), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
            const batch = querySnapshot.docs.map(async (document) => {
                await deleteDoc(doc(db, 'favorites', document.id));
                return document.id; 
            });
            const deletedDocIds = await Promise.all(batch);
    
            deletedDocIds.forEach(docId => {
                removeFavorite(docId);
            });
        } else {
            console.error("firestore無此筆收藏紀錄文件或狀態找不到對應id的元素");
        }
    };
    

const handleIncrement = async (institution: InstitutionInfo) => {
    const docRef = doc(db, 'medicalInstitutions', institution.hosp_name);
    router.push(`/search/${encodeURIComponent(institution.hosp_name)}`);

    try {
        await updateDoc(docRef, {
            view: increment(1)
        });
       
    } catch (error) {
        console.error('Failed to increment views:', error);
    }
 };
    
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = currentData.slice(indexOfFirstPost, indexOfLastPost);


    return (
        <main className="w-full h-auto flex flex-col justify-center items-center flex-grow bg-[#FCFCFC]" >
                <div className="flex w-full h-auto relative">
                    <div className="flex  w-full h-[400px]">
                        <Image  src="/images/searchPage_banner.jpg" alt="icon" width={1720} height={400} className="w-full h-full object-cover"/>
                    </div>
                    {/*癌篩分類*/}
                    <div style={{ bottom: '-165px' }} className="absolute inset-x-0 max-w-screen-md h-[200px] flex  flex-col justify-between items-center mb-[60px] mx-auto px-[20px] rounded-lg border-solid border border-[#2D759E] shadow-[0_0_5px_#AABBCC] bg-[#FCFCFC]"> 
                        <div className="text-[#2D759E] text-center font-bold text-[24px] mt-[10px]">依癌篩資格搜尋</div>
                        <div  className="flex w-full justify-between mb-[25px]">
                            {cancers.map((cancer, index) => (
                                <button 
                                    key={index} 
                                    className="w-2/12 flex flex-col justify-between transition-transform duration-300 hover:scale-110 hover:rounded-lg  hover:shadow-lg hover:shadow-gray-400 hover:bg-gradient-to-b  from-[#FFFFFF] via-[#C3D8EA] to-[#77ACCC]"
                                    onClick={() => handleCancerFilter(cancer.filter)}
                                >
                                    <div className="w-full h-[100px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${cancer.image})` }}></div>
                                    <div className="w-full text-center text-[20px] text-[#252525] font-bold mb-[10px]">{cancer.filter}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-[1200px] pt-[80px]">
                    {/*搜*/}
                    <div className="w-full h-10 mt-[60px]  mb-[30px]"> 
                        <div className="flex max-w-screen-md h-full mx-auto"> 
                            <div className="flex relative w-full h-full ">
                                <input
                                    className="flex-grow h-full px-4 text-[18px] font-bold text-gray-500 border-solid border border-[#2D759E] shadow-[0_0_3px_#AABBCC] rounded-l-md"
                                    type="text"
                                    placeholder="請輸入關鍵字搜尋"
                                    ref={searchInputRef}
                                />
                                <button className="hover:scale-110 absolute top-2 right-10 z-10" onClick={deleteSearch}>
                                    <Image src="/images/xmark-solid.svg" alt="close" width={15} height={15} className="w-auto"/>
                                </button>                               
                            </div>
                            <button 
                                className="w-32 h-full bg-[#2D759E] hover:bg-[#5B98BC] text-white rounded-r-md flex items-center justify-center font-bold"
                                onClick={handleSearch}
                            >
                                <Image className="w-auto h-auto mr-[7px]" src="/images/search.png" alt="Search" width={30} height={30}/>
                                搜尋
                            </button>
                        </div>
                    </div>
                    {/*渲資*/}
                    <div className="h-auto w-full flex flex-col items-start">
                        <p className="text-[#595959] text-left">共查詢到<strong className="mx-[6px]">{currentData.length}</strong>個新北市醫療機構</p>
                        <hr className="w-full border-solid border border-[#E0E0E0] my-[20px]"/>
                        {/*選標籤*/}
                        <div className="mx-w-screen-md h-9 flex justify-center mb-[20px]">
                            <div className="w-[150px] bg-2 bg-[#E0E0E0]  rounded-l-md text-black text-center text-[16px] py-1">排序:</div>
                            <div className="relative w-36">
                                <button
                                    className={`text-center pl-[5px] w-full h-full flex justify-around items-center text-[16px]  border border-[#E0E0E0] ${isOpenInstitutions ? 'bg-[#2D759E] text-[#ffffff]' : 'bg-[#FCFCFC] hover:bg-[#2D759E] hover:text-[#ffffff] text-[#707070]'}`}
                                    onClick={() => toggleDropdowns('institutions')}
                                >
                                    依機構
                                    <Image src="/images/down_small_line.svg" alt="institution" width={18} height={18} />
                                </button>
                                {isOpenInstitutions && (
                                    <ul className="grid grid-cols-3 gap-2  absolute z-20 bg-[#ffffff] border-2 border-[#2D759E] rounded-md w-[500px] py-[15px] px-[10px] shadow-[0_0_5px_#AABBCC]">
                                        {institutions.map((institution) => (
                                            <li key={institution} 
                                                className="z-20 hover:bg-[#2D759E] hover:text-[#ffffff] text-center text-[#707070] py-2 border-solid border border-[#e6e6e6] rounded-md  cursor-pointer"
                                                onClick={() => handleSelectFilter('institution', institution)} 
                                            >
                                                {institution}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-36">
                                <button
                                    className={`flex justify-around items-center text-[16px] border border-[#E0E0E0] ${isOpenDivisions ? 'bg-[#2D759E] text-[#ffffff]' : 'bg-[#FCFCFC] hover:bg-[#2D759E] hover:text-[#ffffff] text-[#707070]'} text-center py-1 w-full h-full`}
                                    onClick={() => toggleDropdowns('divisions')}
                                >
                                    依科別
                                    <Image src="/images/down_small_line.svg" alt="division" width={18} height={18} />
                                </button>
                                {isOpenDivisions && (
                                    <ul className="grid grid-cols-3 gap-2  absolute z-20 bg-[#ffffff] border-2 border-[#2D759E] rounded-md w-[500px] p-[10px] shadow-[0_0_5px_#AABBCC]">
                                        {divisions.map((division) => (
                                            <li 
                                                key={division} 
                                                className="z-20 hover:bg-[#2D759E] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]  rounded-md  cursor-pointer " 
                                                onClick={() => handleSelectFilter('division', division)}
                                            >
                                                {division}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-36">
                                <button
                                    className={`rounded-r-md flex justify-around items-center text-[16px] border border-[#E0E0E0] ${isOpenDistricts ? 'bg-[#2D759E] text-[#ffffff]' : 'bg-[#FCFCFC] hover:bg-[#2D759E] hover:text-[#ffffff] text-[#707070]'} text-center py-1 w-full h-full`} 
                                    onClick={() => toggleDropdowns('districts')}
                                >
                                    依地區
                                    <Image src="/images/down_small_line.svg" alt="district" width={18} height={18} />
                                </button>
                                {isOpenDistricts && (
                                    <ul className="grid grid-cols-3 gap-2  absolute z-20 bg-[#ffffff] border-2 border-[#2D759E] rounded-md w-[500px] p-[10px] shadow-[0_0_5px_#AABBCC]">
                                        {districts.map((district) => (
                                            <li 
                                                key={district} 
                                                className="z-20 hover:bg-[#2D759E] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]  rounded-md  cursor-pointer " 
                                                onClick={() => handleSelectFilter('district', district)}
                                                >
                                                {district}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {/*卡片盒 */} 
                        <div className="w-full h-auto m-auto grid grid-cols-2 justify-center items-start box-border my-[10px] gap-[2%]">
                        {loading ? (
                            Array.from({ length: postsPerPage-14 }, (_, index) => (
                                <Skeleton key={index} height={170} width={600} className="m-[5px]" />
                            ))
                        ) : (
                            currentPosts.map((institution) => (
                                    <div  
                                        key={institution.hosp_name} 
                                        className="relative border border-gray-300 overflow-hidden bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC] h-auto fill-two-columns rounded-sm mb-[15px]"
                                    >
                                         <button onClick={() => handleIncrement(institution)} className="h-full w-full flex">
                                            {institution.imageUrl && (
                                                <Image
                                                    src={institution.imageUrl}
                                                    alt="institution"
                                                    width={170}
                                                    height={170}
                                                    className="object-cover"
                                                    unoptimized={true}
                                                />
                                            )}
                                            <div className="flex flex-col justify-between py-[10px] pl-[12px] ">
                                                <div className="w-full  text-left text-[#3E3A39] font-bold  pr-[15px] text-[16px]">{institution.hosp_name}</div>
                                                <div className=" text-left text-[14px] text-[#595959]">{institution.division}</div>
                                                <div className=" text-left text-[14px] text-[#595959]">{institution.cancer_screening}</div>
                                                <div className="w-full h-[30px] flex items-center">
                                                    <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                    <span className="ml-2  text-[14px] text-[#707070] mt-[3px]">觀看數:{institution.view}</span>
                                                </div>
                                            </div>
                                        </button>
                                        {!user ? (
                                            <>
                                                <button 
                                                    type="button"  
                                                    className="absolute top-[5px] left-[130px] z-10" 
                                                    onMouseEnter={() => setFavoriteHoverState(institution.objectID, true)}
                                                    onMouseLeave={() => setFavoriteHoverState(institution.objectID, false)}
                                                    onClick={() => setIsSignInModalVisible(true)}>
                                                    <Image 
                                                        src={favoriteHover[institution.objectID] ? "/images/diamond_selected.png" : "/images/diamond_white.png"} 
                                                        alt="favorite" 
                                                        width={30} 
                                                        height={30} 
                                                        className={`rounded-full p-[2px] ${favoriteHover[institution.objectID] ? 'bg-[#FFFFFF]  border-solid border  border-[#2D759E] shadow-[0_0_3px_#2D759E]':'border-none shadow-none bg-[#0000004d]' }`}
                                                    />
                                                </button>
                                                {isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                                                {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                                            </>
                                        ) : (
                                            <>
                                                {(() => {
                                                    const isFavorited = state.favorites.some(item => item.userId === user.uid && item.hosp_name === institution.objectID);
                                                    const handleHeartClick = isFavorited ? () => handleRemoveClick(institution.objectID, user.uid) : () => handleAddClick(institution, user.uid);
                                                    return (
                                                        <button 
                                                            type="button" 
                                                            className="absolute top-[5px] left-[130px] z-10" 
                                                            onMouseEnter={() => setFavoriteHoverState(institution.objectID, true)}
                                                            onMouseLeave={() => setFavoriteHoverState(institution.objectID, false)}
                                                            onClick={handleHeartClick}>
                                                            <Image 
                                                                src={isFavorited || favoriteHover[institution.objectID] ? "/images/diamond_selected.png" : "/images/diamond_white.png"} 
                                                                alt="favorite" 
                                                                width={30} 
                                                                height={30} 
                                                                className={`rounded-full p-[2px] ${isFavorited || favoriteHover[institution.objectID] ? 'bg-[#FFFFFF]  border-solid border  border-[#2D759E] shadow-[0_0_5px_#2D759E]':'border-none shadow-none bg-[#0000004d]' }`} 
                                                            />
                                                        </button>
                                                    );
                                                })()}
                                            </>
                                        )}
                                    </div>
                            ))
                        )}
                        </div>
                        {loading ? (
                            <Skeleton  height={50} width={1200} className="m-[20px]" />
                        ):( 
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
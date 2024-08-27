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


interface SearchOptions {
    filters?: string;
    query?: string;
  }


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
    '精神科', '心理諮商及治療科', '家庭醫學科',
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

            try {
                if (filterValue) {
                    let searchOptions: SearchOptions = {};
                    if (['子宮頸癌', '乳癌', '大腸癌', '口腔癌', '肺癌'].includes(filterValue)) {
                        searchOptions.query = filterValue;
                    } else {
                        switch (filterValue) {
                            case '蘆洲區':
                                searchOptions.filters = `area:"${filterValue}"`;
                                break;
                            case '家庭醫學科':
                                searchOptions.query = filterValue;
                                break;
                            case '醫院':
                                searchOptions.query = filterValue;
                                break;
                            default:
                                return; 
                        }
                    }
    
                    const response = await index.search<InstitutionInfo>(filterValue, searchOptions);
                    setCurrentData(response.hits); 
                    setCurrentPage(1);
                } else {
                    let hits: InstitutionInfo[] = [];
                    await index.browseObjects<InstitutionInfo>({
                        batch: (batch) => {
                            hits = hits.concat(batch);
                        }
                    });
    
                    if (hits.length > 0) {
                        setCurrentData(hits);
                        setCurrentPage(1);
                    } else {
                        console.error('No data found');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error); 
            } finally {
                setLoading(false); 
            }
        };
    
        fetchAndSetData();
    }, [filterValue]); 
    

    const handleCancerFilter = async (cancerType: string) => {
        console.log('Filtering data by', cancerType);
        setLoading(true);
    
        try {
            const searchOptions = { query: cancerType };
            const { hits } = await index.search<InstitutionInfo>(cancerType, searchOptions);
            setCurrentData(hits);
            setCurrentPage(1);
            console.log('Search results for cancer type:', cancerType, hits);
        } catch (error) {
            console.error('Search failed:', error); 
        } finally {
            setLoading(false);
        }
    };


    const toggleDropdowns = (type: 'institutions' | 'divisions' | 'districts'): void => {
        setIsOpenInstitutions(type === 'institutions' ? !isOpenInstitutions : false);
        setIsOpenDivisions(type === 'divisions' ? !isOpenDivisions : false);
        setIsOpenDistricts(type === 'districts' ? !isOpenDistricts : false);
    };
    const handleSelectFilter = async (value: string): Promise<void> => {
        console.log(`Handling filter with value: ${value}`);
        setLoading(true);
    
        try {
            const { hits } = await index.search<InstitutionInfo>(value);
            console.log(`Search results for value ${value}:`, hits);
            setCurrentData(hits);
            setCurrentPage(1);

            setIsOpenInstitutions(false); 
            setIsOpenDivisions(false);
            setIsOpenDistricts(false);
        } catch (error) {
            console.error(`Search failed for value ${value}:`, error);
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleSearch = async (): Promise<void> => {
        const searchTerm = searchInputRef.current?.value.trim();
        console.log('Starting search for term:', searchTerm);
        setLoading(true);
    
        try {
            const { hits } = await index.search<InstitutionInfo>(searchTerm || '');
            console.log('Search results:', hits);
            setCurrentData(hits as InstitutionInfo[]);
            setCurrentPage(1);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };
    const deleteSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
    }


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = currentData.slice(indexOfFirstPost, indexOfLastPost);


    const setFavoriteHoverState = (hosp_name: string, state: boolean) => {
        setFavoriteHover(prev => ({
            ...prev,
            [hosp_name]: state
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


    return (
        <main className="w-full h-auto common-col-flex justify-center bg-[#FCFCFC]" >
                <div className="w-full h-auto relative flex ">
                    <div className="w-full h-[400px] flex">
                        <Image  priority={false} src="/images/searchPage_banner.jpg" alt="icon" width={1720} height={400} className="w-full h-full object-cover"/>
                    </div>
                    {/*癌篩分類*/}
                    <div style={{ bottom: '-165px' }} className="absolute inset-x-0 lg:w-full max-w-[760px] w-[95%] md:min-h-[200px] h-auto common-page-layout justify-around md:mb-[60px] mb-[80px] mx-auto px-[20px] common-border border"> 
                        <div className=" mt-[10px] common-title text-[24px]">依癌篩資格搜尋</div>
                        <div  className="grid md:grid-cols-5 grid-cols-3 md:gap-x-16 xs:gap-x-20 xss:gap-x-12 gap-x-10">
                            {cancers.map((cancer, index) => (
                                <button 
                                    key={index} 
                                    className="common-col-flex justify-between transition-transform duration-300 hover:scale-110 hover:rounded-lg  hover:shadow-lg hover:shadow-gray-400 hover:bg-gradient-to-b from-[#FFFFFF] via-[#C3D8EA] to-[#77ACCC]"
                                    onClick={() => handleCancerFilter(cancer.filter)}
                                >
                                    <div className="w-full h-[100px] common-bg-image" style={{ backgroundImage: `url(${cancer.image})` }}></div>
                                    <div className="w-full mb-[10px] xs:text-[20px] text-[14px] text-[#252525] text-center font-bold">{cancer.filter}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="xl:w-full max-w-[1180px] w-[95%] pt-[80px]">
                    {/*搜*/}
                    <div className="w-full h-10 mt-[60px] mb-[30px]"> 
                        <div className="max-w-[760px] w-full h-full flex mx-auto"> 
                            <div className="flex relative w-full h-full">
                                <input
                                    className="h-full flex-grow px-4 text-[18px] font-bold text-gray-500 common-border border shadow-[0_0_3px_#AABBCC] rounded-l-md"
                                    type="text"
                                    placeholder="請輸入關鍵字搜尋"
                                    ref={searchInputRef}
                                />
                                <button className="absolute top-2 right-10 z-10 hover:scale-110" onClick={deleteSearch}>
                                    <Image src="/images/xmark-solid.svg" alt="close" width={15} height={20} className="w-auto h-[20px]"/>
                                </button>                               
                            </div>
                            <button 
                                className="w-32 h-full common-row-flex justify-center flex-grow bg-[#2D759E] hover:bg-[#5B98BC] rounded-r-md text-white font-bold xs:text-[18px] text-[0px]"
                                onClick={handleSearch}
                            >
                                <Image className="w-auto h-auto mr-[7px]" src="/images/search.png" alt="search" width={30} height={30}/>
                                搜尋
                            </button>
                        </div>
                    </div>
                    {/*渲資*/}
                    <div className="h-auto w-full flex flex-col items-start">
                        {loading ? (
                            <Skeleton  height={25} width={250}  />
                        ):( 
                            <p className="text-[#595959] text-left">共有<strong className="mx-[6px]">{currentData.length}</strong>個新北市醫療機構</p>                                                 
                        )} 
                        <hr className="w-full my-[20px] border border-solid border-[#E0E0E0]"/>
                        {/*選標籤*/}
                        <div className="mx-w-screen-md h-9 flex flex-row justify-center mb-[20px]">
                            <div className="sm:w-[150px] w-[100px] py-1 bg-2 bg-[#E0E0E0] rounded-l-md text-black text-center text-[16px]">排序:</div>
                            <div className="relative sm:w-36 w-20">
                                <button
                                    className={`searchPage-label ${isOpenInstitutions ? 'bg-[#2D759E] text-[#ffffff]' : 'searchPage-label-notOpened'}`}
                                    onClick={() => toggleDropdowns('institutions')}
                                >
                                    依機構
                                    <Image src="/images/down_small_line.svg" alt="institution" width={18} height={18} />
                                </button>
                                {isOpenInstitutions && (
                                    <ul className="lg:searchPage-label-optionsGrid-lg md:searchPage-label-optionsGrid-md xs:searchPage-label-optionsGrid-xs xxs:searchPage-label-optionsGrid-xxs searchPage-label-optionsGrid-mobile">
                                        {institutions.map((institution) => (
                                            <li key={institution} 
                                                className="searchPage-label-option py-2 md:text-center text-left"
                                                onClick={() => handleSelectFilter(institution)} 
                                            >
                                                {institution}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative sm:w-36 w-20">
                                <button
                                    className={`searchPage-label ${isOpenDivisions ? 'bg-[#2D759E] text-[#ffffff]' : 'searchPage-label-notOpened'}`}
                                    onClick={() => toggleDropdowns('divisions')}
                                >
                                    依科別
                                    <Image src="/images/down_small_line.svg" alt="division" width={18} height={18} />
                                </button>
                                {isOpenDivisions && (
                                    <ul className="lg:searchPage-label-optionsGrid-lg md:searchPage-label-optionsGrid-md xs:searchPage-label-optionsGrid-xs xxs:searchPage-label-optionsGrid-xxs searchPage-label-optionsGrid-mobile">
                                        {divisions.map((division) => (
                                            <li 
                                                key={division} 
                                                className="searchPage-label-option py-1 md:text-center text-left" 
                                                onClick={() => handleSelectFilter(division)}
                                            >
                                                {division}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative sm:w-36 w-20">
                                <button
                                    className={`rounded-r-md searchPage-label ${isOpenDistricts ? 'bg-[#2D759E] text-[#ffffff]' : 'searchPage-label-notOpened'}`} 
                                    onClick={() => toggleDropdowns('districts')}
                                >
                                    依地區
                                    <Image src="/images/down_small_line.svg" alt="district" width={18} height={18} />
                                </button>
                                {isOpenDistricts && (
                                    <ul className="lg:searchPage-label-optionsGrid-lg md:searchPage-label-optionsGrid-md xs:searchPage-label-optionsGrid-xs xxs:searchPage-label-optionsGrid-xxs searchPage-label-optionsGrid-mobile">
                                        {districts.map((district) => (
                                            <li 
                                                key={district} 
                                                className="searchPage-label-option py-1 md:text-center text-left" 
                                                onClick={() => handleSelectFilter(district)}
                                            >
                                                {district}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {/*卡片盒 */} 
                        <div className="w-full h-auto grid lg:grid-cols-2 grid-cols-1 lg:gap-x-[1%] gap-0 justify-center items-start m-auto box-border">
                            {loading ? (
                                Array.from({ length: postsPerPage-10 }, (_, index) => (
                                    <Skeleton key={index} height={170} width={300} className="m-[3px]" />
                                ))
                            ) : (
                            currentPosts.map((institution) => (
                                    <div  
                                        key={institution.hosp_name} 
                                        className="h-[136px] relative lg:fill-two-columns fill-column mb-[15px] border border-gray-300 rounded-sm overflow-hidden bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]"
                                    >
                                         <button onClick={() => handleIncrement(institution)} className="flex h-full w-full">
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
                                            <div className="flex flex-col w-full justify-between p-[15px]">
                                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[16px] text-[#3E3A39] font-bold pr-[15px]">{institution.hosp_name}</div>
                                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.division}</div>
                                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-card text-[14px] text-[#595959]">{institution.cancer_screening}</div>
                                                <div className="xl:w-[380px] xs:w-[300px] xss:w-[168px] w-[100px] common-row-flex w-[380px] h-[30px] ">
                                                    <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                                    <span className="ml-[5px]  text-[14px] text-[#707070]">{institution.view}</span>
                                                </div>
                                            </div>
                                        </button>
                                        {!user ? (
                                            <>
                                                <button 
                                                    type="button"  
                                                    className="absolute top-[5px] left-[130px] z-10" 
                                                    onMouseEnter={() => setFavoriteHoverState(institution.hosp_name, true)}
                                                    onMouseLeave={() => setFavoriteHoverState(institution.hosp_name, false)}
                                                    onClick={() => setIsSignInModalVisible(true)}>
                                                    <Image 
                                                        src={favoriteHover[institution.hosp_name] ? "/images/diamond_selected.png" : "/images/diamond_white.png"} 
                                                        alt="favorite" 
                                                        width={30} 
                                                        height={30} 
                                                        className={`rounded-full p-[2px] ${favoriteHover[institution.hosp_name] ? 'favorite-button-add':'favorite-button-remove' }`}
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
                                                            onMouseEnter={() => setFavoriteHoverState(institution.hosp_name, true)}
                                                            onMouseLeave={() => setFavoriteHoverState(institution.hosp_name, false)}
                                                            onClick={handleHeartClick}>
                                                            <Image 
                                                                src={isFavorited || favoriteHover[institution.hosp_name] ? "/images/diamond_selected.png" : "/images/diamond_white.png"} 
                                                                alt="favorite" 
                                                                width={30} 
                                                                height={30} 
                                                                className={`rounded-full p-[2px] ${isFavorited || favoriteHover[institution.hosp_name] ? 'favorite-button-add':'favorite-button-remove' }`} 
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
                            <Skeleton  height={50} width={300} className="m-[20px]" />
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
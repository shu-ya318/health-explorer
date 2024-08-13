//import {useInstitutions }  from "../contexts/InstitutionsContext";
import {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';   
import Image from 'next/image';
import Link from 'next/link';

import { SearchBox, Configure, useHits, Pagination } from 'react-instantsearch';
import { finalHit } from "./AlgoliaSearch/finalHit";

import { db } from '../library/firebaseConfig';
import { collection,doc , query, where, orderBy, startAfter, limit, getDocs, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
import { useFavorite} from '../contexts/FavoriteContext'; 
import { FirebaseFavoriteData} from '../library/types.js';
import { useAuth } from '../contexts/AuthContext'; 
import SignInModal from './auth/SignInModal';
import RegisterModal from './auth/RegisterModal';


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
    const { user } = useAuth();
    const { state, addFavorite, removeFavorite} = useFavorite();

    const router = useRouter();
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');

    const [isOpenInstitutions, setIsOpenInstitutions] = useState(false);
    const [isOpenDivisions, setIsOpenDivisions] = useState(false);
    const [isOpenDistricts, setIsOpenDistricts] = useState(false);

    const { items } = useHits();


    const handleAddClick = async (hit: any, userId:string) => {
        if (!user) return;

        const newRecord: FirebaseFavoriteData = {
            userId: user.uid,
            hosp_name: hit.hosp_name,
            hosp_addr: hit.hosp_addr,
            tel:hit.tel,
            //division: hit.division, 
            //cancer_screening: hit.cancer_screening,
            timestamp: new Date() ,
            imageUrl: hit.imageUrl
        };
        await addFavorite(newRecord);
        console.log("Favorite added:", newRecord);
    };

    const handleRemoveClick = async (objectID:string, userId:string) => {
        if (!user) return;

        //遍歷的key值非同資料庫id，先讀取要操作資料庫的對應文件
        const q = query(collection(db, 'favorites'), where("hosp_name", "==", objectID), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
            const batch = querySnapshot.docs.map(async (document) => {
                await deleteDoc(doc(db, 'favorites', document.id));
                console.log("Deleting document:", document.id);
                return document.id;  // 間接從firstore才能取得文件id
            });
            const deletedDocIds = await Promise.all(batch);
    
            deletedDocIds.forEach(docId => {
                removeFavorite(docId);
            });
        } else {
            console.error("firestore無此筆收藏紀錄文件或狀態找不到對應id的元素");
        }
    };
    
    /* 過濾資料
    useEffect(() => {
        let filteredData = institutionData as FirebaseInstitutionData[];
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


    const handleCancerFilter = (cancerType: string) => {
        const filteredInstitutions = institutionData.filter(institution =>
            institution.cancer_screening?.includes(cancerType)
        );
        setCurrentData(filteredInstitutions);
        setCurrentPage(1);
    };


    const toggleDropdowns = (type: 'institutions' | 'divisions' | 'districts'): void => {
        setIsOpenInstitutions(type === 'institutions' ? !isOpenInstitutions : false);
        setIsOpenDivisions(type === 'divisions' ? !isOpenDivisions : false);
        setIsOpenDistricts(type === 'districts' ? !isOpenDistricts : false);
    };
    const handleSelectFilter = (filterType: 'institution' | 'division' | 'district', value: string): void => {
        const filteredData = institutionData.filter(institution =>
            filterType === 'institution' ? institution.hosp_name.includes(value) :
            filterType === 'division' ? institution.division?.includes(value) :
            institution.area?.includes(value)
        );
        setCurrentData(filteredData);
        setCurrentPage(1);
        setIsOpenInstitutions(false);
        setIsOpenDivisions(false);
        setIsOpenDistricts(false);
    };
*/

    /*觀看數 useEffect(() => {
        let data = [...institutionData];
        if (sortByViews) {
            data.sort((a, b) => (views[b.hosp_name] || 0) - (views[a.hosp_name] || 0));
        }
        setCurrentData(data);
    }, [institutionData, sortByViews, views]);

    const handleSortByViews = (): void => {
        setSortByViews(!sortByViews);
        setCurrentPage(1);
    };
*/
    /*const handleIncrement = (hosp_name: string, url: string) => {
        incrementView(hosp_name);
        router.push(url); 
    };
    */


    return (
        <main className="w-full h-auto flex flex-col justify-center items-center flex-grow bg-[#ffffff]" >
                <div className="w-[1280px]">
                    {/*搜*/}
                    <div className="w-full h-10 mt-[60px]  mb-[30px]"> 
                        <div className="flex max-w-screen-md h-full mx-auto"> 
                            <SearchBox className="ais-InstantSearch flex flex-col w-full h-full z-40 rounded-lg border-solid border-[3px] border-[#6898a5]" placeholder="請輸入關鍵字"/>
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
                                    //onClick={() => handleCancerFilter(cancer.filter)}
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
                        <hr className="w-full border-solid border border-[#acb8b6] my-[10px]"/>
                        {/*選標籤*/}
                        <div className="mx-w-screen-md h-9 flex justify-center mb-[20px]">
                            <div className="w-[150px] bg-2 bg-[#e6e6e6]  rounded-l-md text-black text-center py-1">排序:</div>
                            <button 
                                className="font-bold w-36 bg-[#ffffff]  border border-[#e6e6e6] hover:bg-[#acb8b6]  hover:text-[#ffffff] text-[#707070] text-center py-1"
                                //onClick={handleSortByViews}
                            >
                                熱門度
                            </button>
                            <div className="relative w-36">
                                <button
                                    //onClick={() => toggleDropdowns('institutions')}
                                    className={`flex justify-around items-center font-bold border border-[#e6e6e6] ${isOpenInstitutions ? 'bg-[#acb8b6] text-[#ffffff]' : 'bg-[#ffffff] hover:bg-[#acb8b6] hover:text-[#ffffff] text-[#707070]'} text-center py-1 w-full h-full`}
                                >
                                    依機構
                                    <Image src="/images/down_small_line.svg" alt="institution" width={25} height={25} />
                                </button>
                                {isOpenInstitutions && (
                                    <ul className="grid grid-cols-3 gap-2  absolute z-20 bg-[#ffffff] border-2 border-[#acb8b6] rounded-md w-[500px] p-[10px]">
                                        {institutions.map((institution) => (
                                            <li key={institution} 
                                                className="z-20 hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-2 border-solid border border-[#e6e6e6] rounded-md  cursor-pointer"
                                                //onClick={() => handleSelectFilter('institution', institution)} 
                                            >
                                                {institution}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-36">
                                <button
                                    //onClick={() => toggleDropdowns('divisions')}
                                    className={`flex justify-around items-center font-bold border border-[#e6e6e6] ${isOpenDivisions ? 'bg-[#acb8b6] text-[#ffffff]' : 'bg-[#ffffff] hover:bg-[#acb8b6] hover:text-[#ffffff] text-[#707070]'} text-center py-1 w-full h-full`}
                                >
                                    依科別
                                    <Image src="/images/down_small_line.svg" alt="division" width={25} height={25} />
                                </button>
                                {isOpenDivisions && (
                                    <ul className="grid grid-cols-3 gap-2  absolute z-20 bg-[#ffffff] border-2 border-[#acb8b6] rounded-md w-[500px] p-[10px]">
                                        {divisions.map((division) => (
                                            <li 
                                                key={division} 
                                                className="z-20 hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]  rounded-md  cursor-pointer " 
                                                //onClick={() => handleSelectFilter('division', division)}
                                            >
                                                {division}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="relative w-36">
                                <button
                                    //onClick={() => toggleDropdowns('districts')}
                                    className={`rounded-r-md flex justify-around items-center font-bold border border-[#e6e6e6] ${isOpenDistricts ? 'bg-[#acb8b6] text-[#ffffff]' : 'bg-[#ffffff] hover:bg-[#acb8b6] hover:text-[#ffffff] text-[#707070]'} text-center py-1 w-full h-full`}
                                >
                                    依行政區
                                    <Image src="/images/down_small_line.svg" alt="district" width={25} height={25} />
                                </button>
                                {isOpenDistricts && (
                                    <ul className="grid grid-cols-3 gap-2  absolute z-20 bg-[#ffffff] border-2 border-[#acb8b6] rounded-md w-[500px] p-[10px]">
                                        {districts.map((district) => (
                                            <li 
                                                key={district} 
                                                className="z-20 hover:bg-[#acb8b6] hover:text-[#ffffff] text-center text-[#707070] py-1 border-solid border border-[#e6e6e6]  rounded-md  cursor-pointer " 
                                                //onClick={() => handleSelectFilter('district', district)}
                                                >
                                                {district}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {/*卡片盒*/}
                        <div className="w-full h-auto m-auto grid grid-cols-4 gap-20 justify-center items-start box-border mt-[20px]">
                            <Configure hitsPerPage={16} /> 
                            {items.map((hit) => (
                                 <Link  key={hit.objectID} href={`/Search/${encodeURIComponent(hit.hosp_name)}`}>
                                    <div  className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
                                        <div className="relative">
                                            {hit.imageUrl && (
                                                <Image
                                                    src={hit.imageUrl}
                                                    alt="institution"
                                                    width={250}
                                                    height={200}
                                                    className="w-full h-[200px] object-cover object-center"
                                                    unoptimized={true}
                                                />
                                            )}
                                            {/* 連接另一個資料庫favorites */}
                                            {!user ? (
                                                <>
                                                    <button type="button" onClick={() => setIsSignInModalVisible(true)}>
                                                        <Image src="/images/heart_line.svg" alt="collection" width={40} height={40} className="absolute top-1.5 right-1.5 z-10 border-solid border-2 border-[#6898a5] rounded-full" />
                                                    </button>
                                                    {isSignInModalVisible && <SignInModal onClose={() => setIsSignInModalVisible(false)} onShowRegister={() => setIsRegisterModalVisible(true)} />}
                                                    {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowSignIn={() => setIsSignInModalVisible(true)} />}
                                                </>
                                            ) : (
                                                <>
                                                    {(() => {
                                                        const isFavorited = state.favorites.some(item => item.userId === user.uid && item.hosp_name === hit.objectID);
                                                        const handleHeartClick = isFavorited ? () => handleRemoveClick(hit.objectID, user.uid) : () => handleAddClick(hit, user.uid);
                                                        return (
                                                            <button type="button" onClick={handleHeartClick}>
                                                                <Image 
                                                                    src="/images/heart_line.svg" 
                                                                    alt="collection" width={40} height={40} 
                                                                    className={`${isFavorited ? 'bg-[#FFFFFF] border-[10px]  shadow-[0_0_10px_#6898a5]' : 'bg-transparent '} absolute top-1.5 right-1.5 z-10 border-solid border-2  border-[#6898a5] rounded-full`}
                                                                />
                                                            </button>
                                                        );
                                                    })()}
                                                </>
                                            )}
                                        </div>
                                        <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[10px] pr-[15px]">{hit.hosp_name}</div>
                                        <div className="w-full h-[30px] flex items-center justify-end">
                                            <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                                            <span className="ml-2 text-black mr-[10px]">觀看數:{hit.view}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div  className="w-full">
                            <Pagination padding={5} showFirst={true} showLast={true} className="my-[50px]  mx-auto w-[650px]"/>
                        </div>
                    </div>
                </div>
            </main>
    );
};

export default SearchContent;
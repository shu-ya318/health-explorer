import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { useAuth } from "../hooks/useAuth";
import { useFavorite } from "../hooks/useFavorite";

import CancerFilter from "./CancerFilter";
import SearchInput from "./SearchInput";
import FilterDropdowns from "./FilterDropdowns";
import InstitutionCards from "./InstitutionCards";
import Pagination from "./Pagination";
//import { useInstitutions }  from "../contexts/InstitutionsContext";

import { db } from "../lib/firebaseConfig";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { FirebaseFavoriteData, InstitutionInfo } from "../lib/types";
import algoliasearch from "algoliasearch";

interface SearchOptions {
    filters?: string;
    query?: string;
}

const cancers = [
    { filter: "子宮頸癌", image: "/images/cervicalCancer.png" },
    { filter: "乳癌", image: "/images/breastCancer.png" },
    { filter: "大腸癌", image: "/images/colorectalCancer.png" },
    { filter: "口腔癌", image: "/images/oralCancer.png" },
    { filter: "肺癌", image: "/images/lungCancer.png" }
];

const institutions = [
    "衛生所", "診所", "醫院"
];

const divisions = [
    "婦產科", "牙醫一般科", "耳鼻喉科",
    "皮膚科", "眼科", "骨科",
    "精神科", "心理諮商及治療科", "家庭醫學科",
    "泌尿科", "內科", "外科"
];

const districts = [
    "板橋區", "三重區", "中和區", "永和區", "新莊區",
    "新店區", "樹林區", "鶯歌區", "三峽區", "淡水區",
    "汐止區", "瑞芳區", "土城區", "蘆洲區", "五股區",
    "泰山區", "林口區", "深坑區", "石碇區", "坪林區",
    "三芝區", "石門區", "八里區", "平溪區", "雙溪區",
    "貢寮區", "金山區", "萬里區", "烏來區"
];

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string, 
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
);

const index = searchClient.initIndex("Medical_Institutions");

const SearchContent: React.FC = () => {    
    const { user } = useAuth();
    const { state, addFavorite, removeFavorite} = useFavorite();
    const router = useRouter();
    const searchParams = useSearchParams();
    const filterValue = decodeURIComponent(searchParams.get('filter') || '');

    
    const [favoriteHover, setFavoriteHover] = useState<Record<string, boolean>>({});
    const [isOpenInstitutions, setIsOpenInstitutions] = useState<boolean>(false);
    const [isOpenDivisions, setIsOpenDivisions] = useState<boolean>(false);
    const [isOpenDistricts, setIsOpenDistricts] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const [currentData, setCurrentData] = useState<InstitutionInfo[]>([]); 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 20;

    const favoriteButtonRef = useRef<HTMLButtonElement>(null);
    const loggedFavoriteButtonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log("updated:", favoriteHover);
    }, [favoriteHover]);
    
    useEffect(() => {
        const fetchAndSetData = async () => {
            setLoading(true);

            try {
                if (filterValue) {
                    let searchOptions: SearchOptions = {};
                    if (["子宮頸癌", "乳癌", "大腸癌", "口腔癌", "肺癌"].includes(filterValue)) {
                        searchOptions.query = filterValue;
                    } else {
                        switch (filterValue) {
                            case "蘆洲區":
                                searchOptions.filters = `area:"${filterValue}"`;
                                break;
                            case "家庭醫學科":
                                searchOptions.query = filterValue;
                                break;
                            case "醫院":
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
                        console.error("No data found");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error); 
            } finally {
                setLoading(false); 
            }
        };
    
        fetchAndSetData();
    }, [filterValue]); 


    const handleSearch = async (searchTerm: string): Promise<void> => {
        setLoading(true);
    
        try {
            const { hits } = await index.search<InstitutionInfo>(searchTerm || "");
            setCurrentData(hits as InstitutionInfo[]);
            setCurrentPage(1);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
    }


    const handleCancerFilter = async (cancerType: string) => {
        setLoading(true);
    
        try {
            const searchOptions = { query: cancerType };
            const { hits } = await index.search<InstitutionInfo>(cancerType, searchOptions);
            setCurrentData(hits);
            setCurrentPage(1);
        } catch (error) {
            console.error("Search failed:", error); 
        } finally {
            setLoading(false);
        }
    };


    const toggleDropdowns = (type: "institutions" | "divisions" | "districts"): void => {
        setIsOpenInstitutions(type === "institutions" ? !isOpenInstitutions : false);
        setIsOpenDivisions(type === "divisions" ? !isOpenDivisions : false);
        setIsOpenDistricts(type === "districts" ? !isOpenDistricts : false);
    };

    const handleSelectFilter = async (value: string): Promise<void> => {
        setLoading(true);
    
        try {
            const { hits } = await index.search<InstitutionInfo>(value);
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


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = currentData.slice(indexOfFirstPost, indexOfLastPost);

    
    const setFavoriteHoverState = (hosp_name: string, state: boolean) => {
        setFavoriteHover(prev => {
            if (prev[hosp_name] === state) {
                return prev; 
            }
            const updated = { ...prev, [hosp_name]: state };
            console.log(`Setting favorite hover for ${hosp_name} to ${state}`);
            return updated;
        });
    };


    const handleAddClick = async (institution: InstitutionInfo, userId:string) => {
        if (!user) return;

        const newRecord: FirebaseFavoriteData = {
            userId: user.uid,
            hosp_name: institution.hosp_name,
            hosp_addr: institution.hosp_addr,
            tel:institution.tel,
            imageUrl: institution.imageUrl
        };
        await addFavorite(newRecord);
    };

    const handleRemoveClick = async (objectID:string, userId:string) => {
        if (!user) return;

        const q = query(collection(db, "favorites"), where("hosp_name", "==", objectID), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
            const batch = querySnapshot.docs.map(async (document) => {
                await deleteDoc(doc(db, "favorites", document.id));
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
        const docRef = doc(db, "medicalInstitutions", institution.hosp_name);
        router.push(`/search/${encodeURIComponent(institution.hosp_name)}`);

        try {
            await updateDoc(docRef, {
                view: increment(1)
            });
        } catch (error) {
            console.error("Failed to increment views:", error);
        }
    };

    return (
        <main className="w-full h-auto common-col-flex justify-center bg-[#FCFCFC]">
            <div className="w-full h-auto relative flex">
                <div className="relative w-full h-[400px] flex">
                    <Image 
                        src="/images/searchPage_banner.jpg" 
                        alt="icon" 
                        fill={true} 
                        className="max-w-full h-auto object-cover"
                    />
                </div>
                <CancerFilter 
                    cancers={cancers} 
                    handleCancerFilter={handleCancerFilter} 
                />
            </div>
            <div className="xl:w-full max-w-[1180px] w-[95%] pt-[80px]">
                <SearchInput 
                    handleSearch={handleSearch} 
                    deleteSearch={deleteSearch}
                />
                <div className="h-auto w-full flex flex-col items-start">
                    {loading ? (
                        <div className="w-[250px] h-[25px] bg-gray-300 rounded-lg animate-pulse"></div>   
                    ):( 
                        <p className="text-[#595959] text-left">
                            共有<strong className="mx-[6px]">{currentData.length}</strong>個新北市醫療機構
                        </p>                                                 
                    )} 
                    <hr className="w-full my-[20px] border border-solid border-[#E0E0E0]"/>
                    <FilterDropdowns
                        institutions={institutions}
                        divisions={divisions}
                        districts={districts}
                        isOpenInstitutions={isOpenInstitutions}
                        isOpenDivisions={isOpenDivisions}
                        isOpenDistricts={isOpenDistricts}
                        handleSelectFilter={handleSelectFilter}
                        toggleDropdowns={toggleDropdowns}
                    />
                    <InstitutionCards
                        user={user} 
                        loading={loading}
                        postsPerPage={postsPerPage}
                        currentPosts={currentPosts}
                        handleIncrement={handleIncrement}
                        setFavoriteHoverState={setFavoriteHoverState}
                        handleAddClick={handleAddClick} 
                        handleRemoveClick={handleRemoveClick} 
                        favoriteButtonRef={favoriteButtonRef}
                        loggedFavoriteButtonRef={loggedFavoriteButtonRef}
                        favoriteHover={favoriteHover}
                        state={state} 
                    />
                    {loading ? (
                        <div className="w-[90%] h-[40px] my-[20px] mx-auto bg-gray-300 rounded-lg animate-pulse"></div>
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
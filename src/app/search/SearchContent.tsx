import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { useAuth } from "../hooks/useAuth";
import { useFavorite } from "../hooks/useFavorite";
import { useInstitution }  from "../hooks/useInstitution";

import CancerFilter from "./CancerFilter";
import SearchInput from "./SearchInput";
import FilterDropdowns from "./FilterDropdowns";
import InstitutionCard from "./InstitutionCard";
import Pagination from "./Pagination";

import { InstitutionInfo } from "../lib/types";
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
    const { state, handleAddFavorite, handleRemoveFavorite} = useFavorite();
    const { handleIncrement } = useInstitution();
    
    const searchParams = useSearchParams();
    const filterValue = decodeURIComponent(searchParams.get("filter") || "");

    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isOpenInstitutions, setIsOpenInstitutions] = useState<boolean>(false);
    const [isOpenDivisions, setIsOpenDivisions] = useState<boolean>(false);
    const [isOpenDistricts, setIsOpenDistricts] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const [currentData, setCurrentData] = useState<InstitutionInfo[]>([]); 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 20;
    
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

    return (
        <main className="w-full h-auto common-col-flex justify-center bg-[#FCFCFC]">
            <div className="w-full h-auto relative flex">
                <div className="relative w-full h-[400px] flex">
                    <Image 
                        src="/images/searchPage_banner.jpg" 
                        alt="searchPage_banner" 
                        fill={true} 
                        className="w-full h-full object-cover"
                        onLoad={() => setImageLoaded(true)}
                        style={{backgroundImage: imageLoaded ? "" : "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)"}}
                    />
                </div>
                <CancerFilter 
                    cancers={cancers} 
                    handleCancerFilter={handleCancerFilter} 
                />
            </div>
            <div className="xl:w-full max-w-[1180px] w-[95%] pt-[80px]">
                <SearchInput
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleSearch={handleSearch} 
                />
                <div className="w-full h-auto flex flex-col items-start">
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
                    <div className="w-full h-auto grid lg:grid-cols-2 grid-cols-1 lg:gap-x-[1%] gap-0 justify-center items-start m-auto box-border">
                        {loading ? (
                            Array.from({ length: postsPerPage-12 }, (_, index) => ( 
                                    <div 
                                        key={index} 
                                        role="status" 
                                        className="lg:fill-two-columns fill-column mb-[15px] border border-gray-300 rounded-lg p-4"
                                    >
                                        <div className="w-full h-48 flex justify-center items-center mb-[15px] bg-gray-300 rounded-lg animate-pulse">
                                            <svg 
                                                className="w-8 h-8 stroke-gray-400" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path 
                                                    d="M20.5499 15.15L19.8781 14.7863C17.4132 13.4517 16.1808 12.7844 14.9244 13.0211C13.6681 13.2578 12.763 14.3279 10.9528 16.4679L7.49988 20.55M3.89988 17.85L5.53708 16.2384C6.57495 15.2167 7.09388 14.7059 7.73433 14.5134C7.98012 14.4396 8.2352 14.4011 8.49185 14.3993C9.16057 14.3944 9.80701 14.7296 11.0999 15.4M11.9999 21C12.3154 21 12.6509 21 12.9999 21C16.7711 21 18.6567 21 19.8283 19.8284C20.9999 18.6569 20.9999 16.7728 20.9999 13.0046C20.9999 12.6828 20.9999 12.3482 20.9999 12C20.9999 11.6845 20.9999 11.3491 20.9999 11.0002C20.9999 7.22883 20.9999 5.34316 19.8283 4.17158C18.6568 3 16.7711 3 12.9998 3H10.9999C7.22865 3 5.34303 3 4.17145 4.17157C2.99988 5.34315 2.99988 7.22877 2.99988 11C2.99988 11.349 2.99988 11.6845 2.99988 12C2.99988 12.3155 2.99988 12.651 2.99988 13C2.99988 16.7712 2.99988 18.6569 4.17145 19.8284C5.34303 21 7.22921 21 11.0016 21C11.3654 21 11.7021 21 11.9999 21ZM7.01353 8.85C7.01353 9.84411 7.81942 10.65 8.81354 10.65C9.80765 10.65 10.6135 9.84411 10.6135 8.85C10.6135 7.85589 9.80765 7.05 8.81354 7.05C7.81942 7.05 7.01353 7.85589 7.01353 8.85Z" 
                                                    stroke="stroke-current" 
                                                    strokeWidth="1.6" 
                                                    strokeLinecap="round"
                                                >
                                                </path>
                                            </svg>
                                        </div>
                                        <div className="w-full flex justify-between items-start animate-pulse">
                                            <div className="block">
                                                <h3 className="w-48 h-3 mb-4 bg-gray-300 rounded-full"></h3>
                                            </div>
                                            <span className="w-16 h-2 bg-gray-300 rounded-full"></span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                currentPosts.map((institution) => (
                                    <InstitutionCard
                                        key={institution.hosp_name} 
                                        user={user}
                                        state={state}
                                        institution={institution}
                                        handleAddFavorite={handleAddFavorite} 
                                        handleRemoveFavorite={handleRemoveFavorite} 
                                        handleIncrement={handleIncrement}
                                    />
                            ))
                        )}
                    </div>
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
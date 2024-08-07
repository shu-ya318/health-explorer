'use client';
import SearchContent from '../components/SearchContent';
import { InstitutionsProvider } from '../contexts/InstitutionsContext';
import {useInstitutions }  from "../contexts/InstitutionsContext";
import {useState, useEffect , useRef, ChangeEvent} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';   
import {FirebaseInstitutionData} from "../lib/types.js";
import Pagination from '../components/Pagination';

const SearchPage: React.FC = (): React.ReactElement | null  => {
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

    const {institutionData, loading, views, incrementView, logMessage} = useInstitutions();
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
            //在內部馬上console.log(searchResults); 仍顯示初始值  (改外部會取得正確值)
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
        window.location.href = url; 
    };


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = currentData.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (     
        <InstitutionsProvider>  
             <SearchContent
                searchInputRef={searchInputRef}
                deleteSearch={() => { if (searchInputRef.current) searchInputRef.current.value = ""; }}
                handleSearch={handleSearch}
                cancers={cancers}
                handleCancerFilter={handleCancerFilter}

                handleInstitutionsClick={handleInstitutionsClick} // 新增
                handleDivisionsClick={handleDivisionsClick} // 新增
                handleDistrictsClick={handleDistrictsClick} // 新增
                handleInstitutionSelect={handleInstitutionSelect} // 新增
                isOpenInstitutions={isOpenInstitutions} // 新增
                isOpenDivisions={isOpenDivisions} // 新增
                isOpenDistricts={isOpenDistricts} // 新增
                institutions={institutions} // 新增
                divisions={divisions} // 新增
                districts={districts} // 新增

                institutionData={institutionData}
                loading={loading}
                views={views}
                incrementView={incrementView} 

                currentPosts={currentPosts}
                handleIncrement={handleIncrement}
                currentData={currentData}
                paginate={(pageNumber: number) => setCurrentPage(pageNumber)}
                currentPage={currentPage}
                postsPerPage={postsPerPage}
                totalPosts={currentData.length}

                logMessage={logMessage}
            />
        </InstitutionsProvider>
    )
};

export default SearchPage;

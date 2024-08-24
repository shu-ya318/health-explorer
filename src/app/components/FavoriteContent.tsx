import { useRouter } from 'next/navigation';
import { useState, useEffect,useCallback , useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { db } from '../lib/firebaseConfig';
import { collection,doc , query, where, orderBy, startAfter, limit, getDocs, addDoc, deleteDoc, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import { useFavorite} from '../hooks/useFavorite'; 
import { FirebaseFavoriteData} from '../lib/types';
import { useAuth } from '../hooks/useAuth'; 

import HomePage  from '../page'; 
import {ConfirmDeleteModal} from '../components/ConfirmDeleteModal';


const FavoriteContent: React.FC = (): React.ReactElement | null  => {
    const { uid } = useAuth().user || {}; 
    const { state, fetchFavoriteData, removeFavorite} = useFavorite();

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const observer = useRef<IntersectionObserver>(null);
    const lastElementRef = useRef<HTMLDivElement>(null);
    const [favoriteData, setFavoriteData] = useState<FirebaseFavoriteData[]>([]);

    const [hover, setHover] = useState<Record<string, boolean>>({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const router = useRouter();


    const fetchMoreData = useCallback(async () => {
        if (! uid  || loading || (!lastVisible && !isInitialLoad) || allDataLoaded) return;

        setLoading(true);
        try {
            const nextQuery = query(
                collection(db, 'favorites'),
                where('userId', '==', uid),
                lastVisible ? startAfter(lastVisible) : limit(3),
                limit(3)
            );
            const documentSnapshots = await getDocs(nextQuery);

            if (documentSnapshots.docs.length > 0) {
                const newData = documentSnapshots.docs.map(doc => ({ ...doc.data()as FirebaseFavoriteData, id: doc.id }));
                setFavoriteData(prev => {
                    console.log('Updating favoriteData:', prev, newData);
                    return [...prev, ...newData];
                });
                setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            } else {
                setAllDataLoaded(true);
                if (observer.current && lastElementRef.current) {
                    observer.current.unobserve(lastElementRef.current);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    }, [uid,loading, lastVisible, isInitialLoad, allDataLoaded]);

    useEffect(() => {
        console.log(isInitialLoad);
        if (isInitialLoad) {
          fetchMoreData();
          setIsInitialLoad(false);
        }
    
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && !loading && lastVisible && !allDataLoaded) {
            console.log("IntersectionObserver - Triggered");
            fetchMoreData();
          }
        }, { threshold: 1.0 });
    
        if (lastElementRef.current) {
          observer.observe(lastElementRef.current);
        }

        return () => {
        console.log(" Cleanup: lastVisible", lastVisible);
          observer.disconnect();
        };
      }, [lastVisible, loading, fetchMoreData, isInitialLoad, allDataLoaded]);


    const toggleHover = (id: string) => { 
        setHover(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        console.log(hover);
    };
    

    const handleDeleteClick = async (docId: string) => {
        setSelectedId(docId);
        setIsConfirmModalOpen(true);
      };
    const handleConfirmDelete = async () => {
    if (!selectedId || !uid) return;

    try {
        await removeFavorite(selectedId);
        setFavoriteData(favoriteData.filter(item => item.id !== selectedId));
    } catch (error) {
        console.error('刪除失敗:', error);
    }
    setIsConfirmModalOpen(false);
    };
    const handleCloseModal = () => {
    setIsConfirmModalOpen(false);
    };

  
    return (
        <> 
        {!uid  ? 
         <HomePage/>
          :( 
            <> 
                <main className="common-col-flex justify-center w-full h-auto">
                    {isConfirmModalOpen && (
                        <ConfirmDeleteModal 
                            isOpen={isConfirmModalOpen} 
                            onConfirm={handleConfirmDelete} 
                            onCancel={handleCloseModal} 
                        />
                    )}   
                    <div className="relative flex w-full h-auto">
                        <div className="relative flex flex-col w-full h-[360px]"> 
                            <Image  priority={false} src="/images/favoritePage_banner.jpg" alt="icon" width={1920} height={360} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 w-full h-full bg-gray-900 bg-opacity-20">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ffffff] font-bold sm:text-[56px] xs:text-[48px] text-[37px] text-center">收藏清單</div>  
                            </div>
                        </div>  
                    </div>
                    {/*收藏項目*/}
                    <div className="common-col-flex justify-center w-full min-h-screen bg-[#F0F0F0] backdrop-blur-sm my-auto pt-5 pb-10">
                        <div className="xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] flex md:flex-row flex-col min-h-screen  shadow-[0_0_10px_#AABBCC] rounded-lg">
                            <div className="lg:w-[75%] md:w-[65%] w-full common-col-flex justify-start bg-[#FFFFFF] backdrop-blur-md py-7 px-8 rounded-l-lg">
                                {favoriteData.length === 0 ? (
                                    <>
                                        <div className="text-2xl text-gray-600 text-center my-auto">目前無收藏機構</div>
                                        <button 
                                            type="button" 
                                            className="w-64 h-11 py-4.5 px-2.5 mb-[60px] common-button"
                                            onClick={()=>router.push('/search')} 
                                        >
                                        開始搜尋
                                        </button>
                                    </>
                                ) : (
                                favoriteData.map((item) => (
                                    <>  
                                        <div key={item.id} className="grid lg:grid-cols-custom fill-column w-[98%]">
                                            <div className="relative lg:w-[180px] w-[85%] lg:h-[180px] h-[300px] aspect-square common-row-flex">
                                                {item.imageUrl && (
                                                    <div className="w-full h-full common-bg-image" style={{backgroundImage: `url(${item.imageUrl})`}}></div> 
                                                )}
                                                {item.id && (
                                                    <button 
                                                        type="button" 
                                                        className="absolute top-[7px] right-[10px] lg:left-[145px]  z-10 w-[30px] h-[30px]"
                                                    >
                                                        <Image 
                                                            src="/images/diamond_selected.png" 
                                                            alt="collection" 
                                                            width={30} 
                                                            height={30} 
                                                            className="w-full h-full  p-[2px] favorite-button-add rounded-full"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="relative flex w-full lg:ml-[10px] lg:mr-0 ">
                                                <div className="flex flex-col w-[90%] h-auto text-[#2D759E] xl:text-base lg:text-sm text-lg leading-12 lg:mt-0 mt-[35px]">
                                                    <div className="flex mb-4">
                                                        <span className="font-bold lg:w-[43px] text-nowrap mr-[2px]">名稱</span>
                                                        <span className="text-[#1D445D]">{item.hosp_name}</span>
                                                    </div>
                                                    <div className="flex mb-4">
                                                        <span className="font-bold lg:w-[43px] text-nowrap mr-[2px]">電話</span>
                                                        <span className="text-[#1D445D]">{item.tel}</span>
                                                    </div>
                                                    <div className="flex mb-4">
                                                        <span className="font-bold lg:w-[43px] text-nowrap mr-[5px]">地址</span>
                                                        <span className="text-[#1D445D] ml-px">{item.hosp_addr}</span>
                                                    </div>
                                                </div>
                                                {item.id && (
                                                <button 
                                                    className="absolute lg:top-0 lg:right-0 bottom-[-100px] right-0 flex min-h-[150px] z-10" 
                                                    onClick={() => item.id && handleDeleteClick(item.id)}
                                                >
                                                    <Image  src="/images/delete.png" alt="delete" width={30} height={30} />
                                                </button>  
                                                 )}
                                            </div>
                                        </div>
                                        <hr className="w-full  border border-solid border-[#e8e8e8] my-5"/>
                                    </>
                                    ))
                                )}
                                <div ref={lastElementRef}></div>
                            </div>
                            <div className="lg:w-[25%] md:w-[35%] w-full common-col-flex justify-start bg-gradient-to-t from-[#F0F0F0] via-[#C3D8EA] to-[#77ACCC] backdrop-blur-md rounded-tr-lg rounded-br-lg py-10 px-8 text-lg shadow-md">
                                <div className="mb-[30px] text-[#FFFFFF] lg:text-[28px] text-[30px] font-bold">匯出格式</div>
                                <div className="common-col-flex justify-between lg:w-[200px] md:w-[180px] h-auto text-[#1D445D]">
                                    <button 
                                            className={`common-row-flex justify-center w-full h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#FFEEDD] hover:bg-[#FFC78E] hover:text-[#ffffff] border-2 border-solid border-[#eb980a]  text-center text-[20px] transition-all duration-300 hover:scale-110
                                                        ${favoriteData.length === 0 ? 'bg-gray-200 pointer-events-none  text-white' : ''}`} 
                                            onClick={() => {
                                                if (favoriteData.length > 0) {
                                                window.print();
                                                }
                                            }}
                                    >
                                    PDF檔
                                        <Image src="/images/file-pdf-solid.svg" alt="PDF" width={25} height={25} className="ml-[10px]"/>
                                    </button >
                                    <button 
                                            className={`common-row-flex justify-center  w-full  h-11 rounded-lg py-4.5  mt-5 mb-5 bg-[#D1E9E9] hover:bg-[#B3D9D9] hover:text-[#ffffff] border-2 border-solid border-[#1f5127]  text-center text-[20px] transition-all duration-300 hover:scale-110
                                                        ${favoriteData.length === 0 ? 'bg-gray-200 pointer-events-none text-white' : ''}`} 
                                            onClick={() => {
                                                if (favoriteData.length > 0) {
                                                window.print();
                                                }
                                            }}
                                    >
                                    CSV檔
                                        <Image src="/images/file-csv-solid.svg" alt="CSV" width={25} height={25} className="ml-[10px]"/>
                                    </button >
                                    <button 
                                            className={`common-row-flex justify-center w-full h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#D2E9FF] hover:bg-[#C4E1FF] hover:text-[#ffffff] border-2 border-solid border-[#19a8e6]  text-center text-[20px] transition-all duration-300 hover:scale-110
                                                        ${favoriteData.length === 0 ? 'bg-gray-200 pointer-events-none text-white' : ''}`} 
                                            onClick={() => {
                                                if (favoriteData.length > 0) {
                                                window.print();
                                                }
                                            }}
                                    >
                                    WORD檔
                                        <Image src="/images/file-word-solid.svg" alt="PDF" width={25} height={25} className="ml-[10px]"/>
                                    </button >
                                </div>
                            </div>
                        </div>
                    </div>


                </main>
            </>
          )}
        </>
    );
}
  

export default FavoriteContent;

import { useRouter } from 'next/navigation';
import { useState, useEffect,useCallback , useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { db } from '../lib/firebaseConfig';
import { collection,doc , query, where, orderBy, startAfter, limit, getDocs, addDoc, deleteDoc, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import { useFavorite} from '../contexts/FavoriteContext'; 
import { FirebaseFavoriteData} from '../lib/types';
import { useAuth } from '../contexts/AuthContext'; 

import HomePage  from '../page'; 


const FavoriteContent: React.FC = (): React.ReactElement | null  => {
    const { uid } = useAuth().user || {}; 
    const { state, fetchFavoriteData, addFavorite, removeFavorite} = useFavorite();

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const observer = useRef<IntersectionObserver>(null);
    const lastElementRef = useRef<HTMLDivElement>(null);
    const [favoriteData, setFavoriteData] = useState<FirebaseFavoriteData[]>([]);

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


    const handleDeleteClick = async (docId: string) => {
        if (!uid) return;

        try {
            await removeFavorite(docId);
            setFavoriteData(favoriteData.filter(item => item.id !== docId));
        } catch (error) {
            console.error('刪除失敗:', error);
        }
    };
    
  
    return (
        <> 
        {!uid  ? 
         <HomePage/>
          :( 
            <> 
                <main className="w-full h-auto flex flex-col  justify-center items-center flex-grow  bg-[#F0F0F0]" >
                    <div className="flex w-full h-auto relative">
                        <div className="flex  w-full h-[360px]"  style={{ backgroundImage: `url('images/favoritePage_banner.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}> 
                            <div className="relative top-0 left-0 w-full h-full z-10 flex items-center justify-center bg-black/10">
                                <div className="text-[#ffffff] font-bold text-[56px] text-center">收藏清單</div>  
                            </div>
                        </div>  
                    </div>
                    {/*收藏項目*/}
                    <div className="w-full flex flex-col min-h-screen bg-[rgba(255,255,255,0.2)] backdrop-blur-sm my-auto pt-5 pb-10 flex justify-center items-center mt-[20px]">
                        <div className="w-[1200px] flex min-h-screen  shadow-[0_0_5px_#AABBCC] rounded-lg">
                            <div className="w-full flex flex-col justify-start items-center bg-[rgba(255,255,255,0.6)] backdrop-blur-md py-7 px-8">
                                {favoriteData.length === 0 ? (
                                    <>
                                        <div className="text-2xl text-gray-600 text-center my-auto">目前無收藏機構，推薦前往搜尋頁進行挑選</div>
                                        <button 
                                            type="button" 
                                            className="w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-11  mb-10 hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]"
                                            onClick={()=>router.push('/search')} 
                                        >
                                        開始搜尋
                                        </button>
                                    </>
                                ) : (
                                favoriteData.map((item, index) => (
                                    <>
                                        <div key={index} className="h-auto w-full flex justify-between">
                                            <div className="relative w-[250px] h-[250px]  aspect-square flex items-center">
                                                {item.imageUrl && <div className="bg-cover bg-center w-full h-full" style={{backgroundImage: `url(${item.imageUrl})`}}></div>}
                                                {item.id && (
                                                    <button type="button" className="absolute top-[15px] left-[200px] z-10" onClick={() => item.id && handleDeleteClick(item.id)}>
                                                        <Image 
                                                            src="/images/heart_fill.svg" 
                                                            alt="collection" 
                                                            width={35} 
                                                            height={35} 
                                                            className="bg-[#FFFFFF] border-solid border-2  border-[#6898a5] rounded-full p-[2px]  transition-all duration-300 hover:scale-110 shadow-[0_0_5px_#6898a5]  hover:bg-transparent  hover:shadow-[0_0_3px_#6898a5]" 
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-col shrink-0 w-[500px] h-full mr-[10px]">
                                                <div className="flex flex-row justify-start items-center leading-12 mb-4">
                                                    <span className="font-bold text-lg text-[#1D445D] mr-1.5">機構名稱:</span>
                                                    <span className="text-lg text-[#1D445D] mr-1.5">{item.hosp_name}</span>
                                                </div>
                                                <div className="flex flex-row justify-start items-center leading-12 mb-4">
                                                    <span className="font-bold text-lg text-[#1D445D] mr-1.5 ">電話:</span>
                                                    <span className="text-lg text-[#1D445D] mr-1.5">{item.tel}</span>
                                                </div>
                                                <div className="flex flex-row justify-start items-center leading-12 mb-4">
                                                    <span className="font-bold text-lg text-[#1D445D] mr-1.5 ">地址:</span>
                                                    <span className="text-lg text-[#1D445D] mr-1.5">{item.hosp_addr}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="w-full  border border-solid border-[#e8e8e8] my-5"/>
                                    </>
                                    ))
                                )}
                                <div ref={lastElementRef}></div>
                            </div>
                            <div className="w-2/5 min-w-[285px] flex flex-col justify-start items-center bg-gradient-to-b  from-[#eff4f5]  to-[#c8d6da] backdrop-blur-md rounded-tr-lg rounded-br-lg py-10 px-8 text-lg shadow-md">
                                <div className="text-2xl mb-7.5 text-[#1D445D] font-bold mb-[30px]">匯出格式</div>
                                <div className="flex flex-col justify-between items-center w-[200px] h-auto text-[#1D445D] ">
                                    <button 
                                            className={`flex justify-center items-center w-full rounded-md py-4.5  h-11  mt-5 mb-5 bg-[#FFEEDD] hover:bg-[#FFC78E] hover:text-[#ffffff] border-2 border-solid border-[#eb980a]  text-center text-[20px] transition-all duration-300 hover:scale-110
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
                                            className={`flex justify-center items-center w-full rounded-md py-4.5  h-11  mt-5 mb-5 bg-[#D1E9E9] hover:bg-[#B3D9D9] hover:text-[#ffffff] border-2 border-solid border-[#1f5127]  text-center text-[20px] transition-all duration-300 hover:scale-110
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
                                            className={`flex justify-center items-center w-full rounded-md py-4.5  h-11  mt-5 mb-5 bg-[#D2E9FF] hover:bg-[#C4E1FF] hover:text-[#ffffff] border-2 border-solid border-[#19a8e6]  text-center text-[20px] transition-all duration-300 hover:scale-110
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

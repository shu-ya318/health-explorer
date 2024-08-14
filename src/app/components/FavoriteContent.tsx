import { useRouter } from 'next/navigation';
import { useState, useEffect,useCallback , useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { db } from '../lib/firebaseConfig';
import { collection,doc , query, where, orderBy, startAfter, limit, getDocs, addDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
import { useFavorite} from '../contexts/FavoriteContext'; 
import { FirebaseFavoriteData} from '../lib/types.js';
import { useAuth } from '../contexts/AuthContext'; 

import HomePage  from '../page'; 



const FavoriteContent: React.FC = (): React.ReactElement | null  => {
    const { user } = useAuth();
    const { state, addFavorite, removeFavorite} = useFavorite();

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
    const observer = useRef<IntersectionObserver>();
    const lastElementRef = useRef<HTMLDivElement>(null);
    const [favoriteData, setFavoriteData] = useState<FirebaseFavoriteData[]>([]);

    const router = useRouter();

   
    const fetchMoreData = useCallback(async () => {
        console.log('fetchMoreData called');
        if (loading || (!lastVisible && !isInitialLoad)) return;

        setLoading(true);
        try {
            const nextQuery = query(
                collection(db, 'favorites'),
                lastVisible ? startAfter(lastVisible) : limit(2)
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
                if (observer.current && lastElementRef.current) {
                    observer.current.unobserve(lastElementRef.current);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    }, [loading, lastVisible, isInitialLoad]);

    useEffect(() => {
        if (isInitialLoad) {
            fetchMoreData();
            setIsInitialLoad(false);
        }

        let currentObserver = observer.current;
        if (!currentObserver) {
            currentObserver = new IntersectionObserver(entries => {
                console.log('IntersectionObserver entry:', entries[0]);
                if (entries[0].isIntersecting && !loading && lastVisible) {
                    fetchMoreData();
                }
            }, { threshold: 1.0 });
            observer.current = currentObserver;
        }

        const currentElement = lastElementRef.current;
        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            console.log('Cleanup IntersectionObserver');
            if (currentObserver) {
                currentObserver.disconnect();
            }
        };
    }, [lastVisible, loading, fetchMoreData, isInitialLoad]);
    /*useEffect(() => {
        if (isInitialLoad) {
            fetchMoreData();
            setIsInitialLoad(false);
        }

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading && lastVisible) {
                fetchMoreData();
            }
        }, { threshold: 1.0 });

        if (lastElementRef.current) {
            observer.observe(lastElementRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [lastVisible, loading, fetchMoreData, isInitialLoad]); */


    const handleDeleteClick = async (docId: string) => {
        console.log('handleDeleteClick called:', docId);
        if (!user) return;

        try {
            await removeFavorite(docId);
            setFavoriteData(favoriteData.filter(item => item.id !== docId));
        } catch (error) {
            console.error('刪除失敗:', error);
        }
    };
    

    return (
        <> 
        {!user ? 
         <HomePage/>
          :( <> 
            <main className="w-full h-auto flex flex-col  justify-center items-center flex-grow  bg-[#F0F0F0]" >
                <div className="w-full flex flex-col min-h-screen bg-[rgba(255,255,255,0.2)] backdrop-blur-sm my-auto pt-5 pb-10 flex justify-center items-center">
                    <div className="max-w-7xl w-11/12 flex flex-row min-h-screen">
                        <div className="w-full flex flex-col justify-start items-center rounded-tl-lg bg-[rgba(255,255,255,0.6)] backdrop-blur-md py-7 px-8 text-lg shadow-md">
                            {favoriteData.length === 0 ? (
                                <>
                                    <div className="text-2xl text-gray-600 text-center my-auto">目前無收藏機構，推薦前往搜尋頁進行挑選</div>
                                    <button 
                                        type="button" 
                                        className="w-64 bg-[#24657d] rounded-md py-4.5 px-2.5  h-11  mb-10 hover:bg-[#7199a1] hover:text-black font-bold text-white text-center text-[20px]"
                                        onClick={()=>router.push('/Search')} 
                                    >
                                    開始搜尋
                                    </button>
                                </>
                            ) : (
                            favoriteData.map((item, index) => (
                                <>
                                    <div key={index} className="w-11/12 grid grid-cols-3 gap-5 relative ">
                                    {item.id && (
                                        <button type="button" onClick={() => item.id && handleDeleteClick(item.id)}>
                                            <Image 
                                                src="/images/heart_line.svg" 
                                                alt="collection" 
                                                width={40} 
                                                height={40} 
                                                className="hover:border-2 hover:bg-transparent absolute w-7.5 h-7.5 top-0 right-0 z-10 border-solid  border-[#6898a5] bg-[#FFFFFF] border-[10px] shadow-[0_0_10px_#6898a5] rounded-full" 
                                            />
                                        </button>
                                    )}
                                        <div className="relative w-full h-auto aspect-square flex justify-center items-center overflow-hidden">
                                            {item.imageUrl && <div className="bg-cover bg-center w-full h-full" style={{backgroundImage: `url(${item.imageUrl})`}}></div>}
                                        </div>
                                        <div className="w-full flex flex-col shrink-0">
                                            <div className="flex flex-row justify-start items-center leading-12">
                                                <span className="text-lg font-medium text-[#1D445D] mr-1.5">機構名稱:</span>
                                                <span className="text-lg font-medium text-[#1D445D] mr-1.5">{item.hosp_name}</span>
                                            </div>
                                            <div className="flex flex-row justify-start items-center leading-12">
                                                <span className="text-lg font-medium text-[#1D445D] mr-1.5">電話:</span>
                                                <span className="text-lg font-medium text-[#1D445D] mr-1.5">{item.tel}</span>
                                            </div>
                                            <div className="flex flex-row justify-start items-center leading-12">
                                                <span className="text-lg font-medium text-[#1D445D] mr-1.5">地址:</span>
                                                <span className="text-lg font-medium text-[#1D445D] mr-1.5">{item.hosp_addr}</span>
                                            </div>
                                            <div className="flex flex-row justify-start items-center leading-12">
                                                <span className="text-lg font-medium text-[#1D445D] mr-1.5">收藏日期:</span>
                                                <span className="text-lg font-medium text-[#1D445D]">{item.timestamp.toDate().toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-[#1D445D] my-5"></div>
                                </>
                                ))
                            )}
                        </div>
                        <div className="w-2/5 min-w-[285px] flex flex-col justify-start items-center bg-[rgba(182,227,255,0.6)] backdrop-blur-md rounded-tr-lg rounded-br-lg py-10 px-8 text-lg shadow-md">
                            <div className="text-2xl mb-7.5 text-[#1D445D] font-bold mb-[30px]">收藏清單輸出</div>
                            <button 
                                className={`w-full h-12 bg-[#6898a5] text-white text-3xl mt-8.5  rounded-md flex justify-center items-center hover:bg-[#36B2D8] active:bg-[#3686A5] ${favoriteData.length === 0 ? 'bg-gray-400 pointer-events-none' : ''}`} 
                                onClick={() => {
                                    if (favoriteData.length > 0) {
                                      window.print();
                                    }
                                }}
                            >
                            列印或儲存成PDF檔
                            </button >
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
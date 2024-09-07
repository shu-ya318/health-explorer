import { 
    Fragment,
    useState, 
    useEffect,
    useCallback, 
    useRef
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { UserType } from "../hooks/useAuth"; 

import { db } from "../lib/firebaseConfig";
import { 
    collection
    , query
    , where
    , startAfter
    , limit
    , getDocs
    , DocumentSnapshot
} from "firebase/firestore";
import { FirebaseFavoriteData } from "../lib/types";

interface FavoriteDataDisplayProps {
    user: UserType | null;
    favoriteData: FirebaseFavoriteData[];
    setFavoriteData: React.Dispatch<React.SetStateAction<FirebaseFavoriteData[]>>; 
    handleDeleteClick: (id: string) => void;
}

const FavoriteDataDisplay: React.FC<FavoriteDataDisplayProps> = ({ 
    user,
    favoriteData,
    setFavoriteData,
    handleDeleteClick
}) => {
    const router = useRouter();

    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    
    const observer = useRef<IntersectionObserver>(null);
    const lastElementRef = useRef<HTMLDivElement>(null);

    const fetchMoreData = useCallback(async (): Promise<void> => {
        console.log("Attempting to fetch data", { userId: user?.uid, loading, lastVisible, isInitialLoad, allDataLoaded });
    
        if (!user?.uid || loading || (!lastVisible && !isInitialLoad) || allDataLoaded) {
            console.log("Fetch aborted", { reason: !user?.uid ? 'No user' : loading ? 'Currently loading' : (!lastVisible && !isInitialLoad) ? 'No more data and not initial load' : 'All data loaded' });
            return;
        }
    
        setLoading(true);
    
        try {
            const constraints = [
                where("userId", "==", user.uid),
                lastVisible ? startAfter(lastVisible) : limit(3),
                limit(3)
            ];
            const nextQuery = query(collection(db, "favorites"), ...constraints);
            const documentSnapshots = await getDocs(nextQuery);
    
            if (documentSnapshots.docs.length > 0) {
                const newData = documentSnapshots.docs.map(doc => ({ ...doc.data() as FirebaseFavoriteData, id: doc.id }));
                setFavoriteData(prev => {
                    console.log("Updating favoriteData:", prev, newData);
                    return [...prev, ...newData];
                });
                setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            } else {
                setAllDataLoaded(true);
                console.log("All data has been loaded, no more fetches.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            console.log("Fetch completed or failed, loading set to false.");
        }
    }, [user?.uid, loading, lastVisible, isInitialLoad, allDataLoaded, setFavoriteData]);

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
            console.log("Cleanup: lastVisible", lastVisible);
            observer.disconnect();
        };
    }, [lastVisible, loading, fetchMoreData, isInitialLoad, allDataLoaded]);

    return (
        <> 
            <div className="lg:w-[75%] md:w-[65%] w-full common-col-flex lg:justify-start justify-center py-7 xxs:px-8 bg-[#FFFFFF] backdrop-blur-md md:rounded-l-lg md:rounded-r-none rounded-t-lg">
                {favoriteData.length === 0 ? (
                    <>
                        <div className="text-2xl text-gray-600 text-center md:my-auto mb-[60px] pt-[30px]">尚無收藏機構</div>
                        <button
                            onClick={()=>router.push('/search')}  
                            type="button" 
                            className="sm:w-64 w-[55%] min-w-[130px] h-11 py-4.5 px-2.5 mb-[60px] common-button"
                        >
                        開始搜尋
                        </button>
                    </>
                ) : (
                favoriteData.map((item) => (
                    <Fragment key={item.id} >  
                        <div className="grid lg:grid-cols-custom fill-column w-full mx-auto">
                            <div className="relative lg:w-[180px] xss:w-[85%] w-[90%] lg:h-[180px] h-[300px] xxs:pl-0 mx-auto pl-[10px] common-row-flex aspect-square">
                                {item.imageUrl && (
                                    <Image
                                        src={item.imageUrl}
                                        alt="institution"
                                        fill={true}
                                        sizes="(min-width: 1024px) 180px, (min-width: 360px) 85%, 90%"
                                        onLoad={() => setLoadedImages(prev => ({...prev, [item.imageUrl]: true}))}
                                        style={loadedImages[item.imageUrl] ? {} : {backgroundImage: "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)"}}
                                        className="w-full h-full bg-contain bg-center bg-no-repeat"
                                    />
                                )}
                                {item.id && (
                                    <div className="absolute top-[7px] right-[10px] lg:left-[145px] z-10 w-[30px] h-[30px]">
                                        <Image 
                                            src="/images/diamond_selected.png" 
                                            alt="collection" 
                                            width={30} 
                                            height={30}
                                            className="p-[2px] favorite-button-add rounded-full"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="relative flex w-full lg:ml-[10px] lg:mr-0">
                                <div className="flex flex-col w-[85%] h-auto text-[#2D759E] xl:text-base lg:text-sm text-lg leading-12 lg:m-0 mx-auto mt-[15px]">
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
                                    onClick={() => item.id && handleDeleteClick(item.id)}
                                    type="button"
                                    className="absolute lg:top-0 lg:right-0 lg:left-auto md:left-[30px] sm:left-[33px] xxs:left-[25px] left-[20px] xxs:bottom-[-135px] bottom-[-130px] min-h-[150px] z-10 flex" 
                                >
                                    <Image  
                                        src="/images/delete.png" 
                                        alt="delete" 
                                        width={30} 
                                        height={30} 
                                    />
                                </button>  
                                )}
                            </div>
                        </div>
                        <hr className="w-full my-5 border border-solid border-[#e8e8e8]"/>
                    </Fragment>
                    ))
                )}
                <div ref={lastElementRef}></div>
            </div>
        </>
    );
}

export default FavoriteDataDisplay;
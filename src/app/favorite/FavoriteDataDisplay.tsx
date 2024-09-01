import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FirebaseFavoriteData } from "../lib/types";

interface FavoriteDataDisplayProps {
    favoriteData: FirebaseFavoriteData[];
    loadedImages: Record<string, boolean>;
    setLoadedImages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    lastElementRef: React.RefObject<HTMLDivElement>;
    handleDeleteClick: (id: string) => void;
}

const FavoriteDataDisplay: React.FC<FavoriteDataDisplayProps> = ({ 
    favoriteData, 
    loadedImages,
    setLoadedImages,
    lastElementRef,
    handleDeleteClick
}) => {
    const router = useRouter();
    useEffect(() => {
        console.log("Received new favoriteData in display:", favoriteData);
    }, [favoriteData]);
    return (
        <> 
            <section className="common-col-flex justify-start lg:w-[75%] md:w-[65%] w-full py-7 xss:px-8 bg-[#FFFFFF] backdrop-blur-md md:rounded-l-lg rounded-t-lg">
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
                        <div className="grid lg:grid-cols-custom fill-column w-[98%] mx-auto">
                            <div className="relative lg:w-[180px] xss:w-[85%] w-[90%] lg:h-[180px] h-[300px] xss:pl-0 pl-[10px] common-row-flex aspect-square">
                                {item.imageUrl && (
                                    <Image
                                        src={item.imageUrl}
                                        alt="institution"
                                        fill={true}
                                        sizes="(min-width: 1024px) 180px, (min-width: 360px) 85%, 90%"
                                        onLoad={() => setLoadedImages(prev => ({...prev, [item.imageUrl]: true}))}
                                        style={loadedImages[item.imageUrl] ? {} : {backgroundImage: 'linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)'}}
                                        className="w-full h-full common-bg-image"
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
                                    onClick={() => item.id && handleDeleteClick(item.id)}
                                    type="button"
                                    className="absolute lg:top-0 lg:right-0 z-10 xss:bottom-[-135px] bottom-[-130px] min-h-[150px] flex" 
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
            </section>
        </>
    );
}

export default FavoriteDataDisplay;
import Image from 'next/image';
import {Configure, useHits} from "react-instantsearch";


export const finalHit: React.FC = ({ hit }: any) => {
    

    return (
            <>
                <div className="h-[320px] flex flex-col border border-gray-300 rounded-lg overflow-hidden w-[250px] bg-[#ffffff] shadow-[0_0_3px_#AABBCC] hover:shadow-[0_0_10px_#AABBCC]">
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
                        <Image
                            className="absolute top-1.5 right-1.5 z-10 border-solid border-2 border-[#6898a5] rounded-full"
                            src="/images/heart_line.svg"
                            alt="collection"
                            width={40}
                            height={40}
                        />
                    </div>
                    <div className="w-full h-[30px] text-black text-left font-bold my-[20px] mx-[10px] pr-[15px]">{hit.hosp_name}</div>
                    <div className="w-full h-[30px] flex items-center justify-end">
                        <Image src="/images/eye-regular.svg" alt="view" width={20} height={20} />
                        <span className="ml-2 text-black mr-[10px]">觀看數:{hit.view}</span>
                    </div>
                </div>
            </>
        );
};

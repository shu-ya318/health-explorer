import { useState, useRef } from "react";
import Image from "next/image";

interface SearchInputProps {
    handleSearch: (searchTerm: string) => Promise<void>;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
    handleSearch
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const deleteSearchInput = () => {
        setSearchTerm(""); 
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleSearchClick = () => {
        if (!searchTerm.trim()) return;
        handleSearch(searchTerm);
    };
  
    return (
        <div className="w-full h-10 mt-[60px] mb-[30px]"> 
            <div className="max-w-[760px] w-full h-full flex mx-auto"> 
                <div className="relative w-full h-full flex">
                    <input
                        className="h-full flex-grow px-4 xs:text-[18px] text-[14px] font-bold text-gray-500 common-border border shadow-[0_0_3px_#AABBCC] rounded-l-md"
                        type="text"
                        placeholder="請輸入關鍵字才能搜尋"
                        ref={searchInputRef}
                        value={searchTerm} 
                        onChange={event => setSearchTerm(event.target.value)}
                    />
                    <button
                        onClick={deleteSearchInput} 
                        type="button"
                        className="absolute top-2 right-10 z-10 hover:scale-110"
                    >
                        <Image 
                            src="/images/xmark-solid.svg" 
                            alt="close" 
                            width={15} 
                            height={20} 
                            className="w-auto h-[20px]"
                        />
                    </button>                               
                </div>
                <button
                    onClick={handleSearchClick}
                    type="button" 
                    className="w-32 h-full common-row-flex justify-center flex-grow bg-[#2D759E] hover:bg-[#5B98BC] rounded-r-md text-white font-bold xs:text-[18px] text-[0px]"
                >
                    <Image 
                        className="xs:w-auto w-[30%] h-auto xs:mr-[7px]" 
                        src="/images/search.png" 
                        alt="search" 
                        width={30} 
                        height={30}
                    />
                    搜尋
                </button>
            </div>
        </div>
    );
};

export default SearchInput;
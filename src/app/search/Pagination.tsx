"use client";

import {useState, useEffect} from "react";
import Image from "next/image";

interface PaginationProps {
  postsPerPage: number;
  totalPosts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ 
    postsPerPage, 
    totalPosts, 
    paginate, 
    currentPage 
}) => {
    const [pageNumbers, setPageNumbers] = useState<number[]>([]);
    const [pageNumberLimit, setPageNumberLimit] = useState(8);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit);

    useEffect(() => {
        const updatePageNumberLimit = () => {
            const width = window.innerWidth;
            if (width >= 640) {
                setPageNumberLimit(8);
            } else if (width <= 639 && width > 479) {
                setPageNumberLimit(5);
            } else if (width <= 479 && width > 359) {
                setPageNumberLimit(2);
            } else {
                setPageNumberLimit(1);
            }
        };
    
        window.addEventListener("resize", updatePageNumberLimit);
        updatePageNumberLimit(); 
    
        return () => {
            window.removeEventListener("resize", updatePageNumberLimit);
        };
    }, []);

    //確保元件首次渲染，會使用更新計算的pageNumbers
    useEffect(() => {
        const newPageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
            newPageNumbers.push(i);
        }
        setPageNumbers(newPageNumbers);
        setMaxPageNumberLimit(pageNumberLimit);
        setMinPageNumberLimit(0);
    }, [pageNumberLimit, postsPerPage, totalPosts]);


    const handleFirstPage = () => {
        paginate(1);
        setMinPageNumberLimit(0);
        setMaxPageNumberLimit(pageNumberLimit);
    };

    const handleLastPage = () => {
        const lastPageNumber = pageNumbers.length;
        paginate(lastPageNumber);
        setMinPageNumberLimit(lastPageNumber - pageNumberLimit);
        setMaxPageNumberLimit(lastPageNumber);
    };


    const handlePrevbtn = () => {
        paginate(currentPage - 1);

        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        }
    };

    const handleNextbtn = () => {
    paginate(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
    }
    };


    return (
        <div className="w-full max-w-[750px] min-h-[40px] flex flex-row justify-center mt-[20px] mb-[40px] mx-auto">
            <div className="md:w-[88px] sm:w-[78px] xs:w-[78px] w-[90px] h-[40px] flex justify-between">
                <button
                    onClick={handleFirstPage}
                    type="button"
                    disabled={currentPage === 1}
                    className={`pagination-button md:w-[40px] xs:w-[33px] w-[40px] h-full p-[10px]
                                ${currentPage === 1 ? "bg-gray-300" : "hover:bg-[#5B98BC]"}`}
                >
                    <Image 
                        src="/images/angles-left-solid.svg" 
                        alt="FirstPage" 
                        width={20} 
                        height={20} 
                        className="w-[20px] h-auto object-cover"
                    />
                </button>
                <button
                    onClick={handlePrevbtn}
                    type="button"
                    disabled={currentPage === 1}
                    className={`pagination-button md:w-[40px] xs:w-[33px] w-[40px] h-full py-[10px] md:px-[13px] px-[12px] 
                                ${currentPage === 1 ? "bg-gray-300" : "hover:bg-[#5B98BC]"}`}
                >
                    <Image 
                        src="/images/angle-left-solid.svg" 
                        alt="PreviousPage" 
                        width={12} 
                        height={12} 
                        className="w-[12px] h-auto object-cover"
                    />
                </button>
            </div>
            <div className="md:w-full md:max-w-[500px] max-w-[430px] h-full flex flex-row justify-center m-auto">
                {pageNumbers.map(number => {
                    if (number <= maxPageNumberLimit && number > minPageNumberLimit) {
                        return (
                            <button  
                                onClick={() => paginate(number)} 
                                type="button"
                                key={number} 
                                className={`md:w-[40px] xs:w-[33px] w-[40px] h-[40px] flex mx-[10px] md:mb-0 mb-[10px] rounded-md 
                                            ${currentPage === number ? "bg-[#9FC5DF] text-white" : "bg-[#e6e6e6] hover:bg-[#9FC5DF]"} `}
                            >
                                <div className="text-center m-auto">{number}</div>
                            </button>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
            <div className="md:w-[88px] sm:w-[78px] xs:w-[78px] w-[90px] h-[40px] flex justify-between">
                <button
                    onClick={handleNextbtn}
                    type="button"
                    disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
                    className={`pagination-button md:w-[40px] xs:w-[33px] w-[40px] h-full py-[10px] md:px-[13px] px-[12px]
                            ${currentPage === pageNumbers[pageNumbers.length - 1] ? "bg-gray-300" : "hover:bg-[#5B98BC]"} `}
                >
                    <Image 
                        src="/images/angle-right-solid.svg" 
                        alt="NextPage" 
                        width={12} 
                        height={12} 
                        className="w-[12px] h-auto object-cover"
                    />
                </button>
                <button
                    onClick={handleLastPage}
                    disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
                    className={`pagination-button md:w-[40px] xs:w-[33px] w-[40px] h-full p-[10px] 
                                ${currentPage === pageNumbers[pageNumbers.length - 1] ? "bg-gray-300" : "hover:bg-[#5B98BC]"} `}
                >
                    <Image 
                        src="/images/angles-right-solid.svg" 
                        alt="LastPage" 
                        width={20} 
                        height={20} 
                        className="w-[20px] h-auto object-cover"/>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
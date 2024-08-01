'use client';
import {useState} from 'react';
import Image from 'next/image';

interface PaginationProps {
  postsPerPage: number;
  totalPosts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers: number[] = [];
    const pageNumberLimit = 8;
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);


    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    const handlePrevbtn = () => {
        paginate(currentPage - 1);

        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };
    const handleFirstPage = () => {
        paginate(1);
        setMaxPageNumberLimit(pageNumberLimit);
        setMinPageNumberLimit(0);
    };

    const handleNextbtn = () => {
    paginate(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
    };
    const handleLastPage = () => {
        const lastPageNumber = pageNumbers.length;
        paginate(lastPageNumber);
        setMaxPageNumberLimit(lastPageNumber);
        setMinPageNumberLimit(lastPageNumber - pageNumberLimit);
    };


    return (
        <div className="w-full flex justify-center h-[40px] my-[40px]">
            <div className="w-[88px] flex justify-between h-full">
                <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className={`border-solid border border-[#6898a5] ${currentPage === 1 ? 'bg-gray-300' : 'hover:bg-[#6898a5]'} rounded-md w-[40px] p-[10px]`}
                >
                    <Image src="/images/placeholder.png" alt="First Page" width={20} height={20} />
                </button>
                <button
                    onClick={handlePrevbtn}
                    disabled={currentPage === 1}
                    className={`border-solid border border-[#6898a5] ${currentPage === 1 ? 'bg-gray-300' : 'hover:bg-[#6898a5]'} rounded-md w-[40px] p-[10px]`}
                >
                    <Image src="/images/placeholder.png" alt="Previous Page" width={20} height={20} />
                </button>
            </div>
            <div className="w-[528px] h-full flex justify-start px-[10px] mx-[24px]">
                {pageNumbers.map(number => {
                    if (number <= maxPageNumberLimit && number > minPageNumberLimit) {
                        return (
                            <button key={number} onClick={() => paginate(number)} className={`${currentPage === number ? 'bg-[#acb8b6] text-white' : 'bg-[#e6e6e6] hover:bg-[#acb8b6]'} rounded-md w-[40px] p-[10px] mx-[10px] `}>
                                {number}
                            </button>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
            <div className="w-[88px] flex justify-between h-full">
                <button
                    onClick={handleNextbtn}
                    disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
                    className={`border-solid border border-[#6898a5] ${currentPage === pageNumbers[pageNumbers.length - 1] ? 'bg-gray-300' : 'hover:bg-[#6898a5]'} rounded-md w-[40px] p-[10px]`}
                >
                    <Image src="/images/placeholder.png" alt="Next Page" width={20} height={20} />
                </button>
                <button
                    onClick={handleLastPage}
                    disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
                    className={`border-solid border border-[#6898a5] ${currentPage === pageNumbers[pageNumbers.length - 1] ? 'bg-gray-300' : 'hover:bg-[#6898a5]'} rounded-md w-[40px] p-[10px]`}
                >
                    <Image src="/images/placeholder.png" alt="Last Page" width={20} height={20} />
                </button>
            </div>
        </div>
    );
    };


export default Pagination;

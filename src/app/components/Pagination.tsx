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
        <div className="flex xss:flex-row common-col-flex justify-center w-full max-w-[750px] min-h-[40px] mt-[20px] mb-[40px] mx-auto">
            <div className="w-[88px] flex justify-between h-full">
                <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className={`pagination-button p-[10px] ${currentPage === 1 ? 'bg-gray-300' : 'hover:bg-[#5B98BC]'}`}
                >
                    <Image src="/images/angles-left-solid.svg" alt="First Page" width={20} height={20} />
                </button>
                <button
                    onClick={handlePrevbtn}
                    disabled={currentPage === 1}
                    className={`pagination-button py-[10px]  px-[13px] ${currentPage === 1 ? 'bg-gray-300' : 'hover:bg-[#5B98BC]'}`}
                >
                    <Image src="/images/angle-left-solid.svg" alt="Previous Page" width={12} height={12} />
                </button>
            </div>
            <div className="sm:w-[500px] xs:w-[250px] w-[120px] h-full flex flex-row flex-wrap justify-start xss:m-auto my-[10px]">
                {pageNumbers.map(number => {
                    if (number <= maxPageNumberLimit && number > minPageNumberLimit) {
                        return (
                            <button 
                                key={number} 
                                onClick={() => paginate(number)} 
                                className={`flex w-[40px] h-[40px] mx-[10px] md:mb-0 mb-[10px] rounded-md ${currentPage === number ? 'bg-[#9FC5DF] text-white' : 'bg-[#e6e6e6] hover:bg-[#9FC5DF]'} `}
                            >
                                <div className="text-center m-auto">{number}</div>
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
                    className={`pagination-button py-[10px] px-[13px] ${currentPage === pageNumbers[pageNumbers.length - 1] ? 'bg-gray-300' : 'hover:bg-[#5B98BC]'} `}
                >
                    <Image src="/images/angle-right-solid.svg" alt="Next Page" width={12} height={12} />
                </button>
                <button
                    onClick={handleLastPage}
                    disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
                    className={`pagination-button p-[10px] ${currentPage === pageNumbers[pageNumbers.length - 1] ? 'bg-gray-300' : 'hover:bg-[#5B98BC]'} `}
                >
                    <Image src="/images/angles-right-solid.svg" alt="Last Page" width={20} height={20} />
                </button>
            </div>
        </div>
    );
    };


export default Pagination;
import Image from "next/image";

interface FavoriteExporterProps {
    prepareAndExportToPDF: () => Promise<void>;
    prepareAndExportToCSV: () => Promise<void>;
    prepareAndExportToDocx: () => Promise<void>;
    isDataEmpty: boolean;
}

const FavoriteExporter: React.FC<FavoriteExporterProps> = ({
    prepareAndExportToPDF,
    prepareAndExportToCSV,
    prepareAndExportToDocx,
    isDataEmpty
}) => {
    return (
        <div className="common-col-flex justify-start lg:w-[25%] md:w-[35%] w-full py-10 px-8 bg-gradient-to-t from-[#F0F0F0] via-[#C3D8EA] to-[#77ACCC] backdrop-blur-md md:rounded-r-lg md:rounded-l-none rounded-b-lg text-lg shadow-md">
            <div className="mb-[30px] text-[#FFFFFF] lg:text-[28px] text-[30px] font-bold">匯出格式</div>
            <div className="common-col-flex justify-between lg:w-[200px] md:w-[180px] w-[55%] min-w-[130px] h-auto text-[#1D445D]">
                <button
                    onClick={prepareAndExportToPDF}
                    type="button"  
                    className={`common-row-flex justify-center w-full h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#FFEEDD] hover:bg-[#FFC78E] hover:text-[#ffffff] border-2 border-solid border-[#eb980a] text-center text-[20px] cursor-pointer transition-all duration-300 hover:scale-110
                                ${isDataEmpty ? "bg-gray-200 pointer-events-none text-white" : ""}`} 
                    disabled={isDataEmpty}
                >
                    PDF
                    <Image 
                        src="/images/file-pdf-solid.svg" 
                        alt="PDF" 
                        width={25} 
                        height={25} 
                        className="w-[25px] h-[25px] ml-[10px]"
                    />
                </button>
                <button
                        onClick={prepareAndExportToCSV}
                        type="button"  
                        className={`common-row-flex justify-center w-full min-w-[130px] h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#D1E9E9] hover:bg-[#B3D9D9] hover:text-[#ffffff] border-2 border-solid border-[#1f5127] text-center text-[20px] transition-all duration-300 hover:scale-110
                                    ${isDataEmpty ? "bg-gray-200 pointer-events-none text-white" : ""}`} 
                        disabled={isDataEmpty}
                >
                    CSV
                    <Image 
                        src="/images/file-csv-solid.svg" 
                        alt="CSV" 
                        width={25} 
                        height={25} 
                        className="w-[25px] h-[25px] ml-[10px]"
                    />
                </button >
                <button 
                        onClick={prepareAndExportToDocx}
                        type="button" 
                        className={`common-row-flex justify-center w-full min-w-[130px] h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#D2E9FF] hover:bg-[#C4E1FF] hover:text-[#ffffff] border-2 border-solid border-[#19a8e6] text-center text-[20px] transition-all duration-300 hover:scale-110
                                    ${isDataEmpty ? "bg-gray-200 pointer-events-none text-white" : ""}`} 
                        disabled={isDataEmpty}
                >
                    WORD
                    <Image 
                        src="/images/file-word-solid.svg" 
                        alt="WORD" 
                        width={25} 
                        height={25} 
                        className="w-[25px] h-[25px] ml-[10px]"
                    />
                </button >
            </div>
        </div>
    );
};

export default FavoriteExporter;
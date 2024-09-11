import Image from "next/image";

import { FavoriteState } from "../hooks/useFavorite";

import { FirebaseFavoriteData } from "../lib/types";

import { 
    Font,
    pdf, 
    Document as PDFDocument, 
    Page, 
    Text, 
    View, 
    StyleSheet 
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun 
} from "docx";

interface FavoriteExporterProps {
    isDataEmpty: boolean;
    state: FavoriteState;
}

const FavoriteExporter: React.FC<FavoriteExporterProps> = ({
    state,
    isDataEmpty
}) => {
    //匯出前，確保取得所有收藏資料，非僅當前滾動頁面資料
    Font.register({
        family: "NotoSansTC",
        fonts: [
            { src: "/fonts/NotoSansTC-Regular.ttf", fontWeight: "normal" },
            { src: "/fonts/NotoSansTC-Bold.ttf", fontWeight: "bold" },
        ]
    });

    const styles = StyleSheet.create({
        header: {
            fontFamily: "NotoSansTC",
            fontWeight: "bold"
        },
        content: {
            fontFamily: "NotoSansTC",
            fontWeight: "normal"
        }
    });

    const exportToPDF = (data: FirebaseFavoriteData[]) => {
        const doc = (
            <PDFDocument>
                <Page size="A4">
                    {data.map(item => (
                        <View 
                            key={item.id} 
                            style={{ marginTop: 5, marginBottom: 20, marginLeft: 20 }}
                        >
                            <Text style={styles.header}>名稱:</Text>
                            <Text style={styles.content}>{item.hosp_name}</Text>
                            <Text style={styles.header}>電話:</Text>
                            <Text style={styles.content}>{item.tel}</Text>
                            <Text style={styles.header}>地址:</Text>
                            <Text style={styles.content}>{item.hosp_addr}</Text>
                        </View>
                    ))}
                </Page>
            </PDFDocument>
        );
        return doc;
    };

    const prepareAndExportToPDF = async (): Promise<void> => {
        const allData = state.favorites; 
        const doc = exportToPDF(allData); 

        const pdfInstance = pdf();
        pdfInstance.updateContainer(doc); 

        const blob = await pdfInstance.toBlob(); 
        const url = URL.createObjectURL(blob); 

        const link = document.createElement("a");
        link.href = url;
        link.download = "FavoriteData.pdf";
        link.click();
        URL.revokeObjectURL(url); 
    };


    const exportToCSV = (data: FirebaseFavoriteData[]) => {
        const headers = "名稱,電話,地址\n";
        const rows = data.map(item =>
            `"${item.hosp_name}","${item.tel}","${item.hosp_addr}"\n`
        ).join('');
        const csvContent = `data:text/csv;charset=utf-8,\uFEFF${headers}${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "FavoriteData.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const prepareAndExportToCSV = async (): Promise<void>  => {
        const allData = state.favorites;
        exportToCSV(allData);
    };


    const exportToDocx = (data: FirebaseFavoriteData[]) => {
        const paragraphs = data.map(item => {
            return new Paragraph({
                spacing: { after: 240 },  
                children: [
                    new TextRun({ text: "名稱:", bold: true }),
                    new TextRun({ text: `${item.hosp_name}\n`, bold: false }),
                    new TextRun({ text: "電話:", bold: true }), 
                    new TextRun({ text: `${item.tel}\n`, bold: false }),
                    new TextRun({ text: "地址", bold: true }),
                    new TextRun({ text: `${item.hosp_addr}\n`, bold: false })
                ]
            });
        });

        const doc = new Document({
            sections: [{
                children: paragraphs
            }]
        });

        return Packer.toBlob(doc);
    };

    const prepareAndExportToDocx = async (): Promise<void> => {
        const allData = state.favorites;
        const blob = await exportToDocx(allData);
        saveAs(blob, "FavoriteData.docx");
    };

    
    return (
        <section className="common-col-flex justify-start lg:w-[25%] md:w-[35%] w-full py-10 px-8 bg-gradient-to-t from-[#F0F0F0] via-[#C3D8EA] to-[#77ACCC] backdrop-blur-md md:rounded-r-lg md:rounded-l-none rounded-b-lg text-lg shadow-md">
            <div className="mb-[30px] text-[#FFFFFF] lg:text-[28px] text-[30px] font-bold">匯出格式</div>
            <div className="common-col-flex justify-between lg:w-[200px] md:w-[180px] w-[55%] min-w-[130px] h-auto text-[#1D445D]">
                <button
                    onClick={prepareAndExportToPDF}
                    type="button"  
                    className={`common-row-flex justify-center w-full h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#FFEEDD] hover:bg-[#FFC78E] hover:text-[#FFFFFF] border-2 border-solid border-[#EB980A] text-center text-[20px] cursor-pointer transition-all duration-300 hover:scale-110
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
                        className={`common-row-flex justify-center w-full min-w-[130px] h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#D1E9E9] hover:bg-[#B3D9D9] hover:text-[#FFFFFF] border-2 border-solid border-[#1F5127] text-center text-[20px] transition-all duration-300 hover:scale-110
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
                </button>
                <button 
                        onClick={prepareAndExportToDocx}
                        type="button" 
                        className={`common-row-flex justify-center w-full min-w-[130px] h-11 rounded-lg py-4.5 mt-5 mb-5 bg-[#D2E9FF] hover:bg-[#C4E1FF] hover:text-[#FFFFFF] border-2 border-solid border-[#19A8E6] text-center text-[20px] transition-all duration-300 hover:scale-110
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
                </button>
            </div>
        </section>
    );
};

export default FavoriteExporter;
import { 
    useState, 
    useEffect,
    useCallback, 
    useRef
} from "react";
import Image from "next/image";

import { useFavorite } from "../hooks/useFavorite";
import { useAuth } from "../hooks/useAuth"; 

import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import FavoriteDataDisplay from "./FavoriteDataDisplay";
import FavoriteExporter from "./FavoriteExporter";

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
import HomePage  from "../page"; 

import { motion, AnimatePresence } from "framer-motion"; 
import RingLoader from "react-spinners/RingLoader";

const FavoriteContent: React.FC = () => {
    const { uid } = useAuth().user || {}; 
    const { state, removeFavorite } = useFavorite();

    const [openLoading, setOpenLoading] = useState<boolean>(true);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [favoriteData, setFavoriteData] = useState<FirebaseFavoriteData[]>([]);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const observer = useRef<IntersectionObserver>(null);
    const lastElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
          setOpenLoading(false);
        }, 1500);
    
        return () => clearTimeout(timer);
    }, []);


    const fetchMoreData = useCallback(async () => {
        if (! uid || loading || (!lastVisible && !isInitialLoad) || allDataLoaded) return;

        setLoading(true);

        try {
            const nextQuery = query(
                collection(db, "favorites"),
                where("userId", "==", uid),
                lastVisible ? startAfter(lastVisible) : limit(3),
                limit(3)
            );
            const documentSnapshots = await getDocs(nextQuery);

            if (documentSnapshots.docs.length > 0) {
                const newData = documentSnapshots.docs.map(doc => ({ ...doc.data()as FirebaseFavoriteData, id: doc.id }));
                setFavoriteData(prev => {
                    console.log("Updating favoriteData:", prev, newData);
                    return [...prev, ...newData];
                });
                setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
            } else {
                setAllDataLoaded(true);
                if (observer.current && lastElementRef.current) {
                    observer.current.unobserve(lastElementRef.current);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally{
            setLoading(false);
        }
    }, [uid,loading, lastVisible, isInitialLoad, allDataLoaded]);

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
    

    const handleDeleteClick = (docId: string) => {
        setSelectedId(docId);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId || !uid) return;
    
        try {
            await removeFavorite(selectedId);
            //確保即時更新favoriteData，重渲染反映在UI
            setFavoriteData(prevData => prevData.filter(item => item.id !== selectedId));
        } catch (error) {
            console.error(error);
        } finally {
            setIsConfirmModalOpen(false);
        }
    };

    const handleCloseModal = () => {
        setIsConfirmModalOpen(false);
    };
    

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

    const prepareAndExportToPDF = async () => {
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

    const prepareAndExportToCSV = async () => {
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

    const prepareAndExportToDocx = async () => {
        const allData = state.favorites;
        const blob = await exportToDocx(allData);
        saveAs(blob, "FavoriteData.docx");
    };

    return ( 
        <>   
            {!uid  ? 
                <HomePage/>
            :( 
                <>
                    { !favoriteData && openLoading ? (
                        <div className="h-screen common-row-flex justify-center bg-[#FFFFFF]">
                            <RingLoader 
                                size="300px" 
                                color="#24657d"
                            />
                        </div>
                    ) : (
                        <AnimatePresence>
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                            >
                                <main className="w-full h-auto common-col-flex justify-center">
                                    {isConfirmModalOpen && (
                                        <ConfirmDeleteModal 
                                            isOpen={isConfirmModalOpen} 
                                            handleConfirmDelete={handleConfirmDelete} 
                                            handleCloseModal={handleCloseModal} 
                                        />
                                    )}   
                                    <div className="relative w-full h-auto flex">
                                        <div className="relative w-full h-[360px] flex flex-col "> 
                                            <Image 
                                                src="/images/favoritePage_banner.jpg" 
                                                alt="icon" 
                                                fill={true} 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 w-full h-full bg-gray-900 bg-opacity-20">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[#FFFFFF] text-center sm:text-[56px] xs:text-[48px] text-[37px]">收藏清單</div>  
                                            </div>
                                        </div>  
                                    </div>
                                    <div className="common-col-flex justify-center w-full min-h-screen bg-[#F0F0F0] backdrop-blur-sm my-auto pt-5 pb-10">
                                        <div className="xl:w-full max-w-[1180px] lg:w-[90%] xs:w-[80%] w-[95%] flex md:flex-row flex-col min-h-screen shadow-[0_0_10px_#AABBCC] rounded-lg">
                                            <FavoriteDataDisplay 
                                                favoriteData={favoriteData}
                                                loadedImages={loadedImages} 
                                                setLoadedImages={setLoadedImages} 
                                                lastElementRef={lastElementRef}
                                                handleDeleteClick={handleDeleteClick}
                                            />
                                            <FavoriteExporter 
                                                prepareAndExportToPDF={prepareAndExportToPDF}
                                                prepareAndExportToCSV={prepareAndExportToCSV}
                                                prepareAndExportToDocx={prepareAndExportToDocx}
                                                isDataEmpty={favoriteData.length === 0}
                                            />
                                        </div>
                                    </div>
                                </main>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </>
            )}
        </> 
    )
};

export default FavoriteContent;
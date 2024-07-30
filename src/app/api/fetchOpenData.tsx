import { FirebaseInstitutionData } from '../lib/types';
import {db} from '../lib/firebaseConfig';
import { collection, doc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore';

// (一)取得資料: 1.自行輸入: 定義實際資料   2.API:  定義資料的統一格式 -> 定義新增屬性 作為 新增欄位內容 -> 定義call API函式，呼叫前2個函式   
const cervicalCancerData: FirebaseInstitutionData[] = [
    {
      hosp_name: "新北市立聯合醫院",
      tel: "02-2982-9111轉3288、3266",
      area: "三重區",
      hosp_addr: "新北市三重區新北大道一段3號",
    },
    {
      hosp_name: "行天宮醫療志業醫療財團法人恩主公醫院",
      tel: "02-2672-3456轉8726、8733",
      area: "三峽區",
      hosp_addr: "新北市三峽區復興路399號",
    },
    {
      hosp_name: "新北市立土城醫院 (委託長庚醫療財團法人興建經營)",
      tel: "02-2263-0588轉3330",
      area: "土城區",
      hosp_addr: "新北市土城區金城路二段6號",
    },
    {
      hosp_name: "衛生福利部雙和醫院 (委託臺北醫學大學興建經營)",
      tel: "02-2249-0088轉1263",
      area: "中和區",
      hosp_addr: "新北市中和區中正路291號",
    },
    {
      hosp_name: "天主教耕莘醫療財團法人永和耕莘醫院",
      tel: "02-6637-3658",
      area: "永和區",
      hosp_addr: "新北市永和區中興街80號",
    },
    {
      hosp_name: "國泰醫療財團法人汐止國泰綜合醫院",
      tel: "02-2648-1122",
      area: "汐止區",
      hosp_addr: "新北市汐止區建成路59巷2號",
    },
    {
      hosp_name: "板橋中興醫院",
      tel: "板橋院區:02-2959-0707轉280 海山院區:02-2261-6128轉888",
      area: "板橋區",
      hosp_addr: "板橋院區:新北市板橋區忠孝路15號 海山院區:新北市土城區中華路一段32號",
    },
    {
      hosp_name: "醫療財團法人徐元智先生醫藥基金會亞東紀念醫院",
      tel: "02-8966-7000轉 2216",
      area: "板橋區",
      hosp_addr: "新北市板橋區南雅南路二段21號",
    },
    {
      hosp_name: "中英醫療社團法人中英醫院",
      tel: "02-2256-3584轉106、107",
      area: "板橋區",
      hosp_addr: "新北市板橋區文化路一段196號",
    },
    {
      hosp_name: "淡水馬偕紀念醫院",
      tel: "02-2809-4661轉2842",
      area: "淡水區",
      hosp_addr: "新北市淡水區民生路45號",
    },
    {
      hosp_name: "財團法人台灣基督長老教會馬偕醫療財團法人淡水馬偕紀念醫院",
      tel: "02-2809-4661轉2842",
      area: "淡水區",
      hosp_addr: "新北市淡水區民生路45號",
    },
];

const formatFunctions: { [key: string]: (item: any) => FirebaseInstitutionData } = {
    'HealthCenter': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.district,
        hosp_addr: item.hosp_addr
    }),
   'Hospital': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr
    }),
     'Pediatrics': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'ObstetricsAndGynecology': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'GeneralDentistry': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'ENT': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'Dermatology': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'Ophthalmology': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'Orthopedics': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
    }),
    'Psychiatry': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.district,
        hosp_addr: item.hosp_addr,
    }),
    'PsychologicalCounselingAndTherapy': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr
    }),
    'FamilyMedicine': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'Urology': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'InternalMedicine': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'Surgery': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    'CervicalCancer': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
    }),
    'ColorectalCancer': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
    }),
    'OralCancer': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
    }),
    'BreastCancer': (item: any) => ({
        hosp_name: item.hosp_attr_type,
        hosp_addr: item.hosp_addr,
    })
};
function addManualFields(item: FirebaseInstitutionData, apiKey: string): FirebaseInstitutionData {
    switch (apiKey) {
        case 'HealthCenter':
            return { 
                ...item, 
                division: '家庭醫學科'
            };
        case 'Hospital':
            const divisions = getDivisionsByHospName(item.hosp_name);
            return { 
                ...item,
                division: divisions
            };
        case 'Orthopedics':
            return { 
                ...item, 
                division: '骨科'
            };
        case 'Psychiatry':
            return { 
                ...item, 
                division: '精神科'
            };
        case 'PsychologicalCounselingAndTherapy':
            return { 
                ...item, 
                division: '心理諮詢科'
            };
        case 'BreastCancer':
            const area = getAreaByHospAttrType(item.hosp_attr_type);
            const tel = getTelByHospAttrType(item.hosp_attr_type);
            return { 
                ...item,
                area,
                tel 
            };
        default:
            return item;
    }
}
function getAreaByHospAttrType(hospAttrType: string): string {
    const areaMapping: { [key: string]: string } = {
      '中英醫療社團法人中英醫院': '板橋區',
      '醫療財團法人徐元智先生醫藥基金會亞東紀念醫院': '板橋區',
      '新北市立聯合醫院(三重院區)': '三重區',
      '天主教耕莘醫療財團法人永和耕莘醫院': '永和區',
      '衛生福利部雙和醫院(委託臺北醫學大學興建經營)': '中和區',
      '佛教慈濟醫療財團法人臺北慈濟醫院': '新店區',
      '天主教耕莘醫療財團法人耕莘醫院': '新店區',
      '豐榮醫院': '中和區',
      '衛生福利部臺北醫院': '新莊區',
      '衛生福利部樂生療養院': '新莊區',
      '輔大診所': '新莊區',
      '明新診所': '板橋區',
      '仁愛醫院': '板橋區',
      '行天宮醫療志業醫療財團法人恩主公醫院': '三峽區',
      '財團法人基督長老教會馬偕紀念醫院淡水分院': '淡水區',
      '國泰醫療財團法人汐止國泰綜合醫院': '汐止區',
      '新北市瑞芳區衛生所(乳攝師檢)': '瑞芳區',
      '輔仁大學學校財團法人輔仁大學附設醫院': '新莊區',
      '新北市立土城醫院(委託長庚醫療財團法人興建經營)': '土城區'
    };
  
    return areaMapping[hospAttrType] || 'Unknown Area';
}
function getDivisionsByHospName(hospName: string): string[] {
    const divisionMapping: { [key: string]: string[] } = {
      '國立臺灣大學醫學院附設醫院金山分院': ['家庭醫學科', '內科', '外科', '兒科', '骨科', '泌尿科', '神經科', '復健科', '放射診斷科', '急診醫學', '牙科一般科', '牙科不分科'],
      '醫療財團法人徐元智先生醫藥基金會亞東紀念醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '臨床病理科', '核子醫學科', '急診醫學', '職業醫學科', '西醫一般科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '板橋中興醫院': ['家庭醫學科', '內科', '外科', '骨科', '泌尿科', '神經科', '麻醉科', '放射診斷科', '放射腫瘤科'],
      '板橋國泰醫院': ['家庭醫學科', '內科', '兒科', '復健科'],
      '板新醫院': ['內科', '外科', '神經科', '復健科'],
      '中英醫療社團法人板英醫院': ['家庭醫學科', '內科', '復健科'],
      '中英醫療社團法人中英醫院': ['內科', '外科', '骨科', '泌尿科', '復健科', '麻醉科', '放射診斷科'],
      '蕭中正醫院': ['家庭醫學科', '內科', '婦產科', '泌尿科', '復健科'],
      '國泰醫療財團法人汐止國泰綜合醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '核子醫學科', '急診醫學', '牙科一般科', '牙科不分科'],
      '瑞芳礦工醫院': ['內科', '外科', '骨科'],
      '佛教慈濟醫療財團法人台北慈濟醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '臨床病理科', '核子醫學科', '急診醫學', '職業醫學科', '西醫一般科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '宏慈療養院': ['精神科'],
      '新北仁康醫院': ['內科', '外科', '骨科', '復健科'],
      '同仁醫院': ['內科', '外科', '復健科'],
      '怡濟慈園醫療社團法人宏濟神經精神科醫院': ['精神科'],
      '天主教耕莘醫療財團法人耕莘醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '臨床病理科', '核子醫學科', '急診醫學', '職業醫學科', '西醫一般科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '天主教耕莘醫療財團法人永和耕莘醫院': ['家庭醫學科', '內科', '外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '解剖病理科', '急診醫學', '職業醫學科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '永和復康醫院': ['內科', '復健科'],
      '衛生福利部雙和醫院(委託臺北醫學大學興建經營)': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '臨床病理科', '核子醫學科', '急診醫學', '職業醫學科', '西醫一般科', '牙科一般科', '牙科不分科'],
      '祥顥醫院': ['內科', '兒科'],
      '怡和醫院': ['家庭醫學科', '內科', '泌尿科', '復健科'],
      '蕙生醫院': ['兒科', '婦產科'],
      '中祥醫院': ['家庭醫學科', '內科', '外科'],
      '廣川醫院': ['家庭醫學科', '內科', '外科', '骨科', '泌尿科', '復健科'],
      '恩樺醫院': ['內科', '兒科', '復健科'],
      '仁安醫院': ['家庭醫學科', '內科', '外科', '復健科'],
      '新北市立土城醫院(委託長庚醫療財團法人興建經營)': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '核子醫學科', '急診醫學', '職業醫學科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '元復醫院': ['家庭醫學科', '內科', '骨科', '復健科'],
      '永聖醫療社團法人文化醫院': ['內科'],
      '清福醫院': ['家庭醫學科', '內科', '婦產科', '精神科'],
      '行天宮醫療志業醫療財團法人恩主公醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '核子醫學科', '急診醫學', '職業醫學科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '仁愛醫院': ['家庭醫學科', '內科', '外科', '骨科', '泌尿科', '神經科', '復健科', '麻醉科', '放射診斷科', '急診醫學'],
      '名恩療養院': ['精神科'],
      '宏仁醫院': ['內科', '外科', '骨科', '復健科', '放射診斷科'],
      '新北市立聯合醫院三重院區': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '解剖病理科', '核子醫學科', '急診醫學', '牙科一般科', '牙科不分科', '中醫一般科'],
      '新北市立聯合醫院板橋院區': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '解剖病理科', '核子醫學科', '急診醫學', '牙科一般科', '牙科不分科', '中醫一般科'],
      '三重中興醫院': ['家庭醫學科', '內科', '外科', '神經科', '復健科', '職業醫學科'],
      '祐民醫院': ['家庭醫學科', '內科', '外科', '骨科', '泌尿科', '復健科'],
      '益民醫院': ['內科'],
      '新莊英仁醫院': ['內科', '外科', '婦產科'],
      '新泰綜合醫院': ['內科', '外科', '兒科', '婦產科', '骨科', '泌尿科', '眼科', '神經科', '復健科', '麻醉科', '放射診斷科', '急診醫學', '職業醫學科'],
      '財團法人台灣省私立台北仁濟院附設新莊仁濟醫院': ['內科', '精神科'],
      '新仁醫療社團法人新仁醫院': ['家庭醫學科', '內科', '外科', '骨科', '泌尿科', '復健科'],
      '衛生福利部樂生療養院': ['家庭醫學科', '內科', '外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '精神科', '神經科', '復健科', '麻醉科', '放射診斷科', '急診醫學', '牙科一般科', '牙科不分科', '中醫一般科'],
      '大順醫院': ['內科', '外科', '婦產科'],
      '衛生福利部臺北醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '核子醫學科', '急診醫學', '職業醫學科', '西醫一般科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '輔仁大學學校財團法人輔仁大學附設醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '臨床病理科', '核子醫學科', '急診醫學', '職業醫學科', '西醫一般科', '牙科一般科', '牙科不分科'],
      '全民醫院': ['家庭醫學科', '內科', '外科'],
      '衛生福利部八里療養院': ['精神科'],
      '台灣基督長老教會馬偕醫療財團法人淡水馬偕紀念醫院': ['家庭醫學科', '內科', '外科', '整形外科', '兒科', '婦產科', '骨科', '泌尿科', '耳鼻喉科', '眼科', '皮膚科', '精神科', '神經科', '神經外科', '復健科', '麻醉科', '放射診斷科', '放射腫瘤科', '解剖病理科', '臨床病理科', '核子醫學科', '急診醫學', '職業醫學科', '牙科一般科', '牙科不分科', '中醫一般科'],
      '北新醫療社團法人北新醫院': ['精神科'],
      '泓安醫院': ['精神科'],
      '台安醫院': ['精神科'],
      '豐榮醫院': ['內科', '外科', '骨科', '精神科', '復健科', '麻醉科', '放射診斷科']
    };

    return divisionMapping[hospName] || ['Unknown Division'];
}
function getTelByHospAttrType(hospAttrType: string): string {
    const telMapping: { [key: string]: string } = {
      '中英醫療社團法人中英醫院': '(02) 2256 3584',
      '醫療財團法人徐元智先生醫藥基金會亞東紀念醫院': '(02) 8966 7000',
      '新北市立聯合醫院(三重院區)': '(02) 2982 9111',
      '天主教耕莘醫療財團法人永和耕莘醫院': '(02) 2928 6060',
      '衛生福利部雙和醫院(委託臺北醫學大學興建經營)': '(02) 2249 0088',
      '佛教慈濟醫療財團法人臺北慈濟醫院': '(02) 6628 1234',
      '天主教耕莘醫療財團法人耕莘醫院': '(02) 2219 3391',
      '豐榮醫院': '(02) 2240 8899',
      '衛生福利部臺北醫院': '(02) 2276 5566',
      '衛生福利部樂生療養院': '(02) 8231 6161',
      '輔大診所': '(02) 2905 2230',
      '明新診所': '(02) 2204 3466',
      '仁愛醫院': '(02) 2683 4567',
      '行天宮醫療志業醫療財團法人恩主公醫院': '(02) 2672 3456',
      '財團法人基督長老教會馬偕紀念醫院淡水分院': '(02) 2809 4661',
      '國泰醫療財團法人汐止國泰綜合醫院': '(02) 2648 2121',
      '新北市瑞芳區衛生所(乳攝師檢)': '(02) 2497 2150',
      '輔仁大學學校財團法人輔仁大學附設醫院': '(02) 2905 2230',
      '新北市立土城醫院(委託長庚醫療財團法人興建經營)': '(02) 7705 8888'
    };
  
    return telMapping[hospAttrType] || 'Unknown Tel';
}

async function fetchAndFormatData(url: string, formatFunction: (item: any) => FirebaseInstitutionData, apiKey: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.map((item: FirebaseInstitutionData) => {
        const formattedItem = formatFunction(item);
        return addManualFields(formattedItem, apiKey);
      });
    } catch (error) {
      console.error(`Failed to fetch and format data from ${url}:`, error);
      return [];
    }
}

// (二)連接firebase: 判斷建立或更新
async function saveOrUpdateData(data: FirebaseInstitutionData[]) {
    for (const item of data) {
      const docRef = doc(db, "hospitals", item.hosp_name);
      const docSnap = await getDocs(docRef);
  
      if (docSnap.exists()) {
        await setDoc(docRef, item, { merge: true });
      } else {
        await setDoc(docRef, item);
      }
    }
  }

// (三)放到父函式，遍歷每個API來執行同操作邏輯
async function organizeInstitutionData() {
    const apiUrls = [     //修正
      { url: '/api/datasets/2553bb1a-bcbb-4284-8b24-acfefe966f1e/json', key: 'HealthCenter' },
    ];
  
    await saveOrUpdateData(cervicalCancerData);

    for (const { url, key } of apiUrls) {
      const formatFunction = formatFunctions[key];
      if (!formatFunction) {
        console.warn(`No format function found for API key: ${key}`);
        continue;
      }
  
      const formattedData = await fetchAndFormatData(url, formatFunction, key);
      await saveOrUpdateData(formattedData);
    }
    
}
  
organizeInstitutionData();

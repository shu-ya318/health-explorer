//舊測試用檔案
import { FirebaseInstitutionData } from '../lib/types';
import {db} from '../lib/firebaseConfig';
import { collection, doc, writeBatch, setDoc, addDoc, getDocs, getDoc, query, where } from 'firebase/firestore';


// (一)取得資料: 1.自行輸入: 定義實際資料   2.API:  定義資料的統一格式 -> 定義新增屬性 作為 新增欄位內容 -> 定義call API函式，呼叫前2個函式   
  const cervicalCancerData: FirebaseInstitutionData[] = [
      {
        hosp_name: "新北市立聯合醫院三重院區",
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
        hosp_name: "台灣基督長老教會馬偕醫療財團法人淡水馬偕紀念醫院",
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
        area: item.district,
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
        area: item.district,
        hosp_addr: item.hosp_addr,
    }),
    'OralCancer': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.town,
        hosp_addr: item.hosp_addr,
    }),
    'BreastCancer': (item: any) => ({
        hosp_name: item.hosp_attr_type,
        hosp_addr: item.hosp_addr,
    })
  };
 
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
            const area = getAreaByHospAttrType(item.hosp_name) || '未知區域';
            const tel = getTelByHospAttrType(item.hosp_name)  || '未知電話';
            return { 
                ...item,
                area,
                tel 
            };
        default:
            return item;
    }
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

  async function fetchAndFormatData(url: string, formatFunction: (item: any) => FirebaseInstitutionData, apiKey: string, page: number = 0) {
    try {
      const paginatedUrl = `${url}?page=0&size=1`;
      const response = await fetch(paginatedUrl);
  
      if (!response.ok) {
        throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log(data);
      return data.map((item: FirebaseInstitutionData) => {
        const formattedItem = formatFunction(item);
        return addManualFields(formattedItem, apiKey);
      });
    } catch (error) {
      console.error(`Failed to fetch and format data from ${url}:`, error);
      return [];
    }
  }


  // (二)連接firebase: 判斷是否建立
  async function checkMultipleEntries() {
    const collectionRef = collection(db, 'medicalInstitutions');
    const snapshot = await getDocs(collectionRef);
    return snapshot.size > 1;
  }

  async function createData(data: FirebaseInstitutionData[]) {
    const batch = writeBatch(db);
    for (const item of data) {
      const docRef = doc(db, 'medicalInstitutions', item.hosp_name);
      batch.set(docRef, item);
    }
    /* 
    const docSnap = await getDoc(docRef);
    [VER] 逐筆檢查，更新既有資料時  
    if (docSnap.exists()) {
        batch.set(docRef, item, { merge: true });
      } else {
        batch.set(docRef, item);
      }
    } 
    [VER] 逐筆檢查，有則不更新資料
      if (!docSnap.exists()) { 
        batch.set(docRef, item);
        }
      }
    */
    try {
      await batch.commit();
    } catch (error) {
      console.error(`Failed to save data: ${error}`);
    }
  }


  // (三)放到父函式，處理自行定義資料+遍歷每個API來執行同操作邏輯 。 await 均接收完當前API資料+插入資料庫才繼續
export  async function organizeInstitutionData() { 
    if (await checkMultipleEntries()) {
      console.log("firestore已初始化資料，不執行 call API!");
      return;
    }

    const apiUrls = [
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/2553bb1a-bcbb-4284-8b24-acfefe966f1e/json', 'key': '衛生所' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/85bfcaa8-9932-4d06-a2ec-731171191883/json', 'key': '醫院' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/d041976e-de7a-473a-8667-daa9833d777a/json', 'key': '兒科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/77ae6d31-3a9c-49ec-9299-bcd4e19571ef/json', 'key': '婦產科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/248e3ecc-975f-494f-8fdb-1d1a177b8c72/json', 'key': '牙醫一般科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/44fc194a-9964-4f5a-ac0d-de7cf49660ce/json', 'key': '耳鼻喉科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/407c317b-3253-45cc-8755-89c1480e5a55/json', 'key': '皮膚科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/48a4da9c-3a1b-4247-afde-47abb1ed6a4d/json', 'key': '眼科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/1c770555-c917-4d96-9e6e-9601c496b8ed/json', 'key': '骨科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/6556714e-4eb1-4645-a6de-7f2402527a91/json', 'key': '精神' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/f86e3560-7922-4f0f-b5ee-9ecccf80e2e6/json', 'key': '心理諮商及心理治療' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/9e1c1aba-4e0b-4d5a-8755-efa1f09abe65/json', 'key': '家庭醫學科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/9e36f533-38e9-49fe-99fe-b711cfcbe4c5/json', 'key': '泌尿科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/e8244d31-e0e5-459d-87ba-3c188706fbee/json', 'key': '內科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/e922e439-a892-4bd3-b756-5a9afb3812b6/json', 'key': '外科' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/08e4e0e8-c32e-4ef7-a262-68ab9debdce7/json', 'key': '子宮頸癌' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/85eeec59-b584-4d97-ba83-8786eb2536a4/json', 'key': '大腸癌' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/4aa54765-a471-4412-a314-468f892a1794/json', 'key': '口腔癌' },
      { 'url': 'https://data.ntpc.gov.tw/api/datasets/435dae21-f8b9-449b-b9bd-0283a9541f68/json', 'key': '乳癌' }
    ];
    let results: any[] = [];

    try {
      //await createData(cervicalCancerData);

      for (const { url, key } of apiUrls) {
          const formatFunction = formatFunctions[key];
          if (!formatFunction) {
            console.warn(`No format function found for API key: ${key}`);
            continue;
          }
          try {
              const formattedData = await fetchAndFormatData(url, formatFunction, key);
              results.push({ key, data: formattedData });
              await createData(formattedData);
          } catch (error:any) {
            console.error(`Error fetching data for ${key}:`, error.message);
            results.push({ key, data: { error: `Failed to fetch: ${error.message}` } });
          }
      }
      } catch (error:any) {
        console.error('An error occurred while processing data:', error.message);
      } 

      return results;
  }



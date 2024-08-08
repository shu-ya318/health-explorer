'use client';
import { useEffect, useState } from 'react';
import { FirebaseInstitutionData } from '../lib/types';
import {db} from '../lib/firebaseConfig';
import { collection, doc, writeBatch, getDocs, setDoc} from 'firebase/firestore';

// 單處肺癌寫死資
/*遍歷每API : 接收全實資   -> 取部分屬 整理進指定屬名  
-> 塞入統一資庫(一、apiKey非癌篩們 1.過濾任一元素h_s : 若同值，該元素divison 合併更新值為apiKey、不同值，新增 二、apiKey癌們，過濾任一元素h_s : 若同值，該元素cancer_screening 合併更新為apiKey)  
->指定者，額外新增欄位(3診API)
*/
// (一)取得+整理資料
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
    '衛生所': (item: any) => ({
      hosp_name: `新北市${item.hosp_name.substring(0, 3)}${item.hosp_name.substring(3)}`,
      tel: item.tel,
      area: item.district,
      hosp_addr: item.hosp_addr
    }),
    '醫院': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr
    }),
    '兒科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '婦產科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '牙醫一般科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '耳鼻喉科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '皮膚科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '眼科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '骨科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
    }),
    '精神科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.district,
        hosp_addr: item.hosp_addr,
    }),
    '心理諮商及心理治療科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.district,
        hosp_addr: item.hosp_addr
    }),
    '家庭醫學科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '泌尿科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '內科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '外科': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
        division: item.division
    }),
    '子宮頸癌': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.area,
        hosp_addr: item.hosp_addr,
    }),
    '大腸癌': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.district,
        hosp_addr: item.hosp_addr,
    }),
    '口腔癌': (item: any) => ({
        hosp_name: item.hosp_name,
        tel: item.tel,
        area: item.town,
        hosp_addr: item.hosp_addr,
    }),
    '乳癌': (item: any) => ({
        hosp_name: item.hosp_attr_type,
        hosp_addr: item.hosp_addr,
    })
};

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
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/6556714e-4eb1-4645-a6de-7f2402527a91/json', 'key': '精神科' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/f86e3560-7922-4f0f-b5ee-9ecccf80e2e6/json', 'key': '心理諮商及心理治療科' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/9e1c1aba-4e0b-4d5a-8755-efa1f09abe65/json', 'key': '家庭醫學科' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/9e36f533-38e9-49fe-99fe-b711cfcbe4c5/json', 'key': '泌尿科' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/e8244d31-e0e5-459d-87ba-3c188706fbee/json', 'key': '內科' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/e922e439-a892-4bd3-b756-5a9afb3812b6/json', 'key': '外科' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/08e4e0e8-c32e-4ef7-a262-68ab9debdce7/json', 'key': '子宮頸癌' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/85eeec59-b584-4d97-ba83-8786eb2536a4/json', 'key': '大腸癌' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/4aa54765-a471-4412-a314-468f892a1794/json', 'key': '口腔癌' },
    { 'url': 'https://data.ntpc.gov.tw/api/datasets/435dae21-f8b9-449b-b9bd-0283a9541f68/json', 'key': '乳癌' }
];
function addManualFields(item: FirebaseInstitutionData, apiKey: string): FirebaseInstitutionData {
    switch (apiKey) {
        case '骨科':
            return { 
                ...item, 
                division: '骨科'
            };
        case '精神科':
            return { 
                ...item, 
                division: '精神科'
            };
        case '心理諮商及心理治療科':
            return { 
                ...item, 
                division: '心理諮商及心理治療科'
            };
        default:
            return item;
    }
}

async function fetchAndFormatData() {
    let institutionData: FirebaseInstitutionData[] = [];

    for (const { url, key } of apiUrls) {
        const paginatedUrl = `${url}?page=0&size=1`;
        try {
            const response = await fetch(paginatedUrl);
            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const data = await response.json();
            const formatFunction = formatFunctions[key];
            if (!formatFunction) {
                console.error(`No format function found for key: ${key}`);
                continue;
            }

            for (const item of data) {
                let formattedItem = formatFunction(item);
                formattedItem = addManualFields(formattedItem, key);
                const existingEntry = institutionData.find(entry => entry.hosp_name === formattedItem.hosp_name);
                if (['子宮頸癌', '大腸癌', '口腔癌', '乳癌'].includes(key)) {
                    if (existingEntry) {
                        existingEntry.cancer_screening = existingEntry.cancer_screening ? `${existingEntry.cancer_screening}, ${key}` : key;
                    } else {
                        institutionData.push(formattedItem);
                    }
                } else {
                    if (existingEntry) {
                        existingEntry.division = existingEntry.division ? `${existingEntry.division}, ${key}` : key;
                    } else {
                        institutionData.push(formattedItem);
                    }
                }

            }
        } catch (error) {
            console.error(`Error fetching data for key ${key}:`, error);
        }
    }
    for (const item of cervicalCancerData) {
        const existingEntry = institutionData.find(entry => entry.hosp_name === item.hosp_name);
        if (existingEntry) {
            existingEntry.cancer_screening = existingEntry.cancer_screening ? `${existingEntry.cancer_screening}, '肺癌'` : '肺癌';
        } else {
            institutionData.push(item);
        }
    }

    return institutionData;
}


 // (二)資料加入firebase
async function createFirestoreData(institutionData: FirebaseInstitutionData[]) {
    const batch = writeBatch(db);
    institutionData.forEach(item => {
        const docRef = doc(db, 'medicalInstitutions', item.hosp_name);
        batch.set(docRef, item);
    });
    await batch.commit();
}


// (三)放到父函式
export async function initInstitutionData(){
    const snapshot = await getDocs(collection(db, 'medicalInstitutions'));
    if (snapshot.size > 1) {
        console.log("Firestore data is fully initialized; no API calls");
        return;
    } 
    const institutionData = await fetchAndFormatData(); 
    await createFirestoreData(institutionData);
}

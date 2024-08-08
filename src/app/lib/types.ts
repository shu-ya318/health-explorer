export interface FirebaseInstitutionData {
    hosp_name: string;
    tel?: string;
    area?: string;
    hosp_addr: string;
    division?: string;
    cancer_screening?: string
}


//繼承 FirebaseInstitutionData的屬性 ，且+額外屬性
//搭配元件 1.引入FirebaseInstitutionDataExtended 2.型別定義useState<FirebaseInstitutionDataExtended[]  >([]);或 | null>(null); 3.條件渲染處理undefined情形
export interface FirebaseInstitutionDataExtended extends FirebaseInstitutionData {
    lat?: number;
    lng?: number;
    map?: string;
}


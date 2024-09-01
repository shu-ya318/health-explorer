export interface FirebaseInstitutionData {
    hosp_name: string;
    tel?: string;
    area?: string;
    hosp_addr: string;
    division?: string;
    cancer_screening?: string;
    view?:number;
    lat?: number | null;
    lng?: number | null;
    imageUrl?: string | null;
}

export interface FirebaseFavoriteData{
    id?: string;          //每筆收藏文件id，由firestore內建
    userId: string;
    hosp_name: string;
    tel:string;
    hosp_addr: string;
    division?: string;
    cancer_screening?: string;
    imageUrl: string;
}

export interface InstitutionInfo {
    objectID: string;
    hosp_name: string;
    area: string;
    path: string;
    tel: string;
    hosp_addr: string;
    division: string;
    view: number;
    lat: number;
    lng: number;
    cancer_screening?:string;
    imageUrl: string;
    lastmodified: {
        _operation: string;
        value: number;
    };
}
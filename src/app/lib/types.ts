export interface FirebaseInstitutionData {
    hosp_name: string;
    tel?: string;
    area?: string;
    hosp_addr: string;
    division?: string;
    cancer_screening?: string
}


export interface FirebaseInstitutionDataExtended extends FirebaseInstitutionData {
    lat?: number;
    lng?: number;
}


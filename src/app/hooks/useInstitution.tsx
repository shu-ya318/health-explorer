"use client";

import { useRouter } from "next/navigation";
import { db } from "../lib/firebaseConfig";
import { doc, updateDoc, increment } from "firebase/firestore"; 

interface InstitutionName {
    hosp_name: string;
}

export const useInstitution = () => {
    const router = useRouter();

    const handleIncrement = async (institution: InstitutionName) : Promise<void>=> {
        const docRef = doc(db, "medicalInstitutions", institution.hosp_name);
        router.push(`/search/${encodeURIComponent(institution.hosp_name)}`);

        try {
            await updateDoc(docRef, {
                view: increment(1)
            });
        } catch (error) {
            console.error("Failed to increment views:", error);
        }
    };

    return { handleIncrement };
};
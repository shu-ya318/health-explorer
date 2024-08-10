'use client';
import { useEffect } from 'react';
import { initInstitutionData } from '../api/initInstitutionData';

const Page = () => {
    useEffect(() => {
        (async () => {
            try {
                await initInstitutionData();
            } catch (error) {
                console.error('Failed to initialize institution data:', error);
            }
        })();
    }, []); // 空依賴數組表示這個效果只在組件掛載時執行一次

    return (
        <div>
            <h1>Welcome to Our Page</h1>
        </div>
    );
};

export default Page;

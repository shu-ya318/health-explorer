'use client';

import { useState, useEffect } from 'react';

export function useReadingProgress() {
    const [readingProgress, setReadingProgress] = useState<number>(0); 

    useEffect(() => {
      function updateScroll() {
        const currentScrollY = window.scrollY;
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        if (scrollHeight) {
            setReadingProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100)
        };
      }
      
      window.addEventListener('scroll', updateScroll);
  
      return () => {
        window.removeEventListener('scroll', updateScroll);
      }
    }, [])

    return readingProgress;
}

export default function ProgressBar() {
    const readingProgress = useReadingProgress();

    return (
      <div className="w-screen">
        <div
          className="fixed inset-x-0 top-0 z-30 max-w-[100vw] h-[3px] mt-[58px] bg-[#1e94b4] rounded-r-lg"
          style={{ width: `${readingProgress}%` }}
        >
        </div>
      </div>
    )
}
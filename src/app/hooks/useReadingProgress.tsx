'use client';
import { useEffect, useState } from 'react';


export function useReadingProgress() {
    const [progress, setProgress] = useState(0);


    useEffect(() => {
      function updateScroll() {
        const currentScrollY = window.scrollY;
        let scrollHeight = document.body.scrollHeight - window.innerHeight;
        if (scrollHeight) {
            setProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100)
        };
      }
      window.addEventListener('scroll', updateScroll);
  
      return () => {
        window.removeEventListener('scroll', updateScroll);
      }
    }, [])

    return progress;
}


export default function ProgressBar() {
    const progress = useReadingProgress();


    return (
      <div
        className="h-[3px] bg-[#1e94b4] fixed inset-x-0 top-0 z-50 mt-[58px] rounded-r-lg"
        style={{
          width: `${progress}%`,
          transform: `translateX(${progress - 100}%)`,
        }}
      />
    )
}
'use client';
import SearchContent from '../components/SearchContent';
import { CollectionContextProvider } from '../contexts/CollectionContext';


const SearchPage: React.FC = (): React.ReactElement | null  => {
    return (     
        <CollectionContextProvider>  
            <SearchContent />
        </CollectionContextProvider>
    )
};


export default SearchPage;
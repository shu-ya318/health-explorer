'use client';
import SearchContent from '../components/SearchContent';
import { InstitutionsProvider } from '../contexts/InstitutionsContext';


const SearchPage: React.FC = (): React.ReactElement | null  => {
    return (     
        <InstitutionsProvider>  
            <SearchContent />
        </InstitutionsProvider>
    )
};

export default SearchPage;

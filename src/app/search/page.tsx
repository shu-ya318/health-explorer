'use client';
import SearchContent from '../components/SearchContent';
import { CollectionProvider } from '../contexts/CollectionContext';
import { useAuth } from '../contexts/AuthContext';

const SearchPage: React.FC = (): React.ReactElement | null  => {
    const { user } = useAuth();

    
    return (     
        <CollectionProvider user={user}>  
            <SearchContent />
        </CollectionProvider>
    )
};


export default SearchPage;
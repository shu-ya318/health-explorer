'use client';
import SearchContent from '../components/SearchContent';
import { FavoriteProvider } from '../hooks/useFavorite';
import { useAuth } from '../hooks/useAuth';
// import { InstitutionsProvider } from '../../contexts/InstitutionsContext';


const SearchPage: React.FC = (): React.ReactElement | null  => {
    const { user } = useAuth();

    
    return (     
        //<InstitutionsProvider>  
        <FavoriteProvider user={user}>  
            <SearchContent />
        </FavoriteProvider>
        //</InstitutionsProvider>
    )
};


export default SearchPage;
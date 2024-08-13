'use client';
import SearchContent from '../components/SearchContent';
import { FavoriteProvider } from '../contexts/FavoriteContext';
import { useAuth } from '../contexts/AuthContext';
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
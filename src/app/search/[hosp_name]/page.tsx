'use client';
import InstitutionContent from './InstitutionContent';
import { FavoriteProvider } from '../../hooks/useFavorite';
import { useAuth } from '../../hooks/useAuth';
// import { InstitutionsProvider } from '../../contexts/InstitutionsContext';


const InstitutionPage: React.FC = (): React.ReactElement | null  => {
    const { user } = useAuth();

    
    return(
        //<InstitutionsProvider>  
        <FavoriteProvider user={user}> 
            <InstitutionContent />
        </FavoriteProvider>
        //</InstitutionsProvider>
    )
}


export default InstitutionPage;
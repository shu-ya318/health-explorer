'use client';
import InstitutionContent from '../../components/InstitutionContent';
import { FavoriteProvider } from '../../contexts/FavoriteContext';
import { useAuth } from '../../contexts/AuthContext';
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
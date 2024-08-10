'use client';
import InstitutionContent from '../../components/InstitutionContent';
// import { InstitutionsProvider } from '../../contexts/InstitutionsContext';


const InstitutionPage: React.FC = (): React.ReactElement | null  => {
    return(
        //<InstitutionsProvider>  
            <InstitutionContent />
        //</InstitutionsProvider>
    )
}

export default InstitutionPage;

"use client";

import { useAuth } from "../../hooks/useAuth";
import { FavoriteProvider } from "../../hooks/useFavorite";

import InstitutionContent from "./InstitutionContent";
// import { InstitutionsProvider } from "../../contexts/InstitutionsContext";


const InstitutionPage: React.FC = () => {
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
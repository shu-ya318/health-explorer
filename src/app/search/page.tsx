"use client";

import { useAuth } from "../hooks/useAuth";
import { FavoriteProvider } from "../hooks/useFavorite";

import SearchContent from "./SearchContent";

const SearchPage: React.FC = () => {
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
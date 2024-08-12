'use client';
import CollectionContent from '../components/CollectionContent';
import { CollectionContextProvider } from '../contexts/CollectionContext';


const CollectionPage: React.FC = (): React.ReactElement | null  => {
    return (     
        <CollectionContextProvider>  
            <CollectionContent />
        </CollectionContextProvider>
    )
};


export default CollectionPage;
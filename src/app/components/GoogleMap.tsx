import { useMemo } from 'react';
import Image from 'next/image';
import { FirebaseFavoriteData, InstitutionInfo} from '../lib/types';
import { useApiIsLoaded, APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';


const GoogleMap: React.FC <{ institutionDetails: InstitutionInfo }> = ({ institutionDetails }): React.ReactElement | null => { 
    const apiIsLoaded = useApiIsLoaded();

    const mapCenter = useMemo(() => {
        if (institutionDetails && typeof institutionDetails.lat === 'number' && typeof institutionDetails.lng === 'number') { 
            return { lat: institutionDetails.lat, lng: institutionDetails.lng };
        }
        return { lat: 0, lng: 0 };
    }, [institutionDetails]);


    return(
        <>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                {!apiIsLoaded && (
                    <Map
                        style={{width: "100%", height: "100%"}}
                        defaultCenter={mapCenter}
                        defaultZoom={15}
                        gestureHandling={"greedy"}
                        disableDefaultUI={true}
                        mapId={"DEMO_MAP_ID"}
                    >
                        <AdvancedMarker position={mapCenter}>
                            <Image src="/images/hospital_fill.svg" alt="icon" width={52} height={52} className="w-[52px] h-[52px]"/>
                        </AdvancedMarker>
                    </Map>
                )}
            </APIProvider>
        </>
    );
}

export default GoogleMap;
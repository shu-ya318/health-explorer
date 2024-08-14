
import { SearchBox, Configure, Hits , useSearchBox} from "react-instantsearch";
import { InstantHit } from "./InstantHit";


export const InstantResults = () => {
  const { query } = useSearchBox();
  const shouldDisplayHits = query && query.trim() !== ''; 


  return (
    <>
      <Configure hitsPerPage={10} />  
      <div className="ais-InstantSearch flex flex-col w-full h-full z-40">
        <SearchBoxComponent />
        {shouldDisplayHits && <Hits hitComponent={InstantHit} className="cursor-pointer"/>}
      </div>
    </>
  );
};

const SearchBoxComponent = () => {
  return (
    <>
      <SearchBox placeholder="請輸入關鍵字"/>
    </>
  );
};
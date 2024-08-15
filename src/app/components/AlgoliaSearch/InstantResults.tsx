
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
       <div className="flex max-w-screen-md h-full mx-auto"> 
          <SearchBox className="ais-InstantSearch flex flex-col w-full h-full z-40 rounded-lg border-solid border-[3px] border-[#6898a5]" placeholder="請輸入關鍵字"/>
      </div>
    </>
  );
};
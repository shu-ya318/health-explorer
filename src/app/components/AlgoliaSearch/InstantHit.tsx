import { Highlight } from "react-instantsearch";


//錯誤設hosp_name，改同值的objectID仍無法被query搜尋
export const InstantHit: React.FC = ({ hit }: any) => {
  return (
    <article>
      <div className="hit-hosp_name text-black font-bold text-[16px]">
        <Highlight attribute="hosp_name" hit={hit} />   
      </div>
      <div className="hit-area text-black">
        <Highlight attribute="area" hit={hit} />
      </div>
      <div className="hit-cancer_screening text-black">
        <Highlight attribute="cancer_screening" hit={hit} />
      </div>
    </article>
  );
};
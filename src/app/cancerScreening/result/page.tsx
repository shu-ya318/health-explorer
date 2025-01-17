"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { db } from "../../lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface cancerScreeningAnswer {
  birthYear: number;
  indigenous: number;
  betelNutUsage: number;
  gender: number;
  smoking: number;
  familyLungCancer: number;
  familyBreastCancer: number;
}

const cancers = [
  { filter: "子宮頸癌" },
  { filter: "乳癌" },
  { filter: "大腸癌" },
  { filter: "口腔癌" },
  { filter: "肺癌" },
];

const CancerScreeningResultPage: React.FC = () => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [answers, setAnswers] = useState<cancerScreeningAnswer[]>([]);

  useEffect(() => {
    const fetchResults = async (): Promise<void> => {
      try {
        const testerId = sessionStorage.getItem("testerId");

        const q = query(
          collection(db, "cancerScreening"),
          where("testerId", "==", testerId)
        );
        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map(
          (doc) => doc.data() as cancerScreeningAnswer
        );
        setAnswers(documents);
      } catch (error) {
        console.error("Failed to fetch results: ", error);
      }
    };

    fetchResults();
  }, []);

  if (!answers || answers.length === 0) {
    return <p>正在加載答案...</p>;
  }

  const firstAnswer = answers[0];
  const birthYear = firstAnswer.birthYear;
  const indigenous = firstAnswer.indigenous;
  const gender = firstAnswer.gender;
  const betelNutUsage = firstAnswer.betelNutUsage;
  const smoking = firstAnswer.smoking;
  const familyLungCancer = firstAnswer.familyLungCancer;
  const familyBreastCancer = firstAnswer.familyBreastCancer;

  /*    無資格者:未滿18歲、滿18~29歲非原住民 、滿18~29歲原住民且未嚼檳榔及未吸菸、滿30~49歲男性且未嚼檳榔及未吸菸、滿75歲以上男性*/
  const noQualification =
    birthYear > 95 ||
    (birthYear >= 84 && birthYear <= 95 && indigenous === 2) ||
    (birthYear >= 84 &&
      birthYear <= 95 &&
      indigenous === 1 &&
      betelNutUsage === 3 &&
      smoking === 3) ||
    (birthYear >= 64 &&
      birthYear <= 83 &&
      gender === 2 &&
      betelNutUsage === 3 &&
      smoking === 3) ||
    (birthYear <= 38 && gender === 2);

  /*    口腔癌篩:滿18歲以上有嚼過檳榔或有吸菸的原住民、滿30歲以上有嚼過檳榔或有吸菸*/
  const oralCancerQualification =
    (birthYear <= 95 &&
      indigenous === 1 &&
      (betelNutUsage !== 3 || smoking !== 3)) ||
    (birthYear <= 83 && (betelNutUsage !== 3 || smoking !== 3));

  /*    肺癌篩: 滿45~49歲女性且有肺癌家族史 、滿50~74歲且有肺癌史或有吸菸者*/
  const lungCancerQualification =
    (birthYear >= 64 &&
      birthYear <= 68 &&
      gender === 1 &&
      familyLungCancer === 1) ||
    (birthYear >= 39 &&
      birthYear <= 63 &&
      (familyLungCancer === 1 || smoking !== 3));

  /*    大腸癌篩:滿50~74歲*/
  const colorectalCancerQualification = birthYear >= 39 && birthYear <= 63;

  /*    子宮頸癌篩:滿30歲以上女性*/
  const cervicalCancerQualification = birthYear <= 83 && gender === 1;

  /*    乳癌篩:滿40~44歲且二等血親內有乳癌史的女性、滿45~69歲女性*/
  const breastCancerQualification =
    (birthYear >= 44 && birthYear <= 68 && gender === 1) ||
    (birthYear >= 69 &&
      birthYear <= 73 &&
      gender === 1 &&
      familyBreastCancer === 1);

  const handleSearchClick = (filter: string) => {
    router.push(`/search?filter=${filter}`);
  };

  return (
    <>
      <main className="w-full h-auto common-col-flex justify-center bg-[#FCFCFC]">
        <div className="xl:w-full max-w-[1180px] lg:w-[90%] w-[80%] h-auto common-col-flex my-[150px] mb-[40px] bg-[#FFFFFF] common-border border-2 rounded-lg shadow-[0_0_5px_#AABBCC] text-black">
          <div className="relative w-full h-[440px]">
            <Image
              src="/images/cancerScreeningResult_banner.jpg"
              alt="cancerScreeningResult_banner"
              fill={true}
              className="w-full h-full object-cover rounded-t-md"
              onLoad={() => setImageLoaded(true)}
              style={{
                backgroundImage: imageLoaded
                  ? ""
                  : "linear-gradient(to top, #F0F0F0, #C3D8EA, #77ACCC)",
              }}
            />
          </div>
          <div className="w-full my-[20px] text-[#1D445D] text-[28px] text-center font-bold">
            您的檢測結果如下:
          </div>
          {noQualification && (
            <div className="common-col-flex justify-between w-full mx-auto px-[40px] mb-[40px]">
              <div className="w-[200px] h-[330px] flex flex-col py-[10px] justify-around rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                  <div className="text-[18px]">很抱歉...</div>
                  <div className="text-[24px]">您尚無免費資格</div>
                </div>
                <div
                  className="w-[140px] h-[140px] mx-auto rounded-lg bg-[#f0ffff] bg-no-repeat bg-contain bg-center"
                  style={{ backgroundImage: `url("../images/notFound.png")` }}
                ></div>
                <button
                  onClick={() => handleSearchClick("醫院")}
                  className="cancerResult-button shadow-xs"
                >
                  查詢自費醫院
                </button>
              </div>
            </div>
          )}
          <section className="w-full common-row-flex flex-wrap justify-center mx-auto px-[40px] mb-[40px]">
            {oralCancerQualification && (
              <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                  <div className="text-[18px]">
                    每<strong className="text-[24px] mx-[5px]">2</strong>
                    年可篩檢:
                  </div>
                  <div className="text-[24px] text-center">口腔癌</div>
                </div>
                <div
                  className="w-[130px] h-[130px] mx-auto rounded-lg bg-[#F0FFFF] bg-no-repeat bg-contain bg-center"
                  style={{ backgroundImage: `url("../images/oralCancer.png")` }}
                ></div>
                <button
                  onClick={() => handleSearchClick(cancers[3].filter)}
                  className="cancerResult-button shadow-xs"
                >
                  挑選機構
                </button>
              </div>
            )}
            {lungCancerQualification && (
              <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] xl:py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                  <div className="text-[18px]">
                    每<strong className="text-[24px] mx-[5px]">2</strong>
                    年可篩檢:
                  </div>
                  <div className="text-[24px] text-center">肺癌</div>
                </div>
                <div
                  className="mx-auto w-[130px] h-[130px] rounded-lg bg-[#F0FFFF] bg-no-repeat bg-contain bg-center"
                  style={{ backgroundImage: `url("../images/lungCancer.png")` }}
                ></div>
                <button
                  onClick={() => handleSearchClick(cancers[4].filter)}
                  className="cancerResult-button shadow-xs"
                >
                  挑選機構
                </button>
              </div>
            )}
            {cervicalCancerQualification && (
              <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                  <div className="text-[18px]">
                    每<strong className="text-[24px] mx-[5px]">1</strong>
                    年可篩檢:
                  </div>
                  <div className="text-[24px] text-center">子宮頸癌</div>
                </div>
                <div
                  className="w-[130px] h-[130px] mx-auto rounded-lg bg-[#F0FFFF] bg-no-repeat bg-contain bg-center"
                  style={{
                    backgroundImage: `url("../images/cervicalCancer.png")`,
                  }}
                ></div>
                <button
                  onClick={() => handleSearchClick(cancers[0].filter)}
                  className="cancerResult-button shadow-xs"
                >
                  挑選機構
                </button>
              </div>
            )}
            {breastCancerQualification && (
              <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                  <div className="text-[18px]  ">
                    每<strong className="text-[24px] mx-[5px]">2</strong>
                    年可篩檢:
                  </div>
                  <div className="text-[24px] text-center">乳癌</div>
                </div>
                <div
                  className="mx-auto w-[130px] h-[130px] rounded-lg bg-[#F0FFFF] bg-no-repeat bg-contain bg-center"
                  style={{
                    backgroundImage: `url("../images/breastCancer.png")`,
                  }}
                ></div>
                <button
                  className="cancerResult-button shadow-xs"
                  onClick={() => handleSearchClick(cancers[1].filter)}
                >
                  挑選機構
                </button>
              </div>
            )}
            {colorectalCancerQualification && (
              <div className="w-[200px] h-[330px] flex flex-col justify-around mr-[10px] md:mb-[10px] mb-[15px] py-[10px] rounded-lg bg-gradient-to-b from-[#50A7C2] to-[#B7F8DB] animate-flipUp">
                <div className="flex flex-col pl-[10px] mb-[10px] text-left text-[#FFFFFF] font-bold">
                  <div className="text-[18px]">
                    每<strong className="text-[24px] mx-[5px]">2</strong>
                    年可篩檢:
                  </div>
                  <div className="text-[24px] text-center">大腸癌</div>
                </div>
                <div
                  className="mx-auto w-[130px] h-[130px] rounded-lg bg-[#F0FFFF] bg-no-repeat bg-contain bg-center"
                  style={{
                    backgroundImage: `url("../images/colorectalCancer.png")`,
                  }}
                ></div>
                <button
                  onClick={() => handleSearchClick(cancers[2].filter)}
                  className="cancerResult-button shadow-xs"
                >
                  挑選機構
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};
export default CancerScreeningResultPage;

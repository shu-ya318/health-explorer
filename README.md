# Health Explorer (健康探索者)

**Health Explorer** is a website that provides flexible search capabilities for medical institutions across New Taipei City and facilitates eligibility checks for cancer screenings.

Website: <https://health-explorer-virid.vercel.app/>

- Test account : test1@healthExplorer.com<br/>
- Test password : healthExplorer

<img src="public/images/README/homePage.jpg" alt="HomePage" width="720px" height="600px">

# Technology Stack

<img src="public/images/README/TechnologyStack.jpg" alt="Technology Stack" width="720px">

## Frontend

- **React Hooks**：
  - useState
  - useRef
  - useCallback
  - useMemo
  - useEffect
  - useContext
  - useReducer
- **Custom Hooks**：

  - useAuth
  - useInstitution
  - useFavorite

- **Next.js**：App Router, static resources optimization
- **TypeScript**
- **Tailwind CSS**
- **AJAX**

## Cloud Services

- **Firebase**：

  - Authentication
  - Cloud Firestore
  - Storage

- **Algolia**：
  quickly conducts filter searches

## Third-party

- **Library**:

  - React Google Maps
  - React-pdf
  - Animate.css
  - AOS
  - React Spinners

- **APIs**:

  - NTPC Open Data: receives a list of 19 medical institutions from various divisions and cancer screening types.
  - Google Maps API: obtains the latitude and longitude of all medical institutions, along with static and dynamic maps.

    Due to the vast amount of data and format inconsistencies, data is integrated using multiple throttle functions to ensure no loss occurs.
    <img src="public/images/README/fetchAndFormatData.jpg" alt="fetchAndFormat_data" width="720px">

## Others

- **Vercel**
- **ESLint**
- **Prettier**

## Component Structure

<img src="public/images/README/ComponentStructure1.jpg" alt="Component Structure_global" width="720px">

<img src="public/images/README/ComponentStructure2.jpg" alt="Component Structure_page" width="720px">

## Features

### HomePage:

<img src="public/images/README/HomePage.gif" alt="Home_page" width="720px">

### CancerScreeningPage:

<img src="public/images/README/CancerScreeningPage.gif" alt="CancerScreening_Page" width="720px">

### SearchPage:

<img src="public/images/README/SearchPage.gif" alt="Search_page" width="720px">

### InstitutionPage:

<img src="public/images/README/InstitutionPage.gif" alt="Institution_page" width="720px">

### FavoritePage:

<img src="public/images/README/FavoritePage.gif" alt="Favorite_page" width="720px">

### RWD: 360 px ~ 1920 px

- **mobile**:

<img src="public/images/README/mobile.gif" alt="mobile" width="720px">

- **tablet**:

<img src="public/images/README/tablet.gif" alt="tablet" width="720px">

- **desktop**:

<img src="public/images/README/desktop.gif" alt="desktop" width="720px">

## Contact

- **Email**: shuyaHsieh318@gmail.com
- **Cake**: https://www.cake.me/funghi0983524367
- **Linkedin**: https://www.linkedin.com/in/%E6%B7%91%E9%9B%85-%E8%AC%9D-9906772b1/

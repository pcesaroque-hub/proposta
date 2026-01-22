
export const BASE_PRICE = 5000.00; 
export const DP_FEE = 1500.00;     
export const CITY_COMPLEXITY_FEE = 400.00;
export const DIAGNOSIS_FIXED_FEE = 2000.00;
export const SALES_VOLUME_INCREMENT = 500.00; 

export const LOGO_SVG = () => (
  <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
    <path d="M20 10L40 40H0L20 10Z" fill="#2b5a91"/>
    <rect x="45" y="15" width="10" height="25" rx="2" fill="#1e3a5f"/>
    <rect x="60" y="10" width="10" height="30" rx="2" fill="#2b5a91"/>
    <rect x="75" y="20" width="10" height="20" rx="2" fill="#1e3a5f"/>
    <text x="95" y="38" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" fill="#1e3a5f">PRICING</text>
    <text x="95" y="52" fontFamily="Inter, sans-serif" fontWeight="500" fontSize="10" fill="#2b5a91" letterSpacing="0.2em">CONSULTANCY</text>
  </svg>
);

export const ICONS = {
  Car: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <path d="M5 17h10"/><path d="M9 10v2"/><path d="M13 10v2"/>
    </svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22"/><line x1="15" y1="22" x2="15" y2="22"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="12" y1="6" x2="12" y2="6"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="8" y1="6" x2="8" y2="6"/><line x1="16" y1="18" x2="16" y2="18"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="16" y1="6" x2="16" y2="6"/>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
};

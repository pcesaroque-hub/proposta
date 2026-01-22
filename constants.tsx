
export const BASE_PRICE = 5000.00; 
export const DP_FEE = 1500.00;     
export const CITY_COMPLEXITY_FEE = 400.00;
export const DIAGNOSIS_FIXED_FEE = 2000.00;
export const SALES_VOLUME_INCREMENT = 500.00;
export const SYSTEM_PARAMETRIZATION_FEE = 5000.00;

export const DEFAULT_LOGO_URL = "https://dvzuzslkpcyaupkfkmen.supabase.co/storage/v1/object/sign/midias/WhatsApp%20Image%202026-01-22%20at%2011.35.17.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMzU2Y2YzNi04NzBhLTRlMGItYjc0Yy00ZWY5NWZjOWMxODAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWRpYXMvV2hhdHNBcHAgSW1hZ2UgMjAyNi0wMS0yMiBhdCAxMS4zNS4xNy5qcGVnIiwiaWF0IjoxNzY5MTA3MzkxLCJleHAiOjE4MDA2NDMzOTF9._3w1UbEy-tNtTF1M6RJsaKTeZVQobHsWdjAW_8jSt58";

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
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

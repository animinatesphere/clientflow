export default function Logo({ size = 48, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 88 88" 
      fill="none" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="88" height="88" rx="22" fill="#25D366"/>
      <rect x="10" y="10" width="68" height="68" rx="16" fill="#1db954"/>
      <rect x="18" y="24" width="38" height="6" rx="3" fill="#ffffff"/>
      <rect x="18" y="36" width="28" height="6" rx="3" fill="rgba(255,255,255,0.65)"/>
      <polygon points="18,58 30,50 30,58" fill="#ffffff"/>
      <rect x="30" y="52" width="36" height="6" rx="3" fill="#ffffff"/>
      <path d="M0 68 Q0 88 18 88 L70 88 Q88 88 88 68 Z" fill="#1aab52"/>
    </svg>
  );
}

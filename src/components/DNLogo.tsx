interface DNLogoProps {
  className?: string;
  size?: number;
}

const DNLogo = ({ className = "", size = 40 }: DNLogoProps) => {
  return (
    <div 
      className={`inline-flex items-center justify-center font-bold text-white bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      DN
    </div>
  );
};

export default DNLogo;
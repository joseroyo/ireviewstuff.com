type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer";
  const variants = {
    primary: "bg-primary font-bold text-secondary hover:bg-btn-primary-hover",
    secondary: "bg-lowlight border-1 text-primary hover:bg-gray-100",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${className} ${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
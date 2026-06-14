type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer";
  const variants = {
    primary: "bg-primary text-secondary hover:bg-gray-700",
    secondary: "bg-white border-1 text-black hover:bg-gray-100",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
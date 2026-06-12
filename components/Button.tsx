type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-700",
    secondary: "bg-white border-1 text-black hover:bg-gray-100",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
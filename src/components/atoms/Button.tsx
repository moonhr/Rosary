/**
 * 버튼 컴포넌트
 * @param children 버튼 텍스트
 * @param onClick 버튼 클릭 이벤트
 * @param className 버튼 클래스명
 * @returns 버튼 컴포넌트
 */
const Button = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;

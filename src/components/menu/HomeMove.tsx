import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import Button from "../atoms/Button";

const HomeMove = () => {
  const router = useRouter();

  const handleHomeMove = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={handleHomeMove}>
        <FaHome />
      </Button>
    </div>
  );
};

export default HomeMove;

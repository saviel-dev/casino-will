import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-background border-b py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Casino Predictor
        </Link>
        <Link to="/login">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;

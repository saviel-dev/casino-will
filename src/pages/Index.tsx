import LotteryPredictor from '@/components/LotteryPredictor';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/fondo.png';

const Index = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', filter: 'blur(4px)' }}></div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto pt-8 relative z-10">
        <div className="flex justify-end mb-6">
          <Link to="/login">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-zinc-800 hover:border-zinc-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <LotteryPredictor />
      </div>
    </div>
  );
};

export default Index;

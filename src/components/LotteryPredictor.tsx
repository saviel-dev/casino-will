import React, { useState, useEffect } from 'react';
import lottoActivo from '../assets/loto activo.png';
import granjita from '../assets/granjita.png';
import selva from '../assets/selva.png';
import lottoVenezuela from '../assets/lottoVenezuela.png';
import ruletaBrasil from '../assets/ruletaBrasil.png';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp, Target, Crown, Facebook, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// We need to create a custom TikTok icon since it's not available in lucide-react
const TikTokIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

interface PredictionResult {
  numbers: string[];
  confidence: number;
  algorithm: string;
}

const LotteryPredictor = () => {
  const [inputNumber, setInputNumber] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  // Función para buscar números en la base de datos
  const findNumbersInDatabase = async (inputNum: string): Promise<PredictionResult | null> => {
    try {
      console.log('Buscando en la base de datos con número:', inputNum);
      
      // Primero intentamos con el número tal cual
      let { data, error } = await supabase
        .from('reference_numbers')
        .select('*')
        .eq('input_number', inputNum)
        .single();

      // Si no encontramos resultados y el número es de un dígito, intentamos con el formato 0X
      if (!data && inputNum.length === 1) {
        const paddedNum = inputNum.padStart(2, '0');
        console.log('Intentando con número con padding:', paddedNum);
        
        ({ data, error } = await supabase
          .from('reference_numbers')
          .select('*')
          .eq('input_number', paddedNum)
          .single());
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error buscando en la base de datos:', error);
        return null;
      }
      
      if (data) {
        console.log('Datos encontrados:', data);
        return {
          numbers: [data.output_number1, data.output_number2, data.output_number3, data.output_number4],
          confidence: 100,
          algorithm: 'Base de Datos'
        };
      }

      console.log('No se encontraron datos para el número:', inputNum);
      return null;
    } catch (error) {
      console.error('Error buscando en la base de datos:', error);
      return null;
    }
  };

  const handlePredict = async () => {
    if (!inputNumber) {
      toast.error('Por favor ingresa un número');
      return;
    }

    const numInt = parseInt(inputNumber);
    if (isNaN(numInt) || numInt < 0 || numInt > 36) {
      toast.error('Por favor ingresa un número válido entre 0 y 36');
      return;
    }

    // Usar el número tal como fue ingresado
    console.log('Iniciando búsqueda con número:', inputNumber);

    setIsGenerating(true);
    setAnimateCards(false);
    
    const result = await findNumbersInDatabase(inputNumber);
    
    if (result) {
      setPrediction(result);
      setAnimateCards(true);
      toast.success('¡Números encontrados en la base de datos!');
    } else {
      toast.error('No se encontraron números para esta entrada');
      setPrediction(null);
    }
    
    setIsGenerating(false);


  };

  const NumberCard = ({ number, index }: { number: string; index: number }) => {
    const lotteryMap: { [key: string]: { image: string; alt: string } } = {
      '1': { image: lottoActivo, alt: 'LOTTO ACTIVO' },
      '2': { image: granjita, alt: 'GRANJITA' },
      '3': { image: selva, alt: 'SELVA' },
      '4': { image: lottoVenezuela, alt: 'LOTTO VENEZUELA' },
      '5': { image: ruletaBrasil, alt: 'RULETON BRASIL' }
    };

    const lottery = lotteryMap[(index + 1).toString()];

    return (
      <Card
        className={`w-48 h-56 flex flex-col items-center justify-between text-center transform transition-all duration-500 ${animateCards ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} bg-slate-900 border-casino-gold/30`}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        <CardHeader className="pb-2 pt-2">
          <CardTitle className="text-sm text-casino-gold">
            <img 
              src={lottery.image} 
              alt={lottery.alt} 
              className="w-24 h-24 object-contain mx-auto drop-shadow-lg"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-3xl font-bold text-casino-gold mb-2">{number.toString().padStart(2, '0')}</div>
          <div className="text-sm text-slate-300">
            {index === 0 ? 'Principal' : index === 1 ? 'Segundo' : index === 2 ? 'Tercero' : 'Cuarto'}
          </div>
        </CardContent>
      </Card>
    );
  };

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="floating-particles"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingParticles />
      
      {/* Header */}
      <div className="relative z-10 text-center py-8 animate-fade-in-up">
        <div className="flex items-center justify-center mb-4">
          <Crown className="w-12 h-12 text-casino-gold mr-4 animate-glow-pulse" />
          <h1 className="text-5xl font-bold text-shimmer">
            Tendencias de DRACULOTTO
          </h1>
          <Crown className="w-12 h-12 text-casino-gold ml-4 animate-glow-pulse" />
        </div>
        <p className="text-xl text-slate-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          ¡Coloque su numero de la suerte!
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Input Section */}
          <Card className="casino-card mb-8 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-center text-casino-gold flex items-center justify-center">
                <Target className="w-6 h-6 mr-2" />
                Ingrese un número (0-36)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Input
                  type="text"
                  pattern="\d*"
                  maxLength={2}
                  value={inputNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir campo vacío o números
                    if (value === '' || /^\d{1,2}$/.test(value)) {
                      if (value === '') {
                        setInputNumber('');
                      } else {
                        const num = parseInt(value);
                        if (!isNaN(num) && num >= 0 && num <= 36) {
                          setInputNumber(value);
                        }
                      }
                    }
                  }}
                  placeholder="Ingresa tu número"
                  className="text-center text-xl font-bold bg-slate-800 border-casino-gold/30 text-white max-w-xs"
                />
                <Button
                  onClick={handlePredict}
                  disabled={isGenerating}
                  className="casino-button relative overflow-hidden"
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                      ¡Pronosticar numero!
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Results */}
          {prediction && (
            <Card className="casino-card animate-fade-in-scale">
              <CardHeader>
                <CardTitle className="text-center text-casino-gold text-2xl">
                  Pronóstico para el número {inputNumber}
                </CardTitle>
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">
                    Números encontrados en la base de datos
                  </div>
                  <div className="text-casino-gold font-bold">
                    Coincidencia exacta
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {prediction.numbers.map((number, index) => (
                    <Card key={index} className="bg-gradient-to-br from-black/50 to-black/70 border-casino-gold/50 hover:border-casino-gold transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-casino-gold/20">
                      <CardHeader>
                        <CardTitle className="text-casino-gold text-center text-lg">
                          {index === 0 ? 'Primer Número' : index === 1 ? 'Segundo Número' : index === 2 ? 'Tercer Número' : 'Cuarto Número'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-5xl font-bold text-white mb-2">{number.toString().padStart(2, '0')}</div>
                          <div className="text-sm text-casino-gold/80">Base de Datos</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media and Brand */}
          <div className="mt-8 text-center">
            <div className="text-center text-casino-gold text-3xl font-bold mb-4">DRACULOTTO</div>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="https://www.facebook.com/profile.php?id=100090371612857" target="_blank" rel="noopener noreferrer" className="text-white hover:text-casino-gold transition-colors">
                <Facebook className="w-8 h-8" />
              </a>
              <a href="https://www.instagram.com/draculotto/?igsh=MWF5NnlqOTZ3Y2ZzMQ%3D%3D#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-casino-gold transition-colors">
                <Instagram className="w-8 h-8" />
              </a>
              <a href="https://www.tiktok.com/@draculotto?_t=ZM-8wZnVtnE80O&_r=1" target="_blank" rel="noopener noreferrer" className="text-white hover:text-casino-gold transition-colors">
                <TikTokIcon className="w-8 h-8" />
              </a>
            </div>
          </div>

          {/* Lottery Brands */}
          <div className="mt-10 mb-6">
            <Separator className="bg-casino-gold/20 mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {/* LOTTO ACTIVO */}
              <div className="lottery-brand">
                <div className="h-16 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-casino-gold/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-casino-gold">LA</span>
                  </div>
                </div>
                <div className="text-casino-gold font-bold text-lg mt-2">LOTTO ACTIVO</div>
              </div>

              {/* GRANJITA */}
              <div className="lottery-brand">
                <div className="h-16 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-casino-gold/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-casino-gold">G</span>
                  </div>
                </div>
                <div className="text-casino-gold font-bold text-lg mt-2">GRANJITA</div>
              </div>

              {/* SELVA */}
              <div className="lottery-brand">
                <div className="h-16 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-casino-gold/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-casino-gold">S</span>
                  </div>
                </div>
                <div className="text-casino-gold font-bold text-lg mt-2">SELVA</div>
              </div>

              {/* LOTTO VENEZUELA */}
              <div className="lottery-brand">
                <div className="h-16 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-casino-gold/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-casino-gold">LV</span>
                  </div>
                </div>
                <div className="text-casino-gold font-bold text-lg mt-2">LOTTO VENEZUELA</div>
              </div>

              {/* RULETON BRASIL */}
              <div className="lottery-brand">
                <div className="h-16 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-casino-gold/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-casino-gold">RB</span>
                  </div>
                </div>
                <div className="text-casino-gold font-bold text-lg mt-2">RULETON BRASIL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-slate-400 text-sm">
        © 2025 Pronosticador Numérico - Todos los derechos reservados
      </footer>
    </div>
  );
};

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="floating-particles"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${4 + Math.random() * 4}s`
        }}
      />
    ))}
  </div>
);

export default LotteryPredictor;

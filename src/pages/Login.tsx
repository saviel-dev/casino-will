import { useState } from "react";
import { ArrowLeft, Lock, LogIn, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Draculotto" && password === "2310") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin");
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de administración",
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black p-4">
      <div className="fixed top-4 left-4">
        <Link to="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </Button>
        </Link>
      </div>

      <Card className="w-[400px] border-zinc-800/50 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 pointer-events-none" />
        
        <CardHeader className="text-center space-y-4 relative">
          <div className="mx-auto bg-gradient-to-b from-blue-500 to-purple-600 p-0.5 rounded-full w-16 h-16">
            <div className="bg-black/90 w-full h-full rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Panel Administrativo
            </CardTitle>
            <p className="text-white/70 text-sm">Ingresa tus credenciales para continuar</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white text-sm">Usuario</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/50 border-zinc-800 focus:border-blue-500/50 pl-10 transition-all duration-300 text-white placeholder:text-white/50"
                />
                <User className="w-4 h-4 absolute left-3 top-3 text-white/50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-zinc-800 focus:border-blue-500/50 pl-10 transition-all duration-300 text-white placeholder:text-white/50"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-white/50" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 rounded-lg"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Acceder al Sistema
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

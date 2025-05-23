import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, LogOut, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface ReferenceNumber {
  id: number;
  input_number: string;
  output_number1: string;
  output_number2: string;
  output_number3: string;
  output_number4: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [referenceNumbers, setReferenceNumbers] = useState<ReferenceNumber[]>([]);

  const fetchReferences = async () => {
    try {
      const { data, error } = await supabase
        .from('reference_numbers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferenceNumbers(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cargar los números de referencia",
      });
    }
  };
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newInput, setNewInput] = useState("");
  const [searchResults, setSearchResults] = useState<ReferenceNumber | null>(null);
  const [outputs, setOutputs] = useState<string[]>(["", "", "", ""]);
  const [newOutputs, setNewOutputs] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchReferences();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const clearForm = () => {
    setNewInput("");
    setOutputs(["", "", ""]);
    setEditingIndex(null);
  };

  const handleSave = async (index: number) => {
    if (!newInput || outputs.some(o => !o.trim())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes ingresar un número de entrada y los cuatro números de salida",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reference_numbers')
        .update({
          input_number: newInput,
          output_number1: outputs[0],
          output_number2: outputs[1],
          output_number3: outputs[2],
          output_number4: outputs[3]
        })
        .eq('id', referenceNumbers[index].id);

      if (error) throw error;
      
      fetchReferences();
      clearForm();
      toast({
        title: "Éxito",
        description: "Números de referencia actualizados correctamente",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al actualizar la referencia",
      });
    }
  };

  const handleAdd = async () => {
    if (!newInput || outputs.some(o => !o.trim())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes ingresar un número de entrada y los cuatro números de salida",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reference_numbers')
        .insert({
          input_number: newInput,
          output_number1: outputs[0],
          output_number2: outputs[1],
          output_number3: outputs[2],
          output_number4: outputs[3]
        });

      if (error) throw error;

      fetchReferences();
      clearForm();
      toast({
        title: "Éxito",
        description: "Nueva referencia agregada correctamente",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al agregar la referencia",
      });
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const { error } = await supabase
        .from('reference_numbers')
        .delete()
        .eq('id', referenceNumbers[index].id);

      if (error) throw error;

      fetchReferences();
      toast({
        title: "Éxito",
        description: "Referencia eliminada correctamente",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al eliminar la referencia",
      });
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setNewInput(referenceNumbers[index].input_number);
    setOutputs([
      referenceNumbers[index].output_number1,
      referenceNumbers[index].output_number2,
      referenceNumbers[index].output_number3,
      referenceNumbers[index].output_number4
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Gestión de Números de Referencia
            </h1>
            <p className="text-white/70">Administra los números que aparecerán en el predictor</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg shadow-red-500/30 transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:border-white/30 transition-all duration-300 shadow-xl shadow-black/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-white">Números de Referencia Actuales</span>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/30 transition-all duration-300"
                  onClick={() => {
                    setEditingIndex(null);
                    setNewInput("");
                    setNewOutputs("");
                  }}
                >
                  Agregar Nuevo
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Formulario para agregar/editar */}
              <div className="p-4 border border-white/10 rounded-lg space-y-4 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-lg font-medium text-white">
                    {editingIndex !== null ? "Editar Referencia" : "Agregar Nueva Referencia"}
                  </h3>
                  {editingIndex !== null && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingIndex(null);
                        setNewInput("");
                        setNewOutputs("");
                      }}
                      className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 shadow-lg shadow-slate-500/30 transition-all duration-300"
                    >
                      Cancelar Edición
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newInput" className="text-white flex items-center gap-2">
                      <span className="text-white/70">Número de Entrada</span>
                      <span className="text-xs text-white/50">(Ej: 05)</span>
                    </Label>
                    <Input
                      id="newInput"
                      value={newInput}
                      onChange={async (e) => {
                        const value = e.target.value;
                        setNewInput(value);
                        if (value.length === 2) {
                          try {
                            const { data, error } = await supabase
                              .from('reference_numbers')
                              .select('*')
                              .eq('input_number', value)
                              .single();

                            if (error && error.code !== 'PGRST116') throw error;

                            if (data) {
                              setOutputs([
                                data.output_number1,
                                data.output_number2,
                                data.output_number3,
                                data.output_number4
                              ]);
                              toast({
                                title: "Números encontrados",
                                description: `Salidas: ${[data.output_number1, data.output_number2, data.output_number3, data.output_number4].join(', ')}`
                              });
                            } else {
                              setOutputs(["", "", "", ""]);
                            }
                          } catch (error) {
                            console.error('Error buscando referencia:', error);
                            toast({
                              variant: "destructive",
                              title: "Error",
                              description: "Error al buscar la referencia"
                            });
                          }
                        }
                      }}
                      className="bg-black/50 border-white/20 text-white placeholder:text-white/30 text-lg font-medium text-center"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white flex items-center gap-2">
                      <span className="text-white/70">Números de Salida</span>
                      <span className="text-xs text-white/50">(Cuatro números)</span>
                    </Label>
                    <div className="grid grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <Input
                          key={i}
                          value={outputs[i]}
                          onChange={(e) => {
                            const newOutputs = [...outputs];
                            newOutputs[i] = e.target.value;
                            setOutputs(newOutputs);
                          }}
                          className="bg-black/50 border-white/20 text-white text-lg font-medium text-center"
                          maxLength={2}
                          placeholder={(i + 1).toString()}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => editingIndex === null ? handleAdd() : handleSave(editingIndex)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-blue-500/30 transition-all duration-300 mt-4"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingIndex === null ? "Agregar Referencia" : "Guardar Cambios"}
                </Button>
              </div>

              {/* Lista de referencias existentes */}
              <div className="space-y-2">
                {referenceNumbers.map((ref, index) => (
                  <div
                    key={index}
                    className={`p-4 border border-white/10 rounded-lg flex items-center justify-between transition-all duration-300 ${editingIndex === index ? 'bg-white/20 border-blue-500/50' : 'hover:bg-white/5'}`}
                  >
                    <div className="space-y-1">
                      <div className="text-lg font-medium text-white">
                        Entrada: {ref.input_number}
                      </div>
                      <div className="text-white/70">
                        Salidas: {[ref.output_number1, ref.output_number2, ref.output_number3, ref.output_number4].join(", ")}
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg shadow-amber-500/30 transition-all duration-300"
                        onClick={() => startEditing(index)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg shadow-amber-500/30 transition-all duration-300"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

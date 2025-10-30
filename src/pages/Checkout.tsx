import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Check, Lock, CreditCard, Info } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing
    navigate("/success");
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + " / " + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">StatCalc Pro</span>
          </Link>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Finalizar Compra</h1>
          <p className="text-muted-foreground">Transação segura e criptografada.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Plano Profissional - Anual</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Análises estatísticas avançadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Upload de datasets ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Suporte prioritário por e-mail</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Plano Profissional - Anual</span>
                  <span>R$ 1.200,00</span>
                </div>
                <div className="flex justify-between text-sm text-success">
                  <span>Desconto (Primeiro Ano)</span>
                  <span>-R$ 200,00</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>R$ 1.000,00</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Método de Pagamento</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5" />
                        <span>Cartão de Crédito</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent opacity-60">
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal" className="cursor-pointer flex-1">
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "credit-card" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        placeholder="John M. Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          className="pl-10"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Validade (MM/AA)</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM / AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={7}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv" className="flex items-center gap-1">
                          CVV
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" size="lg">
                  Confirmar Pagamento
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Ao confirmar, você concorda com nossos{" "}
                  <Link to="/about" className="text-primary hover:underline">
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link to="/about" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                  .
                </p>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="w-10 h-7 bg-primary/10 rounded flex items-center justify-center text-xs font-bold text-primary">
                    VISA
                  </div>
                  <div className="w-10 h-7 bg-orange-500/10 rounded flex items-center justify-center text-xs font-bold text-orange-600">
                    MC
                  </div>
                  <div className="w-10 h-7 bg-blue-500/10 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                    ELO
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>SSL Secured</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2024 StatCalc Pro. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Checkout;

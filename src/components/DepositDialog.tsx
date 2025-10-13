import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Wallet, Bitcoin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DepositDialog = () => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleCopyPix = () => {
    const pixKey = 'exemplo@pix.com.br';
    navigator.clipboard.writeText(pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "Cole no seu app de pagamento"
    });
  };

  const handleCopyCrypto = () => {
    const walletAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Endereço copiado!",
      description: "Use para enviar Bitcoin"
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-success hover:bg-success/90 text-white font-semibold px-6">
          <Wallet className="w-4 h-4 mr-2" />
          Depositar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Fazer Depósito</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="pix" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pix" className="gap-2">
              <span className="text-lg">💳</span>
              PIX
            </TabsTrigger>
            <TabsTrigger value="crypto" className="gap-2">
              <Bitcoin className="w-4 h-4" />
              Cripto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pix" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount-pix">Valor (R$)</Label>
              <Input
                id="amount-pix"
                type="number"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Chave PIX</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPix}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </Button>
              </div>
              <div className="font-mono text-sm break-all">exemplo@pix.com.br</div>
            </div>

            <div className="bg-muted/30 p-3 rounded text-xs text-muted-foreground">
              <strong>Instruções:</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Copie a chave PIX acima</li>
                <li>Abra seu app de pagamento</li>
                <li>Faça a transferência do valor desejado</li>
                <li>Seu saldo será creditado automaticamente</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount-crypto">Valor (USD)</Label>
              <Input
                id="amount-crypto"
                type="number"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bitcoin (BTC)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCrypto}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </Button>
              </div>
              <div className="font-mono text-xs break-all">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</div>
            </div>

            <div className="bg-muted/30 p-3 rounded text-xs text-muted-foreground">
              <strong>Instruções:</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Copie o endereço da wallet acima</li>
                <li>Envie Bitcoin para este endereço</li>
                <li>Aguarde 3 confirmações na rede</li>
                <li>Seu saldo será creditado automaticamente</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

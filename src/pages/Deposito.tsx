import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Wallet, Bitcoin, Copy, Check, QrCode, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pixDepositSchema = z.object({
  valor: z.number().min(10, 'Valor mínimo é R$ 10,00').max(50000, 'Valor máximo é R$ 50.000,00'),
});

const cryptoDepositSchema = z.object({
  valor: z.number().min(0.001, 'Valor mínimo é 0.001'),
  moeda: z.string().min(1, 'Selecione uma criptomoeda'),
});

type PixDepositData = z.infer<typeof pixDepositSchema>;
type CryptoDepositData = z.infer<typeof cryptoDepositSchema>;

type TransactionHistory = {
  id: string;
  date: string;
  type: 'PIX' | 'BTC' | 'ETH' | 'USDT';
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  fee: string;
};

const mockTransactions: TransactionHistory[] = [
  {
    id: 'DEP001',
    date: '13/10/2025 14:30',
    type: 'PIX',
    amount: 'R$ 250,00',
    status: 'completed',
    fee: 'R$ 0,00'
  },
  {
    id: 'DEP002',
    date: '12/10/2025 09:15',
    type: 'BTC',
    amount: '0.005 BTC',
    status: 'completed',
    fee: '0.0001 BTC'
  },
  {
    id: 'DEP003',
    date: '11/10/2025 16:45',
    type: 'USDT',
    amount: '500 USDT',
    status: 'pending',
    fee: '2 USDT'
  },
  {
    id: 'DEP004',
    date: '10/10/2025 11:20',
    type: 'PIX',
    amount: 'R$ 100,00',
    status: 'failed',
    fee: 'R$ 0,00'
  }
];

const cryptoCurrencies = [
  { value: 'BTC', label: 'Bitcoin (BTC)', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', fee: '0.0005' },
  { value: 'ETH', label: 'Ethereum (ETH)', address: '0x742d35Cc6630C0532c0C0c0c0c0c0c0c0c0c0c0c', fee: '0.01' },
  { value: 'USDT', label: 'Tether (USDT)', address: 'TQn9Y2khEsLMWRJjTfGhXdC4p3C4MjVF8o', fee: '1.0' },
];

export default function Deposito() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pix');
  const [pixQrGenerated, setPixQrGenerated] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');

  const pixForm = useForm<PixDepositData>({
    resolver: zodResolver(pixDepositSchema),
  });

  const cryptoForm = useForm<CryptoDepositData>({
    resolver: zodResolver(cryptoDepositSchema),
  });

  const onPixSubmit = async (data: PixDepositData) => {
    try {
      console.log('PIX Deposit:', data);
      setPixQrGenerated(true);
      // Aqui você faria a chamada para gerar o QR code PIX
    } catch (error) {
      console.error('Erro no depósito PIX:', error);
    }
  };

  const onCryptoSubmit = async (data: CryptoDepositData) => {
    try {
      console.log('Crypto Deposit:', data);
      // Aqui você faria a chamada para processar o depósito crypto
      alert('Endereço gerado! Envie a criptomoeda para o endereço fornecido.');
    } catch (error) {
      console.error('Erro no depósito crypto:', error);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">OB</span>
              <span className="text-destructive">NESS</span>
            </h1>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <h2 className="text-lg font-semibold text-muted-foreground">Depósito</h2>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Deposit Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Fazer Depósito
                </CardTitle>
                <CardDescription>
                  Escolha entre PIX ou Criptomoedas para adicionar saldo à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pix">PIX</TabsTrigger>
                    <TabsTrigger value="crypto">Criptomoedas</TabsTrigger>
                  </TabsList>

                  {/* PIX Tab */}
                  <TabsContent value="pix" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PIX</span>
                        </div>
                        <span className="font-medium">Depósito via PIX</span>
                        <Badge variant="outline" className="text-green-600">Instantâneo</Badge>
                      </div>

                      {!pixQrGenerated ? (
                        <form onSubmit={pixForm.handleSubmit(onPixSubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="valorPix">Valor do Depósito</Label>
                            <Input
                              id="valorPix"
                              type="number"
                              placeholder="Ex: 100.00"
                              step="0.01"
                              min="10"
                              max="50000"
                              {...pixForm.register('valor', { valueAsNumber: true })}
                              className={pixForm.formState.errors.valor ? 'border-destructive' : ''}
                            />
                            {pixForm.formState.errors.valor && (
                              <p className="text-sm text-destructive">{pixForm.formState.errors.valor.message}</p>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Valor mínimo: R$ 10,00 | Valor máximo: R$ 50.000,00
                            </div>
                          </div>

                          <Button type="submit" className="w-full" disabled={pixForm.formState.isSubmitting}>
                            {pixForm.formState.isSubmitting ? 'Gerando QR Code...' : 'Gerar QR Code PIX'}
                          </Button>
                        </form>
                      ) : (
                        <div className="space-y-4 text-center">
                          <div className="bg-muted/50 p-8 rounded-lg">
                            <QrCode className="w-32 h-32 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">QR Code PIX gerado</p>
                          </div>

                          <div className="space-y-2">
                            <p className="font-medium">Código PIX Copia e Cola:</p>
                            <div className="flex items-center gap-2">
                              <Input
                                value="00020126360014br.gov.bcb.pix0114+55119999999990210Deposito0303UPI6304ABCD"
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard("00020126360014br.gov.bcb.pix0114+55119999999990210Deposito0303UPI6304ABCD", "pix")}
                              >
                                {copiedAddress === 'pix' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="bg-blue-500/10 p-4 rounded-lg">
                            <p className="text-sm text-blue-600">
                              <strong>Instruções:</strong><br />
                              1. Abra seu app bancário<br />
                              2. Escaneie o QR Code ou cole o código<br />
                              3. Confirme o pagamento<br />
                              4. Aguarde a confirmação (até 5 minutos)
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => setPixQrGenerated(false)}
                            className="w-full"
                          >
                            Fazer Novo Depósito
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Crypto Tab */}
                  <TabsContent value="crypto" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-6 h-6 text-orange-500" />
                        <span className="font-medium">Depósito via Criptomoedas</span>
                        <Badge variant="outline" className="text-orange-500">Rede Blockchain</Badge>
                      </div>

                      <form onSubmit={cryptoForm.handleSubmit(onCryptoSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="moeda">Criptomoeda</Label>
                          <Select {...cryptoForm.register('moeda')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma criptomoeda" />
                            </SelectTrigger>
                            <SelectContent>
                              {cryptoCurrencies.map((crypto) => (
                                <SelectItem key={crypto.value} value={crypto.value}>
                                  {crypto.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="valorCrypto">Valor</Label>
                          <Input
                            id="valorCrypto"
                            type="number"
                            placeholder="Ex: 0.001"
                            step="0.000001"
                            min="0.001"
                            {...cryptoForm.register('valor', { valueAsNumber: true })}
                            className={cryptoForm.formState.errors.valor ? 'border-destructive' : ''}
                          />
                          {cryptoForm.formState.errors.valor && (
                            <p className="text-sm text-destructive">{cryptoForm.formState.errors.valor.message}</p>
                          )}
                        </div>

                        <Button type="submit" className="w-full" disabled={cryptoForm.formState.isSubmitting}>
                          {cryptoForm.formState.isSubmitting ? 'Gerando Endereço...' : 'Gerar Endereço de Depósito'}
                        </Button>
                      </form>

                      {/* Example Address Display */}
                      <div className="space-y-4 border-t pt-4">
                        <p className="font-medium">Endereços de Depósito:</p>
                        {cryptoCurrencies.map((crypto) => (
                          <div key={crypto.value} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{crypto.label}</span>
                              <Badge variant="outline">Taxa: {crypto.fee} {crypto.value}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                value={crypto.address}
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(crypto.address, crypto.value)}
                              >
                                {copiedAddress === crypto.value ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Depósitos</CardTitle>
                <CardDescription>Últimas transações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          <span className="font-medium text-sm">{transaction.type}</span>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status === 'completed' ? 'Concluído' :
                             transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        <p className="font-medium">{transaction.amount}</p>
                        <p className="text-xs text-muted-foreground">Taxa: {transaction.fee}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
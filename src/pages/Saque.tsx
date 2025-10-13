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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Wallet, Bitcoin, Shield, Mail, Phone, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pixSaqueSchema = z.object({
  valor: z.number().min(20, 'Valor mínimo é R$ 20,00').max(10000, 'Valor máximo é R$ 10.000,00'),
  chavePix: z.string().min(1, 'Informe sua chave PIX'),
  tipoChave: z.enum(['cpf', 'email', 'telefone', 'aleatorio']),
});

const cryptoSaqueSchema = z.object({
  valor: z.number().min(0.001, 'Valor mínimo é 0.001'),
  moeda: z.string().min(1, 'Selecione uma criptomoeda'),
  endereco: z.string().min(26, 'Endereço da carteira inválido'),
});

const twoFactorSchema = z.object({
  codigo: z.string().length(6, 'Código deve ter 6 dígitos'),
});

type PixSaqueData = z.infer<typeof pixSaqueSchema>;
type CryptoSaqueData = z.infer<typeof cryptoSaqueSchema>;
type TwoFactorData = z.infer<typeof twoFactorSchema>;

type WithdrawalHistory = {
  id: string;
  date: string;
  type: 'PIX' | 'BTC' | 'ETH' | 'USDT';
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fee: string;
  destination: string;
};

const mockWithdrawals: WithdrawalHistory[] = [
  {
    id: 'SAQ001',
    date: '13/10/2025 12:15',
    type: 'PIX',
    amount: 'R$ 150,00',
    status: 'completed',
    fee: 'R$ 3,00',
    destination: '***@gmail.com'
  },
  {
    id: 'SAQ002',
    date: '11/10/2025 18:30',
    type: 'BTC',
    amount: '0.002 BTC',
    status: 'processing',
    fee: '0.0005 BTC',
    destination: '1A1z...DivfNa'
  },
  {
    id: 'SAQ003',
    date: '10/10/2025 14:20',
    type: 'PIX',
    amount: 'R$ 300,00',
    status: 'failed',
    fee: 'R$ 3,00',
    destination: '***.***.***-**'
  }
];

const cryptoCurrencies = [
  { value: 'BTC', label: 'Bitcoin (BTC)', minWithdraw: '0.001', fee: '0.0005' },
  { value: 'ETH', label: 'Ethereum (ETH)', minWithdraw: '0.01', fee: '0.005' },
  { value: 'USDT', label: 'Tether (USDT)', minWithdraw: '10', fee: '2' },
];

export default function Saque() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pix');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'sms'>('email');
  const [pendingWithdrawal, setPendingWithdrawal] = useState<any>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const pixForm = useForm<PixSaqueData>({
    resolver: zodResolver(pixSaqueSchema),
  });

  const cryptoForm = useForm<CryptoSaqueData>({
    resolver: zodResolver(cryptoSaqueSchema),
  });

  const twoFactorForm = useForm<TwoFactorData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const formatChavePix = (value: string, type: string) => {
    switch (type) {
      case 'cpf':
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 'telefone':
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      default:
        return value;
    }
  };

  const onPixSubmit = async (data: PixSaqueData) => {
    try {
      console.log('PIX Withdrawal:', data);
      setPendingWithdrawal({ ...data, method: 'PIX' });
      setShow2FA(true);
    } catch (error) {
      console.error('Erro no saque PIX:', error);
    }
  };

  const onCryptoSubmit = async (data: CryptoSaqueData) => {
    try {
      console.log('Crypto Withdrawal:', data);
      setPendingWithdrawal({ ...data, method: 'CRYPTO' });
      setShow2FA(true);
    } catch (error) {
      console.error('Erro no saque crypto:', error);
    }
  };

  const send2FACode = () => {
    setVerificationSent(true);
    // Simula envio do código
    setTimeout(() => {
      alert(`Código de verificação enviado via ${twoFactorMethod === 'email' ? 'e-mail' : 'SMS'}`);
    }, 1000);
  };

  const onTwoFactorSubmit = async (data: TwoFactorData) => {
    try {
      console.log('2FA Code:', data.codigo);
      // Simula verificação do código
      if (data.codigo === '123456') {
        alert('Saque processado com sucesso! Você receberá o valor em até 24 horas.');
        setShow2FA(false);
        setPendingWithdrawal(null);
        setVerificationSent(false);
        // Reset forms
        pixForm.reset();
        cryptoForm.reset();
        twoFactorForm.reset();
      } else {
        alert('Código inválido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na verificação 2FA:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
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
      case 'processing':
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  if (show2FA) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-background border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShow2FA(false);
                setPendingWithdrawal(null);
                setVerificationSent(false);
              }}
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
            <h2 className="text-lg font-semibold text-muted-foreground">Verificação de Segurança</h2>
          </div>
        </header>

        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verificação em 2 Fatores
              </CardTitle>
              <CardDescription>
                Por segurança, confirme sua identidade para processar o saque
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Withdrawal Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Resumo do Saque:</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Método:</span>
                    <span>{pendingWithdrawal?.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor:</span>
                    <span>{pendingWithdrawal?.method === 'PIX' ? `R$ ${pendingWithdrawal?.valor}` : `${pendingWithdrawal?.valor} ${pendingWithdrawal?.moeda}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destino:</span>
                    <span className="truncate max-w-48">
                      {pendingWithdrawal?.method === 'PIX' ? pendingWithdrawal?.chavePix : pendingWithdrawal?.endereco}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2FA Method Selection */}
              <div className="space-y-4">
                <Label>Método de verificação:</Label>
                <RadioGroup
                  value={twoFactorMethod}
                  onValueChange={(value: 'email' | 'sms') => setTwoFactorMethod(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail (user@*****.com)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      SMS ((11) 9****-9999)
                    </Label>
                  </div>
                </RadioGroup>

                {!verificationSent ? (
                  <Button onClick={send2FACode} className="w-full">
                    Enviar Código de Verificação
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Código enviado para {twoFactorMethod === 'email' ? 'seu e-mail' : 'seu telefone'}.
                        Verifique sua caixa de entrada.
                      </AlertDescription>
                    </Alert>

                    <form onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="codigo">Código de Verificação</Label>
                        <Input
                          id="codigo"
                          type="text"
                          placeholder="000000"
                          maxLength={6}
                          {...twoFactorForm.register('codigo')}
                          className={twoFactorForm.formState.errors.codigo ? 'border-destructive' : ''}
                        />
                        {twoFactorForm.formState.errors.codigo && (
                          <p className="text-sm text-destructive">{twoFactorForm.formState.errors.codigo.message}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={twoFactorForm.formState.isSubmitting}>
                          {twoFactorForm.formState.isSubmitting ? 'Verificando...' : 'Confirmar Saque'}
                        </Button>
                        <Button type="button" variant="outline" onClick={send2FACode}>
                          Reenviar
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h2 className="text-lg font-semibold text-muted-foreground">Saque</h2>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Withdrawal Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Solicitar Saque
                </CardTitle>
                <CardDescription>
                  Escolha entre PIX ou Criptomoedas para sacar seu saldo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Todos os saques passam por verificação de segurança em 2 fatores
                  </AlertDescription>
                </Alert>

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
                        <span className="font-medium">Saque via PIX</span>
                        <Badge variant="outline" className="text-green-600">Taxa R$ 3,00</Badge>
                      </div>

                      <form onSubmit={pixForm.handleSubmit(onPixSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="tipoChave">Tipo de Chave PIX</Label>
                          <Select {...pixForm.register('tipoChave')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de chave" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cpf">CPF</SelectItem>
                              <SelectItem value="email">E-mail</SelectItem>
                              <SelectItem value="telefone">Telefone</SelectItem>
                              <SelectItem value="aleatorio">Chave Aleatória</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="chavePix">Chave PIX</Label>
                          <Input
                            id="chavePix"
                            placeholder="Digite sua chave PIX"
                            {...pixForm.register('chavePix')}
                            className={pixForm.formState.errors.chavePix ? 'border-destructive' : ''}
                          />
                          {pixForm.formState.errors.chavePix && (
                            <p className="text-sm text-destructive">{pixForm.formState.errors.chavePix.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="valorPix">Valor do Saque</Label>
                          <Input
                            id="valorPix"
                            type="number"
                            placeholder="Ex: 100.00"
                            step="0.01"
                            min="20"
                            max="10000"
                            {...pixForm.register('valor', { valueAsNumber: true })}
                            className={pixForm.formState.errors.valor ? 'border-destructive' : ''}
                          />
                          {pixForm.formState.errors.valor && (
                            <p className="text-sm text-destructive">{pixForm.formState.errors.valor.message}</p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Valor mínimo: R$ 20,00 | Valor máximo: R$ 10.000,00 | Taxa: R$ 3,00
                          </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={pixForm.formState.isSubmitting}>
                          {pixForm.formState.isSubmitting ? 'Processando...' : 'Solicitar Saque PIX'}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>

                  {/* Crypto Tab */}
                  <TabsContent value="crypto" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-6 h-6 text-orange-500" />
                        <span className="font-medium">Saque via Criptomoedas</span>
                        <Badge variant="outline" className="text-orange-500">Taxa de Rede</Badge>
                      </div>

                      <form onSubmit={cryptoForm.handleSubmit(onCryptoSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="moedaSaque">Criptomoeda</Label>
                          <Select {...cryptoForm.register('moeda')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma criptomoeda" />
                            </SelectTrigger>
                            <SelectContent>
                              {cryptoCurrencies.map((crypto) => (
                                <SelectItem key={crypto.value} value={crypto.value}>
                                  {crypto.label} - Taxa: {crypto.fee} {crypto.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endereco">Endereço da Carteira</Label>
                          <Input
                            id="endereco"
                            placeholder="Digite o endereço da sua carteira"
                            {...cryptoForm.register('endereco')}
                            className={cryptoForm.formState.errors.endereco ? 'border-destructive' : ''}
                          />
                          {cryptoForm.formState.errors.endereco && (
                            <p className="text-sm text-destructive">{cryptoForm.formState.errors.endereco.message}</p>
                          )}
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
                          {cryptoForm.formState.isSubmitting ? 'Processando...' : 'Solicitar Saque Cripto'}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal History Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Saques</CardTitle>
                <CardDescription>Últimas transações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(withdrawal.status)}
                          <span className="font-medium text-sm">{withdrawal.type}</span>
                          <Badge className={getStatusColor(withdrawal.status)}>
                            {getStatusText(withdrawal.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{withdrawal.date}</p>
                        <p className="font-medium">{withdrawal.amount}</p>
                        <p className="text-xs text-muted-foreground">Taxa: {withdrawal.fee}</p>
                        <p className="text-xs text-muted-foreground">{withdrawal.destination}</p>
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
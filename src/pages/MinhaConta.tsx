import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Lock, Phone, Mail, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const userFormSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').max(15, 'Telefone inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function MinhaConta() {
  const navigate = useNavigate();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'email' | 'sms'>('email');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('telefone', formatted);
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      console.log('Dados do usuário:', data);
      console.log('2FA habilitado:', is2FAEnabled);
      console.log('Método 2FA:', twoFactorMethod);

      // Aqui você faria a chamada para a API para salvar os dados
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula uma chamada de API

      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados. Tente novamente.');
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
          <h2 className="text-lg font-semibold text-muted-foreground">Minha Conta</h2>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Complete suas informações de cadastro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo</Label>
                  <Input
                    id="nomeCompleto"
                    placeholder="Digite seu nome completo"
                    {...register('nomeCompleto')}
                    className={errors.nomeCompleto ? 'border-destructive' : ''}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(11) 99999-9999"
                    {...register('telefone')}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    className={errors.telefone ? 'border-destructive' : ''}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-destructive">{errors.telefone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    {...register('cpf')}
                    onChange={handleCPFChange}
                    maxLength={14}
                    className={errors.cpf ? 'border-destructive' : ''}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-destructive">{errors.cpf.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Informações'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Autenticação em 2 Fatores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Autenticação em 2 Fatores
              </CardTitle>
              <CardDescription>
                Adicione uma camada extra de segurança à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base">Habilitar 2FA</div>
                  <div className="text-sm text-muted-foreground">
                    Ativar autenticação em dois fatores
                  </div>
                </div>
                <Switch
                  checked={is2FAEnabled}
                  onCheckedChange={setIs2FAEnabled}
                />
              </div>

              {is2FAEnabled && (
                <div className="space-y-4 border-t border-border/50 pt-4">
                  <div className="space-y-3">
                    <Label className="text-base">Método de verificação:</Label>
                    <RadioGroup
                      value={twoFactorMethod}
                      onValueChange={(value: 'email' | 'sms') => setTwoFactorMethod(value)}
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50">
                        <RadioGroupItem value="email" id="email-2fa" />
                        <Label htmlFor="email-2fa" className="flex items-center gap-2 cursor-pointer">
                          <Mail className="w-4 h-4" />
                          Por e-mail
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50">
                        <RadioGroupItem value="sms" id="sms-2fa" />
                        <Label htmlFor="sms-2fa" className="flex items-center gap-2 cursor-pointer">
                          <Phone className="w-4 h-4" />
                          Por SMS
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        Quando habilitada, você receberá um código de verificação via {' '}
                        {twoFactorMethod === 'email' ? 'e-mail' : 'SMS'} sempre que fizer login
                        ou realizar operações importantes.
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      alert(`Configuração 2FA salva: ${twoFactorMethod === 'email' ? 'E-mail' : 'SMS'}`);
                    }}
                  >
                    Confirmar Configuração 2FA
                  </Button>
                </div>
              )}

              {!is2FAEnabled && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      A autenticação em 2 fatores está desabilitada.
                      Recomendamos ativar para maior segurança da sua conta.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
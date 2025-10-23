import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  content: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '🎯 Bem-vindo à Obness!',
    content: 'Plataforma de apostas rápidas em BTC/USDT com foco em transparência, inclusão e sustentabilidade. Vamos te guiar pelas principais funcionalidades!',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'header',
    title: '📊 Header da Plataforma',
    content: 'Aqui você vê o preço atual do BTC em tempo real, volume 24h e pode acessar sua conta. O logo é clicável para recarregar a página.',
    target: 'header',
    position: 'bottom'
  },
  {
    id: 'chart',
    title: '📈 Gráfico TradingView',
    content: 'Gráfico com todas as ferramentas de análise técnica habilitadas. Timeframe inicial de 1 minuto, com linhas verticais a cada 5min e horizontais acompanhando o preço.',
    target: '[data-onboarding="chart"]',
    position: 'bottom'
  },
  {
    id: 'timer',
    title: '⏱️ Timer da Vela (1 Minuto)',
    content: 'Cada ciclo dura 1 minuto. Você aposta para a PRÓXIMA vela. Cor normal (0-55s) = apostas ativas. Cor vermelha (últimos 5s) = bloqueio de apostas.',
    target: '[data-onboarding="timer"]',
    position: 'left'
  },
  {
    id: 'amount',
    title: '💰 Valor da Aposta',
    content: 'Digite o valor ou use as setas. Valores min/máx são definidos dinamicamente baseados na liquidez disponível e número de usuários ativos.',
    target: '[data-onboarding="amount"]',
    position: 'left'
  },
  {
    id: 'payout',
    title: '💹 Payout e Comissão',
    content: 'Comissão fixa de 5%. A Obness só ganha com essa taxa, nunca com suas perdas. O dinheiro apenas troca de mãos entre usuários.',
    target: '[data-onboarding="payout"]',
    position: 'left'
  },
  {
    id: 'buttons',
    title: '🔴🟢 Botões de Aposta',
    content: 'Green (CALL) = aposta na alta. Red (PUT) = aposta na baixa. Um clique efetiva a aposta imediatamente. Quem aposta primeiro tem prioridade!',
    target: '[data-onboarding="buttons"]',
    position: 'left'
  },
  {
    id: 'equalizer',
    title: '🎛️ Equalizador de Liquidez',
    content: 'Nos últimos 5 segundos, o sistema avalia todas as apostas por ordem de chegada. Se faltar liquidez, devolve automaticamente o dinheiro dos últimos apostadores.',
    target: '[data-onboarding="equalizer"]',
    position: 'top'
  },
  {
    id: 'orderbook',
    title: '📊 Order Book',
    content: 'Mostra em tempo real todas as operações: valor, cor (Green/Red), hora e resultado. Acompanhe as apostas de outros usuários!',
    target: '[data-onboarding="orderbook"]',
    position: 'right'
  },
  {
    id: 'history',
    title: '📚 Histórico',
    content: 'Todas suas operações concluídas ficam registradas: data, hora, valor apostado e resultado (vitória/derrota). Histórico completo e transparente.',
    target: '[data-onboarding="history"]',
    position: 'top'
  },
  {
    id: 'winner',
    title: '🏆 Sistema Winner',
    content: 'Após vitória: aparece foto Winner + moedas sobre o gráfico por 10 segundos com efeito sonoro. Para derrotas, nada aparece.',
    target: '[data-onboarding="chart"]',
    position: 'bottom'
  },
  {
    id: 'principles',
    title: '⚖️ Princípios da Obness',
    content: 'Sistema justo e transparente: sem liquidez própria, sem manipulação, todos jogam nas mesmas condições. Primeiro aposta = prioridade + risco. Último aposta = mais info + menos garantia.',
    target: 'body',
    position: 'bottom'
  }
]

interface OnboardingTourProps {
  isOpen: boolean
  onClose: () => void
}

export const OnboardingTour = ({ isOpen, onClose }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const step = onboardingSteps[currentStep]
    if (step.target === 'body') {
      setHighlightedElement(null)
      return
    }

    const element = document.querySelector(step.target) as HTMLElement
    if (element) {
      setHighlightedElement(element)
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentStep, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setHighlightedElement(null)
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  const currentStepData = onboardingSteps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === onboardingSteps.length - 1

  const nextStep = () => {
    if (!isLast) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getTooltipPosition = () => {
    if (!highlightedElement) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      }
    }

    const rect = highlightedElement.getBoundingClientRect()
    const tooltipWidth = 350
    const tooltipHeight = 'auto'

    let top = rect.top
    let left = rect.left

    switch (currentStepData.position) {
      case 'top':
        top = rect.top - 300
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'bottom':
        top = rect.bottom + 20
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'left':
        top = rect.top + rect.height / 2 - 150
        left = rect.left - tooltipWidth - 20
        break
      case 'right':
        top = rect.top + rect.height / 2 - 150
        left = rect.right + 20
        break
    }

    // Ensure tooltip stays within viewport
    top = Math.max(20, Math.min(top, window.innerHeight - 320))
    left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20))

    return {
      position: 'fixed' as const,
      top,
      left,
      zIndex: 9999
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-9998" onClick={onClose} />

      {/* Highlight */}
      {highlightedElement && (
        <div
          className="fixed border-2 border-blue-400 rounded-lg pointer-events-none z-9998"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        className="w-[350px] max-h-[300px] bg-background border-2 border-blue-400 shadow-2xl"
        style={getTooltipPosition()}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base font-bold text-blue-400 pr-2 leading-tight">{currentStepData.title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="max-h-[180px] overflow-y-auto mb-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} de {onboardingSteps.length}
              </span>
              <div className="flex gap-1">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentStep ? 'bg-blue-400' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={isFirst}
                className="text-xs px-2 py-1"
              >
                <ChevronLeft className="w-3 h-3" />
                Anterior
              </Button>

              {isLast ? (
                <Button size="sm" onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-xs px-2 py-1">
                  Finalizar
                </Button>
              ) : (
                <Button size="sm" onClick={nextStep} className="bg-blue-500 hover:bg-blue-600 text-xs px-2 py-1">
                  Próximo
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}
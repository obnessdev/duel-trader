import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const SupabaseTest = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])
  const [loadingTables, setLoadingTables] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      // Teste simples da conexão usando RPC ou query básica
      const { data, error } = await supabase.rpc('current_setting', { setting_name: 'server_version' })

      if (error) {
        setIsConnected(false)
        setError(error.message)
      } else {
        setIsConnected(true)
        setError(`Conectado! Versão PostgreSQL: ${data}`)
      }
    } catch (err) {
      setIsConnected(false)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const listTables = async () => {
    setLoadingTables(true)
    try {
      // Tentar listar tabelas usando uma query simples no information_schema
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE')

      if (error) {
        console.error('Erro ao listar tabelas:', error)
        // Se não funcionar, tentar apenas testar algumas tabelas conhecidas
        const commonTables = ['users', 'profiles', 'trades', 'auth.users']
        const existingTables = []

        for (const table of commonTables) {
          try {
            const { error: testError } = await supabase
              .from(table)
              .select('*')
              .limit(0)

            if (!testError) {
              existingTables.push(table)
            }
          } catch (e) {
            // Tabela não existe ou sem permissão
          }
        }
        setTables(existingTables)
      } else {
        setTables(data?.map(row => row.table_name) || [])
      }
    } catch (err) {
      console.error('Erro:', err)
      setTables([])
    } finally {
      setLoadingTables(false)
    }
  }

  useEffect(() => {
    testConnection()
    listTables()
  }, [])

  const getStatusColor = () => {
    if (isConnected === null) return 'text-gray-500'
    return isConnected ? 'text-green-500' : 'text-red-500'
  }

  const getStatusText = () => {
    if (loading) return 'Testando...'
    if (isConnected === null) return 'Aguardando teste'
    return isConnected ? 'Conectado ✅' : 'Desconectado ❌'
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Teste Supabase</CardTitle>
        <CardDescription>
          Status da conexão com o banco de dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        {error && (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
            {error}
          </div>
        )}

        <Button
          onClick={testConnection}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testando...' : 'Testar Novamente'}
        </Button>

        <Button
          onClick={listTables}
          disabled={loadingTables}
          variant="outline"
          className="w-full"
        >
          {loadingTables ? 'Listando...' : 'Listar Tabelas'}
        </Button>

        {tables.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium">Tabelas encontradas:</div>
            <div className="text-xs space-y-1">
              {tables.map((table, index) => (
                <div key={index} className="bg-gray-100 p-1 rounded text-gray-700">
                  {table}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}<br/>
          <strong>Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...
        </div>
      </CardContent>
    </Card>
  )
}
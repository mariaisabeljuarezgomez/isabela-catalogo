import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabaseClient'

type Product = {
  id: string
  brand: string
  sku: string
  name: string
  category: string | null
  price: number
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('active_campaign_products')
        .select('id, brand, sku, name, category, price')
        .order('brand')
        .order('sku')

      if (error) {
        setError(error.message)
        setProducts([])
      } else {
        setProducts((data ?? []) as Product[])
      }

      setLoading(false)
    }

    run()
  }, [])

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>ISABELA (prueba Supabase)</h1>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!loading && !error && (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              <strong>{p.brand}</strong> — {p.name} (SKU {p.sku}) — ${p.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

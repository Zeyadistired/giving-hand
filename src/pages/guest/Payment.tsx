"use client"

import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Heart, Shield, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentForm } from "@/components/payment/payment-form"
import type { Charity } from "@/types"
import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabaseClient"
import { toast } from "sonner"

export default function Payment() {
  const { charityId } = useParams()
  const navigate = useNavigate()
  const [charity, setCharity] = useState<Charity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', charityId)
          .eq('type', 'charity')
          .single()

        if (error) throw error
        if (!data) {
          toast.error('Charity not found')
          navigate('/')
          return
        }

        setCharity(data as Charity)
      } catch (error: any) {
        console.error('Error fetching charity:', error)
        toast.error(error.message || 'Failed to load charity')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    if (charityId) {
      fetchCharity()
    } else {
      navigate('/')
    }
  }, [charityId, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading charity information...</p>
      </div>
    )
  }

  if (!charity) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
            <span className="font-bold text-lg">Giving Hand</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Make a Donation</h1>
          <p className="text-muted-foreground">
            Support {charity.name} in their mission to help those in need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="font-semibold text-lg mb-1">{charity.name}</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {charity.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>Verified Charity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Active since 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <PaymentForm charity={charity} />
          </div>
        </div>
      </main>
    </div>
  )
}

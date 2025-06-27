"use client"

import type React from "react"

import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (isLoggedIn === "true") {
      router.push("/vangogh/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === "admin" && credentials.password === "admin") {
      localStorage.setItem("adminLoggedIn", "true")
      router.push("/vangogh/dashboard")
    } else {
      setError("Usuário ou senha incorretos")
    }

    setIsLoading(false)
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#312e81] flex items-center justify-center p-4 relative overflow-hidden ${montserrat.className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <Image src="/images/vangogh.jpg" alt="Van Gogh Starry Night" fill className="object-cover" priority />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/85 via-[#1e40af]/75 to-[#312e81]/85"></div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white/20">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1e3a8a]/70 hover:text-[#1e3a8a] transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Voltar para Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">van Gogh</h1>
          <p className="text-gray-600">Easy - Painel Admin</p>
          <div className="mt-4 text-xs text-gray-500 italic">
            "I dream of painting and then I paint my dream" - Vincent van Gogh
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none text-lg transition-colors"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none text-lg pr-12 transition-colors"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">Acesso restrito apenas para administradores</p>
          <div className="mt-4 text-xs text-gray-400">
            Sistema van Gogh by{" "}
            <Link
              href="https://enchante.digital"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1e3a8a] hover:text-[#1d4ed8] transition-colors font-medium"
            >
              enchantè
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

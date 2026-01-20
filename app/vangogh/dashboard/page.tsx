"use client"

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { BannersTab } from "./_components/BannersTab";
import { ClientsTab } from "./_components/ClientsTab";
import { ContactTab } from "./_components/ContactTab";
import { SocialTab } from "./_components/SocialTab";
// ✅ IMPORTANDO O NOVO COMPONENTE DE COMPANHIAS AÉREAS
import { AirlinesTab } from "./_components/AirlinesTab";

import {
  ArrowLeft,
  ImageIcon,
  LogOut,
  Palette,
  Phone,
  Plane,
  RefreshCw,
  Share2,
  Users,
  X,
  AlertTriangle
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("clients")
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)
  // ✅ REMOVIDO: Toda a gestão de estado local para 'airlines' e 'settings' foi removida.
  const router = useRouter()

  const clients = useQuery(api.clients.list)
  const airlines = useQuery(api.company.list)

  // Data limite: 20 de Março de 2026
  const EXPIRATION_DATE = new Date('2026-03-20T23:59:59')

  useEffect(() => {
    // Mostrar aviso toda vez que entrar na dashboard
    setShowWarning(true)

    // Calcular tempo restante
    const calculateTimeRemaining = () => {
      const now = new Date()
      const difference = EXPIRATION_DATE.getTime() - now.getTime()

      if (difference <= 0) {
        setIsExpired(true)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/vangogh")
  }

  // Se expirou, mostrar tela de bloqueio
  if (isExpired) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center ${montserrat.className}`}>
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 p-6 rounded-full">
              <AlertTriangle className="w-20 h-20 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard Desativada
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            O prazo de 6 meses de inatividade expirou em <strong>20 de Março de 2026</strong>.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Para reativar o sistema e retomar o acesso, entre em contato com o administrador:
          </p>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-lg font-semibold text-blue-900">
              📧 <a href="mailto:contato@projetomidia.com" className="underline hover:text-blue-700">contato@projetomidia.com</a>
            </p>
            <p className="text-lg font-semibold text-blue-900 mt-2">
              🌐 <a href="https://projetomidia.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">projetomidia.com</a>
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    )
  }
 
  // ✅ REMOVIDO: Todas as funções handle... que gerenciavam o estado local foram removidas
  // pois a lógica agora está encapsulada nos seus respectivos componentes de aba.

  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
      {/* Pop-up de Aviso */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 relative">
              <button
                onClick={() => setShowWarning(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Aviso Importante</h2>
                  <p className="text-amber-50 mt-1">Atenção necessária do administrador</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Devido a <strong className="text-red-600">mais de 6 meses de inatividade em pagamentos e uso</strong>, 
                  este site pode ser <strong>desativado da hospedagem</strong>.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Para resolução e continuidade do serviço, é necessário entrar em contato com o administrador 
                  do sistema o mais breve possível.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  ⏰ Tempo Restante até Desativação
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="text-4xl font-bold text-red-600">{timeRemaining.days}</div>
                      <div className="text-sm text-gray-600 mt-1">Dias</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="text-4xl font-bold text-orange-600">{timeRemaining.hours}</div>
                      <div className="text-sm text-gray-600 mt-1">Horas</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="text-4xl font-bold text-amber-600">{timeRemaining.minutes}</div>
                      <div className="text-sm text-gray-600 mt-1">Minutos</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="text-4xl font-bold text-yellow-600">{timeRemaining.seconds}</div>
                      <div className="text-sm text-gray-600 mt-1">Segundos</div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4 font-semibold">
                  Data de desativação: <span className="text-red-600">20 de Março de 2026</span>
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📞 Contato do Administrador:</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Projeto Mídia</strong>
                  </p>
                  <p className="text-gray-700">
                    🌐 <a href="https://projetomidia.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium">
                      projetomidia.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    📧 <a href="mailto:contato@projetomidia.com" className="text-blue-600 hover:text-blue-800 underline font-medium">
                      contato@projetomidia.com
                    </a>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWarning(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                Entendi, continuar para o painel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Palette className="w-8 h-8 text-yellow-300" />
              <h1 className="text-2xl font-bold">van Gogh - Easy Viagens</h1>
              <Link href="/" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-1 font-medium">
                <ArrowLeft size={16} />
                Home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-100">
                Sistema van Gogh by{" "}
                <Link href="https://projetomidia.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-200 transition-colors font-medium underline">
                  Projeto Mídia
                </Link>
              </div>
              <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors">
                <RefreshCw size={20} />
                Atualizar
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-200 hover:bg-red-500/20 rounded-lg transition-colors">
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image src="/images/vangogh.jpg" alt="Van Gogh Starry Night" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/80 to-[#1e40af]/70"></div>
          <nav className="p-4 relative z-10">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "clients" ? "bg-white/90 text-[#1e3a8a] shadow-lg" : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Users size={20} />
                  Clientes ({clients?.length ?? 0})
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("banners")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "banners" ? "bg-white/90 text-[#1e3a8a] shadow-lg" : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <ImageIcon size={20} />
                  Banners
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "social" ? "bg-white/90 text-[#1e3a8a] shadow-lg" : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Share2 size={20} />
                  Redes Sociais
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "contact" ? "bg-white/90 text-[#1e3a8a] shadow-lg" : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Phone size={20} />
                  Contato
                </button>
              </li>
              {/* ✅ REMOVIDO: Botão da Calculadora foi excluído do menu */}
              <li>
                <button
                  onClick={() => setActiveTab("airlines")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "airlines" ? "bg-white/90 text-[#1e3a8a] shadow-lg" : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Plane size={20} />
                  Companhias ({airlines?.length ?? 0})
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === "clients" && <ClientsTab />}
          {activeTab === "banners" && <BannersTab />}
          {activeTab === "social" && <SocialTab />}
          {activeTab === "contact" && <ContactTab />}
          
          {/* ✅ REMOVIDO: A aba da Calculadora foi excluída do conteúdo principal */}

          {/* ✅ SEÇÃO DE COMPANHIAS SUBSTITUÍDA PELO NOVO COMPONENTE DINÂMICO */}
          {activeTab === "airlines" && <AirlinesTab />}
        </main>
      </div>
    </div>
  )
}

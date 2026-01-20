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
  Users
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
  // ✅ REMOVIDO: Toda a gestão de estado local para 'airlines' e 'settings' foi removida.
  const router = useRouter()

  const clients = useQuery(api.clients.list)
  const airlines = useQuery(api.company.list)


  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/vangogh")
  }
 
  // ✅ REMOVIDO: Todas as funções handle... que gerenciavam o estado local foram removidas
  // pois a lógica agora está encapsulada nos seus respectivos componentes de aba.

  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
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

"use client"

import {
  deleteUser,
  getAirlines,
  getSettings,
  getUsers,
  initializeData,
  updateAirlines,
  updateSettings,
  type Airline,
  type SiteSettings,
  type User,
} from "@/lib/data-store"
import {
  ArrowLeft,
  Calculator,
  Edit,
  Eye,
  EyeOff,
  ImageIcon,
  LogOut,
  Palette,
  Phone,
  Plane,
  Plus,
  RefreshCw,
  Save,
  Share2,
  Trash2,
  Users,
} from "lucide-react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState<User[]>([])
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [settings, setSettings] = useState<SiteSettings>({
    socialLinks: {
      facebook: "#",
      instagram: "#",
      linkedin: "#",
    },
    contact: {
      phone1: "+55 11 111-111",
      phone2: "+55 11 999-999",
      email: "easyviagens@gmail.com",
      whatsappLink: "#",
    },
    milesCalculator: {
      minMiles: 1000,
      maxMiles: 150000,
      buyMultiplier: 0.02,
      sellMultiplier: 0.018,
    },
    banners: {
      banner1: "/images/frame01.png",
      banner2: "/images/frame02.png",
    },
  })
  const [editingAirline, setEditingAirline] = useState<string | null>(null)
  const [newAirlineName, setNewAirlineName] = useState("")
  const [showAddAirline, setShowAddAirline] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (isLoggedIn !== "true") {
      router.push("/vangogh")
      return
    }

    // Initialize and load data
    initializeData()
    loadData()
  }, [router])

  const loadData = () => {
    setUsers(getUsers())
    setSettings(getSettings())
    setAirlines(getAirlines())
  }

  const refreshData = () => {
    loadData()
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/vangogh")
  }

  const handleSettingsChange = (section: keyof SiteSettings, field: string, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    updateSettings(settings)
    alert("Configurações salvas com sucesso!")
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUser(id)
      setUsers(getUsers())
    }
  }

  const handleEditAirline = (id: string, newName: string) => {
    const updatedAirlines = airlines.map((airline) => (airline.id === id ? { ...airline, name: newName } : airline))
    setAirlines(updatedAirlines)
    updateAirlines(updatedAirlines)
    setEditingAirline(null)
  }

  const handleToggleAirline = (id: string) => {
    const updatedAirlines = airlines.map((airline) =>
      airline.id === id ? { ...airline, isActive: !airline.isActive } : airline,
    )
    setAirlines(updatedAirlines)
    updateAirlines(updatedAirlines)
  }

  const handleDeleteAirline = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta companhia?")) {
      const updatedAirlines = airlines.filter((airline) => airline.id !== id)
      setAirlines(updatedAirlines)
      updateAirlines(updatedAirlines)
    }
  }

  const handleAddAirline = () => {
    if (newAirlineName.trim()) {
      const newAirline: Airline = {
        id: Date.now().toString(),
        name: newAirlineName.trim(),
        isActive: true,
      }
      const updatedAirlines = [...airlines, newAirline]
      setAirlines(updatedAirlines)
      updateAirlines(updatedAirlines)
      setNewAirlineName("")
      setShowAddAirline(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.className}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Palette className="w-8 h-8 text-yellow-300" />
              <h1 className="text-2xl font-bold">van Gogh - Easy Viagens</h1>
              <Link
                href="/"
                className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-1 font-medium"
              >
                <ArrowLeft size={16} />
                Home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-100">
                Sistema van Gogh by{" "}
                <Link
                  href="https://enchante.digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-300 hover:text-yellow-200 transition-colors font-medium underline"
                >
                  enchantè
                </Link>
              </div>
              <button
                onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw size={20} />
                Atualizar
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-200 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r relative overflow-hidden">
          {/* Van Gogh background for sidebar */}
          <div className="absolute inset-0 opacity-20">
            <Image src="/images/vangogh.jpg" alt="Van Gogh Starry Night" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a8a]/80 to-[#1e40af]/70"></div>

          <nav className="p-4 relative z-10">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "users"
                      ? "bg-white/90 text-[#1e3a8a] shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Users size={20} />
                  Usuários ({users.length})
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("banners")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "banners"
                      ? "bg-white/90 text-[#1e3a8a] shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
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
                    activeTab === "social"
                      ? "bg-white/90 text-[#1e3a8a] shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
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
                    activeTab === "contact"
                      ? "bg-white/90 text-[#1e3a8a] shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Phone size={20} />
                  Contato
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("calculator")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "calculator"
                      ? "bg-white/90 text-[#1e3a8a] shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Calculator size={20} />
                  Calculadora
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("airlines")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    activeTab === "airlines"
                      ? "bg-white/90 text-[#1e3a8a] shadow-lg"
                      : "text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  <Plane size={20} />
                  Companhias ({airlines.filter((a) => a.isActive).length}/{airlines.length})
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Usuários Cadastrados</h2>
                <div className="text-sm text-gray-600">Total: {users.length} usuários</div>
              </div>

              {users.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum usuário cadastrado</h3>
                  <p className="text-gray-500">Os usuários que preencherem o formulário de milhas aparecerão aqui.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {users.map((user) => (
                    <div key={user.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Excluir usuário"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                              <strong>Telefone:</strong> {user.phone}
                            </p>
                            <p>
                              <strong>CPF:</strong> {user.cpf}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <strong>Operação:</strong>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  user.operationType === "comprar"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {user.operationType}
                              </span>
                            </p>
                            <p>
                              <strong>Companhia:</strong> {user.airline}
                            </p>
                            <p>
                              <strong>Milhas:</strong> {Number.parseInt(user.miles).toLocaleString()}
                            </p>
                            <p>
                              <strong>Entrega:</strong>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  user.deliveryType === "antecipado"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {user.deliveryType}
                              </span>
                            </p>
                            <p>
                              <strong>Data:</strong> {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Banners Tab */}
          {activeTab === "banners" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Banners</h2>
              <div className="grid gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Banner Promocional 1</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caminho da Imagem Atual</label>
                      <input
                        type="text"
                        value={settings.banners.banner1}
                        onChange={(e) => handleSettingsChange("banners", "banner1", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                        placeholder="/images/frame01.png"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Nova Imagem</label>
                      <input type="file" accept="image/*" className="w-full p-3 border border-gray-300 rounded-lg" />
                      <p className="text-xs text-gray-500 mt-1">Após fazer upload, atualize o caminho acima</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Banner Promocional 2</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Caminho da Imagem Atual</label>
                      <input
                        type="text"
                        value={settings.banners.banner2}
                        onChange={(e) => handleSettingsChange("banners", "banner2", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                        placeholder="/images/frame02.png"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Nova Imagem</label>
                      <input type="file" accept="image/*" className="w-full p-3 border border-gray-300 rounded-lg" />
                      <p className="text-xs text-gray-500 mt-1">Após fazer upload, atualize o caminho acima</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Redes Sociais</h2>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link do Facebook</label>
                    <input
                      type="url"
                      value={settings.socialLinks.facebook}
                      onChange={(e) => handleSettingsChange("socialLinks", "facebook", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link do Instagram</label>
                    <input
                      type="url"
                      value={settings.socialLinks.instagram}
                      onChange={(e) => handleSettingsChange("socialLinks", "instagram", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link do LinkedIn</label>
                    <input
                      type="url"
                      value={settings.socialLinks.linkedin}
                      onChange={(e) => handleSettingsChange("socialLinks", "linkedin", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações de Contato</h2>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone 1</label>
                    <input
                      type="tel"
                      value={settings.contact.phone1}
                      onChange={(e) => handleSettingsChange("contact", "phone1", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone 2</label>
                    <input
                      type="tel"
                      value={settings.contact.phone2}
                      onChange={(e) => handleSettingsChange("contact", "phone2", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => handleSettingsChange("contact", "email", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link do WhatsApp</label>
                    <input
                      type="url"
                      value={settings.contact.whatsappLink}
                      onChange={(e) => handleSettingsChange("contact", "whatsappLink", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                      placeholder="https://wa.me/5511999999999"
                    />
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Calculator Tab */}
          {activeTab === "calculator" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações da Calculadora</h2>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade Mínima de Milhas</label>
                    <input
                      type="number"
                      value={settings.milesCalculator.minMiles}
                      onChange={(e) =>
                        handleSettingsChange("milesCalculator", "minMiles", Number.parseInt(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade Máxima de Milhas</label>
                    <input
                      type="number"
                      value={settings.milesCalculator.maxMiles}
                      onChange={(e) =>
                        handleSettingsChange("milesCalculator", "maxMiles", Number.parseInt(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Multiplicador para Compra (R$ por milha)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={settings.milesCalculator.buyMultiplier}
                      onChange={(e) =>
                        handleSettingsChange("milesCalculator", "buyMultiplier", Number.parseFloat(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Multiplicador para Venda (R$ por milha)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={settings.milesCalculator.sellMultiplier}
                      onChange={(e) =>
                        handleSettingsChange("milesCalculator", "sellMultiplier", Number.parseFloat(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveSettings}
                  className="mt-6 bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* Airlines Tab */}
          {activeTab === "airlines" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Companhias Aéreas</h2>
                <button
                  onClick={() => setShowAddAirline(true)}
                  className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Adicionar Companhia
                </button>
              </div>

              {showAddAirline && (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Nova Companhia</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newAirlineName}
                      onChange={(e) => setNewAirlineName(e.target.value)}
                      placeholder="Nome da companhia"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                    />
                    <button
                      onClick={handleAddAirline}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => {
                        setShowAddAirline(false)
                        setNewAirlineName("")
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="space-y-4">
                    {airlines.map((airline) => (
                      <div
                        key={airline.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          {editingAirline === airline.id ? (
                            <input
                              type="text"
                              defaultValue={airline.name}
                              onBlur={(e) => handleEditAirline(airline.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEditAirline(airline.id, e.currentTarget.value)
                                }
                              }}
                              className="p-2 border border-gray-300 rounded focus:border-[#1e3a8a] focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <span className={`font-medium ${airline.isActive ? "text-gray-800" : "text-gray-400"}`}>
                              {airline.name}
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              airline.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {airline.isActive ? "Ativa" : "Inativa"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingAirline(editingAirline === airline.id ? null : airline.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleAirline(airline.id)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {airline.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteAirline(airline.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

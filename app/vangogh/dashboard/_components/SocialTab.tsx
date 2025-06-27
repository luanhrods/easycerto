"use client"

import { useMutation, useQuery } from "convex/react"
import { Save } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "../../../../convex/_generated/api"

export function SocialTab() {
  // 1. Busca os links existentes do Convex em tempo real
  const linksData = useQuery(api.landingLinks.getUnique)
  const updateLinks = useMutation(api.landingLinks.update)
  const createLinks = useMutation(api.landingLinks.create)

  // 2. Estado local do formulário para edição
  const [formState, setFormState] = useState({
    fb: "",
    ig: "",
    linkd: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // 3. Quando os dados do Convex chegam, atualiza o formulário
  useEffect(() => {
    if (linksData) {
      setFormState({
        fb: linksData.fb ?? "",
        ig: linksData.ig ?? "",
        linkd: linksData.linkd ?? "",
      })
    }
  }, [linksData]) // Roda sempre que linksData mudar

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (linksData?._id) {
        // Se já existe um documento de links, atualiza
        await updateLinks({
          id: linksData._id,
          ...formState,
        })
      } else {
        // Se não existe, cria um novo
        await createLinks(formState)
      }
      alert("Links salvos com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar os links:", error)
      alert("Ocorreu um erro ao salvar os links.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Redes Sociais</h2>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {linksData === undefined ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link do Facebook</label>
              <input
                type="url"
                name="fb"
                value={formState.fb}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                placeholder="https://facebook.com/seu-usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link do Instagram</label>
              <input
                type="url"
                name="ig"
                value={formState.ig}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                placeholder="https://instagram.com/seu-usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link do LinkedIn</label>
              <input
                type="url"
                name="linkd"
                value={formState.linkd}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                placeholder="https://linkedin.com/in/seu-usuario"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

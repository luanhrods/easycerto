"use client"

import { useMutation, useQuery } from "convex/react"
import { Save } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "../../../../convex/_generated/api"

export function ContactTab() {
  // 1. Busca os dados de contato existentes do Convex em tempo real
  const contactData = useQuery(api.landingLinks.getUnique)
  const updateContact = useMutation(api.landingLinks.update)
  const createContact = useMutation(api.landingLinks.create)

  // 2. Estado local do formulário para edição
  const [formState, setFormState] = useState({
    telOne: "",
    telTwo: "",
    emailContact: "",
    // O link do WhatsApp será gerenciado em outra aba se necessário, ou adicionado aqui.
  })
  const [isLoading, setIsLoading] = useState(false)

  // 3. Quando os dados do Convex chegam, atualiza o formulário
  useEffect(() => {
    if (contactData) {
      setFormState({
        telOne: contactData.telOne ?? "",
        telTwo: contactData.telTwo ?? "",
        emailContact: contactData.emailContact ?? "",
      })
    }
  }, [contactData]) // Roda sempre que contactData mudar

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (contactData?._id) {
        // Se já existe um documento de links, atualiza
        await updateContact({
          id: contactData._id,
          ...formState,
        })
      } else {
        // Se não existe, cria um novo
        await createContact(formState)
      }
      alert("Contatos salvos com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar os contatos:", error)
      alert("Ocorreu um erro ao salvar os contatos.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações de Contato</h2>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {contactData === undefined ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone 1</label>
              <input
                type="tel"
                name="telOne"
                value={formState.telOne}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                placeholder="(XX) XXXX-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone 2</label>
              <input
                type="tel"
                name="telTwo"
                value={formState.telTwo}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contato</label>
              <input
                type="email"
                name="emailContact"
                value={formState.emailContact}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:outline-none"
                placeholder="contato@empresa.com"
              />
            </div>
            {/* O WhatsApp pode ser adicionado aqui seguindo o mesmo padrão, se desejado */}
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

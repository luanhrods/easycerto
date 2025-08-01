"use client"

import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../../../convex/_generated/api"
import type { Doc, Id } from "../../../../convex/_generated/dataModel"

import { Edit, Plus, Trash2 } from "lucide-react"

// Este é o componente completo para a aba de Clientes
export function ClientsTab() {
  const clients = useQuery(api.clients.list)
  const createClient = useMutation(api.clients.create)
  const updateClient = useMutation(api.clients.update)
  const deleteClient = useMutation(api.clients.remove)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Doc<"clients"> | null>(null)

  const handleOpenCreateModal = () => {
    setEditingClient(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (client: Doc<"clients">) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
  }

  const handleDelete = (id: Id<"clients">) => {
    // Usando um modal customizado ou uma confirmação mais robusta seria o ideal em produção
    if (window.confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) {
      deleteClient({ id })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clientes Cadastrados</h2>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors"
        >
          <Plus size={18} />
          Adicionar Cliente
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Operação</th>
              <th className="px-6 py-3">Entrega</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients === undefined && (
              <tr><td colSpan={5} className="text-center p-4">Carregando clientes...</td></tr>
            )}
            {clients && clients.length === 0 && (
              <tr><td colSpan={5} className="text-center p-4">Nenhum cliente cadastrado.</td></tr>
            )}
            {clients?.map((client) => (
              <tr key={client._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.buyorsell ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.buyorsell ? "Compra" : "Venda"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.antecipated ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {client.antecipated ? "Antecipado" : "Programado"}
                  </span>
                </td>
                <td className="px-6 py-4">{client.email}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleOpenEditModal(client)} className="text-blue-600 hover:text-blue-800 mr-4" title="Editar"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(client._id)} className="text-red-600 hover:text-red-800" title="Excluir"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ClientFormModal
          client={editingClient}
          onClose={handleCloseModal}
          onSubmit={async (formData) => {
            // Omitindo o tipo para garantir que o objeto corresponda ao esperado pelas mutações
            const dataToSubmit: Omit<Doc<"clients">, "_id" | "_creationTime"> = formData;
            if (editingClient) {
              await updateClient({ id: editingClient._id, ...dataToSubmit })
            } else {
              await createClient(dataToSubmit)
            }
            handleCloseModal()
          }}
        />
      )}
    </div>
  )
}

function ClientFormModal({
  client,
  onClose,
  onSubmit,
}: {
  client: Doc<"clients"> | null
  onClose: () => void
  // A tipagem do onSubmit foi ajustada para refletir os novos campos
  onSubmit: (data: Omit<Doc<"clients">, "_id" | "_creationTime">) => Promise<void>
}) {
  // Adiciona os novos campos ao estado inicial do formulário
  const [formData, setFormData] = useState({
    name: client?.name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    cpf: client?.cpf ?? "",
    pixBank: client?.pixBank ?? "", // Novo campo
    pixNumber: client?.pixNumber ?? "", // Novo campo
    quantity: client?.quantity ?? 0,
    buyorsell: client?.buyorsell ?? true,
    antecipated: client?.antecipated ?? false,
    date: client?.date ? new Date(client.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (name === "buyorsell" || name === "antecipated") {
      setFormData((prev) => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Garante que a data seja enviada como timestamp e a quantidade como número
    const dataToSubmit = { 
        ...formData, 
        quantity: Number(formData.quantity) || 0, 
        date: new Date(formData.date).getTime() 
    };
    onSubmit(dataToSubmit);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative animate-in fade-in-0 zoom-in-95 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{client ? "Editar Cliente" : "Adicionar Novo Cliente"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome completo do cliente" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemplo.com" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" className="w-full p-2 border rounded" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="w-full p-2 border rounded" />
          </div>

          {/* Novos campos para PIX adicionados aqui */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banco do PIX</label>
            <input name="pixBank" value={formData.pixBank} onChange={handleChange} placeholder="Ex: Nubank, Itaú, etc." className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX</label>
            <input name="pixNumber" value={formData.pixNumber} onChange={handleChange} placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória" className="w-full p-2 border rounded" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="0" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required/>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Operação</label>
              <select
                name="buyorsell"
                value={String(formData.buyorsell)}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="true">Compra</option>
                <option value="false">Venda</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Entrega</label>
              <select
                name="antecipated"
                value={String(formData.antecipated)}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="false">Programado</option>
                <option value="true">Antecipado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">{client ? "Salvar Alterações" : "Criar Cliente"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

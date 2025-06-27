"use client"

import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { api } from "../../../../convex/_generated/api"
import type { Doc, Id } from "../../../../convex/_generated/dataModel"

import { Edit, Plus, Save, Trash2 } from "lucide-react"

export function AirlinesTab() {
  const airlines = useQuery(api.company.list)
  const createAirline = useMutation(api.company.create)
  const updateAirline = useMutation(api.company.update)
  const deleteAirline = useMutation(api.company.remove)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAirline, setEditingAirline] = useState<Doc<"company"> | null>(null)

  const handleOpenCreateModal = () => {
    setEditingAirline(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (airline: Doc<"company">) => {
    setEditingAirline(airline)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAirline(null)
  }

  const handleDelete = (id: Id<"company">) => {
    if (window.confirm("Tem certeza que deseja excluir esta companhia?")) {
      deleteAirline({ id })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Companhias Aéreas</h2>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Adicionar Companhia
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 space-y-4">
          {airlines === undefined && <p>Carregando companhias...</p>}
          {airlines?.map((airline : any) => (
            <div
              key={airline._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{airline.name}</span>
                <div className="text-xs text-gray-500 mt-1 flex gap-4">
                  <span>Venda: R$ {airline.priceSell?.toFixed(2)} / Limite: {airline.limitSell}</span>
                  <span>Compra: R$ {airline.priceBuy?.toFixed(2)} / Limite: {airline.limitBuy}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(airline)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(airline._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <AirlineFormModal
          airline={editingAirline}
          onClose={handleCloseModal}
          onSubmit={async (formData) => {
            if (editingAirline) {
              await updateAirline({ id: editingAirline._id, ...formData })
            } else {
              await createAirline(formData)
            }
            handleCloseModal()
          }}
        />
      )}
    </div>
  )
}

function AirlineFormModal({
  airline,
  onClose,
  onSubmit,
}: {
  airline: Doc<"company"> | null
  onClose: () => void
  onSubmit: (data: Omit<Doc<"company">, "_id" | "_creationTime">) => Promise<void>
}) {
  const [formData, setFormData] = useState({
    name: airline?.name ?? "",
    priceSell: airline?.priceSell ?? 0,
    priceBuy: airline?.priceBuy ?? 0,
    limitSell: airline?.limitSell ?? 0,
    limitBuy: airline?.limitBuy ?? 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <h3 className="text-xl font-bold mb-4">{airline ? "Editar Companhia" : "Adicionar Nova Companhia"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Companhia</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
              <input name="priceSell" type="number" step="0.01" value={formData.priceSell} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Venda</label>
              <input name="limitSell" type="number" value={formData.limitSell} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Compra (R$)</label>
              <input name="priceBuy" type="number" step="0.01" value={formData.priceBuy} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Compra</label>
              <input name="limitBuy" type="number" value={formData.limitBuy} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Save size={16} />
              {airline ? "Salvar Alterações" : "Adicionar Companhia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

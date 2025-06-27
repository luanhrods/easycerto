"use client"

import { useMutation, useQuery } from "convex/react"
import { UploadCloud } from "lucide-react"
import Image from "next/image"
import { useState, type ChangeEvent } from "react"
import { api } from "../../../../convex/_generated/api"

// Componente para um único card de banner, para evitar repetição de código
function BannerUploader({
  title,
  bannerKey,
  currentImageUrl,
}: {
  title: string
  bannerKey: "banner1StorageId" | "banner2StorageId"
  currentImageUrl: string | null
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const generateUploadUrl = useMutation(api.siteConfig.generateUploadUrl)
  const saveBannerStorageId = useMutation(api.siteConfig.saveBannerStorageId)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsLoading(true)

    try {
      // 1. Obter a URL de upload do Convex
      const postUrl = await generateUploadUrl()

      // 2. Enviar o arquivo para a URL de upload
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      })

      const { storageId } = await result.json()

      // 3. Salvar o storageId no banco de dados
      await saveBannerStorageId({ storageId, bannerKey })

      alert(`${title} atualizado com sucesso!`)
      setSelectedFile(null)
    } catch (error) {
      console.error(error)
      alert(`Erro ao fazer upload do ${title}.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {currentImageUrl && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Banner Atual</p>
            <div className="relative w-full h-40 rounded-lg overflow-hidden border">
              <Image src={currentImageUrl} alt={title} fill className="object-cover" />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Selecionar Nova Imagem</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            disabled={isLoading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {selectedFile && (
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <UploadCloud size={16} />
              {isLoading ? "Enviando..." : `Salvar ${title}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente principal da aba de Banners
export function BannersTab() {
  const siteConfig = useQuery(api.siteConfig.get)

  if (siteConfig === undefined) {
    return <div>Carregando configurações dos banners...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Banners</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <BannerUploader
          title="Banner Promocional 1"
          bannerKey="banner1StorageId"
          currentImageUrl={siteConfig?.banner1Url ?? null}
        />
        <BannerUploader
          title="Banner Promocional 2"
          bannerKey="banner2StorageId"
          currentImageUrl={siteConfig?.banner2Url ?? null}
        />
      </div>
    </div>
  )
}


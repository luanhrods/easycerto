"use client"

import type React from "react"

import { ArrowLeft, Check, Menu, Send, X } from "lucide-react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { z } from "zod"
// ✅ IMPORTS DO CONVEX
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

// SVG Components permanecem os mesmos...
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="white" /></svg>
)
const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="white" /></svg>
)
const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="white" /></svg>
)

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
})

type FormData = z.infer<typeof formSchema>
type FinalSubmission = {
    name: string;
    operationType: string;
    miles: string;
    airline: string;
    phone: string;
};

export default function MilhasPage() {
  // ✅ DADOS VINDOS DO CONVEX
  const companies = useQuery(api.company.list);
  const contactInfo = useQuery(api.landingLinks.getUnique);
  const createClient = useMutation(api.clients.create);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: Seleção, 2: Entrega, 3: Confirmação, 4: Contato, 5: Sucesso
  const [selectedAirline, setSelectedAirline] = useState("")
  const [selectedMiles, setSelectedMiles] = useState(10000)
  const [deliveryType, setDeliveryType] = useState("programado")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", cpf: "" })
  const [operationType, setOperationType] = useState("vender")
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmission, setLastSubmission] = useState<FinalSubmission | null>(null);

  // ✅ LÓGICA ATUALIZADA PARA USAR DADOS DO CONVEX
  const selectedCompany = useMemo(() => {
    return companies?.find((c) => c._id === selectedAirline);
  }, [selectedAirline, companies]);

  const milesOptions = useMemo(() => {
    if (!selectedCompany) return [];
    const limit = operationType === 'vender' ? selectedCompany.limitSell : selectedCompany.limitBuy;
    const options = [];
    for (let i = 10000; i <= (limit ?? 150000); i += 1000) {
      options.push(i);
    }
    return options;
  }, [selectedCompany, operationType]);
  
  const estimatedValue = useMemo(() => {
    if (!selectedCompany || !selectedMiles) return 0;
    const price = operationType === 'vender' ? selectedCompany.priceSell : selectedCompany.priceBuy;
    return (selectedMiles / 1000) * (price ?? 0);
  }, [selectedCompany, selectedMiles, operationType]);

  const handleContinue = () => {
    if (step === 1 && operationType && selectedAirline && selectedMiles) setStep(2)
    else if (step === 2 && deliveryType) setStep(3)
    else if (step === 3) setStep(4)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Partial<Record<keyof FormData, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as keyof FormData] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        quantity: selectedMiles,
        buyorsell: operationType === "comprar",
        antecipated: deliveryType === "antecipado",
        date: new Date().getTime(),
      };
      
      await createClient(submissionData);

      const airlineName = companies?.find(c => c._id === selectedAirline)?.name ?? '';
      setLastSubmission({
          name: formData.name,
          operationType: operationType,
          miles: selectedMiles.toLocaleString('pt-BR'),
          airline: airlineName,
          phone: formData.phone,
      });

      setStep(5); // ✅ AVANÇA PARA A TELA DE SUCESSO

    } catch (error) {
      console.error("Erro ao submeter o formulário:", error);
      alert("Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const whatsAppMessage = useMemo(() => {
    if (!lastSubmission) return "";
    const text = `Olá! Gostaria de confirmar minha solicitação de ${lastSubmission.operationType} de ${lastSubmission.miles} milhas da ${lastSubmission.airline}. Meu nome é ${lastSubmission.name}.`;
    return encodeURIComponent(text);
  }, [lastSubmission]);

  const whatsAppNumber = contactInfo?.telOne?.replace(/\D/g, '') ?? '';

  return (
    <div className={`min-h-screen bg-white ${montserrat.className}`}>
      {/* Estilos e Header (sem alterações) */}
      <style jsx global>{`
        .hover-underline { position: relative; display: inline-block; overflow: visible; }
        .hover-underline::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background-color: #024E69; transition: width 0.4s ease-out; }
        .hover-underline:hover::after { width: 100%; }
        .mobile-menu { transform: translateX(-100%); transition: transform 0.3s ease-in-out; }
        .mobile-menu.open { transform: translateX(0); }
      `}</style>
      <header className="bg-[#024E69] text-white px-4 sm:px-6 py-4 sm:py-5 shadow-lg relative">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-wide hover:text-blue-200 transition-colors">EASY VIAGENS</Link>
          <nav className="hidden lg:flex space-x-12">
            <Link href="/" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline">HOME</Link>
            <Link href="/#produtos" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline">PRODUTOS</Link>
            <Link href="/#sobre" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline">SOBRE NÓS</Link>
            <Link href="/#contato" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline">CONTATO</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href={`https://wa.me/55${whatsAppNumber}`} target="_blank" className="bg-transparent p-2 sm:p-3 rounded-full hover:bg-green-600 transition-colors duration-300 cursor-pointer">
              <Image src="/images/whatsapp-icon.png" alt="WhatsApp" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            </Link>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div className={`lg:hidden absolute top-full left-0 w-full bg-[#024E69] shadow-lg mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">HOME</Link>
            <Link href="/#produtos" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">PRODUTOS</Link>
            <Link href="/#sobre" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">SOBRE NÓS</Link>
            <Link href="/#contato" className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">CONTATO</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {step < 5 && (
            <Link href="/" className="inline-flex items-center gap-2 text-[#179FCF] hover:text-[#1489b8] mb-8 font-medium hover-underline">
              <ArrowLeft size={20} />
              Voltar ao início
            </Link>
          )}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#024E69] mb-4">Comprar ou Vender Milhas</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Encontre as melhores ofertas de milhas das principais companhias aéreas do Brasil</p>
          </div>
          {step < 5 && (
            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= stepNumber ? "bg-[#024E69] text-white" : "bg-gray-300 text-gray-600"}`}>
                      {step > stepNumber ? <Check size={20} /> : stepNumber}
                    </div>
                    {stepNumber < 4 && (<div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-[#024E69]" : "bg-gray-300"}`} />)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-[#024E69] mb-6 text-center">Selecione o Tipo, Companhia e Quantidade</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">Tipo de Operação</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div onClick={() => setOperationType("comprar")} className={`p-4 border-2 rounded-lg cursor-pointer transition-colors text-center ${operationType === "comprar" ? "border-[#024E69] bg-blue-50" : "border-gray-300 hover:border-[#024E69]"}`}>
                        <h3 className="text-lg font-semibold text-gray-800">Comprar Milhas</h3><p className="text-gray-600 text-sm mt-1">Adquirir milhas</p>
                      </div>
                      <div onClick={() => setOperationType("vender")} className={`p-4 border-2 rounded-lg cursor-pointer transition-colors text-center ${operationType === "vender" ? "border-[#024E69] bg-blue-50" : "border-gray-300 hover:border-[#024E69]"}`}>
                        <h3 className="text-lg font-semibold text-gray-800">Vender Milhas</h3><p className="text-gray-600 text-sm mt-1">Vender suas milhas</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">Companhia Aérea</label>
                    <select value={selectedAirline} onChange={(e) => setSelectedAirline(e.target.value)} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-[#024E69] focus:outline-none text-lg">
                      <option value="">Selecione uma companhia</option>
                      {companies?.map((airline) => (<option key={airline._id} value={airline._id}>{airline.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">Quantidade de Milhas</label>
                    <select value={selectedMiles} onChange={(e) => setSelectedMiles(Number(e.target.value))} className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-[#024E69] focus:outline-none text-lg" disabled={!selectedAirline}>
                      <option value="">Selecione a quantidade</option>
                      {milesOptions.map((miles) => (<option key={miles} value={miles}>{miles.toLocaleString()} milhas</option>))}
                    </select>
                  </div>
                  <button onClick={handleContinue} disabled={!operationType || !selectedAirline || !selectedMiles} className="w-full bg-[#024E69] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1489b8] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">Continuar</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="max-w-2xl mx-auto"><div className="bg-white rounded-2xl shadow-lg p-8"><h2 className="text-2xl font-bold text-[#024E69] mb-6 text-center">Tipo de Entrega</h2><div className="space-y-4"><div onClick={() => setDeliveryType("programado")} className={`p-6 border-2 rounded-lg cursor-pointer transition-colors ${deliveryType === "programado" ? "border-[#024E69] bg-blue-50" : "border-gray-300 hover:border-[#024E69]"}`}><div className="flex items-center justify-between"><div><h3 className="text-xl font-semibold text-gray-800">Programado</h3><p className="text-gray-600 mt-2">Entrega em até 10 dias úteis</p></div><div className={`w-6 h-6 rounded-full border-2 ${deliveryType === "programado" ? "border-[#024E69] bg-[#024E69]" : "border-gray-400"}`}>{deliveryType === "programado" && <Check size={16} className="text-white m-0.5" />}</div></div></div><div onClick={() => setDeliveryType("antecipado")} className={`p-6 border-2 rounded-lg cursor-pointer transition-colors ${deliveryType === "antecipado" ? "border-[#024E69] bg-blue-50" : "border-gray-300 hover:border-[#024E69]"}`}><div className="flex items-center justify-between"><div><h3 className="text-xl font-semibold text-gray-800">Antecipado</h3><p className="text-gray-600 mt-2">Entrega em até 24 horas</p></div><div className={`w-6 h-6 rounded-full border-2 ${deliveryType === "antecipado" ? "border-[#024E69] bg-[#024E69]" : "border-gray-400"}`}>{deliveryType === "antecipado" && <Check size={16} className="text-white m-0.5" />}</div></div></div><div className="flex gap-4"><button onClick={handleBack} className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors">Voltar</button><button onClick={handleContinue} disabled={!deliveryType} className="flex-1 bg-[#024E69] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1489b8] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">Continuar</button></div></div></div></div>
          )}

          {step === 3 && (
            <div className="max-w-2xl mx-auto"><div className="bg-white rounded-2xl shadow-lg p-8"><h2 className="text-2xl font-bold text-[#024E69] mb-6 text-center">Confirme suas Informações</h2><div className="bg-gray-50 rounded-lg p-6 mb-6"><div className="space-y-4"><div className="flex justify-between"><span className="font-semibold text-gray-700">Operação:</span><span className="text-gray-900 capitalize">{operationType}</span></div><div className="flex justify-between"><span className="font-semibold text-gray-700">Companhia:</span><span className="text-gray-900">{selectedCompany?.name}</span></div><div className="flex justify-between"><span className="font-semibold text-gray-700">Quantidade:</span><span className="text-gray-900">{selectedMiles.toLocaleString()} milhas</span></div><div className="flex justify-between"><span className="font-semibold text-gray-700">Tipo de Entrega:</span><span className="text-gray-900 capitalize">{deliveryType}</span></div><div className="flex justify-between border-t pt-4 mt-4"><span className="font-bold text-gray-700">Valor Estimado:</span><span className="font-bold text-[#024E69] text-lg">R$ {estimatedValue.toFixed(2)}</span></div>{deliveryType === "antecipado" && (<div className="bg-red-50 border border-red-200 rounded p-3 mt-4"></div>)}</div></div><div className="flex gap-4"><button onClick={handleBack} className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors">Voltar</button><button onClick={handleContinue} className="flex-1 bg-[#024E69] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1489b8] transition-colors">Confirmar e Continuar</button></div></div></div>
          )}

          {step === 4 && (
            <div className="max-w-2xl mx-auto"><div className="bg-white rounded-2xl shadow-lg p-8"><h2 className="text-2xl font-bold text-[#024E69] mb-6 text-center">Informações de Contato</h2><form onSubmit={handleSubmit} className="space-y-6"><div><label className="block text-lg font-semibold text-gray-700 mb-3">Nome Completo</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full p-4 border-2 rounded-lg focus:outline-none text-lg ${formErrors.name ? "border-red-500" : "border-gray-300 focus:border-[#024E69]"}`} required disabled={isSubmitting} />{formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}</div><div><label className="block text-lg font-semibold text-gray-700 mb-3">E-mail</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full p-4 border-2 rounded-lg focus:outline-none text-lg ${formErrors.email ? "border-red-500" : "border-gray-300 focus:border-[#024E69]"}`} required disabled={isSubmitting} />{formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}</div><div><label className="block text-lg font-semibold text-gray-700 mb-3">Telefone/WhatsApp</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={`w-full p-4 border-2 rounded-lg focus:outline-none text-lg ${formErrors.phone ? "border-red-500" : "border-gray-300 focus:border-[#024E69]"}`} required disabled={isSubmitting} />{formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}</div><div><label className="block text-lg font-semibold text-gray-700 mb-3">CPF</label><input type="text" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} className={`w-full p-4 border-2 rounded-lg focus:outline-none text-lg ${formErrors.cpf ? "border-red-500" : "border-gray-300 focus:border-[#024E69]"}`} required disabled={isSubmitting} />{formErrors.cpf && <p className="text-red-500 text-sm mt-1">{formErrors.cpf}</p>}</div><div className="flex gap-4"><button type="button" onClick={handleBack} className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors" disabled={isSubmitting}>Voltar</button><button type="submit" className="flex-1 bg-[#024E69] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1489b8] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar Solicitação"}</button></div></form></div></div>
          )}

          {/* ✅ TELA DE SUCESSO */}
          {step === 5 && (
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="text-green-600 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Solicitação Enviada!</h2>
                    <p className="text-gray-600 mb-8">Sua solicitação foi registrada com sucesso. Para agilizar o processo, entre em contato conosco pelo WhatsApp.</p>
                    <Link
                        href={`https://wa.me/55${whatsAppNumber}?text=${whatsAppMessage}`}
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-green-500 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors"
                    >
                        <Send size={20} />
                        Falar no WhatsApp
                    </Link>
                </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer (sem alterações) */}
      <footer className="bg-[#024E69] text-white py-8 sm:py-12"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left"><div className="flex flex-col items-center md:items-start"><h3 className="font-bold mb-4 text-lg">Páginas</h3><ul className="space-y-3"><li><Link href="/#produtos" className="hover:text-blue-200 hover-underline text-sm sm:text-base transition-colors duration-300">Produtos</Link></li><li><Link href="/#sobre" className="hover:text-blue-200 hover-underline text-sm sm:text-base transition-colors duration-300">Sobre Nós</Link></li><li><Link href="/#contato" className="hover:text-blue-200 hover-underline text-sm sm:text-base transition-colors duration-300">Contato</Link></li></ul></div><div className="flex flex-col items-center"><h3 className="font-bold mb-4 text-lg">Nos siga!</h3><p className="text-sm sm:text-base mb-4">easyviagens@gmail.com</p><div className="flex space-x-4"><Link href="#" className="hover:opacity-80 transition-opacity duration-300 p-2 hover:bg-white/10 rounded-full" aria-label="Facebook"><FacebookIcon /></Link><Link href="#" className="hover:opacity-80 transition-opacity duration-300 p-2 hover:bg-white/10 rounded-full" aria-label="Instagram"><InstagramIcon /></Link><Link href="#" className="hover:opacity-80 transition-opacity duration-300 p-2 hover:bg-white/10 rounded-full" aria-label="LinkedIn"><LinkedInIcon /></Link></div></div><div className="flex flex-col items-center md:items-end"><h3 className="font-bold mb-4 text-lg">Contato</h3><div className="space-y-2 text-sm sm:text-base"><p>+55 11 111-111</p><p>+55 11 999-999</p></div></div></div><div className="border-t border-white/20 mt-8 pt-6 text-center"><p className="text-xs sm:text-sm opacity-80">Copyright@2025 &lt;enterprise&gt;. Made with ❤️ by enchante.digital.</p></div></div></footer>
    </div>
  )
}

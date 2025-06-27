"use client"

// A importação de 'getSettings' e 'initializeData' pode ser mantida se for usada por outras partes que não migraram.
import { api } from "@/convex/_generated/api"
import { type SiteSettings } from "@/lib/data-store"
import { useQuery } from "convex/react"
import { CreditCard, Headphones, Menu, MessageCircle, Users, X } from "lucide-react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

// SVG Components for Social Media (mantidos intactos)
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="white"
    />
  </svg>
)

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      fill="white"
    />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      fill="white"
    />
  </svg>
)

export default function HomePage() {
  const links = useQuery(api.landingLinks.getUnique)
  // ✅ ADICIONADO: Query para buscar as configurações do site, incluindo banners
  const siteConfig = useQuery(api.siteConfig.get)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // ✅ ALTERADO: Removido 'banners' do estado local, pois agora é dinâmico
  const [settings, setSettings] = useState<Omit<SiteSettings, "banners">>({
    socialLinks: { facebook: "#", instagram: "#", linkedin: "#" },
    contact: { phone1: "+55 11 111-111", phone2: "+55 11 999-999", email: "easyviagens@gmail.com", whatsappLink: "#" },
    milesCalculator: { minMiles: 1000, maxMiles: 150000, buyMultiplier: 0.02, sellMultiplier: 0.018 },
  })

  // ✅ REMOVIDO: A lógica de carregar banners do data-store não é mais necessária.
  // A parte de 'settings' pode ser mantida se outras configurações ainda são carregadas de lá.
  useEffect(() => {
    // initializeData() // Se outras partes ainda dependem disso, pode ser mantido
    // setSettings(getSettings()) // Se outras partes ainda dependem disso, pode ser mantido
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className={`min-h-screen bg-white ${montserrat.className}`}>
      <style jsx global>{`
        /* ... Seu CSS global permanece intacto ... */
        .hover-underline { position: relative; display: inline-block; overflow: visible; }
        .hover-underline::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background-color: #179FCF; transition: width 0.4s ease-out; }
        .hover-underline:hover::after { width: 100%; }
        .hover-underline.flex-link { display: inline-flex; align-items: center; gap: 0.5rem; }
        .hover-underline.flex-link::after { width: 0; transition: width 0.4s ease-out; }
        .hover-underline.flex-link:hover::after { width: calc(100% - 1rem); }
        .mobile-menu { transform: translateX(-100%); transition: transform 0.3s ease-in-out; }
        .mobile-menu.open { transform: translateX(0); }
      `}</style>

      {/* Header (permanece intacto) */}
      <header className="bg-[#024E69] text-white px-4 sm:px-6 py-4 sm:py-5 shadow-lg relative">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold tracking-wide">EASY VIAGENS</div>
          <nav className="hidden lg:flex space-x-12">
            <button onClick={() => scrollToSection("home")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline cursor-pointer">HOME</button>
            <button onClick={() => scrollToSection("produtos")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline cursor-pointer">PRODUTOS</button>
            <button onClick={() => scrollToSection("sobre")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline cursor-pointer">SOBRE NÓS</button>
            <button onClick={() => scrollToSection("contato")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline cursor-pointer">CONTATO</button>
          </nav>
          <div className="flex items-center gap-4">
            <Link href={settings.contact.whatsappLink} className="bg-transparent p-2 sm:p-3 rounded-full hover:bg-green-600 transition-colors duration-300 cursor-pointer">
              <Image src="/images/whatsapp-icon.png" alt="WhatsApp" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            </Link>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div className={`lg:hidden absolute top-full left-0 w-full bg-[#024E69] shadow-lg mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <nav className="flex flex-col p-4 space-y-4">
            <button onClick={() => scrollToSection("home")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">HOME</button>
            <button onClick={() => scrollToSection("produtos")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">PRODUTOS</button>
            <button onClick={() => scrollToSection("sobre")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">SOBRE NÓS</button>
            <button onClick={() => scrollToSection("contato")} className="text-lg font-medium hover:text-blue-200 transition-colors duration-300 py-2 hover-underline text-left">CONTATO</button>
          </nav>
        </div>
      </header>

      {/* Hero Section (permanece intacto) */}
      <section id="home" className="bg-[#179FCF] text-white relative overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[780px]">
        <div className="absolute inset-0">
          <Image src="/images/hero-background.png" alt="Toronto skyline" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#179FCF] bg-opacity-40"></div>
        </div>
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32 relative z-10 min-h-[500px] sm:min-h-[600px] lg:min-h-[780px] flex items-center">
          <div className="max-w-2xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">SUA VIAGEM MAIS FÁCIL</h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10">Economize na passagem, e curta seu sonho!</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="#" className="border-2 border-white text-white px-6 py-3 rounded-3xl hover:bg-white hover:text-[#179FCF] transition-colors duration-300 text-center font-medium text-sm sm:text-base">Comprar passagem</Link>
              <Link href="/milhas" className="text-white hover:text-blue-200 transition-colors duration-300 font-medium self-center text-sm sm:text-base hover-underline text-center sm:text-left">Comprar milhas</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SEÇÃO PROMOCIONAL 1 ATUALIZADA */}
      <section id="produtos" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-3xl">
            {siteConfig === undefined && <div className="h-[230px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>}
            {siteConfig?.banner1Url && (
              <>
                <Image
                  src={siteConfig.banner1Url}
                  alt="Banner promocional"
                  width={690}
                  height={230}
                  className="hidden sm:block rounded-2xl object-cover w-full"
                />
                <Image
                  src={siteConfig.banner1Url} 
                  alt="Banner promocional mobile"
                  width={300}
                  height={400}
                  className="sm:hidden rounded-2xl object-cover w-full max-w-sm mx-auto"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Destination Section (permanece intacto) */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <Image src="/images/group2.png" alt="Travel destinations" width={280} height={210} className="rounded-2xl object-cover w-full max-w-md mx-auto lg:mx-0" />
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-[#179FCF] leading-tight mb-4 lg:mb-5">Qual seu destino?</h2>
              <p className="text-black text-sm sm:text-base lg:text-[18px] mb-4 lg:mb-3 leading-relaxed">Seja qual for, nós temos a sua passagem aqui! Seu destino tem uma passagem certa, e você pode economizar até <span className="font-bold text-[#179FCF]">30%</span> na sua passagem com a Easy Destinos como Paris, Inglaterra e Toronto podem ser mais reais!</p>
              <Link href="#" className="text-[#179FCF] hover:text-[#1489b8] inline-flex items-center gap-2 font-semibold text-sm sm:text-base lg:text-[18px] hover-underline flex-link justify-center lg:justify-start">
                Compre sua passagem <Image src="/images/vetorseta.png" alt="Arrow" width={12} height={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Miles Section (permanece intacto) */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-[#179FCF] leading-tight mb-4 lg:mb-5">Comprar milhas</h2>
              <p className="text-black text-sm sm:text-base lg:text-[18px] mb-4 lg:mb-3 leading-relaxed">Compre milhas no melhor preço para aproveitar sua viagem da melhor forma! Aqui negociamos milhas diretamente com você, com atendimento humanizado!</p>
              <Link href="/milhas" className="text-[#179FCF] hover:text-[#1489b8] inline-flex items-center gap-2 font-semibold text-sm sm:text-base lg:text-[18px] hover-underline flex-link justify-center lg:justify-start">
                Economize <Image src="/images/vetorseta.png" alt="Arrow" width={12} height={12} />
              </Link>
            </div>
            <div className="w-full lg:w-1/2">
              <Image src="/images/group3.png" alt="Toronto skyline" width={280} height={210} className="rounded-2xl object-cover w-full max-w-md mx-auto lg:mx-0" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section (permanece intacto) */}
      <section id="sobre" className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-[#179FCF] leading-tight mb-8 lg:mb-10 text-center">Por que nos escolher?</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-start gap-4 lg:gap-5">
                <div className="bg-blue-500 p-3 lg:p-4 rounded-full flex-shrink-0"><MessageCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" /></div>
                <div>
                  <h3 className="font-semibold text-black text-lg sm:text-xl lg:text-[22px] mb-1">Atendimento humanizado</h3>
                  <p className="text-black text-base sm:text-lg lg:text-[20px]">via WhatsApp!</p>
                </div>
              </div>
              <div className="flex items-start gap-4 lg:gap-5">
                <div className="bg-blue-500 p-3 lg:p-4 rounded-full flex-shrink-0"><Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" /></div>
                <div>
                  <h3 className="font-semibold text-black text-lg sm:text-xl lg:text-[22px] mb-1">Compre para toda família</h3>
                  <p className="text-black text-base sm:text-lg lg:text-[20px]">com até <span className="font-bold">30% de desconto</span></p>
                </div>
              </div>
              <div className="flex items-start gap-4 lg:gap-5">
                <div className="bg-blue-500 p-3 lg:p-4 rounded-full flex-shrink-0"><Headphones className="w-5 h-5 lg:w-7 lg:h-7 text-white" /></div>
                <div>
                  <h3 className="font-semibold text-black text-lg sm:text-xl lg:text-[22px] mb-1">Suporte premium para sua</h3>
                  <p className="text-black text-base sm:text-lg lg:text-[20px]">viagem</p>
                </div>
              </div>
              <div className="flex items-start gap-4 lg:gap-5">
                <div className="bg-blue-500 p-3 lg:p-4 rounded-full flex-shrink-0"><CreditCard className="w-5 h-5 lg:w-7 lg:h-7 text-white" /></div>
                <div>
                  <h3 className="font-semibold text-black text-lg sm:text-xl lg:text-[22px] mb-1">Reserve, pague e receba</h3>
                  <p className="text-black text-base sm:text-lg lg:text-[20px]">tudo diretamente do WhatsApp!</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Image src="/images/group4.png" alt="Travel destinations" width={224} height={168} className="rounded-2xl object-cover w-full max-w-sm lg:max-w-none lg:w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section (permanece intacto) */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <Image src="/images/group3.png" alt="Toronto skyline" width={280} height={210} className="rounded-2xl object-cover w-full max-w-md mx-auto lg:mx-0" />
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-[#179FCF] leading-tight mb-4 lg:mb-5">Destinos populares</h2>
              <p className="text-black text-sm sm:text-base lg:text-[18px] mb-4 lg:mb-3 leading-relaxed">Passagem <span className="font-bold">ida e volta</span> por <span className="font-bold">R$2.350</span> para <span className="font-bold">Toronto, Canadá</span>. Mais de 30 viajantes foram a este destino só esse mês! Confira nossos preços promocionais e embarque você também nessa viagem!</p>
              <Link href="#" className="text-[#179FCF] hover:text-[#1489b8] inline-flex items-center gap-2 font-semibold text-sm sm:text-base lg:text-[18px] hover-underline flex-link justify-center lg:justify-start">
                Reserve agora! <Image src="/images/vetorseta.png" alt="Arrow" width={12} height={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SEÇÃO PROMOCIONAL 2 ATUALIZADA */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="w-full max-w-3xl">
            {siteConfig === undefined && <div className="h-[230px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>}
            {siteConfig?.banner2Url && (
              <>
                <Image
                  src={siteConfig.banner2Url}
                  alt="Banner promocional"
                  width={690}
                  height={230}
                  className="hidden sm:block rounded-2xl object-cover w-full"
                />
                <Image
                  src={siteConfig.banner2Url}
                  alt="Banner promocional mobile"
                  width={300}
                  height={400}
                  className="sm:hidden rounded-2xl object-cover w-full max-w-sm mx-auto"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer (permanece intacto) */}
      <footer id="contato" className="bg-[#179FCF] text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-bold mb-4 text-lg">Páginas</h3>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection("produtos")} className="hover:text-blue-200 hover-underline text-sm sm:text-base transition-colors duration-300">Produtos</button></li>
                <li><button onClick={() => scrollToSection("sobre")} className="hover:text-blue-200 hover-underline text-sm sm:text-base transition-colors duration-300">Sobre Nós</button></li>
                <li><button onClick={() => scrollToSection("contato")} className="hover:text-blue-200 hover-underline text-sm sm:text-base transition-colors duration-300">Contato</button></li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-bold mb-4 text-lg">Nos siga!</h3>
              <p className="text-sm sm:text-base mb-4">{links?.emailContact}</p>
              <div className="flex space-x-4">
                <Link href={links?.fb ?? "https://facebook.com"} className="hover:opacity-80 transition-opacity duration-300 p-2 hover:bg-white/10 rounded-full" aria-label="Facebook"><FacebookIcon /></Link>
                <Link href={links?.ig ?? "https://instagram.com"} className="hover:opacity-80 transition-opacity duration-300 p-2 hover:bg-white/10 rounded-full" aria-label="Instagram"><InstagramIcon /></Link>
                <Link href={links?.linkd ?? "https://linkedin.com"} className="hover:opacity-80 transition-opacity duration-300 p-2 hover:bg-white/10 rounded-full" aria-label="LinkedIn"><LinkedInIcon /></Link>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <h3 className="font-bold mb-4 text-lg">Contato</h3>
              <div className="space-y-2 text-sm sm:text-base">
                <p>{links?.telOne}</p>
                <p>{links?.telTwo}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center">
            <p className="text-xs sm:text-sm opacity-80">
              Copyright@2025 &lt;enterprise&gt;. Made with ❤️ by{" "}
              <Link href="https://enchante.digital" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors underline">
                enchante.digital
              </Link>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

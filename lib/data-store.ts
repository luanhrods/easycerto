// Data store utilities for managing mock data
export interface User {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  operationType: string
  airline: string
  miles: string
  deliveryType: string
  createdAt: string
}

export interface SiteSettings {
  socialLinks: {
    facebook: string
    instagram: string
    linkedin: string
  }
  contact: {
    phone1: string
    phone2: string
    email: string
    whatsappLink: string
  }
  milesCalculator: {
    minMiles: number
    maxMiles: number
    buyMultiplier: number
    sellMultiplier: number
  }
  banners: {
    banner1: string
    banner2: string
  }
}

export interface Airline {
  id: string
  name: string
  isActive: boolean
}

// Default data
const defaultSettings: SiteSettings = {
  socialLinks: {
    facebook: "https://facebook.com/easyviagens",
    instagram: "https://instagram.com/easyviagens",
    linkedin: "https://linkedin.com/company/easyviagens",
  },
  contact: {
    phone1: "+55 11 111-111",
    phone2: "+55 11 999-999",
    email: "easyviagens@gmail.com",
    whatsappLink: "https://wa.me/5511999999999",
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
}

const defaultAirlines: Airline[] = [
  { id: "1", name: "LATAM", isActive: true },
  { id: "2", name: "GOL", isActive: true },
  { id: "3", name: "Azul", isActive: true },
  { id: "4", name: "Avianca", isActive: true },
  { id: "5", name: "TAP Air Portugal", isActive: true },
  { id: "6", name: "American Airlines", isActive: true },
  { id: "7", name: "United Airlines", isActive: true },
  { id: "8", name: "Air France", isActive: true },
  { id: "9", name: "KLM", isActive: true },
  { id: "10", name: "Lufthansa", isActive: true },
  { id: "11", name: "Emirates", isActive: true },
  { id: "12", name: "Qatar Airways", isActive: true },
  { id: "13", name: "Turkish Airlines", isActive: true },
  { id: "14", name: "Copa Airlines", isActive: true },
  { id: "15", name: "Iberia", isActive: true },
]

// Users management
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("easyviagens_users")
  return users ? JSON.parse(users) : []
}

export const addUser = (user: Omit<User, "id" | "createdAt">): void => {
  if (typeof window === "undefined") return
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem("easyviagens_users", JSON.stringify(users))
}

export const deleteUser = (id: string): void => {
  if (typeof window === "undefined") return
  const users = getUsers().filter((user) => user.id !== id)
  localStorage.setItem("easyviagens_users", JSON.stringify(users))
}

// Settings management
export const getSettings = (): SiteSettings => {
  if (typeof window === "undefined") return defaultSettings
  const settings = localStorage.getItem("easyviagens_settings")
  return settings ? JSON.parse(settings) : defaultSettings
}

export const updateSettings = (settings: SiteSettings): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("easyviagens_settings", JSON.stringify(settings))
}

// Airlines management
export const getAirlines = (): Airline[] => {
  if (typeof window === "undefined") return defaultAirlines
  const airlines = localStorage.getItem("easyviagens_airlines")
  return airlines ? JSON.parse(airlines) : defaultAirlines
}

export const updateAirlines = (airlines: Airline[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("easyviagens_airlines", JSON.stringify(airlines))
}

export const getActiveAirlines = (): Airline[] => {
  return getAirlines().filter((airline) => airline.isActive)
}

// Initialize default data if not exists
export const initializeData = (): void => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("easyviagens_settings")) {
    updateSettings(defaultSettings)
  }

  if (!localStorage.getItem("easyviagens_airlines")) {
    updateAirlines(defaultAirlines)
  }
}

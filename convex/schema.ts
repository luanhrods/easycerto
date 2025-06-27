import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    email: v.optional(v.string()),
    password: v.optional(v.string()),
  }),
  company: defineTable({
    name: v.optional(v.string()),
    priceSell: v.optional(v.float64()),
    priceBuy: v.optional(v.float64()),
    limitSell: v.optional(v.number()),
    limitBuy:  v.optional(v.number()),
  }),
  clients: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    cpf: v.optional(v.string()),
    quantity:  v.optional(v.number()),
    buyorsell: v.optional(v.boolean()),
    antecipated: v.optional(v.boolean()),
    date: v.optional(v.any()),
  }),
  landingLinks: defineTable({
    fb: v.optional(v.string()),
    linkd: v.optional(v.string()),
    ig: v.optional(v.string()),
    telOne: v.optional(v.string()),
    telTwo: v.optional(v.string()),
    emailContact: v.optional(v.string())
  }),
   siteConfig: defineTable({
    // Vamos usar um identificador para garantir que só haja um documento de config
    identifier: v.string(), 
    banner1StorageId: v.optional(v.id("_storage")),
    banner2StorageId: v.optional(v.id("_storage")),
  }).index("by_identifier", ["identifier"]), // Índice para buscar a config facilmente
})
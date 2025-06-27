// convex/company.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- CREATE ---
// Cria um novo registro de empresa/ativo.
export const create = mutation({
  args: {
    name: v.optional(v.string()),
    priceSell: v.optional(v.float64()),
    priceBuy: v.optional(v.float64()),
    limitSell: v.optional(v.number()),
    limitBuy: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const companyId = await ctx.db.insert("company", args);
    return companyId;
  },
});

// --- READ ---
// Busca um único registro de empresa pelo seu ID.
export const get = query({
  args: { companyId: v.id("company") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    return company;
  },
});

// Lista todos os registros de empresa.
export const list = query({
  handler: async (ctx) => {
    const companies = await ctx.db.query("company").collect();
    return companies;
  },
});

// --- UPDATE ---
// Atualiza os campos de um registro de empresa.
export const update = mutation({
  args: {
    id: v.id("company"),
    name: v.optional(v.string()),
    priceSell: v.optional(v.float64()),
    priceBuy: v.optional(v.float64()),
    limitSell: v.optional(v.number()),
    limitBuy: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

// --- DELETE ---
// Deleta um registro de empresa pelo seu ID.
export const remove = mutation({
  args: { id: v.id("company") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
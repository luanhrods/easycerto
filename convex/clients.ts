// convex/clients.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- CREATE ---
// Cria um novo cliente.
export const create = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    cpf: v.optional(v.string()),
    quantity: v.optional(v.number()),
    buyorsell: v.optional(v.boolean()),
    antecipated: v.optional(v.boolean()),
    date: v.optional(v.any()),
    pixBank: v.optional(v.string()),
    pixNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const clientId = await ctx.db.insert("clients", args);
    return clientId;
  },
});

// --- READ ---
// Busca um único cliente pelo seu ID.
export const get = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const client = await ctx.db.get(args.clientId);
    return client;
  },
});


// Lista todos os clientes, ordenados do mais novo para o mais velho.
export const list = query({
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").order("desc").collect();
    return clients;
  },
});

// --- UPDATE ---
// Atualiza os campos de um cliente.
export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    cpf: v.optional(v.string()),
    quantity: v.optional(v.number()),
    buyorsell: v.optional(v.boolean()),
    antecipated: v.optional(v.boolean()),
    date: v.optional(v.any()),
    pixBank: v.optional(v.string()),
    pixNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

// --- DELETE ---
// Deleta um cliente pelo seu ID.
export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
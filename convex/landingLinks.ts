// convex/landingLinks.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- CREATE ---
// Cria um novo conjunto de links. Idealmente, você teria apenas um documento nesta tabela.
export const create = mutation({
  args: {
    fb: v.optional(v.string()),
    linkd: v.optional(v.string()),
    ig: v.optional(v.string()),
    telOne: v.optional(v.string()),
    telTwo: v.optional(v.string()),
    emailContact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const linkId = await ctx.db.insert("landingLinks", args);
    return linkId;
  },
});

// --- READ ---
// Busca um único registro de links pelo seu ID.
export const get = query({
  args: { linkId: v.id("landingLinks") },
  handler: async (ctx, args) => {
    const links = await ctx.db.get(args.linkId);
    return links;
  },
});

// Busca o primeiro (e provavelmente único) registro de links da tabela.
// Este é um padrão útil para tabelas de configuração como esta.
export const getUnique = query({
    handler: async (ctx) => {
        const links = await ctx.db.query("landingLinks").first();
        return links;
    }
})

// --- UPDATE ---
// Atualiza os campos do registro de links.
export const update = mutation({
  args: {
    id: v.id("landingLinks"),
    fb: v.optional(v.string()),
    linkd: v.optional(v.string()),
    ig: v.optional(v.string()),
    telOne: v.optional(v.string()),
    telTwo: v.optional(v.string()),
    emailContact: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

// --- DELETE ---
// Deleta um registro de links pelo seu ID.
export const remove = mutation({
  args: { id: v.id("landingLinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
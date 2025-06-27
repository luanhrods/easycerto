"use client"

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query para buscar as configurações e as URLs dos banners
export const get = query({
  handler: async (ctx) => {
    // Busca o único documento de configuração
    const config = await ctx.db.query("siteConfig").withIndex("by_identifier", q => q.eq("identifier", "default")).unique();

    if (!config) return { banner1Url: null, banner2Url: null };

    // Converte os storageIds em URLs públicas, se existirem
    const banner1Url = config.banner1StorageId ? await ctx.storage.getUrl(config.banner1StorageId) : null;
    const banner2Url = config.banner2StorageId ? await ctx.storage.getUrl(config.banner2StorageId) : null;
    
    return {
        ...config,
        banner1Url,
        banner2Url
    };
  },
});

// Mutation para gerar uma URL de upload temporária
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Mutation para salvar o storageId do banner no banco de dados
export const saveBannerStorageId = mutation({
  args: {
    storageId: v.id("_storage"),
    bannerKey: v.union(v.literal("banner1StorageId"), v.literal("banner2StorageId")),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("siteConfig").withIndex("by_identifier", q => q.eq("identifier", "default")).unique();

    if (!config) {
      // Se a configuração não existir, cria uma nova
      await ctx.db.insert("siteConfig", {
        identifier: "default",
        [args.bannerKey]: args.storageId,
      });
    } else {
      // Se já existir, atualiza
      await ctx.db.patch(config._id, {
        [args.bannerKey]: args.storageId,
      });
    }
  },
});

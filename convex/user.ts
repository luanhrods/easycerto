// convex/user.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- CREATE ---
// Cria um novo usuário.
// ATENÇÃO: Armazenar senhas em texto puro não é seguro.
// Considere usar uma "action" do Convex para fazer o hash da senha antes de salvá-la,
// ou utilize um provedor de autenticação como o Clerk.
export const create = mutation({
  args: {
    email: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("user", {
      email: args.email,
      password: args.password,
    });
    return userId;
  },
});

// --- READ ---
// Busca um único usuário pelo seu ID.
export const get = query({
  args: { userId: v.id("user") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

// Lista todos os usuários. Para um grande número de usuários, considere usar paginação.
export const list = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("user").collect();
    return users;
  },
});

// --- UPDATE ---
// Atualiza os campos de um usuário.
export const update = mutation({
  args: {
    id: v.id("user"),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

// --- DELETE ---
// Deleta um usuário pelo seu ID.
export const remove = mutation({
  args: { id: v.id("user") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// --- LOGIN ---
// Verifica as credenciais do usuário e retorna o usuário se forem válidas.
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Encontrar o usuário pelo email (assumindo que você tem um índice para email)
    const user = await ctx.db
      .query("user")
      // Se você não criou um índice 'by_email' no schema.ts, essa linha dará erro.
      // A alternativa seria .filter(q => q.eq(q.field("email"), args.email)) mas é menos eficiente.
      .filter(q => q.eq(q.field("email"), args.email))
      .unique();

    if (!user) {
      // Usuário não encontrado, retorna null. Não diga ao frontend se foi o email ou a senha.
      return null;
    }

    // 2. Verificar a senha
    // ESTA VERIFICAÇÃO É INSEGURA! Veja a nota abaixo.
    const isPasswordCorrect = user.password === args.password;

    if (!isPasswordCorrect) {
      // Senha incorreta, retorna null.
      return null;
    }

    // 3. Credenciais corretas, retorna os dados do usuário.
    return user
  },
});
const FALLBACK_SUPABASE_URL = "https://svkhmjdewifbhwfyomwd.supabase.co";
// Supabase publishable keys are public by design; table access remains governed by RLS.
const FALLBACK_SUPABASE_ANON_KEY = "sb_publishable_V4YUMUK-bGOF-w4XiMrKhQ_d_glRL27";

export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
  configured: boolean;
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || FALLBACK_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    FALLBACK_SUPABASE_ANON_KEY;

  return {
    url: url || FALLBACK_SUPABASE_URL,
    anonKey: anonKey || FALLBACK_SUPABASE_ANON_KEY,
    configured: Boolean(url && anonKey && !url.includes("placeholder-project")),
  };
}

export function getSupabaseAdminConfig() {
  const publicConfig = getSupabasePublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

  return {
    ...publicConfig,
    serviceRoleKey,
    adminConfigured: publicConfig.configured && Boolean(serviceRoleKey),
  };
}

export function getStripeConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim() || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";

  return {
    secretKey,
    webhookSecret,
    configured: Boolean(secretKey),
  };
}

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (vercelUrl && (!configuredUrl || configuredUrl.includes("localhost"))) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

const FALLBACK_SUPABASE_URL = "https://svkhmjdewifbhwfyomwd.supabase.co";
// Supabase publishable keys are public by design; table access remains governed by RLS.
const FALLBACK_SUPABASE_ANON_KEY = "sb_publishable_V4YUMUK-bGOF-w4XiMrKhQ_d_glRL27";

export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
  configured: boolean;
}

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;

  return /votre-projet|your-project|placeholder-project|votre_cle|\.\.\.$/i.test(
    value.trim()
  );
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const rawKey = [
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  ].find((value) => value && !isPlaceholder(value));

  // Si l'environnement contient encore les valeurs d'exemple du fichier
  // .env.example, on retombe sur le projet Supabase public de LA CAVE.
  const hasUsableEnvironment = !isPlaceholder(rawUrl) && Boolean(rawKey);

  const url = hasUsableEnvironment ? rawUrl! : FALLBACK_SUPABASE_URL;
  const anonKey = hasUsableEnvironment ? rawKey! : FALLBACK_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    configured: Boolean(url && anonKey),
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

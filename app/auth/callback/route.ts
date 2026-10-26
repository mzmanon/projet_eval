import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const emailOtpTypes = new Set([
  "signup",
  "email",
]);

export async function GET(request: NextRequest) {
  const { origin, searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const otpType = searchParams.get("type");
  const supabase = await createServerSupabaseClient();

  let confirmationError: Error | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    confirmationError = error;
  } else if (tokenHash && otpType && emailOtpTypes.has(otpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });
    confirmationError = error;
  } else {
    confirmationError = new Error("Le lien de confirmation est incomplet.");
  }

  const destination = new URL("/account", origin);
  destination.searchParams.set(
    "confirmation",
    confirmationError ? "error" : "success"
  );

  return NextResponse.redirect(destination);
}

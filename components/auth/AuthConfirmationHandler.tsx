"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmationHandler() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const hasAuthError =
      url.searchParams.has("error") || url.searchParams.has("error_code");

    if (!code && !hasAuthError) return;

    url.searchParams.delete("code");
    url.searchParams.delete("error");
    url.searchParams.delete("error_code");
    url.searchParams.delete("error_description");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`
    );

    const completeConfirmation = async () => {
      if (!code || hasAuthError) {
        window.location.replace("/account?confirmation=error");
        return;
      }

      try {
        const { error } = await createClient().auth.exchangeCodeForSession(code);
        window.location.replace(
          `/account?confirmation=${error ? "error" : "success"}`
        );
      } catch {
        window.location.replace("/account?confirmation=error");
      }
    };

    void completeConfirmation();
  }, []);

  return null;
}

"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async (data: SignUpFormData) => {
  const {
    email,
    password,
    fullName: name,
    country,
    investmentGoals,
    riskTolerance,
    preferredIndustry,
  } = data;

  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (e) {
    console.log("Sign up failed", e);

    return { success: false, error: "Sign up failed" };
  }
};

export const signInWithEmail = async (data: SignInFormData) => {
  const { email, password } = data;

  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
    });

    return { success: true, data: response };
  } catch (e) {
    console.log("Sign in failed", e);

    return { success: false, error: "Sign in failed" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.error("Sign out failed", e);
    return { success: false, error: "Sign out failed" };
  }
};

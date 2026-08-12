"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import type { Units, FontSize } from "@prisma/client";

export type ProfileFormState = { error?: string; success?: boolean };

function parseOptionalFloat(v: FormDataEntryValue | null): number | null {
  if (!v) return null;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

export async function updateProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const userId = await getCurrentUserId();
  const displayName = String(formData.get("displayName") || "").trim();
  if (!displayName) {
    return { error: "Name can't be empty." };
  }

  const heightCm = parseOptionalFloat(formData.get("heightCm"));
  const weightKg = parseOptionalFloat(formData.get("weightKg"));
  const photoUrl = String(formData.get("photoUrl") || "").trim();
  const hometown = String(formData.get("hometown") || "").trim();

  await prisma.profile.update({
    where: { id: userId },
    data: {
      displayName,
      heightCm,
      weightKg,
      hometown: hometown || null,
      ...(photoUrl ? { photoUrl } : {}),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/home");
  return { success: true };
}

export async function updatePhoto(photoUrl: string): Promise<void> {
  const userId = await getCurrentUserId();
  await prisma.profile.update({ where: { id: userId }, data: { photoUrl } });
  revalidatePath("/profile");
  revalidatePath("/home");
}

export async function updatePreferences(formData: FormData): Promise<void> {
  const userId = await getCurrentUserId();
  const units: Units = formData.get("units") === "KG" ? "KG" : "LB";
  const rawFontSize = String(formData.get("fontSize"));
  const fontSize: FontSize = (["SMALL", "MEDIUM", "LARGE"] as const).includes(rawFontSize as FontSize)
    ? (rawFontSize as FontSize)
    : "MEDIUM";
  const marketingOptIn = formData.get("marketingOptIn") === "true";
  const showPRs = formData.get("showPRs") === "true";

  await prisma.profile.update({
    where: { id: userId },
    data: { units, fontSize, marketingOptIn, showPRs },
  });

  revalidatePath("/settings");
  revalidatePath("/profile");
  revalidatePath("/home");
}

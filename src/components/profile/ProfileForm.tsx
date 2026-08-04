"use client";

import { useActionState, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { updateProfile, updatePhoto, type ProfileFormState } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { kgToLb, lbToKg, cmToFtIn, ftInToCm } from "@/lib/units";

type Profile = {
  id: string;
  displayName: string;
  photoUrl: string | null;
  heightCm: number | null;
  weightKg: number | null;
  birthday: Date | null;
  hometown: string | null;
  units: "LB" | "KG";
};

const initialState: ProfileFormState = {};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMetric = profile.units === "KG";
  const initialFtIn = profile.heightCm ? cmToFtIn(profile.heightCm) : { ft: 0, inch: 0 };
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [weightKg, setWeightKg] = useState(profile.weightKg);
  const [ft, setFt] = useState(initialFtIn.ft || "");
  const [inch, setInch] = useState(initialFtIn.inch || "");
  const [cm, setCm] = useState(profile.heightCm ? Math.round(profile.heightCm) : "");
  const [displayWeight, setDisplayWeight] = useState(
    profile.weightKg
      ? Math.round(isMetric ? profile.weightKg : kgToLb(profile.weightKg))
      : ""
  );

  function onFtInChange(nextFt: string, nextIn: string) {
    setFt(nextFt);
    setInch(nextIn);
    const f = parseFloat(nextFt || "0");
    const i = parseFloat(nextIn || "0");
    setHeightCm(f || i ? ftInToCm(f, i) : null);
  }

  function onCmChange(value: string) {
    setCm(value);
    const n = parseFloat(value);
    setHeightCm(Number.isFinite(n) ? n : null);
  }

  function onWeightChange(value: string) {
    setDisplayWeight(value);
    const n = parseFloat(value);
    if (!Number.isFinite(n)) {
      setWeightKg(null);
      return;
    }
    setWeightKg(isMetric ? n : lbToKg(n));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPhotoError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${profile.id}/avatar.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      await updatePhoto(url);
      setPhotoUrl(url);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Upload failed — try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 px-5">
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
          style={{ background: "var(--purple)" }}
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-data text-2xl font-semibold text-white">{initials(profile.displayName)}</span>
          )}
          <div
            className="absolute bottom-0 flex w-full items-center justify-center gap-1 py-1.5"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            <Camera size={12} color="#fff" />
            <span className="font-data text-[9px] text-white">{uploading ? "…" : "Edit"}</span>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
          className="hidden"
          onChange={handlePhotoChange}
        />
        {photoError && <span className="max-w-[220px] text-center text-[12px] text-pink">{photoError}</span>}
        <input type="hidden" name="photoUrl" value={photoUrl ?? ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-data text-xs tracking-wide text-text-dim">NAME</span>
        <input
          name="displayName"
          defaultValue={profile.displayName}
          required
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-data text-xs tracking-wide text-text-dim">HOMETOWN</span>
        <input
          name="hometown"
          defaultValue={profile.hometown ?? ""}
          placeholder="e.g. Rockville Centre, NY"
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-data text-xs tracking-wide text-text-dim">HEIGHT</span>
        {isMetric ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={cm}
              onChange={(e) => onCmChange(e.target.value)}
              placeholder="0"
              className="w-24 rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
            />
            <span className="font-data text-sm text-text-faint">cm</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={ft}
              onChange={(e) => onFtInChange(e.target.value, String(inch))}
              placeholder="0"
              className="w-16 rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
            />
            <span className="font-data text-sm text-text-faint">ft</span>
            <input
              type="number"
              value={inch}
              onChange={(e) => onFtInChange(String(ft), e.target.value)}
              placeholder="0"
              className="w-16 rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
            />
            <span className="font-data text-sm text-text-faint">in</span>
          </div>
        )}
        <input type="hidden" name="heightCm" value={heightCm ?? ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-data text-xs tracking-wide text-text-dim">WEIGHT</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={displayWeight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="0"
            className="w-24 rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
          />
          <span className="font-data text-sm text-text-faint">{isMetric ? "kg" : "lb"}</span>
        </div>
        <input type="hidden" name="weightKg" value={weightKg ?? ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-data text-xs tracking-wide text-text-dim">BIRTHDAY</span>
        <input
          type="date"
          name="birthday"
          defaultValue={profile.birthday ? profile.birthday.toISOString().slice(0, 10) : ""}
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
        />
      </div>

      {state.error && <span className="text-[12.5px] text-pink">{state.error}</span>}
      {state.success && <span className="text-[12.5px] text-purple-deep">Saved.</span>}

      <button
        type="submit"
        disabled={pending}
        className="py-3.5 font-display text-[15px] uppercase text-white"
        style={{ background: "var(--purple)", borderRadius: 12, opacity: pending ? 0.6 : 1 }}
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

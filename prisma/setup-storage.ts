import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const prisma = new PrismaClient();

async function main() {
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.some((b) => b.name === "avatars")) {
    const { error } = await admin.storage.createBucket("avatars", {
      public: true,
      fileSizeLimit: "5MB",
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    });
    if (error) throw error;
    console.log("Created 'avatars' bucket.");
  } else {
    console.log("'avatars' bucket already exists.");
  }

  // RLS on storage.objects so a user can only write inside their own {userId}/ folder,
  // while anyone can read (needed to display avatars publicly).
  const policies: [string, string][] = [
    [
      "Avatar images are publicly accessible",
      `create policy "Avatar images are publicly accessible" on storage.objects
       for select using ( bucket_id = 'avatars' )`,
    ],
    [
      "Users can upload their own avatar",
      `create policy "Users can upload their own avatar" on storage.objects
       for insert with check ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text )`,
    ],
    [
      "Users can update their own avatar",
      `create policy "Users can update their own avatar" on storage.objects
       for update using ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text )`,
    ],
  ];

  for (const [name, sql] of policies) {
    const existing = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `select count(*)::int as count from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = $1`,
      name
    );
    if (Number(existing[0].count) > 0) {
      console.log(`Policy "${name}" already exists, skipping.`);
      continue;
    }
    await prisma.$executeRawUnsafe(sql);
    console.log(`Created policy "${name}".`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

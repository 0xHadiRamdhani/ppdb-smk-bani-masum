This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin Pendaftar

Halaman `/admin` menggunakan login username/password server-side. Jalankan `supabase/registrations.sql` di SQL Editor Supabase agar tabel `registrations` dan bucket dokumen privat tersedia. Pastikan environment berisi:

```env
ADMIN_USERNAME=smkbm
ADMIN_PASSWORD=use-a-strong-unique-password
ADMIN_SESSION_SECRET=generate-a-random-secret
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-server-only-secret-key
```

`SUPABASE_SECRET_KEY` mengakses data hanya dari server; `ADMIN_SESSION_SECRET` menandatangani sesi admin dan harus berupa secret acak yang terpisah. Jangan beri prefiks `NEXT_PUBLIC_` pada password atau secret. Ganti password contoh sebelum deployment, simpan variabel tersebut di secret manager hosting, dan restart aplikasi setelah mengubahnya.

## Prisma dan Postgres

`DATABASE_URL` menggunakan Supabase transaction-mode pooler (port `6543` dan `pgbouncer=true`) untuk koneksi aplikasi. `DIRECT_URL` menggunakan session-mode pooler (port `5432`) untuk perintah migrasi Prisma. Prisma CLI membaca keduanya dari `.env.local`; pada URL lokal, ganti `[YOUR-PASSWORD]` dengan password database dan URL-encode karakter khusus.

```sh
npm run db:generate
npm run db:migrate
```

Untuk deployment, jalankan `npm run db:deploy` setelah migrasi dibuat dan simpan kedua URL sebagai environment server-only.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

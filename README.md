# Loan Management Application

This is a **Next.js 15** project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- **Next.js 15** (React framework)
- **Prisma ORM** (Database management)
- **Shadcn/UI** (Component library)
- **Framer Motion** (Animations)
- **Bun** (Package manager & runtime)
- **Clerk** (Authentication)
- **Supabase** (PostgreSQL database hosting)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org) (v18+ recommended)
- [Bun](https://bun.sh) (preferred package manager)
- PostgreSQL (or Supabase for cloud hosting)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:
   ```sh
   bun install --legacy-peer-deps
   ```

3. Start the development server:
   ```sh
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pages & Features

- **Loan List Page**: Displays all loans.
- **Loan Detail Page**: Shows details of a selected loan.
- **Create/Edit Loan Page**: Allows lenders to create or edit loans.

Additional features include:
- Responsive UI using **Shadcn/UI & Tailwind CSS**.
- Animations using **Framer Motion**.
- Authentication via **Clerk**.
- PostgreSQL database hosted on **Supabase**.

---

## Environment Variables

### `.env.local`
Create a `.env.local` file in the project root and add the following:

```ini
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZmxlZXQta3JpbGwtNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_xTEwMNpklfLB8ALClwXQcr9zdYPc8t2ElL2WXeRfx2
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
```

### `.env`
Create a `.env` file in the project root and add the following:

```ini
DATABASE_URL="postgresql://postgres.idtihntcualvufubijym:YOtkzmorS1fzBCKJ@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.idtihntcualvufubijym:YOtkzmorS1fzBCKJ@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

---

## PLEASE NOTE !!! WHEN SIGNING UP WITH CLERK USE ACTUAL NUMBER AND/OR EMAIL. OTP WILL BE SENT 

___

## Learn More

To learn more about the tools and frameworks used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/UI Docs](https://ui.shadcn.com/)
- [Clerk Authentication](https://clerk.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Bun](https://bun.sh/docs)

---

## Deployment

The easiest way to deploy this Next.js app is via [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel.
2. Add the required **environment variables** in Vercel's settings.
3. Deploy with one click!

More details: [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

---

## Contribution & Development Workflow

- Follow **feature branches** for new features.
- Use **clean commit messages**.
- Run **linting** before pushing code:
  ```sh
  bun lint
  ```
- Format code using **Prettier**:
  ```sh
  bun format
  ```

---

## License

This project is open-source. Feel free to contribute or fork it!


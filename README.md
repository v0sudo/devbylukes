# Dev By Lukes

A showcase platform for developers named Luke from around the world. Built with Next.js, Prisma, and shadcn/ui.

## Features

- 🎨 **Minimal Landing Page** - Clean, modern design showcasing developers named Luke
- 👤 **Profile Management** - Each developer can add their profile with:
  - Name
  - X (Twitter) handle with automatic profile picture
  - GitHub username
  - Website
  - Description
  - Up to 2 notable projects with favicons
- 🔒 **Secure Editing** - UUID-based edit links for profile management
- 🔍 **Search** - Search developers by X handle
- 🌓 **Dark Mode** - Built-in theme support
- ✨ **Duplicate Prevention** - Prevents duplicate X handles

## Tech Stack

- [Next.js 15](https://nextjs.org) - React framework with App Router
- [Prisma](https://prisma.io) - Database ORM
- [PostgreSQL](https://www.postgresql.org) - Database
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org) - Type safety

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/v0sudo/devbylukes.git
cd devbylukes
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
DATABASE_URL="your-postgresql-connection-string"
```

4. Set up the database:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

### Adding Your Profile

1. Click "Request to be Added" on the homepage
2. Fill in your details (name is required)
3. Add your X handle to automatically fetch your profile picture
4. Optionally add GitHub, website, description, and up to 2 notable projects
5. Submit the form
6. **Save your edit UUID** - You'll need this to edit your profile later!

### Editing Your Profile

1. Click the edit button on your profile card
2. Enter your edit UUID when prompted
3. Update your information
4. Save changes

### Searching

Use the search bar to find developers by their X handle.

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── api/         # API routes
│   ├── [uuid]/      # Edit page (UUID route)
│   └── page.tsx     # Homepage
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── ...          # Custom components
├── server/          # Server utilities
└── lib/             # Shared utilities
prisma/
└── schema.prisma    # Database schema
```

## Database Schema

The `Developer` model includes:

- Basic info (name, description)
- Social links (twitter, github, website)
- Avatar (auto-fetched from X handle)
- Notable projects (JSON array, max 2)
- Edit UUID (for secure profile editing)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Built By

Built by [@v0sudo](https://twitter.com/v0sudo) on X

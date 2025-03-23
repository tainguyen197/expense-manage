# AI Chat Application

A modern AI chat application built with Next.js 15, featuring real-time conversations, authentication, and a beautiful UI.

## Features

- 🤖 AI-powered chat interface using OpenAI
- 🔐 Secure authentication with Clerk
- 💾 Database integration with NeonDB and Drizzle ORM
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 📊 Data visualization with Recharts
- 🔄 State management with Zustand
- 📱 Fully responsive design
- ⚡ Real-time updates

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** Clerk
- **Database:** NeonDB (PostgreSQL)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **State Management:** Zustand
- **Charts:** Recharts
- **Form Handling:** Formik
- **Validation:** Zod
- **Date Handling:** date-fns, dayjs
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL database (NeonDB)

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   OPENAI_API_KEY=
   DATABASE_URL=
   ```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── actions/     # Server actions
├── app/         # App router pages
├── components/  # React components
├── db/         # Database schema and configurations
├── hooks/      # Custom React hooks
├── lib/        # Utility libraries
├── types/      # TypeScript types
├── utils/      # Helper functions
└── zustand/    # State management
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

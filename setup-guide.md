# CS Connect - Frontend Setup Guide

## Introduction

CS Connect is a comprehensive platform for computer science resources, faculty connections, and career development at MSU Denver. This guide will walk you through the process of setting up and running the CS Connect frontend application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **Git** for version control

You can verify your installations by running:

```bash
node --version
npm --version
git --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/cs-connect.git
cd cs-connect
```

### 2. Install Dependencies

Install all required dependencies for the project:

```bash
npm install
```

This will install all dependencies listed in the `package.json` file, including:

- Next.js (v15.1.7)
- React (v19.0.0)
- React DOM (v19.0.0)
- Supabase client
- TailwindCSS
- TypeScript

## Development

### Running the Development Server

To start the development server with hot-reload:

```bash
npm run dev
```

This will start the Next.js development server with Turbopack. Once started, you can access the application at [http://localhost:3000](http://localhost:3000).

### Project Structure

The CS Connect frontend follows the Next.js App Router structure:

```
src/
├── app/
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers
│   ├── careers/       # Career resources page
│   ├── faculty/       # Faculty directory page
│   ├── modules/       # Learning modules page
│   ├── profile/       # User profile page
│   ├── social/        # Social hub page
│   ├── layout.tsx     # Root layout component
│   └── page.tsx       # Home page component
├── public/            # Static assets
└── styles/            # Global styles
```

## Building for Production

### Creating a Production Build

To create an optimized production build:

```bash
npm run build
```

This will generate a production-ready build in the `.next` directory.

### Starting the Production Server

To start the production server:

```bash
npm run start
```

The production server will be available at [http://localhost:3000](http://localhost:3000) by default.

## Environment Configuration

The application uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Linting

To run the linter and check for code quality issues:

```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Make sure you've run `npm install`
   - Check for any missing dependencies in package.json

2. **Port already in use**
   - You can specify a different port: `npm run dev -- -p 3001`

3. **Build failures**
   - Check for TypeScript errors
   - Ensure all required environment variables are set

## Contributing

When contributing to the CS Connect frontend, please follow these guidelines:

- Follow the established code style and organization
- Write descriptive commit messages
- Create feature branches for new functionality
- Submit pull requests for review

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

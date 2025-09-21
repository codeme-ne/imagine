The project follows the standard Next.js App Router structure.
- `app/`: Contains all pages and API routes.
  - `app/page.tsx`: The main entry point of the application.
  - `app/layout.tsx`: The root layout for the application.
  - `app/api/`: Holds the backend API routes for scraping (`scrape`), image generation (`imagen4`), prompt generation (`gemini`), and environment checks (`check-env`).
- `components/`: Contains reusable React components.
  - `components/ui/`: Specifically holds components from the shadcn/ui library.
- `lib/`: Shared utility functions and libraries.
- `hooks/`: Custom React hooks.
- `public/`: Static assets like images and icons.
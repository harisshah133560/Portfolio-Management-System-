# PortfolioHub

A full-stack portfolio management system built with the MERN stack.

## Features

- User registration and login
- JWT authentication
- Project CRUD
- Public portfolio view
- Responsive UI

## Local development

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Production deployment

### Frontend on Vercel

1. Set the build command to `npm run build`.
2. Set the output directory to `dist`.
3. Add this environment variable:
   - `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

### Backend on Render

1. Create a web service from the backend folder.
2. Set the start command to `npm start`.
3. Add these environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_secret`
   - `CLIENT_URL=https://your-frontend-domain.vercel.app`
   - `FRONTEND_URL=https://your-frontend-domain.vercel.app`
   - `ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`

### Notes

- The frontend uses Vite and is configured for a production build with a Vercel-friendly rewrite rule.
- The backend is configured to serve uploads from the `uploads` folder and to accept cross-origin requests from the frontend domain.
- For persistent file uploads in production, consider storing uploads in cloud storage rather than the local filesystem.

## Author

**Haris Shah**

- GitHub: https://github.com/harisshah133560

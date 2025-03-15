# Next.js Social Media Application

A modern social media platform built with Next.js 15, TypeScript, and Express. This full-stack application features real-time interactions, responsive design, and a rich set of social features.

## Features

- **Authentication**
  - Secure user registration and login with JWT
  - Protected routes and API endpoints
  - Persistent sessions with HTTP-only cookies

- **Social Interactions**
  - Create and delete posts with image uploads
  - Real-time commenting system
  - Like/unlike posts with immediate UI feedback
  - Follow/unfollow users with state management
  - Save posts to personal collection
  - View saved posts in profile

- **Profile Management**
  - Customizable user profiles with profile pictures
  - View followers and following counts
  - Personal post feed
  - Saved posts collection
  - Profile picture upload with Cloudinary integration

- **Modern UI/UX**
  - Clean and responsive design with Tailwind CSS
  - Toast notifications for user actions
  - Loading states and error handling
  - Dynamic route protection
  - Shadcn UI components for consistent design

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Redux Toolkit for state management
- Tailwind CSS with Shadcn UI
- Axios for API requests
- Sonner for toast notifications

### Backend
- Express.js with TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for image storage

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- MongoDB installed and running
- npm or yarn package manager
- Cloudinary account for image uploads

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd next-express-social-media-app
```

2. Install dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables

Create `.env` files in both client and server directories with variables from file `.env.example`

4. Start the development servers

```bash
# Start the backend server
cd server
npm run start:dev

# In a new terminal, start the frontend
cd client
npm run dev
```

5. Or use deployed frontend and backend

Server is deployed by Render.com.
Deployed domain: 

Client is deployed by Vercel.com
Deployed domain: 

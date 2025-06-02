# ChatConnect Fullstack App Documentation

## Table of Contents

- [Overview](#overview)
- [Frontend](#frontend)
  - [Main Routes](#main-routes)
  - [Protected Routes](#protected-routes)
  - [Components](#components)
- [Backend](#backend)
  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
  - [Chat Routes](#chat-routes)
  - [Image Routes](#image-routes)
  - [AI Routes](#ai-routes)
- [WebSocket Events](#websocket-events)
- [Environment Variables](#environment-variables)
- [Other Notes](#other-notes)

---

## Overview

ChatConnect is a modern communication platform featuring real-time chat, AI assistance, image sharing, notifications, and user management. The stack includes React (frontend), Express/MongoDB (backend), and Socket.IO for real-time features.

---

## Frontend

### Main Routes

| Path             | Component/Page         | Description                                 | Auth Required |
|------------------|-----------------------|---------------------------------------------|--------------|
| `/`              | LandingPage           | Landing/marketing page                      | No           |
| `/login`         | LoginPage             | User login                                  | No           |
| `/signup`        | SignupPage            | User registration                           | No           |
| `/dashboard`     | DashboardPage         | Main dashboard with quick links & stats      | Yes          |
| `/chat`          | ChatPage              | Real-time chat with friends                 | Yes          |
| `/ai-chat`       | AIChatPage            | Chat with AI assistant                      | Yes          |
| `/gallery`       | GalleryPage           | View/upload images                          | Yes          |
| `/profile`       | ProfilePage           | Manage user profile                         | Yes          |
| `/settings`      | SettingsPage          | User settings (notifications, etc.)         | Yes          |
| `/find-users`    | FindUsersPage         | Discover and add new users                  | Yes          |
| `/users/:userId` | PublicProfilePage     | View public profile of another user         | Yes          |
| `/logout`        | LogoutPage            | Logout and redirect                         | No           |

### Protected Routes

All routes except `/`, `/login`, `/signup`, `/logout` are protected and require authentication.

### Components

- **Navbar**: Navigation bar with links, notifications, user menu.
- **CustomCursor**: Custom animated cursor.
- **FloatingOrbs**: 3D animated background for dashboard.
- **ProtectedRoute**: Wrapper to enforce authentication.
- **NotificationDropdown**: Shows notifications and friend requests.

---

## Backend

### Auth Routes (`/api/auth`)

| Method | Path      | Description         | Body Params            | Auth |
|--------|-----------|---------------------|------------------------|------|
| POST   | `/signup` | Register new user   | `{ username, email, password }` | No   |
| POST   | `/login`  | Login user          | `{ email, password }`  | No   |
| POST   | `/logout` | Logout user         |                        | Yes  |

---

### User Routes (`/api/user`)

| Method | Path                        | Description                        | Body Params / Query         | Auth |
|--------|-----------------------------|------------------------------------|----------------------------|------|
| GET    | `/me`                       | Get current user profile           |                            | Yes  |
| PUT    | `/me`                       | Update profile info                | `{ username, ... }`        | Yes  |
| PUT    | `/change-password`          | Change password                    | `{ oldPassword, newPassword }` | Yes  |
| POST   | `/profile-image`            | Upload profile image               | `FormData: image`          | Yes  |
| GET    | `/notification-settings`    | Get notification settings          |                            | Yes  |
| POST   | `/notification-settings`    | Update notification settings       | `{ ... }`                  | Yes  |
| GET    | `/friends`                  | Get friend list                    |                            | Yes  |
| POST   | `/remove-friend`            | Remove a friend                    | `{ friendId }`             | Yes  |
| POST   | `/send-friend-request`      | Send friend request                | `{ userId }`               | Yes  |
| POST   | `/accept-friend-request`    | Accept friend request              | `{ requestId }`            | Yes  |
| GET    | `/notifications`            | Get all notifications              |                            | Yes  |
| POST   | `/mark-notifications-read`  | Mark notifications as read         | `{ ids: [id1, id2, ...] }` | Yes  |
| POST   | `/notification-action`      | Handle notification action         | `{ notificationId, action }` | Yes  |

---

### Chat Routes (`/api/chat`)

| Method | Path                  | Description                        | Body Params / Query         | Auth |
|--------|-----------------------|------------------------------------|----------------------------|------|
| GET    | `/peers`              | Get all users except self          |                            | Yes  |
| GET    | `/history/:peerId`    | Get chat history with a user       |                            | Yes  |
| POST   | `/message`            | Send a text message                | `{ to, content, type? }`   | Yes  |
| GET    | `/unread-counts`      | Get unread message counts          |                            | Yes  |
| POST   | `/mark-read/:peerId`  | Mark messages from peer as read    |                            | Yes  |
| POST   | `/image-message`      | Send image message                 | `FormData: image, to`      | Yes  |
| POST   | `/voice-message`      | Send voice message                 | `FormData: audio, to`      | Yes  |

---

### Image Routes (`/api/images`)

| Method | Path        | Description                | Body Params / Query         | Auth |
|--------|-------------|----------------------------|----------------------------|------|
| POST   | `/`         | Upload image               | `FormData: image`          | Yes  |
| GET    | `/`         | Get all user images        |                            | Yes  |
| DELETE | `/:id`      | Delete image by ID         |                            | Yes  |

#### (Optional) Advanced Image Routes (`/api/images/analyze`, `/generate`, `/optimize`)

- `/analyze`: Analyze image using OpenAI Vision (POST, image upload)
- `/generate`: Generate image using DALL-E (POST, prompt)
- `/optimize`: Optimize uploaded image (POST, image upload)

---

### AI Routes (`/api/ai`)

| Method | Path      | Description         | Body Params            | Auth |
|--------|-----------|---------------------|------------------------|------|
| POST   | `/chat`   | Chat with AI        | `{ message }`          | Yes  |

---

## WebSocket Events

- `chat:join` (userId): Join a user's room for instant messaging.
- `chat:message` (msg): Receive new message (text/image/voice/location).
- `chat:error` (error): Error event for chat actions.

---

## Environment Variables

- `MONGO_URI`: MongoDB connection string
- `CLOUDINARY_URL` or individual Cloudinary keys
- `PORT`: Server port (default 5000)
- `VITE_API_URL`: Frontend env for backend API base URL

---

## Other Notes

- All file uploads are stored in `/uploads` and/or uploaded to Cloudinary.
- All protected routes require a valid JWT token in the `Authorization: Bearer <token>` header.
- Notification system supports friend requests, messages, and other events.
- The frontend uses Framer Motion for animations and @react-three/fiber for 3D backgrounds.
- For development, CORS is enabled for `http://localhost:5173` and the Netlify preview URL.

---

For any further details, refer to the codebase or contact the maintainer.

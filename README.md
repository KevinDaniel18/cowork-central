# 🏢 Coworking Space Booking System (WORKING ON)

A comprehensive coworking space management and booking system built with modern technologies and focused on user experience.

## 🚀 Live Demo

[View Application](https://cowork-central.vercel.app/) | [Admin Dashboard coming soon]

## 📱 Key Features

### 👥 For Users

- **Space Discovery**: Visual catalog with advanced filtering
- **Real-time Booking**: Interactive calendar with instant availability
- **Profile Management**: Personalized dashboard with booking history
- **Smart Search**: Filter by type, capacity, amenities, and location
- **Notifications**: Automatic confirmations and reminders

### 🔧 For Administrators

- **Analytics Dashboard**: Occupancy, revenue, and trend metrics
- **Space Management**: Full CRUD with image gallery
- **Booking Control**: Real-time status and conflict management
- **Detailed Reports**: Performance and utilization analysis
- **User Management**: Role and permission system

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React Framework with App Router
- **TypeScript** - Static typing and better DX
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Accessible and modern components
- **Lucide React** - Consistent iconography

### Backend & Database

- **Next.js API Routes** - Serverless backend
- **Prisma** - Modern ORM with type-safety
- **PostgreSQL** - Robust and scalable database
- **NextAuth.js** - Secure authentication

### DevOps & Deployment

- **Vercel** - Automatic deployment with Git integration
- **Vercel Postgres** - Managed database
- **ESLint & Prettier** - Code quality and formatting

## 🏗 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│   (Next.js)     │◄──►│   (Serverless)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React Pages   │    │ • Auth Routes   │    │ • Users         │
│ • Components    │    │ • Space CRUD    │    │ • Spaces        │
│ • State Mgmt    │    │ • Booking Logic │    │ • Bookings      │
│ • UI/UX         │    │ • Analytics     │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Data Model

### Core Entities

- **Users**: User management and roles (USER/ADMIN)
- **Spaces**: Space catalog with types and amenities
- **Bookings**: Reservations with states and temporal validations
- **Analytics**: Usage and performance metrics

### Key Relationships

```sql
User 1:N Booking (One user can have multiple bookings)
Space 1:N Booking (One space can have multiple bookings)
Booking N:1 User, Space (Each booking belongs to a user and space)
```

## 🚦 System States

### Booking States

- `PENDING` - Booking created, awaiting confirmation
- `CONFIRMED` - Booking confirmed and active
- `COMPLETED` - Booking successfully completed
- `CANCELLED` - Booking cancelled by user/admin
- `NO_SHOW` - User did not show up

### Space Types

- `DESK` - Individual desks
- `OFFICE` - Private offices
- `MEETING_ROOM` - Meeting rooms
- `PHONE_BOOTH` - Phone booths

## 🔐 Security & Authentication

- **NextAuth.js** with multiple providers
- **Role-based Access Control** (RBAC)
- **Protected API Routes** with middleware
- **Server-side data validation**
- **User input sanitization**

## 📈 Metrics & Analytics

### Key KPIs

- **Occupancy Rate**: Utilization percentage by space/period
- **Revenue Tracking**: Income by space and period
- **User Engagement**: Usage frequency and patterns
- **Conversion Rate**: Confirmed bookings vs attempts

### Available Reports

- Real-time dashboard with interactive charts
- CSV/Excel data export
- Temporal trend analysis
- Performance comparisons by space

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
npm/yarn/pnpm
PostgreSQL (or use Vercel Postgres)
```

### Local Installation

```bash
# Clone repository
git clone https://github.com/KevinDaniel18/cowork-central.git
cd coworking-booking-system

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma generate
npx prisma db push

# Run in development
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 🎯 Roadmap & Future Features

### Phase 2 - Integrations

- [ ] **Payment System** (Stripe/PayPal)
- [ ] **Email Notifications** (Resend/SendGrid)
- [ ] **Calendar Integration** (Google Calendar)
- [ ] **QR Codes** for check-in

### Phase 3 - Mobile & PWA

- [ ] **Progressive Web App** (PWA)
- [ ] **Mobile App** (React Native/Expo)
- [ ] **Push Notifications**
- [ ] **Offline Support**

### Phase 4 - Advanced Features

- [ ] **Real-time Updates** (WebSockets)
- [ ] **AI Recommendations** (ML for space suggestions)
- [ ] **Multi-tenant** (multiple coworkings)
- [ ] **Advanced Analytics** (predictive insights)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- LinkedIn: [your-profile](https://www.linkedin.com/in/kevin-sierra-castro-b1448b279/)

---

⭐ **Give a star if you find this project useful!**

## 📞 Contact

Questions? Suggestions? Get in touch!

- 📧 Email: kevnsc18@gmail.com
- 💬 LinkedIn: Send me a message

---

_Built with ❤️ using Next.js and TypeScript_

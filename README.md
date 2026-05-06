<<<<<<< HEAD
# Content Broadcasting System - Frontend

A modern React-based educational content broadcasting platform where teachers upload subject-based content, principals review and approve/reject submissions, and students/public viewers watch live broadcasts.

## 🎯 Project Overview

This is a **full-stack educational content management system** built with React that facilitates content distribution in educational environments. The system provides role-based access control with three main user flows:

1. **Teachers** - Upload educational content with scheduling
2. **Principals** - Review, approve, or reject uploaded content
3. **Students/Public** - View live active broadcasts without authentication

## ✨ Key Features Implemented

### ✅ Authentication & Authorization
- Secure email/password login
- Role-based access control (Teacher, Principal, Student/Public)
- JWT token management with localStorage persistence
- Automatic logout on token expiration (401 errors)
- Protected routes with ProtectedRoute component
- Mock authentication service with demo credentials

### ✅ Teacher Dashboard & Content Management
- **Dashboard**: View statistics (total, pending, approved, rejected content)
- **Upload Page**: 
  - Form validation using Zod schemas
  - File upload (JPG, PNG, GIF - max 10MB)
  - File preview before submission
  - Schedule content with start/end times
  - Add title, subject, description, and rotation duration
  - Real-time validation feedback
- **My Content Page**: 
  - View all uploaded content with status
  - See rejection reasons if rejected
  - Display start/end times and rotation duration
  - Card-based grid layout with images

### ✅ Principal Dashboard & Approval Workflow
- **Dashboard**: Statistics overview (total, pending, approved, rejected)
- **Pending Approvals Page**:
  - List of content awaiting approval
  - Content preview with details
  - Approve button for instant approval
  - Reject button with modal for rejection reason
  - Rejection modal with mandatory 5-char minimum
- **All Content Page**:
  - Filter by status (All, Pending, Approved, Rejected)
  - Search functionality (title, subject, teacher name)
  - Card-based layout with content previews
  - Display teacher information and timestamps

### ✅ Public Live Broadcast Page
- **Route**: `/live/:teacherId` (no authentication required)
- **Features**:
  - Shows only currently active content
  - Displays title, subject, description
  - Full aspect-ratio video preview
  - Schedule status indicator (Active/Scheduled/Expired)
  - Auto-refresh polling every 15 seconds
  - Formatted date/time display
  - Multiple loading states (loading spinner)
  - Empty states (no content, invalid link, error)
  - Error state with retry button
  - Responsive design for all devices

### ✅ UI/UX Features
- **Responsive Design**: Works on desktop, tablet, mobile
- **Toast Notifications**: User feedback for all actions (success/error)
- **Loading States**: Spinner with contextual messages
- **Empty States**: Icon + message for empty results
- **Error States**: User-friendly error messages with retry options
- **Modal Dialogs**: Rejection reason modal with validation
- **Skeleton Loaders**: Loading placeholders for lists
- **Navbar**: Shows user info when authenticated, "Public" label when anonymous
- **Sidebar**: Navigation menu for teacher/principal views

## 🛠 Tech Stack

```
Frontend Framework:    React 18.2
Routing:              React Router 6
Forms:                React Hook Form
Validation:           Zod
HTTP Client:          Axios
Styling:              Tailwind CSS
State Management:     React Context API
Icons:                Lucide React
Build Tool:           Vite / Create React App
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx              # Navigation (auth-aware)
│   │   ├── Sidebar.jsx             # Side menu
│   │   ├── Loading.jsx             # Spinner & skeleton
│   │   └── Toast.jsx               # Toast notifications
│   ├── ProtectedRoute.jsx          # Route authorization
│   └── ...
├── pages/
│   ├── auth/
│   │   └── Login.jsx               # Login form
│   ├── teacher/
│   │   ├── Dashboard.jsx           # Stats overview
│   │   ├── Upload.jsx              # Content upload form
│   │   └── MyContent.jsx           # User's content list
│   ├── principal/
│   │   ├── Dashboard.jsx           # Approval stats
│   │   ├── PendingApprovals.jsx    # Content approval queue
│   │   └── AllContent.jsx          # All content with filters
│   └── public/
│       └── Live.jsx                # Live broadcast (no auth)
├── services/
│   ├── api.js                      # Axios instance
│   ├── auth.service.js             # Auth endpoints
│   ├── content.service.js          # Content CRUD
│   ├── approval.service.js         # Approval endpoints
│   └── mockBackend.js              # Mock API
├── hooks/
│   ├── useAuth.js                  # Auth context hook
│   ├── useApi.js                   # API wrapper hook
│   └── useToast.js                 # Toast context hook
├── context/
│   ├── AuthContext.jsx             # Auth state
│   └── ToastContext.jsx            # Toast state
├── utils/
│   ├── constants.js                # App constants
│   ├── validators.js               # Zod schemas
│   ├── formatters.js               # Date/format utilities
│   └── storage.js                  # LocalStorage helpers
├── App.jsx                         # Root + routing
└── index.js                        # Entry point
```

## 🔐 Authentication Flow

1. User navigates to `/login`
2. Enters email and password
3. Credentials validated against mock backend
4. On success:
   - JWT token stored in localStorage
   - User data stored in AuthContext
   - Redirected to dashboard based on role
5. Protected routes verify token + role before rendering
6. Token automatically attached to all API requests
7. 401 errors trigger logout + redirect to login

**Demo Credentials:**
```
Teacher:   teacher@test.com / 123456
Principal: principal@test.com / 123456
```

## 🗂 Role-Based Routing

### Teacher Routes (Protected)
- `/teacher/dashboard` - Stats overview
- `/teacher/upload` - Upload new content
- `/teacher/content` - My uploaded content

### Principal Routes (Protected)
- `/principal/dashboard` - Approval statistics
- `/principal/pending` - Pending approvals queue
- `/principal/content` - All content with filters

### Public Routes (No Auth)
- `/login` - Authentication page
- `/live/:teacherId` - Live broadcast viewer

## 🔌 API Integration

### Service Layer Architecture
All API calls abstracted into dedicated services:

```javascript
// auth.service.js
- login(email, password)
- logout()
- verifyToken()

// content.service.js
- uploadContent(formData)
- getTeacherContent()
- getAllContent(params)
- getContentById(id)
- getLiveContent(teacherId)

// approval.service.js
- getPendingApprovals()
- approveContent(id)
- rejectContent(id, reason)
- getApprovalStats()
```

### Mock Backend Features
- In-memory content storage using localStorage
- Simulates network delay (350ms)
- Auto-migration of demo credentials
- Time-based content filtering (active broadcasts)
- Status-based content filtering

### Real Backend Ready
- Simply replace `process.env.REACT_APP_USE_MOCK_API = 'false'`
- All API calls route through Axios instance
- Token interceptor handles auth header
- Error interceptor handles 401 responses

## 📝 Form Handling & Validation

### Technologies
- **React Hook Form**: Efficient form state management
- **Zod**: Schema-based validation

### Examples
```javascript
// Login Form
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 chars')
});

// Upload Form
const uploadContentSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(1),
  file: z.instanceof(File)
    .refine(f => ['image/jpeg', 'image/png', 'image/gif'].includes(f.type))
    .refine(f => f.size <= 10 * 1024 * 1024),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  // ... end time > start time validation
});
```

## 📸 File Upload Implementation

### Process
1. User selects image file
2. FileReader generates preview
3. File stored in form state via React Hook Form Controller
4. On submit, FormData created with all fields
5. POST to `/content/upload` endpoint
6. Loading state shown during upload
7. Success toast on completion

### Validation
- **Allowed types**: JPG, PNG, GIF
- **Max size**: 10MB
- **Client-side validation**: Zod schema
- **Preview**: Displayed before upload

## 🚀 State Management

### Context API
- **AuthContext**: User, token, login/logout
- **ToastContext**: Toast queue + actions

### Component State
- Form state: React Hook Form
- UI state: Modal open/close, sidebar toggle
- API state: Loading, data, errors

### Custom Hooks
```javascript
useAuth()      // Access auth context
useToast()     // Show toast notifications
useApi()       // Call API with loading/error handling
```

## 🎨 UI/UX Features

### States Implemented
- **Loading**: Spinner with message during data fetch
- **Empty**: Icon + message when no data
- **Error**: Error message with retry button
- **Content**: Full data display with interactions

### Components
- Toast notifications (success/error/info)
- Loading spinner with contextual messages
- Skeleton loaders for lists
- Modal dialogs (rejection reason)
- Status badges (pending/approved/rejected)
- Image previews with fallback

## ⚙️ Setup & Installation

### 1. Install Dependencies

### 2. Environment Variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_USE_MOCK_API=true
```

### 3. Start Development Server
```bash
npm start
```

Server runs at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

### 5. Test the App
- Login with teacher@test.com / 123456
- Upload content with 2-hour active window
- View as principal: approve/reject content
- Visit `/live/teacher-1` to see public broadcast

## 🐛 Recent Fixes & Improvements (May 6, 2026)

### Fix 1: File Upload Validation
- **Issue**: "Input not instance of File" validation error
- **Cause**: react-hook-form wasn't extracting File from input event
- **Solution**: Used Controller component with manual file extraction
- **Result**: File uploads now work correctly with Zod validation

### Fix 2: Principal Content Display
- **Issue**: All content page showed no results for principals
- **Cause**: Inline arrow function caused infinite dependency loop
- **Solution**: Passed service method directly, removed inline function
- **Result**: Principals can now see all uploaded content with filters

### Fix 3: Public Live Page Loading
- **Issue**: Public broadcast page stuck on "Loading live content..."
- **Cause**: Infinite useEffect loop from recreated execute function
- **Solution**: Used useCallback and proper dependency tracking
- **Result**: Public live page loads and displays content correctly

### Fix 4: Public Page Auth Handling
- **Issue**: Navbar threw errors on public page when user is null
- **Cause**: Attempted to access user properties without null check
- **Solution**: Added isAuthenticated flag and conditional rendering
- **Result**: Public pages display "Public live broadcast" label safely

### Fix 5: Demo Credentials Update
- Updated mock backend credentials
- Teacher: teacher@test.com / 123456
- Principal: principal@test.com / 123456
- Added automatic migration for existing stored users

## 🎬 Usage Examples

### Teacher Flow
```
1. Login as teacher@test.com / 123456
2. Go to /teacher/upload
3. Fill form: title, subject, file, times
4. Submit → See "Content uploaded successfully!"
5. Go to /teacher/content → See uploaded content with status
6. Wait for principal approval
```

### Principal Flow
```
1. Login as principal@test.com / 123456
2. Go to /principal/dashboard → See statistics
3. Go to /principal/pending → See pending content
4. Click Approve → Content status changes to approved
5. Or click Reject → Enter reason → Reject
6. Go to /principal/content → Filter and search all content
```

### Student/Public Flow
```
1. Visit http://localhost:3000/live/teacher-1
2. No login required
3. See active content if available
4. Page auto-refreshes every 15 seconds
5. See "No content available" if none active
```

## 🔍 Debugging Tips

### Check Mock Data
- Browser DevTools → Application → Local Storage
- Look for `content_broadcasting_state`
- Contains users, contents, tokens

### Common Issues
- **Loading never ends**: Check mock content times (should span current time)
- **No content visible**: Ensure content status is "approved" and time window is active
- **Login fails**: Use correct credentials (teacher@test.com / 123456)
- **Empty principal dashboard**: Content must exist and have correct teacherId

## 📊 Performance Features

- Code splitting with lazy routes
- Memoized callbacks with useCallback
- Optimized list rendering with keys
- Image loading states
- Debounced search/filters (ready)
- Virtual scrolling ready (future)

## 🚦 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## 📝 Future Enhancements

- [ ] Real-time updates with WebSocket
- [ ] Advanced filtering and sorting
- [ ] Drag-and-drop file upload
- [ ] Image compression (frontend)
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] React Query for server state
- [ ] Unit and integration tests
- [ ] Performance monitoring
- [ ] Advanced analytics

## 📄 License

MIT

## 👥 Contributors

Built as a technical assignment for frontend developer evaluation.

---

**Status**: ✅ All core features implemented and tested  
**Last Updated**: May 6, 2026  
**Demo Credentials**: See "Demo Credentials" section above
=======
### 3. Run the project

```bash
npm run dev
```

---

## 🔑 Demo Credentials

**Teacher**

```
email: teacher@test.com
password: 123456
```

**Principal**

```
email: principal@test.com
password: 123456
```

---

## ⚡ Performance Optimizations

* Memoization to prevent unnecessary re-renders
* Efficient rendering for large lists (500–1000 items)
* Optimized image previews

---

## ⚠️ Edge Case Handling

* Invalid login
* API failures
* Empty data
* Slow responses
* Upload failure
* Invalid file type/size
* Broken API responses

---

## 🎨 UI/UX Features

* Responsive design
* Navbar / Sidebar layout
* Dashboard cards
* Tables / Lists
* Forms with validation
* Modal (reject reason)
* Toast notifications
* Skeleton loaders

---

## 📄 Documentation

Refer to **Frontend-notes.txt** for:

* Architecture decisions
* Authentication flow
* Role-based routing
* API integration approach
* State management
* Assumptions

---

## 🚀 Future Improvements

* React Query / TanStack Query
* Pagination
* Dark Mode
* Drag-and-drop upload
* Auto-refresh (polling)

---

## 👨‍💻 Author

**Prince Gupta**

---

## 📌 Final Note

This project demonstrates **clean frontend architecture, reusable component design, robust API integration, and real-world UI handling**, making it scalable and production-ready.

---


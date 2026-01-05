🎨 Creative Showcase
A full-stack responsive web application for artists to upload and showcase their digital artwork with a beautiful masonry layout.

✨ Features

🔐 User Authentication - Secure signup and login system
📤 Image Upload - Upload artworks with titles and descriptions
🖼️ Masonry Gallery - Beautiful Pinterest-style layout
👤 User Profiles - Public and private dashboard views
📱 Fully Responsive - Works seamlessly on all devices
💾 Persistent Storage - Data saved using localStorage
🎨 Professional UI - Modern gradients and smooth animations
⚡ Real-time Updates - Instant feedback on all actions

🛠️ Tech Stack
Frontend:

React 18.x
CSS3 (Custom professional styling)
Lucide React (Icons)

Backend Simulation:

LocalStorage API for data persistence
JavaScript ES6+ Classes

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14 or higher)
npm or yarn
Git

🚀 Installation
1. Clone the repository
bashgit clone https://github.com/Rajoshikdas/creative-showcase.git
cd creative-showcase
2. Install dependencies
bashnpm install
3. Run the application
bashnpm start
The app will open at http://localhost:3000
📦 Build for Production
bashnpm run build
This creates an optimized production build in the build folder.
🌐 Deployment
Deploy to Vercel

Install Vercel CLI:

bashnpm install -g vercel

Deploy:

bashvercel
Deploy to Netlify

Build the project:

bashnpm run build

Drag and drop the build folder to Netlify Drop

OR
Connect your GitHub repository directly on Netlify:

Click "New site from Git"
Choose your repository
Build command: npm run build
Publish directory: build

📁 Project Structure
creative-showcase/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js          # Main React component
│   ├── styles.css      # Professional CSS styling
│   ├── index.js        # Entry point
│   └── index.css       # Base styles
├── package.json
├── README.md
└── .gitignore
🎯 Key Features Explained
1. Landing Page

Displays random selection of uploaded artworks in masonry layout
Login/SignUp buttons for authentication
Click on any artwork to view artist's profile

2. Authentication System

SignUp: Create account with username, email, and password
Login: Secure authentication with validation
Password encoding (base64 - use proper hashing in production)

3. User Dashboard (Private)

Upload new artworks with title and description
View all your uploaded images in grid layout
Delete your own artworks
Navigate to public profile

4. Public Profile Page

Accessible via /profile/[username] route pattern
Displays user's gallery in masonry layout
Shows artwork count and user information

5. Data Persistence

All data stored in browser's localStorage
Persists across sessions
Users stay logged in until they logout

🎨 Design Features

Modern gradient backgrounds
Smooth hover animations and transitions
Professional shadow depth system
Responsive masonry grid layout
Beautiful form styling with focus states
Loading states and empty state designs
Mobile-first responsive design

🔒 Security Notes
For Production Use:

Replace base64 encoding with proper password hashing (bcrypt, argon2)
Implement JWT tokens for authentication
Add backend API with proper database
Implement HTTPS
Add input sanitization and validation
Implement rate limiting
Add CSRF protection

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
👤 Author
Rajoshik Das

GitHub: https://github.com/Rajoshikdas
LinkedIn: https://www.linkedin.com/in/rajoshik-das-8529a524b/

🙏 Acknowledgments

Icons by Lucide
Inspired by modern portfolio platforms

📧 Contact
For any questions or suggestions, please reach out:

Email: dasrajoshik037@example.com

# Flutterzon Setup Guide

## Requirements Checklist

### 1. MongoDB Atlas Setup
- [ ] Create free account at [MongoDB Atlas](https://cloud.mongodb.com/)
- [ ] Create a new cluster
- [ ] Create a database user (Database Access → Add New Database User)
- [ ] Get connection string (Connect → Drivers)
- [ ] Whitelist your IP or allow access from anywhere (Network Access → Add IP Address → Allow Access from Anywhere)

### 2. Cloudinary Setup
- [ ] Create free account at [Cloudinary](https://cloudinary.com/)
- [ ] Go to Settings → Upload → Enable "Unsigned uploading"
- [ ] Create an upload preset (Settings → Upload → Add upload preset)
- [ ] Note your Cloud Name and Upload Preset name

### 3. Configuration Files

#### Update `config.env` file:
```env
PORT=3000
DB_USERNAME=your_actual_mongodb_username
DB_PASSWORD=your_actual_mongodb_password
URI=http://YOUR_MACHINE_IP:3000
CLOUDINARY_CLOUDNAME=your_actual_cloudinary_name
CLOUDINARY_UPLOADPRESET=your_actual_upload_preset
JWT_SECRET=any_long_random_string_here
```

**Important Notes:**
- Replace `YOUR_MACHINE_IP` with your actual local IP address (not localhost)
- To find your IP:
  - Windows: Run `ipconfig` in CMD, look for IPv4 Address
  - Mac/Linux: Run `ifconfig` or `ip addr`, look for inet address
  - Should look like: `http://192.168.1.100:3000`

### 4. Install Dependencies

#### Backend (Node.js):
```bash
cd server
npm install
```

#### Flutter App:
```bash
flutter pub get
```

### 5. Start the Backend Server

```bash
cd server
npm start
```

The server should start and show:
```
Connected at PORT : 3000
Mongoose Connected!
```

### 6. Build & Install App

#### Build APK:
```bash
flutter build apk --release
```

#### Install on Device:
- Transfer `build/app/outputs/flutter-apk/app-release.apk` to your Android device
- Enable "Install from unknown sources" in device settings
- Install the APK
- Make sure your phone and development machine are on the same WiFi network

### 7. Test Credentials

**User Account:**
- Email: user@email.com
- Password: 123456

**Admin Account:**
- Email: admin@email.com
- Password: 123456

## Troubleshooting

### App can't connect to backend:
1. Make sure backend server is running
2. Check that URI in config.env uses your machine's IP (not localhost)
3. Ensure phone and computer are on same WiFi network
4. Try disabling firewall temporarily
5. Rebuild the APK after changing config.env

### MongoDB connection fails:
1. Check username and password are correct
2. Ensure IP whitelist includes your IP or "Allow from anywhere"
3. Check connection string format in server/index.js

### Image upload fails:
1. Verify Cloudinary credentials
2. Ensure unsigned uploading is enabled
3. Check upload preset exists and name is correct

## Port Forwarding (Optional)

To access the app from anywhere:
1. Use a service like ngrok: `ngrok http 3000`
2. Update URI in config.env with the ngrok URL
3. Rebuild the APK

## Need Help?

Check the main [README.md](README.md) for more details or contact the developer.

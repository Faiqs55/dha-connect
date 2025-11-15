const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get absolute path to project root (go up two levels from src/middlewares)
const projectRoot = path.resolve(__dirname, '../..'); // This should point to your project root

// Create custom temp directory within project
const customTempDir = path.join(projectRoot, 'temp_uploads');

// Ensure temp directory exists
if (!fs.existsSync(customTempDir)) {
  fs.mkdirSync(customTempDir, { recursive: true });
  console.log(`Created temp directory: ${customTempDir}`);
}

// Ensure upload directories exist with ABSOLUTE paths
const createDirectories = () => {
  const directories = [
    path.join(projectRoot, 'uploads/agency/logo'),
    path.join(projectRoot, 'uploads/agency/video'),
    path.join(projectRoot, 'uploads/agents/profiles'),
    path.join(projectRoot, 'uploads/property/images'),
    path.join(projectRoot, 'uploads/property/feature-images'),
    path.join(projectRoot, 'uploads/property/videos'),
    path.join(projectRoot, 'uploads/elected-bodies/profiles')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Call this function when the server starts
createDirectories();

// Debug: Log the paths to verify
console.log('Project root:', projectRoot);
console.log('Temp dir:', customTempDir);
console.log('Uploads dir:', path.join(projectRoot, 'uploads'));

// Common multer configuration with custom temp directory
const multerConfig = {
  dest: customTempDir,
  limits: {
    fileSize: 100 * 1024 * 1024
  }
};

// Storage configurations (same as before but with corrected paths)
const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads/agency/logo'));
  },
  filename: function (req, file, cb) {
    const agencyName = req.body.agencyName ? req.body.agencyName.replace(/\s+/g, '-') : 'agency';
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${agencyName}-logo-${timestamp}${extension}`);
  }
});

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads/agency/video'));
  },
  filename: function (req, file, cb) {
    const agencyName = req.body.agencyName ? req.body.agencyName.replace(/\s+/g, '-') : 'agency';
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${agencyName}-video-${timestamp}${extension}`);
  }
});

// File filter for images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for logo!'), false);
  }
};

// File filter for videos
const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed for video!'), false);
  }
};

// Create multer instances
const uploadLogo = multer({ 
  ...multerConfig,
  storage: logoStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const uploadVideo = multer({ 
  ...multerConfig,
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024
  }
});

// Middleware for handling both logo and video uploads
const agencyUpload = multer({
  ...multerConfig,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'agencyLogo') {
      return imageFileFilter(req, file, cb);
    } else if (file.fieldname === 'agencyVideo') {
      return videoFileFilter(req, file, cb);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  }
}).fields([
  { name: 'agencyLogo', maxCount: 1 },
  { name: 'agencyVideo', maxCount: 1 }
]);

// Agent profile image storage
const agentProfileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads/agents/profiles'));
  },
  filename: function (req, file, cb) {
    const agentName = req.body.name ? req.body.name.replace(/\s+/g, '-') : 'agent';
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${agentName}-profile-${timestamp}${extension}`);
  }
});

// File filter for agent profile images
const agentProfileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for agent profile!'), false);
  }
};

// Multer instance for agent profile
const agentProfileUpload = multer({
  ...multerConfig,
  storage: agentProfileStorage,
  fileFilter: agentProfileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Property media storage
const propertyMediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'featureImage') {
      cb(null, path.join(projectRoot, 'uploads/property/feature-images'));
    } else if (file.fieldname === 'images') {
      cb(null, path.join(projectRoot, 'uploads/property/images'));
    } else if (file.fieldname === 'video') {
      cb(null, path.join(projectRoot, 'uploads/property/videos'));
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `property-${timestamp}-${random}${extension}`;
    cb(null, filename);
  }
});

// File filter for property images
const propertyImageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for property images!'), false);
  }
};

// File filter for property videos
const propertyVideoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed for property videos!'), false);
  }
};

// Multer instance for property media
const propertyMediaUpload = multer({
  ...multerConfig,
  storage: propertyMediaStorage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'featureImage' || file.fieldname === 'images') {
      return propertyImageFilter(req, file, cb);
    } else if (file.fieldname === 'video') {
      return propertyVideoFilter(req, file, cb);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}).fields([
  { name: 'featureImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]);

// Elected bodies profile photo storage
const electedBodyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads/elected-bodies/profiles'));
  },
  filename: function (req, file, cb) {
    const memberName = req.body.name ? req.body.name.replace(/\s+/g, '-') : 'member';
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `elected-body-${memberName}-${timestamp}${extension}`);
  }
});

// File filter for elected body profile images
const electedBodyFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for elected body profile!'), false);
  }
};

// Multer instance for elected body profile
const electedBodyUpload = multer({
  ...multerConfig,
  storage: electedBodyStorage,
  fileFilter: electedBodyFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = {
  uploadLogo,
  uploadVideo,
  agencyUpload,
  agentProfileUpload,
  propertyMediaUpload,
  electedBodyUpload
};
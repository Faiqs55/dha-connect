const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createDirectories = () => {
  const directories = [
    'uploads/agency/logo',
    'uploads/agency/video',
    'uploads/agents/profiles',
    'uploads/property/images',
    'uploads/property/feature-images',
    'uploads/property/videos',
    'uploads/elected-bodies/profiles' // Add elected bodies directory
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

// Storage configuration for logo
const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/agency/logo');
  },
  filename: function (req, file, cb) {
    // Get agency name from request body and replace spaces with hyphens
    const agencyName = req.body.agencyName ? req.body.agencyName.replace(/\s+/g, '-') : 'agency';
    const extension = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${agencyName}-logo-${timestamp}${extension}`);
  }
});

// Storage configuration for video
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/agency/video');
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
  storage: logoStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for logo
  }
});

const uploadVideo = multer({ 
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for video
  }
});

// Middleware for handling both logo and video uploads
const agencyUpload = multer({
  storage: multer.diskStorage({}), // Default storage, we'll handle manually
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
    cb(null, 'uploads/agents/profiles');
  },
  filename: function (req, file, cb) {
    // Get agent name from request body and replace spaces with hyphens
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
  storage: agentProfileStorage,
  fileFilter: agentProfileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Property media storage
const propertyMediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create property media directories
    const propertyDirs = [
      'uploads/property/images',
      'uploads/property/feature-images',
      'uploads/property/videos'
    ];
    
    propertyDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });

    // Determine destination based on field name
    if (file.fieldname === 'featureImage') {
      cb(null, 'uploads/property/feature-images');
    } else if (file.fieldname === 'images') {
      cb(null, 'uploads/property/images');
    } else if (file.fieldname === 'video') {
      cb(null, 'uploads/property/videos');
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
    fileSize: 50 * 1024 * 1024 // 50MB limit for all files
  }
}).fields([
  { name: 'featureImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }, // Allow up to 10 images
  { name: 'video', maxCount: 1 }
]);

// Elected bodies profile photo storage
const electedBodyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/elected-bodies/profiles');
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
  storage: electedBodyStorage,
  fileFilter: electedBodyFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = {
  uploadLogo,
  uploadVideo,
  agencyUpload,
  agentProfileUpload,
  propertyMediaUpload,
  electedBodyUpload // Add the new middleware
};
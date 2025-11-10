const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Agency } = require("./models/agency.model");
const { User } = require("./models/user.model");
const { Agent } = require("./models/agent.model");
const { Property } = require("./models/property.model");
const bcrypt = require("bcrypt");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MONGO DB CONNECTED: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await Agency.deleteMany({});
    await User.deleteMany({});
    await Agent.deleteMany({});
    await Property.deleteMany({});
    console.log("Existing data cleared.");

    // Hash password for agencies and users
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create Agencies
    console.log("Creating agencies...");
    const agencies = [];
    
    // Admin agency (admin@gmail.com)
    const adminAgency = await Agency.create({
      agencyName: "Admin Real Estate",
      agencyEmail: "admin@gmail.com",
      password: "admin123", // Agency stores plain password, User will hash it
      ceoName: "Admin User",
      ceoPhone: "+923001234567",
      whatsapp: "+923001234567",
      city: "Karachi",
      phase: "Phase 1",
      address: "123 Main Street, Karachi",
      facebook: "https://facebook.com/adminrealestate",
      youtube: "https://youtube.com/adminrealestate",
      twitter: "https://twitter.com/adminrealestate",
      instagram: "https://instagram.com/adminrealestate",
      agencyLogo: "https://via.placeholder.com/150",
      agencyVideo: "https://example.com/video.mp4",
      about: "Leading real estate agency in DHA",
      website: "https://adminrealestate.com",
      status: "Approved",
      classifiedAds: 20,
      videoAds: 5,
      featuredAds: 3,
    });
    agencies.push(adminAgency);

    // Additional agencies
    const agencyData = [
      {
        agencyName: "Elite Properties",
        agencyEmail: "elite@properties.com",
        password: "password123",
        ceoName: "John Smith",
        ceoPhone: "+923001234568",
        whatsapp: "+923001234568",
        city: "Lahore",
        phase: "Phase 2",
        address: "456 Business District, Lahore",
        facebook: "https://facebook.com/eliteproperties",
        youtube: "https://youtube.com/eliteproperties",
        twitter: "https://twitter.com/eliteproperties",
        instagram: "https://instagram.com/eliteproperties",
        agencyLogo: "https://via.placeholder.com/150",
        agencyVideo: "https://example.com/video2.mp4",
        about: "Premium property solutions",
        website: "https://eliteproperties.com",
        status: "Approved",
        classifiedAds: 20,
        videoAds: 5,
        featuredAds: 2,
      },
      {
        agencyName: "Prime Realty",
        agencyEmail: "prime@realty.com",
        password: "password123",
        ceoName: "Sarah Johnson",
        ceoPhone: "+923001234569",
        whatsapp: "+923001234569",
        city: "Islamabad",
        phase: "Phase 3",
        address: "789 Capital Avenue, Islamabad",
        facebook: "https://facebook.com/primerealty",
        youtube: "https://youtube.com/primerealty",
        twitter: "https://twitter.com/primerealty",
        instagram: "https://instagram.com/primerealty",
        agencyLogo: "https://via.placeholder.com/150",
        agencyVideo: "https://example.com/video3.mp4",
        about: "Your trusted real estate partner",
        website: "https://primerealty.com",
        status: "Approved",
        classifiedAds: 20,
        videoAds: 4,
        featuredAds: 2,
      },
      {
        agencyName: "Dream Homes Agency",
        agencyEmail: "dream@homes.com",
        password: "password123",
        ceoName: "Ahmed Khan",
        ceoPhone: "+923001234570",
        whatsapp: "+923001234570",
        city: "Karachi",
        phase: "Phase 4",
        address: "321 Residential Block, Karachi",
        facebook: "https://facebook.com/dreamhomes",
        youtube: "https://youtube.com/dreamhomes",
        twitter: "https://twitter.com/dreamhomes",
        instagram: "https://instagram.com/dreamhomes",
        agencyLogo: "https://via.placeholder.com/150",
        agencyVideo: "https://example.com/video4.mp4",
        about: "Finding your dream home",
        website: "https://dreamhomes.com",
        status: "Approved",
        classifiedAds: 20,
        videoAds: 3,
        featuredAds: 1,
      },
      {
        agencyName: "Luxury Estates",
        agencyEmail: "luxury@estates.com",
        password: "password123",
        ceoName: "Maria Ali",
        ceoPhone: "+923001234571",
        whatsapp: "+923001234571",
        city: "Lahore",
        phase: "Phase 5",
        address: "654 Luxury Boulevard, Lahore",
        facebook: "https://facebook.com/luxuryestates",
        youtube: "https://youtube.com/luxuryestates",
        twitter: "https://twitter.com/luxuryestates",
        instagram: "https://instagram.com/luxuryestates",
        agencyLogo: "https://via.placeholder.com/150",
        agencyVideo: "https://example.com/video5.mp4",
        about: "Luxury properties at your fingertips",
        website: "https://luxuryestates.com",
        status: "Approved",
        classifiedAds: 20,
        videoAds: 5,
        featuredAds: 3,
      },
    ];

    for (const agencyInfo of agencyData) {
      const agency = await Agency.create(agencyInfo);
      agencies.push(agency);
    }

    console.log(`Created ${agencies.length} agencies.`);

    // Create Users (one for each approved agency)
    console.log("Creating users...");
    const users = [];
    
    for (const agency of agencies) {
      if (agency.status === "Approved") {
        const user = await User.create({
          name: agency.ceoName,
          email: agency.agencyEmail,
          password: agency.password, // Will be hashed by User schema pre-save hook
          role: "agency",
          agency: agency._id,
        });
        users.push(user);
      }
    }

    console.log(`Created ${users.length} users.`);

    // Create Agents
    console.log("Creating agents...");
    const agents = [];
    
    const agentData = [
      {
        name: "Agent 1",
        designation: "Senior Property Consultant",
        phone: "+923001234572",
        email: "agent1@adminrealestate.com",
        password: "agent123",
        image: "https://via.placeholder.com/200",
        classifiedAds: 5,
        videoAds: 1,
        featuredAds: 1,
      },
      {
        name: "Agent 2",
        designation: "Property Specialist",
        phone: "+923001234573",
        email: "agent2@adminrealestate.com",
        password: "agent123",
        image: "https://via.placeholder.com/200",
        classifiedAds: 5,
        videoAds: 1,
        featuredAds: 0,
      },
      {
        name: "Agent 3",
        designation: "Real Estate Advisor",
        phone: "+923001234574",
        email: "agent3@eliteproperties.com",
        password: "agent123",
        image: "https://via.placeholder.com/200",
        classifiedAds: 5,
        videoAds: 1,
        featuredAds: 1,
      },
      {
        name: "Agent 4",
        designation: "Property Consultant",
        phone: "+923001234575",
        email: "agent4@primerealty.com",
        password: "agent123",
        image: "https://via.placeholder.com/200",
        classifiedAds: 5,
        videoAds: 1,
        featuredAds: 0,
      },
      {
        name: "Agent 5",
        designation: "Senior Advisor",
        phone: "+923001234576",
        email: "agent5@dreamhomes.com",
        password: "agent123",
        image: "https://via.placeholder.com/200",
        classifiedAds: 5,
        videoAds: 1,
        featuredAds: 1,
      },
      {
        name: "Agent 6",
        designation: "Property Manager",
        phone: "+923001234577",
        email: "agent6@luxuryestates.com",
        password: "agent123",
        image: "https://via.placeholder.com/200",
        classifiedAds: 5,
        videoAds: 1,
        featuredAds: 1,
      },
    ];

    // Assign agents to agencies
    for (let i = 0; i < agentData.length; i++) {
      const agentInfo = {
        ...agentData[i],
        agency: agencies[i % agencies.length]._id, // Distribute agents across agencies
      };
      const agent = await Agent.create(agentInfo);
      agents.push(agent);
    }

    console.log(`Created ${agents.length} agents.`);

    // Create Properties
    console.log("Creating properties...");
    const properties = [];

    const propertyData = [
      {
        title: "Luxury 5 Bedroom House in DHA Phase 1",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
        ],
        thumbnailImage: "https://via.placeholder.com/800x600",
        video: "https://example.com/property1.mp4",
        phase: "Phase 1",
        address: "123 Main Boulevard, DHA Phase 1, Karachi",
        description: "Spacious luxury home with modern amenities",
        category: "Sell",
        type: "residential",
        subType: "House",
        area: "2500",
        areaUnit: "sqft",
        bathrooms: "4",
        bedrooms: "5",
        status: "available",
        otherFeatures: ["Swimming Pool", "Garden", "Parking", "Security"],
        adType: "featuredAds",
        price: "15000000",
      },
      {
        title: "Modern Apartment for Rent",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
        ],
        thumbnailImage: "https://via.placeholder.com/800x600",
        video: "https://example.com/property2.mp4",
        phase: "Phase 2",
        address: "456 Apartment Complex, DHA Phase 2, Lahore",
        description: "Furnished apartment with all amenities",
        category: "Rent",
        type: "residential",
        subType: "Apartment",
        area: "1200",
        areaUnit: "sqft",
        bathrooms: "2",
        bedrooms: "3",
        status: "available",
        otherFeatures: ["Furnished", "AC", "Elevator", "Security"],
        adType: "videoAds",
        price: "50000",
        paymentPlan: "Monthly",
      },
      {
        title: "Commercial Plot in Prime Location",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
        ],
        thumbnailImage: "https://via.placeholder.com/800x600",
        phase: "Phase 3",
        address: "789 Business District, DHA Phase 3, Islamabad",
        description: "Prime commercial plot for business development",
        category: "Sell",
        type: "plot",
        subType: "Commercial Plot",
        area: "5000",
        areaUnit: "sqft",
        status: "available",
        otherFeatures: ["Corner Plot", "Main Road", "Parking"],
        adType: "classifiedAds",
        price: "25000000",
        plotAmenities: "Main Road Access",
        plotFileType: "Approved",
      },
      {
        title: "Residential Plot in DHA Phase 4",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
        ],
        thumbnailImage: "https://via.placeholder.com/800x600",
        phase: "Phase 4",
        address: "321 Residential Block, DHA Phase 4, Karachi",
        description: "Corner plot with excellent location",
        category: "Sell",
        type: "plot",
        subType: "Residential Plot",
        area: "3000",
        areaUnit: "sqft",
        status: "available",
        otherFeatures: ["Corner Plot", "Parking"],
        adType: "none",
        price: "8000000",
        plotAmenities: "Corner Location",
        plotFileType: "Approved",
      },
      {
        title: "Commercial Space for Rent",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
        ],
        thumbnailImage: "https://via.placeholder.com/800x600",
        phase: "Phase 5",
        address: "654 Shopping Mall, DHA Phase 5, Lahore",
        description: "Prime commercial space in shopping mall",
        category: "Rent",
        type: "commercial",
        subType: "Shop",
        area: "800",
        areaUnit: "sqft",
        status: "available",
        otherFeatures: ["Main Floor", "Parking", "Security"],
        adType: "classifiedAds",
        price: "75000",
        paymentPlan: "Monthly",
      },
      {
        title: "3 Bedroom Villa for Sale",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
        ],
        thumbnailImage: "https://via.placeholder.com/800x600",
        video: "https://example.com/property6.mp4",
        phase: "Phase 1",
        address: "111 Villa Street, DHA Phase 1, Karachi",
        description: "Beautiful villa with garden and pool",
        category: "Sell",
        type: "residential",
        subType: "Villa",
        area: "2000",
        areaUnit: "sqft",
        bathrooms: "3",
        bedrooms: "3",
        status: "available",
        otherFeatures: ["Garden", "Swimming Pool", "Parking"],
        adType: "featuredAds",
        price: "12000000",
      },
      {
        title: "2 Bedroom Apartment for Rent",
        images: [
          "https://via.placeholder.com/800x600",
        ],
        thumbnailImage: "https://via.placeholder.com/800x600",
        phase: "Phase 2",
        address: "222 Apartment Block, DHA Phase 2, Lahore",
        description: "Cozy apartment in secure building",
        category: "Rent",
        type: "residential",
        subType: "Apartment",
        area: "900",
        areaUnit: "sqft",
        bathrooms: "2",
        bedrooms: "2",
        status: "available",
        otherFeatures: ["Furnished", "AC", "Security"],
        adType: "none",
        price: "35000",
        paymentPlan: "Monthly",
      },
    ];

    // Assign properties to agents and agencies
    for (let i = 0; i < propertyData.length; i++) {
      const agent = agents[i % agents.length];
      const agency = agencies.find((a) => a._id.toString() === agent.agency.toString());
      
      // For property agent field, the schema says ref: "User" but controller uses Agent
      // We'll use the User ID from the agency's user (as per schema definition)
      const user = users.find((u) => u.agency.toString() === agency._id.toString());
      
      if (!user) {
        console.warn(`No user found for agency ${agency.agencyName}, skipping property`);
        continue;
      }
      
      const propertyInfo = {
        ...propertyData[i],
        agent: user._id, // Schema says ref: "User"
        agency: agency._id,
      };
      
      const property = await Property.create(propertyInfo);
      properties.push(property);
    }

    console.log(`Created ${properties.length} properties.`);

    console.log("\n✅ Seed data created successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - Agencies: ${agencies.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Agents: ${agents.length}`);
    console.log(`   - Properties: ${properties.length}`);
    console.log("\n🔑 Login Credentials:");
    console.log("   Email: admin@gmail.com");
    console.log("   Password: admin123");
    console.log("   Role: agency");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();


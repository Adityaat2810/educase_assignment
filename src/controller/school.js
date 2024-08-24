const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define SchoolSchema for req.body
const SchoolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

// Define LocationSchema for query parameters
const LocationSchema = z.object({
  userLat: z.coerce.number().min(-90).max(90),
  userLon: z.coerce.number().min(-180).max(180)
});

const createSchool = async (req, res) => {
  try {
    // Validate the request body against the schema
    const validatedData = SchoolSchema.parse(req.body);
    
    // If validation passes, create the school
    const newSchool = await prisma.school.create({
      data: validatedData
    });

    return res.status(200).json({
      data: newSchool,
      success: true,
      error: false,
      message: "School added successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If it's a Zod validation error, return the validation issues
      return res.status(400).json({
        data: [],
        success: false,
        error: true,
        message: "Bad request",
        issues: error.errors
      });
    }
    // For any other error, return a generic error message
    console.error(error);
    return res.status(500).json({
      data: [],
      success: false,
      error: true,
      message: "Internal server error"
    });
  }
};

const getSchools = async (req, res) => {
  try {
    // Validate the query parameters
    const { userLat, userLon } = LocationSchema.parse(req.query);

    const schools = await prisma.school.findMany();

    // Calculate distance and sort
    const sortedSchools = schools.map(school => ({
      ...school,
      distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      data: sortedSchools,
      success: true,
      error: false,
      message: "Schools fetched successfully"
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        data: [],
        success: false,
        error: true,
        message: "Invalid user coordinates",
        issues: error.errors
      });
    }
    console.error(error);
    return res.status(500).json({
      data: [],
      success: false,
      error: true,
      message: "Failed to fetch schools"
    });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula to calculate distance between two points
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

module.exports = {
  createSchool,
  getSchools
};
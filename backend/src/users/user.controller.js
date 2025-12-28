import prisma from "../../prisma/client.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

/**
 * @desc    Get public profile data (No Auth Required)
 */
export const getPublicProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await prisma.user.findUnique({
    where: { username, isPublic: true },
    select: {
      name: true,
      bio: true,
      username: true,
      analyses: {
        select: {
          matchPercentage: true,
          jobTitle: true,
          createdAt: true
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    throw new AppError("Public profile not found or is set to private.", 404);
  }

  res.status(200).json({
    status: "success",
    data: user
  });
});

/**
 * @desc    Update current user's profile settings (Auth Required)
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, bio, username, isPublic } = req.body;

  if (username) {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser && existingUser.id !== req.user.id) {
      throw new AppError("This username is already taken.", 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { 
      name: name || undefined, 
      bio: bio || undefined, 
      username: username || undefined, 
      isPublic: isPublic !== undefined ? isPublic : undefined 
    }
  });

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        isPublic: updatedUser.isPublic
      }
    }
  });
});
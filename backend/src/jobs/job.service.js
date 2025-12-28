import prisma from "../prisma/client.js";

export const getJobs = async (userId, query) => {
  const { status, search, limit = 10, page = 1 } = query;
  const skip = (page - 1) * limit;

  return prisma.jobApplication.findMany({
    where: {
      userId,
      isDeleted: false,
      ...(status && { status }),
      ...(search && {
        OR: [
          { company: { contains: search, mode: 'insensitive' } },
          { position: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    take: Number(limit),
    skip: Number(skip),
    orderBy: { createdAt: 'desc' },
  });
};

export const createJob = async (userId, jobData) => {
  return prisma.jobApplication.create({
    data: {
      ...jobData,
      userId,
    },
  });
};

export const updateJob = async (id, userId, updateData) => {
  return prisma.jobApplication.update({
    where: { id, userId },
    data: updateData,
  });
};

export const deleteJob = async (id, userId) => {
  return prisma.jobApplication.update({
    where: { id, userId },
    data: { isDeleted: true },
  });
};

export const getUserStats = async (userId) => {
  const statusStats = await prisma.jobApplication.groupBy({
    by: ['status'],
    where: { userId, isDeleted: false },
    _count: { status: true },
  });

  const totalApplications = await prisma.jobApplication.count({
    where: { userId, isDeleted: false },
  });

  const interviewCount = statusStats.find(s => s.status === 'INTERVIEW')?._count.status || 0;
  const offerCount = statusStats.find(s => s.status === 'OFFER')?._count.status || 0;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'YYYY-MM') as month, 
      COUNT(id)::int as count
    FROM "JobApplication"
    WHERE "userId" = ${userId} AND "isDeleted" = false AND "createdAt" >= ${sixMonthsAgo}
    GROUP BY month
    ORDER BY month ASC
  `;

  return {
    totalApplications,
    statusDistribution: statusStats,
    performance: {
      interviewRate: totalApplications > 0 ? ((interviewCount / totalApplications) * 100).toFixed(1) + "%" : "0%",
      offerRate: totalApplications > 0 ? ((offerCount / totalApplications) * 100).toFixed(1) + "%" : "0%"
    },
    trends: monthlyTrend
  };
};

export const getDashboardStats = async (userId) => {
  const jobStats = await prisma.jobApplication.groupBy({
    by: ['status'],
    where: { userId },
    _count: { id: true },
  });

  const aiStats = await prisma.analysis.aggregate({
    where: { userId },
    _avg: { matchPercentage: true },
    _count: { id: true },
  });

  const recentAnalyses = await prisma.analysis.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      matchPercentage: true,
      createdAt: true,
      jobTitle: true
    }
  });

  return {
    jobs: jobStats,
    ai: {
      averageMatch: Math.round(aiStats._avg.matchPercentage || 0),
      totalAnalyses: aiStats._count.id,
      chartData: recentAnalyses.reverse() 
    }
  };
};
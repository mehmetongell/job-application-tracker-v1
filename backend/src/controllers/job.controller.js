import prisma from "../prisma/client.js";
import AppError from "../utils/AppError.js";

/* =========================
   GET ALL JOBS (Listeleme, Arama ve Sayfalama)
========================= */
export const getAllJobs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;

    const where = {
      userId: req.user.id,
      ...(status && { status }),
      ...(search && {
        OR: [
          { company: { contains: search, mode: "insensitive" } },
          { position: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [jobs, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    res.status(200).json({
      status: "success",
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   CREATE JOB (Yeni Başvuru Ekleme)
========================= */
export const createJob = async (req, res, next) => {
  try {
    const job = await prisma.jobApplication.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      status: "success",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET JOB BY ID (Tekil Başvuru Detayı)
========================= */
export const getJobById = async (req, res, next) => {
  try {
    const job = await prisma.jobApplication.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!job) {
      return next(new AppError("Job application not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE JOB (Genel Güncelleme)
========================= */
export const updateJob = async (req, res, next) => {
  try {
    const job = await prisma.jobApplication.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!job) return next(new AppError("Job not found or unauthorized", 404));

    const updatedJob = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: { ...req.body },
    });

    res.status(200).json({
      status: "success",
      data: updatedJob,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE JOB STATUS (Sadece Durum Güncelleme)
========================= */
export const updateJobStatus = async (req, res, next) => {
  try {
    const job = await prisma.jobApplication.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!job) return next(new AppError("Job not found", 404));

    const updatedJob = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });

    res.status(200).json({
      status: "success",
      data: updatedJob,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE JOB (Başvuru Silme)
========================= */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await prisma.jobApplication.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!job) return next(new AppError("Job not found", 404));

    await prisma.jobApplication.delete({
      where: { id: req.params.id },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET STATS (Dashboard İstatistikleri)
========================= */
export const getStats = async (req, res, next) => {
  try {
    const stats = await prisma.jobApplication.groupBy({
      by: ["status"],
      where: { userId: req.user.id },
      _count: { status: true },
    });

    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {});

    const defaultStats = {
      APPLIED: formattedStats.APPLIED || 0,
      INTERVIEW: formattedStats.INTERVIEW || 0,
      OFFER: formattedStats.OFFER || 0,
      REJECTED: formattedStats.REJECTED || 0,
    };

    res.status(200).json({
      status: "success",
      data: defaultStats,
    });
  } catch (err) {
    next(err);
  }
};
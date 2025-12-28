import cron from "node-cron";
import prisma from "../prisma/client.js";
import { sendReminderEmail } from "../utils/email.service.js";

export const initReminderJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily reminder job...");

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pendingApplications = await prisma.jobApplication.findMany({
      where: {
        status: "APPLIED",
        updatedAt: {
          lte: sevenDaysAgo,
        },
        isDeleted: false,
      },
      include: {
        user: true, 
      },
    });

    for (const app of pendingApplications) {
      try {
        await sendReminderEmail(app.user.email, app.company);
        console.log(`Reminder sent to ${app.user.email} for ${app.company}`);
      } catch (error) {
        console.error(`Failed to send email to ${app.user.email}:`, error);
      }
    }
  });
};
/**
 * @file emailTemplates.js
 * @description HTML email templates for different notification scenarios.
 */

/**
 * Generates an HTML template for Interview Preparation
 * @param {string} userName - Name of the candidate
 * @param {string} companyName - Name of the hiring company
 * @param {number|string} matchScore - AI calculated match percentage
 * @param {string[]} tips - Array of actionable improvement tips
 * @returns {string} HTML content
 */
export const getInterviewPrepTemplate = (userName, companyName, matchScore, tips) => {
  // Convert tips array to HTML list items
  const tipsHtml = tips.length > 0 
    ? tips.map(tip => `<li style="margin-bottom: 10px;">${tip}</li>`).join("")
    : "<li>General interview preparation is recommended.</li>";

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Congratulations, ${userName}! 🎉</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px;">Great news! Your application for <strong>${companyName}</strong> has moved to the <strong>Interview</strong> stage.</p>
        
        <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #4f46e5;">
          <h3 style="margin-top: 0; color: #111827;">AI Interview Prep Guide</h3>
          <p style="margin-bottom: 5px;">Based on our previous analysis, your match score is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #4f46e5;">${matchScore}%</div>
        </div>

        <h4 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Key Points to Focus On:</h4>
        <ul style="padding-left: 20px; color: #4b5563;">
          ${tipsHtml}
        </ul>

        <p style="margin-top: 30px;">Good luck with your interview! We are rooting for you.</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #9ca3af; text-align: center;">
          Sent by Job Tracker AI Assistant
        </div>
      </div>
    </div>
  `;
};
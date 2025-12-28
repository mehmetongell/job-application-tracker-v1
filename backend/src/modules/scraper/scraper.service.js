import axios from "axios";
import * as cheerio from "cheerio";
import AppError from "../../utils/AppError.js";

export const scrapeJobData = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);
    
    const title = $("title").text() || $("h1").first().text();
    const description = $("meta[name='description']").attr("content") || $(".job-description").text();

    return {
      title: title.trim(),
      description: description.trim(),
      sourceUrl: url
    };
  } catch (error) {
    throw new AppError(`Failed to fetch data from the provided URL: ${error.message}`, 400);
  }
};
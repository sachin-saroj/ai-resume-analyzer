const { zodResponseFormat } = require("openai/helpers/zod");
const { ExtractedResumeSchema, ExtractedJDSchema } = require("../../validation/schemaValidations");

/**
 * Builds the AI prompt configuration to extract structure from unstructured Resume Text
 */
const buildResumeExtractionPrompt = () => {
  return {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an elite career intelligence engine. Your job is to strictly extract and structure data from the provided raw resume text. Extract technologies to arrays where relevant."
      },
      {
        role: "user",
        content: `Extract the structured information from the following text:\\n\\n` // Content gets appended dynamically
      }
    ],
    response_format: zodResponseFormat(ExtractedResumeSchema, "resume_extraction"),
    temperature: 0.1 // Strict confidence
  };
};

/**
 * Builds the AI prompt configuration to extract structure from unstructured Job Description
 */
const buildJDExtractionPrompt = () => {
  return {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an elite career intelligence engine. Deeply analyze the provided job description. Delineate between 'critical' mandatory skills and 'secondary' "nice-to-have" skills."
      },
      {
        role: "user",
        content: `Extract the structured requirements from the following Job Description:\\n\\n`
      }
    ],
    response_format: zodResponseFormat(ExtractedJDSchema, "jd_extraction"),
    temperature: 0.1
  };
};

module.exports = {
  buildResumeExtractionPrompt,
  buildJDExtractionPrompt
};

const { z } = require('zod');

// We use strict Zod schemas to validate everything returning from gpt-4o-mini structured outputs.

const ExtractedResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
  }),
  skills: z.array(z.string()),
  experienceRoles: z.array(z.object({
    title: z.string(),
    company: z.string(),
    duration: z.string().nullable(),
    description: z.string(),
    technologies: z.array(z.string()).optional()
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string().nullable()
  })),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()).optional()
  })).optional()
});

const ExtractedJDSchema = z.object({
  jobTitle: z.string(),
  criticalSkills: z.array(z.string()),
  secondarySkills: z.array(z.string()),
  requiredExperienceYears: z.number().nullable(),
  primaryResponsibilities: z.array(z.string())
});

const AISuggestionsSchema = z.object({
  missingSkills: z.array(z.string()),
  weakAreas: z.array(z.string()),
  improvedBullets: z.array(z.object({
    original: z.string(),
    improved: z.string(),
    reason: z.string()
  })),
  rewriteSuggestions: z.array(z.string())
});

const InsightsSchema = z.object({
  topIssues: z.array(z.string()).max(3),
  quickWins: z.array(z.string()).max(3),
  priorityInsights: z.array(z.object({
    issue: z.string(),
    impact: z.enum(['high', 'medium', 'low']),
    fix: z.string()
  }))
});

module.exports = {
  ExtractedResumeSchema,
  ExtractedJDSchema,
  AISuggestionsSchema,
  InsightsSchema
};

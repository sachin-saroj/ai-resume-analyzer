/**
 * Skill Ontology Core Mapping Definitions
 * Maps raw skills to high-level categories for Elite Benchmarking
 */

const baseOntology = {
  "Frontend Development": [
    "react", "react.js", "vue", "vue.js", "angular", "html", "css", "html5", "css3", 
    "javascript", "js", "typescript", "ts", "tailwind", "tailwindcss", "bootstrap",
    "framer motion", "recharts", "redux", "zustand", "next.js", "nextjs", "webpack"
  ],
  "Backend Development": [
    "node.js", "nodejs", "node", "express", "express.js", "django", "python", "flask", 
    "java", "spring boot", "c#", ".net", "ruby on rails", "ruby", "go", "golang", 
    "php", "laravel", "fastapi", "graphql", "rest api", "grpc"
  ],
  "Database & Storage": [
    "sql", "mysql", "postgresql", "postgres", "mongodb", "mongo", "nosql", "redis", 
    "cassandra", "dynamodb", "firebase", "supabase", "elasticsearch", "sqlite"
  ],
  "Cloud & DevOps": [
    "aws", "amazon web services", "gcp", "google cloud", "azure", "docker", "kubernetes", 
    "k8s", "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "ci/cd", 
    "linux", "bash", "nginx", "apache"
  ],
  "AI & Data Science": [
    "machine learning", "ml", "artificial intelligence", "ai", "deep learning", "nlp",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
    "openai", "llm", "rag", "langchain", "data analysis", "sql", "jupyter"
  ],
  "Core Computer Science": [
    "data structures", "algorithms", "object oriented programming", "oop", "system design",
    "microservices", "agile", "scrum", "git", "version control", "test driven development",
    "tdd", "clean code", "design patterns"
  ]
};

/**
 * Normalizes a raw skill string and maps it to a category.
 * If unknown, maps to "Uncategorized".
 */
const categorizeSkill = (rawSkill) => {
  const normalized = rawSkill.toLowerCase().trim();
  for (const [category, skills] of Object.entries(baseOntology)) {
    if (skills.includes(normalized)) {
      return category;
    }
  }
  return "Uncategorized";
};

module.exports = {
  baseOntology,
  categorizeSkill
};

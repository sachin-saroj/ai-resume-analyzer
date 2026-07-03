/**
 * Skill Ontology Core Mapping Definitions
 * Maps raw skills to high-level categories for Elite Benchmarking.
 */

const baseOntology = {
  "Frontend Development": [
    "react", "react.js", "reactjs", "vue", "vue.js", "angular", "html", "css", "html5", "css3", 
    "javascript", "js", "typescript", "ts", "tailwind", "tailwindcss", "bootstrap",
    "framer motion", "recharts", "redux", "redux toolkit", "rtk", "zustand", "svelte", 
    "solidjs", "pinia", "next.js", "nextjs", "webpack", "vite", "sass", "less",
    "jest", "cypress", "playwright", "shadcn", "chakra ui", "material-ui", "mui"
  ],
  "Backend Development": [
    "node.js", "nodejs", "node", "express", "express.js", "django", "python", "flask", 
    "java", "spring boot", "c#", ".net", "ruby on rails", "ruby", "go", "golang", 
    "php", "laravel", "fastapi", "graphql", "rest api", "grpc", "nestjs", "nest.js",
    "celery", "rabbitmq", "kafka", "apache kafka", "bullmq", "socket.io", "websockets",
    "spring", "microservices"
  ],
  "Database & Storage": [
    "sql", "mysql", "postgresql", "postgres", "mongodb", "mongo", "nosql", "redis", 
    "cassandra", "dynamodb", "firebase", "supabase", "elasticsearch", "sqlite",
    "mariadb", "oracle", "mssql", "prisma", "drizzle", "sequelize", "typeorm", "mongoose"
  ],
  "Cloud & DevOps": [
    "aws", "amazon web services", "gcp", "google cloud", "azure", "docker", "kubernetes", 
    "k8s", "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "ci/cd", 
    "linux", "bash", "nginx", "apache", "cloudflare", "datadog", "prometheus", "grafana",
    "vercel", "netlify", "digitalocean", "heroku", "aws lambda"
  ],
  "AI & Data Science": [
    "machine learning", "ml", "artificial intelligence", "ai", "deep learning", "nlp",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
    "openai", "llm", "rag", "langchain", "data analysis", "jupyter", "opencv", "spacy",
    "hugging face", "huggingface", "gpt", "gemini", "pinecone", "chromadb", "milvus",
    "weaviate", "spark", "apache spark"
  ],
  "Core Computer Science": [
    "data structures", "algorithms", "object oriented programming", "oop", "system design",
    "microservices", "agile", "scrum", "git", "version control", "test driven development",
    "tdd", "clean code", "design patterns", "multithreading", "concurrency", "networking",
    "tcp/ip", "oauth", "jwt"
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

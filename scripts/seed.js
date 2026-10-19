import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import CareerPath from '../models/CareerPath.js';
import Skill from '../models/Skill.js';
import Roadmap from '../models/Roadmap.js';
import CodingProblem from '../models/CodingProblem.js';
import PracticeQuestion from '../models/PracticeQuestion.js';
import InterviewQuestion from '../models/InterviewQuestion.js';
import Internship from '../models/Internship.js';
import Progress from '../models/Progress.js';
import Resume from '../models/Resume.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleCareerTracks = [
  {
    id: 'web-dev',
    name: 'Full-Stack Web Development',
    tagline: 'Build the products people use in a browser, front to back.',
    color: '#4FD1C5',
    icon: 'code',
    stations: [
      {
        title: 'Foundations',
        subtitle: 'Year 1–2',
        skills: ['HTML / CSS / JS', 'Git & GitHub', 'DOM & browser basics', 'Responsive layout'],
      },
      {
        title: 'Frontend Depth',
        subtitle: 'Year 2–3',
        skills: ['React + Hooks', 'State management', 'REST & JSON', 'Component design'],
      },
      {
        title: 'Backend & Data',
        subtitle: 'Year 3',
        skills: ['Node.js / Express', 'SQL & NoSQL', 'Auth & sessions', 'API design'],
      },
      {
        title: 'Ship It',
        subtitle: 'Year 3–4',
        skills: ['CI/CD basics', 'Testing', 'Deployment (Vercel/AWS)', 'Portfolio projects'],
      },
      {
        title: 'Placement Ready',
        subtitle: 'Year 4',
        skills: ['System design basics', 'DSA for interviews', 'Mock interviews', 'Open-source PRs'],
      },
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    tagline: 'Teach systems to learn patterns from data and act on them.',
    color: '#F5A623',
    icon: 'brain',
    stations: [
      {
        title: 'Math Foundations',
        subtitle: 'Year 1–2',
        skills: ['Linear algebra', 'Probability & stats', 'Python', 'NumPy / Pandas'],
      },
      {
        title: 'Core ML',
        subtitle: 'Year 2–3',
        skills: ['Regression & classification', 'Scikit-learn', 'Model evaluation', 'Feature engineering'],
      },
      {
        title: 'Deep Learning',
        subtitle: 'Year 3',
        skills: ['Neural networks', 'PyTorch / TensorFlow', 'CNNs & RNNs', 'Transfer learning'],
      },
      {
        title: 'Production ML',
        subtitle: 'Year 3–4',
        skills: ['Model deployment (FastAPI)', 'MLflow / tracking', 'Docker for ML', 'Model monitoring'],
      },
      {
        title: 'Placement Ready',
        subtitle: 'Year 4',
        skills: ['Kaggle competitions', 'Research papers reading', 'ML system design', 'LLM fine-tuning basics'],
      },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science & Analytics',
    tagline: 'Turn messy business data into decisions leaders can trust.',
    color: '#68D391',
    icon: 'chart',
    stations: [
      {
        title: 'Analytics Foundations',
        subtitle: 'Year 1–2',
        skills: ['SQL basics', 'Excel & Sheets', 'Python for data', 'Descriptive stats'],
      },
      {
        title: 'Data Wrangling & BI',
        subtitle: 'Year 2–3',
        skills: ['Pandas & Polars', 'Power BI / Tableau', 'Data cleaning', 'Exploratory data analysis'],
      },
      {
        title: 'Advanced Analytics',
        subtitle: 'Year 3',
        skills: ['Hypothesis testing', 'Predictive modeling', 'A/B testing', 'Data storytelling'],
      },
      {
        title: 'Big Data & Pipelines',
        subtitle: 'Year 3–4',
        skills: ['Apache Spark basics', 'Data warehousing', 'Airflow basics', 'dbt & data modeling'],
      },
      {
        title: 'Placement Ready',
        subtitle: 'Year 4',
        skills: ['Case study presentations', 'Business metrics (CAC, LTV)', 'Advanced SQL interviews', 'Portfolio dashboard'],
      },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    tagline: 'Defend networks, applications, and data against attacks.',
    color: '#FC8181',
    icon: 'shield',
    stations: [
      {
        title: 'Security Foundations',
        subtitle: 'Year 1–2',
        skills: ['Networking basics (TCP/IP)', 'Linux fundamentals', 'Cryptography basics', 'Security principles (CIA)'],
      },
      {
        title: 'Defensive Security',
        subtitle: 'Year 2–3',
        skills: ['SOC operations & SIEM', 'Network traffic analysis (Wireshark)', 'Vulnerability scanning', 'Incident response basics'],
      },
      {
        title: 'Offensive Security',
        subtitle: 'Year 3',
        skills: ['Web app security (OWASP Top 10)', 'Penetration testing basics', 'Burp Suite', 'Privilege escalation'],
      },
      {
        title: 'Cloud & AppSec',
        subtitle: 'Year 3–4',
        skills: ['Cloud security (AWS IAM)', 'DevSecOps basics', 'Threat modeling', 'Digital forensics basics'],
      },
      {
        title: 'Placement Ready',
        subtitle: 'Year 4',
        skills: ['TryHackMe / HackTheBox ranks', 'Security certifications (CompTIA Security+)', 'CTF writeups portfolio', 'Bug bounty basics'],
      },
    ],
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    tagline: 'Automate build, deployment, and infrastructure at scale.',
    color: '#63B3ED',
    icon: 'cloud',
    stations: [
      {
        title: 'Core Systems',
        subtitle: 'Year 1–2',
        skills: ['Linux administration', 'Shell scripting (Bash)', 'Networking & DNS', 'Git branching models'],
      },
      {
        title: 'Containerization & CI/CD',
        subtitle: 'Year 2–3',
        skills: ['Docker & Docker Compose', 'GitHub Actions / GitLab CI', 'Build tools', 'Artifact registries'],
      },
      {
        title: 'Cloud Providers',
        subtitle: 'Year 3',
        skills: ['AWS core services (EC2, S3, RDS)', 'Serverless (Lambda)', 'VPC & cloud networking', 'Cost optimization'],
      },
      {
        title: 'Orchestration & IaC',
        subtitle: 'Year 3–4',
        skills: ['Kubernetes basics', 'Terraform (IaC)', 'Ansible automation', 'Monitoring (Prometheus/Grafana)'],
      },
      {
        title: 'Placement Ready',
        subtitle: 'Year 4',
        skills: ['Cloud certification (AWS SAA)', 'End-to-end GitOps project', 'Production incident triage', 'Microservices design'],
      },
    ],
  },
  {
    id: 'competitive-programming',
    name: 'Competitive Programming & DSA',
    tagline: 'Master algorithms and data structures to ace technical interviews.',
    color: '#FFB454',
    icon: 'code',
    stations: [
      {
        title: 'Language & Linear Structures',
        subtitle: 'Year 1',
        skills: ['C++ STL / Java Collections', 'Arrays & Strings', 'Linked Lists', 'Stack & Queue'],
      },
      {
        title: 'Recursion & Sorting',
        subtitle: 'Year 2',
        skills: ['Binary Search', 'Sorting Algorithms', 'Recursion & Backtracking', 'Two Pointers & Sliding Window'],
      },
      {
        title: 'Trees & Graphs',
        subtitle: 'Year 2–3',
        skills: ['Binary Trees & BST', 'Graph Traversals (BFS/DFS)', 'Shortest Path Algorithms', 'Disjoint Set Union'],
      },
      {
        title: 'Dynamic Programming',
        subtitle: 'Year 3–4',
        skills: ['1D Dynamic Programming', '2D DP & Knapsack', 'Bitmask DP', 'Greedy Algorithms'],
      },
      {
        title: 'Contest & Placement Ready',
        subtitle: 'Year 4',
        skills: ['Codeforces Specialist / LeetCode Guardian', 'Company-specific interview problem banks', 'Time complexity optimization', 'Mock coding rounds'],
      },
    ],
  },
];

const sampleCodingProblems = [
  {
    id: 'parse-query-string',
    title: 'Parse Query String',
    difficulty: 'medium',
    domain: 'web-dev',
    category: 'JavaScript',
    language: 'javascript',
    description: 'Write a function that parses a URL query string like "a=1&b=2" into an object { a: "1", b: "2" }. Return {} for an empty string.',
    functionName: 'parseQueryString',
    starterCode: 'function parseQueryString(qs) {\n  // your code here\n}',
    testCases: [
      { args: ['a=1&b=2'], expected: { a: '1', b: '2' } },
      { args: ['name=NEC'], expected: { name: 'NEC' } },
      { args: [''], expected: {} },
    ],
    hint: 'Split on "&" first, then split each piece on "=" to get key/value pairs.',
  },
  {
    id: 'c-reverse-array',
    title: 'Reverse an Array (C / Logic)',
    difficulty: 'easy',
    domain: 'competitive-programming',
    category: 'C',
    language: 'c',
    description: 'Implement a function that reverses an array of integers in-place or returns the reversed list.',
    functionName: 'reverseArray',
    starterCode: 'function reverseArray(arr) {\n  // In C: use two pointers (left & right)\n  return arr.slice().reverse();\n}',
    testCases: [
      { args: [[1, 2, 3, 4]], expected: [4, 3, 2, 1] },
      { args: [[42]], expected: [42] },
      { args: [[]], expected: [] },
    ],
    hint: 'Swap elements from arr[i] and arr[n - 1 - i] until pointers meet.',
  },
  {
    id: 'cpp-two-sum',
    title: 'Two Sum (C++ / Map)',
    difficulty: 'easy',
    domain: 'competitive-programming',
    category: 'C++',
    language: 'cpp',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    functionName: 'twoSum',
    starterCode: 'function twoSum(nums, target) {\n  // In C++: std::unordered_map<int, int> seen;\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (comp in map) return [map[comp], i];\n    map[nums[i]] = i;\n  }\n  return [];\n}',
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
    hint: 'Store each number and its index in a hash map as you iterate.',
  },
  {
    id: 'java-is-palindrome',
    title: 'Valid Palindrome (Java / String)',
    difficulty: 'easy',
    domain: 'competitive-programming',
    category: 'Java',
    language: 'java',
    description: 'Write a function that checks if a string is a palindrome, ignoring non-alphanumeric characters and case.',
    functionName: 'isPalindrome',
    starterCode: 'function isPalindrome(s) {\n  // In Java: Character.isLetterOrDigit, toLowerCase\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
    testCases: [
      { args: ['A man, a plan, a canal: Panama'], expected: true },
      { args: ['race a car'], expected: false },
      { args: [' '], expected: true },
    ],
    hint: 'Filter the string to lowercase alphanumeric characters, then compare from both ends.',
  },
  {
    id: 'python-word-frequency',
    title: 'Word Frequency Count (Python / Dict)',
    difficulty: 'easy',
    domain: 'ai-ml',
    category: 'Python',
    language: 'python',
    description: 'Given a sentence, return an object representing the frequency of each lowercase word.',
    functionName: 'wordFrequency',
    starterCode: 'function wordFrequency(sentence) {\n  // In Python: collections.Counter(sentence.lower().split())\n  const words = sentence.toLowerCase().match(/\\b\\w+\\b/g) || [];\n  const count = {};\n  for (const w of words) count[w] = (count[w] || 0) + 1;\n  return count;\n}',
    testCases: [
      { args: ['hello world hello'], expected: { hello: 2, world: 1 } },
      { args: ['python data science python'], expected: { python: 2, data: 1, science: 1 } },
    ],
    hint: 'Normalize the words to lowercase and keep counts in a dictionary/object.',
  },
  {
    id: 'sql-second-highest',
    title: 'Second Highest Salary (SQL Logic)',
    difficulty: 'medium',
    domain: 'data-science',
    category: 'SQL',
    language: 'sql',
    description: 'Simulate finding the second highest unique salary from an array of numeric employee salaries. Return null if no second highest exists.',
    functionName: 'secondHighestSalary',
    starterCode: 'function secondHighestSalary(salaries) {\n  // In SQL: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)\n  const unique = [...new Set(salaries)].sort((a, b) => b - a);\n  return unique.length > 1 ? unique[1] : null;\n}',
    testCases: [
      { args: [[100, 200, 300]], expected: 200 },
      { args: [[100, 100]], expected: null },
      { args: [[500, 400, 300, 200]], expected: 400 },
    ],
    hint: 'Remove duplicates, sort descending, and select the item at index 1.',
  },
  {
    id: 'dsa-valid-parentheses',
    title: 'Valid Parentheses (Data Structures / Stack)',
    difficulty: 'easy',
    domain: 'competitive-programming',
    category: 'Data Structures',
    language: 'javascript',
    description: 'Given a string containing just (), [], and {}, determine if the input string is valid.',
    functionName: 'isValidParentheses',
    starterCode: 'function isValidParentheses(s) {\n  const stack = [];\n  const pairs = { ")": "(", "]": "[", "}": "{" };\n  for (const ch of s) {\n    if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);\n    else if (stack.pop() !== pairs[ch]) return false;\n  }\n  return stack.length === 0;\n}',
    testCases: [
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['{[]}'], expected: true },
    ],
    hint: 'Use a stack to match closing brackets with the latest opening bracket.',
  },
  {
    id: 'algo-binary-search',
    title: 'Binary Search (Algorithms)',
    difficulty: 'easy',
    domain: 'competitive-programming',
    category: 'Algorithms',
    language: 'javascript',
    description: 'Given a sorted array of distinct integers and a target, return its index. If not found, return -1 in O(log n) time.',
    functionName: 'binarySearch',
    starterCode: 'function binarySearch(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
    testCases: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
    ],
    hint: 'Compute mid = Math.floor((left + right) / 2) and narrow down the search space.',
  },
];

const samplePracticeQuestions = [
  {
    id: 'apt-q1',
    category: 'aptitude',
    domain: 'general',
    question: 'What is 25% of 240?',
    options: [
      { id: 'a', text: '50' },
      { id: 'b', text: '60' },
      { id: 'c', text: '65' },
      { id: 'd', text: '70' },
    ],
    correctOptionId: 'b',
    explanation: '25% of 240 = 0.25 × 240 = 60.',
  },
  {
    id: 'apt-q2',
    category: 'aptitude',
    domain: 'general',
    question: 'A train travels at 60 km/h for 3 hours. How far does it travel?',
    options: [
      { id: 'a', text: '120 km' },
      { id: 'b', text: '150 km' },
      { id: 'c', text: '180 km' },
      { id: 'd', text: '200 km' },
    ],
    correctOptionId: 'c',
    explanation: 'Distance = Speed × Time = 60 × 3 = 180 km.',
  },
  {
    id: 'tech-mcq-1',
    category: 'technical-mcqs',
    domain: 'computer-science',
    question: 'Which data structure uses the LIFO (Last In First Out) principle?',
    options: [
      { id: 'a', text: 'Queue' },
      { id: 'b', text: 'Stack' },
      { id: 'c', text: 'Linked List' },
      { id: 'd', text: 'Binary Tree' },
    ],
    correctOptionId: 'b',
    explanation: 'A Stack follows the Last In First Out (LIFO) discipline.',
  },
  {
    id: 'tech-mcq-2',
    category: 'technical-mcqs',
    domain: 'computer-science',
    question: 'What is the average time complexity of searching in a Hash Table?',
    options: [
      { id: 'a', text: 'O(1)' },
      { id: 'b', text: 'O(log n)' },
      { id: 'c', text: 'O(n)' },
      { id: 'd', text: 'O(n log n)' },
    ],
    correctOptionId: 'a',
    explanation: 'A hash table provides O(1) average time complexity for lookup.',
  },
  {
    id: 'logical-q1',
    category: 'logical-reasoning',
    domain: 'general',
    question: 'Look at the series: 2, 1, (1/2), (1/4), ... What number should come next?',
    options: [
      { id: 'a', text: '(1/3)' },
      { id: 'b', text: '(1/8)' },
      { id: 'c', text: '(2/8)' },
      { id: 'd', text: '(1/16)' },
    ],
    correctOptionId: 'b',
    explanation: 'Each term is halved to produce the next term: (1/4) / 2 = (1/8).',
  },
  {
    id: 'quiz-web-1',
    category: 'quiz',
    domain: 'web-dev',
    question: 'Which HTTP method is idempotent and intended for safe retrieval of data?',
    options: [
      { id: 'a', text: 'POST' },
      { id: 'b', text: 'GET' },
      { id: 'c', text: 'PATCH' },
      { id: 'd', text: 'DELETE' },
    ],
    correctOptionId: 'b',
    explanation: 'GET requests are safe and idempotent by HTTP specification.',
  },
];

const sampleInterviewQuestions = [
  {
    id: 'int-tech-1',
    category: 'technical',
    subCategory: 'System Design',
    company: 'Google',
    domain: 'web-dev',
    question: 'How does browser caching and CDN edge routing work when a user loads a web application?',
    tip: 'Explain DNS lookup, CDN cache hits, HTTP headers like Cache-Control and ETag, and service worker caching.',
    sampleAnswer: 'When a request is initiated, the browser checks its local cache and Service Worker. If missing or stale, DNS resolves the nearest CDN PoP edge server, serving cached assets with low latency. If CDN misses, it forwards to the origin Express API.',
  },
  {
    id: 'int-tech-2',
    category: 'technical',
    subCategory: 'Databases',
    company: 'Amazon',
    domain: 'web-dev',
    question: 'Explain the difference between SQL and NoSQL databases. When would you choose MongoDB over PostgreSQL?',
    tip: 'Mention ACID vs BASE, rigid schema vs flexible JSON/BSON documents, vertical vs horizontal scaling.',
    sampleAnswer: 'Choose MongoDB when your data schema evolves rapidly, when working with document-oriented data (like hierarchical user profiles, polymorphic roadmaps), or when massive horizontal partitioning is needed.',
  },
  {
    id: 'int-hr-1',
    category: 'hr',
    subCategory: 'Behavioral',
    company: 'General',
    domain: 'general',
    question: 'Tell me about yourself and why you chose your engineering field.',
    tip: 'Keep it to 60-90 seconds: mention current degree, primary projects, passion for technology, and career goals.',
    sampleAnswer: 'I am a pre-final year CS student passionate about full-stack software development. I have built several projects using React and Node.js with MongoDB Atlas, and I love creating intuitive products that solve real problems.',
  },
  {
    id: 'int-comp-tcs',
    category: 'company-based',
    subCategory: 'TCS Digital / Ninja',
    company: 'TCS',
    domain: 'competitive-programming',
    question: 'What are the four pillars of Object-Oriented Programming? Give real-world code examples.',
    tip: 'Encapsulation, Abstraction, Inheritance, Polymorphism.',
    sampleAnswer: 'The 4 pillars are Encapsulation (data hiding), Abstraction (hiding implementation details), Inheritance (reusability via parent-child classes), and Polymorphism (method overloading & overriding).',
  },
  {
    id: 'int-comp-zoho',
    category: 'company-based',
    subCategory: 'Zoho Advanced Round',
    company: 'Zoho',
    domain: 'competitive-programming',
    question: 'How would you implement a Rate Limiter for an API endpoint without exhausting server memory?',
    tip: 'Discuss Sliding Window Counter or Token Bucket algorithm using Redis or in-memory ring buffers.',
    sampleAnswer: 'A Token Bucket or Sliding Window Log tracks requests with timestamps. Every incoming request checks if tokens remain in the current time frame; excess requests return HTTP 429 Too Many Requests.',
  },
];

const sampleInternships = [
  {
    company: 'Freshworks',
    role: 'Full-Stack Developer Intern',
    location: 'Chennai / Hybrid',
    type: 'Hybrid',
    stipend: '₹35,000 / month',
    trackId: 'web-dev',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    description: 'Work alongside core engineering teams building scalable SaaS products serving thousands of enterprise clients.',
    applicationLink: 'https://careers.freshworks.com',
    deadline: 'April 30, 2026',
    level: 'intermediate',
  },
  {
    company: 'Zoho Corporation',
    role: 'Software Development Intern',
    location: 'Tenkasi / Chennai',
    type: 'On-site',
    stipend: '₹25,000 / month',
    trackId: 'web-dev',
    skills: ['Java', 'JavaScript', 'SQL', 'Algorithms'],
    description: 'Design and build enterprise business tools with high-performance architectures and real-time sync.',
    applicationLink: 'https://zoho.com/careers',
    deadline: 'Rolling Admission',
    level: 'beginner',
  },
  {
    company: 'Razorpay',
    role: 'Backend Engineering Intern',
    location: 'Bengaluru / Remote',
    type: 'Remote',
    stipend: '₹45,000 / month',
    trackId: 'web-dev',
    skills: ['Node.js', 'Express', 'MongoDB', 'Microservices'],
    description: 'Help build high-throughput financial infrastructure handling millions of transactions daily.',
    applicationLink: 'https://razorpay.com/jobs',
    deadline: 'May 15, 2026',
    level: 'advanced',
  },
  {
    company: 'Mu Sigma',
    role: 'Decision Sciences & AI Intern',
    location: 'Bengaluru',
    type: 'On-site',
    stipend: '₹30,000 / month',
    trackId: 'ai-ml',
    skills: ['Python', 'Pandas', 'Machine Learning', 'Data Visualization'],
    description: 'Analyze Fortune 500 business data to build predictive models and automated decision trees.',
    applicationLink: 'https://mu-sigma.com/careers',
    deadline: 'Open Rolling',
    level: 'intermediate',
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to MongoDB Atlas...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 6000 });
    console.log(`Connected to database: ${mongoose.connection.name}`);

    // Clear existing data
    console.log('Clearing old records...');
    await CareerPath.deleteMany({});
    await Skill.deleteMany({});
    await Roadmap.deleteMany({});
    await CodingProblem.deleteMany({});
    await PracticeQuestion.deleteMany({});
    await InterviewQuestion.deleteMany({});
    await Internship.deleteMany({});
    await User.deleteMany({});
    await Progress.deleteMany({});
    await Resume.deleteMany({});

    // 1. Seed Career Paths
    console.log('Seeding Career Paths...');
    const createdPaths = await CareerPath.insertMany(sampleCareerTracks);
    console.log(`✓ Inserted ${createdPaths.length} career paths.`);

    // 2. Seed Skills
    console.log('Seeding Skills...');
    const skillsToInsert = [];
    sampleCareerTracks.forEach((track) => {
      track.stations.forEach((station) => {
        station.skills.forEach((skillName) => {
          skillsToInsert.push({
            name: skillName,
            trackId: track.id,
            stationTitle: station.title,
            description: `Core proficiency in ${skillName}`,
            category: track.name,
            status: 'Not Started',
          });
        });
      });
    });
    const createdSkills = await Skill.insertMany(skillsToInsert);
    console.log(`✓ Inserted ${createdSkills.length} skills.`);

    // 3. Seed Roadmaps
    console.log('Seeding Roadmaps...');
    const roadmapsToInsert = sampleCareerTracks.map((track) => ({
      trackId: track.id,
      name: track.name,
      description: track.tagline,
      stations: track.stations.map((s, idx) => ({
        id: `station-${idx + 1}`,
        title: s.title,
        subtitle: s.subtitle,
        order: idx + 1,
        tasks: s.skills.map((sk, sidx) => ({
          id: `task-${idx + 1}-${sidx + 1}`,
          title: sk,
          description: `Master ${sk} through hands-on practice.`,
          skills: [sk],
          status: 'Not Started',
        })),
      })),
    }));
    const createdRoadmaps = await Roadmap.insertMany(roadmapsToInsert);
    console.log(`✓ Inserted ${createdRoadmaps.length} roadmaps.`);

    // 4. Seed Coding Problems
    console.log('Seeding Coding Problems...');
    const createdProblems = await CodingProblem.insertMany(sampleCodingProblems);
    console.log(`✓ Inserted ${createdProblems.length} coding problems.`);

    // 5. Seed Practice Questions (MCQs)
    console.log('Seeding Practice / Quiz Questions...');
    const createdQuizzes = await PracticeQuestion.insertMany(samplePracticeQuestions);
    console.log(`✓ Inserted ${createdQuizzes.length} practice questions.`);

    // 6. Seed Interview Questions
    console.log('Seeding Interview Questions...');
    const createdInterviews = await InterviewQuestion.insertMany(sampleInterviewQuestions);
    console.log(`✓ Inserted ${createdInterviews.length} interview questions.`);

    // 7. Seed Internships
    console.log('Seeding Internships...');
    const createdInternships = await Internship.insertMany(sampleInternships);
    console.log(`✓ Inserted ${createdInternships.length} internships.`);

    // 8. Seed Demo User
    console.log('Seeding Demo User...');
    const demoUser = await User.create({
      name: 'Birundha M',
      email: 'student@nec.edu.in',
      password: 'password123',
      year: '3rd Year',
      department: 'Computer Science & Engineering',
      careerPath: 'web-dev',
    });

    // Seed Demo User Progress
    const demoProgress = await Progress.create({
      userId: demoUser._id,
      checkedSkills: {
        'web-dev::HTML / CSS / JS::basic': true,
        'web-dev::HTML / CSS / JS::advanced': true,
        'web-dev::HTML / CSS / JS::practice::example': true,
        'web-dev::HTML / CSS / JS::practice::explain': true,
        'web-dev::HTML / CSS / JS::practice::exercises': true,
        'web-dev::HTML / CSS / JS::assessment_date': '2026-03-15',
        'web-dev::HTML / CSS / JS::assessment_check::explain_others': true,
        'web-dev::HTML / CSS / JS::assessment_check::built_something': true,
        'web-dev::HTML / CSS / JS::assessment_check::confident': true,
        'web-dev::HTML / CSS / JS::assessment_taken': true,
      },
      completedSkills: ['web-dev::HTML / CSS / JS'],
      completedRoadmapTasks: ['web-dev::task-1-1'],
      solvedProblems: {
        'parse-query-string': true,
        'cpp-two-sum': true,
      },
      practiceSolved: ['parse-query-string', 'cpp-two-sum'],
      quizProgress: {
        'apt-q1': true,
        'tech-mcq-1': true,
      },
      practicedPrompts: {
        'int-tech-1': true,
      },
      interviewCompleted: ['int-tech-1'],
      overallProgress: 15,
      skillProfile: {
        skillrackSolved: 120,
        skillrackBadge: 'Gold',
        leetEasy: 25,
        leetMedium: 10,
        leetHard: 2,
      },
    });

    // Seed Demo User Resume
    await Resume.create({
      userId: demoUser._id,
      personalDetails: {
        name: 'Birundha M',
        email: 'student@nec.edu.in',
        phone: '+91 98765 43210',
        location: 'Tamil Nadu, India',
        linkedin: 'linkedin.com/in/birundha',
        github: 'github.com/birundha',
      },
      education: {
        college: 'National Engineering College',
        degree: 'B.E. Computer Science & Engineering',
        gradYear: '2027',
      },
      summary: 'Passionate computer science student pursuing Full-Stack Web Development and competitive programming.',
      trackId: 'web-dev',
      skills: {
        mastered: ['HTML / CSS / JS', 'React + Hooks', 'Git & GitHub'],
        learning: ['Node.js / Express', 'MongoDB Atlas', 'REST APIs'],
      },
      projects: [
        {
          id: 'proj-1',
          title: 'Career Path Platform',
          tech: 'React, Node.js, Express, MongoDB Atlas',
          description: 'A station-by-station skill milestone tracker with coding practice and resume generator.',
        },
      ],
      certifications: ['HackerRank Problem Solving', 'FreeCodeCamp Full Stack'],
    });

    console.log(`✓ Created Demo User:`);
    console.log(`   Email: student@nec.edu.in`);
    console.log(`   Password: password123`);

    console.log('\n=============================================');
    console.log('🎉 Seed Script Completed Successfully!');
    console.log('MongoDB collections are ready in Compass for testing.');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();

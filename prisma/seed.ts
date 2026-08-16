import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@wisekew.com" },
    update: {},
    create: {
      name: "Wisekew Admin",
      email: "admin@wisekew.com",
      passwordHash: password,
      role: "ADMIN",
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@wisekew.com" },
    update: {},
    create: {
      name: "Dana Reyes",
      email: "instructor@wisekew.com",
      passwordHash: password,
      role: "INSTRUCTOR",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@wisekew.com" },
    update: {},
    create: {
      name: "Sam Taylor",
      email: "student@wisekew.com",
      passwordHash: password,
      role: "STUDENT",
    },
  });

  // --- Video course ---
  const webDevCourse = await prisma.course.upsert({
    where: { slug: "modern-web-development" },
    update: {},
    create: {
      slug: "modern-web-development",
      title: "Modern Web Development Bootcamp",
      description:
        "Learn to build full-stack web applications from scratch: HTML, CSS, JavaScript, React, and backend fundamentals.",
      category: "Web Development",
      price: 49.99,
      published: true,
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: "Getting Started",
            order: 0,
            lectures: {
              create: [
                {
                  title: "Welcome to the course",
                  content:
                    "In this lecture we'll cover what you'll learn and how the course is structured.",
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 320,
                  order: 0,
                },
                {
                  title: "Setting up your environment",
                  content: "Install Node.js, a code editor, and get your first project running.",
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 540,
                  order: 1,
                },
              ],
            },
          },
          {
            title: "JavaScript Fundamentals",
            order: 1,
            lectures: {
              create: [
                {
                  title: "Variables and data types",
                  content: "Understanding let, const, and JavaScript's core data types.",
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 610,
                  order: 0,
                },
                {
                  title: "Functions and scope",
                  content: "How functions work and what scope means in JavaScript.",
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 480,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // --- Exam-prep course ---
  const examCourse = await prisma.course.upsert({
    where: { slug: "cpa-far-exam-prep" },
    update: { category: "CPA" },
    create: {
      slug: "cpa-far-exam-prep",
      title: "CPA Exam Prep: Financial Accounting & Reporting (FAR)",
      description:
        "Master the FAR section of the CPA exam with structured lessons, a comprehensive question bank, and timed practice exams.",
      category: "CPA",
      price: 199.0,
      published: true,
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: "Conceptual Framework",
            order: 0,
            lectures: {
              create: [
                {
                  title: "Overview of the FAR section",
                  content: "What to expect on exam day and how FAR is structured.",
                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  duration: 400,
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const farBank = await prisma.questionBank.create({
    data: {
      courseId: examCourse.id,
      title: "FAR Question Bank",
      questions: {
        create: [
          {
            text: "Under US GAAP, which financial statement reports a company's financial position at a point in time?",
            choices: [
              "Income Statement",
              "Balance Sheet",
              "Statement of Cash Flows",
              "Statement of Retained Earnings",
            ],
            correctChoice: 1,
            explanation:
              "The Balance Sheet (Statement of Financial Position) reports assets, liabilities, and equity as of a specific date.",
          },
          {
            text: "Which inventory costing method assumes the most recently purchased items are sold first?",
            choices: ["FIFO", "LIFO", "Weighted Average", "Specific Identification"],
            correctChoice: 1,
            explanation:
              "LIFO (Last-In, First-Out) assumes the newest inventory is sold first.",
          },
          {
            text: "Under accrual accounting, revenue is recognized when:",
            choices: [
              "Cash is received",
              "The invoice is sent",
              "Performance obligations are satisfied",
              "The contract is signed",
            ],
            correctChoice: 2,
            explanation:
              "ASC 606 requires revenue recognition when performance obligations are satisfied, regardless of cash timing.",
          },
          {
            text: "Which of the following is classified as a current asset?",
            choices: ["Goodwill", "Accounts Receivable", "Long-term Investments", "Equipment"],
            correctChoice: 1,
            explanation:
              "Accounts Receivable is expected to be collected within one year and is classified as a current asset.",
          },
          {
            text: "Depreciation expense under the straight-line method is calculated as:",
            choices: [
              "(Cost - Salvage Value) / Useful Life",
              "Cost / Useful Life",
              "Cost x Depreciation Rate",
              "(Cost + Salvage Value) / Useful Life",
            ],
            correctChoice: 0,
            explanation:
              "Straight-line depreciation spreads (Cost - Salvage Value) evenly over the asset's useful life.",
          },
          {
            text: "A contingent liability should be recorded when the loss is:",
            choices: [
              "Possible and estimable",
              "Probable and estimable",
              "Remote",
              "Certain but not estimable",
            ],
            correctChoice: 1,
            explanation:
              "Under ASC 450, contingent liabilities are recorded when the loss is probable and the amount can be reasonably estimated.",
          },
        ],
      },
      exams: {
        create: [
          {
            title: "FAR Practice Exam 1",
            numQuestions: 5,
            timeLimitMinutes: 15,
          },
        ],
      },
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: webDevCourse.id } },
    update: {},
    create: { userId: student.id, courseId: webDevCourse.id },
  });

  // --- Additional exam-prep courses (accounting/finance certifications) ---
  const examPrepCourses = [
    {
      slug: "cma-exam-prep",
      category: "CMA",
      title: "CMA Exam Prep",
      description:
        "Prepare for the CMA (Certified Management Accountant) exam with structured lessons covering financial planning, analysis, control, and decision support for accountants in corporate finance.",
      price: 189.0,
      lectureTitle: "Overview of the CMA exam",
      lectureContent: "What the CMA credential covers and how the two-part exam is structured.",
    },
    {
      slug: "cia-exam-prep",
      category: "CIA",
      title: "CIA Exam Prep",
      description:
        "Prepare for the CIA (Certified Internal Auditor) exam with lessons on internal audit fundamentals, practice, and business knowledge.",
      price: 189.0,
      lectureTitle: "Overview of the CIA exam",
      lectureContent: "What to expect across the three parts of the CIA exam.",
    },
    {
      slug: "ea-exam-prep",
      category: "EA",
      title: "EA Exam Prep",
      description:
        "Prepare for the IRS Enrolled Agent (EA) exam, covering individual tax, business tax, and representation, practices, and procedures.",
      price: 159.0,
      lectureTitle: "Overview of the EA exam",
      lectureContent: "How the Enrolled Agent credential works and what the exam covers.",
    },
    {
      slug: "fmaa-exam-prep",
      category: "FMAA",
      title: "FMAA Exam Prep",
      description:
        "Structured lessons and practice questions covering the core financial management and accounting competencies tested on the FMAA exam.",
      price: 149.0,
      lectureTitle: "Overview of the FMAA exam",
      lectureContent: "What to expect on exam day and how the course is structured.",
    },
    {
      slug: "cpe-courses",
      category: "CPE",
      title: "CPE — Continuing Professional Education",
      description:
        "Earn continuing professional education credits with courses covering current accounting standards, regulations, and best practices.",
      price: 99.0,
      lectureTitle: "Getting started with CPE credits",
      lectureContent: "How CPE credit hours work and how to track your progress.",
    },
    {
      slug: "afsp-exam-prep",
      category: "AFSP",
      title: "AFSP — Annual Filing Season Program",
      description:
        "Complete IRS Annual Filing Season Program requirements with courses covering tax law updates, ethics, and filing season readiness for non-credentialed tax preparers.",
      price: 89.0,
      lectureTitle: "AFSP program overview",
      lectureContent: "What the Annual Filing Season Program requires and who it's for.",
    },
    {
      slug: "iap-exam-prep",
      category: "IAP",
      title: "IAP Exam Prep",
      description:
        "Structured lessons and practice questions covering the key professional competencies tested on the IAP exam.",
      price: 149.0,
      lectureTitle: "Overview of the IAP exam",
      lectureContent: "What to expect on exam day and how the course is structured.",
    },
  ];

  for (const c of examPrepCourses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: { category: c.category },
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        category: c.category,
        price: c.price,
        published: true,
        instructorId: instructor.id,
        sections: {
          create: [
            {
              title: "Getting Started",
              order: 0,
              lectures: {
                create: [
                  {
                    title: c.lectureTitle,
                    content: c.lectureContent,
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    duration: 360,
                    order: 0,
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  console.log("Seed complete:");
  console.log(`  Admin:      admin@wisekew.com / password123`);
  console.log(`  Instructor: instructor@wisekew.com / password123`);
  console.log(`  Student:    student@wisekew.com / password123`);
  console.log(`  Courses:    ${webDevCourse.title}, ${examCourse.title}, +${examPrepCourses.length} more exam-prep courses`);
  console.log(`  Question bank: ${farBank.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

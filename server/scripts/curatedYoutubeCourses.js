/**
 * Curated free YouTube courses (lectures use standard /embed/ URLs for the LMS player).
 * List prices mirror typical paid bootcamp tiers; discount 100% = free to enroll.
 * Run via: node scripts/seedCourses.js (imports this file).
 */

export function getCuratedYoutubeCourses(yt) {
  const L = (prefix) => {
    let order = 1;
    return (videoId, title, minutes, isPreviewFree = true) => ({
      lectureId: `lec_${prefix}_${videoId}`,
      lectureTitle: title,
      lectureDuration: minutes,
      lectureUrl: yt(videoId),
      isPreviewFree: isPreviewFree,
      lectureOrder: order++,
    });
  };

  const thumb = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  return [
    // ─── Full stack (2) ───────────────────────────────────────────────────
    {
      courseTitle: "Complete Web Developer — HTML, CSS, JavaScript, React & Node (Free · YouTube)",
      courseDescription: `<p><strong>Free curated path</strong> — same topics as popular paid full-stack bootcamps (often <strong>$50–$80</strong> on marketplaces like Udemy), using trusted YouTube creators. Build websites, then APIs, with embed-ready lectures.</p>
        <p><strong>Includes:</strong> HTML/CSS foundations, JavaScript, React, Node.js & Express.</p>`,
      courseThumbnail: thumb("pQN-pnXPaLg"),
      coursePrice: 79.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_fs1_1",
          chapterOrder: 1,
          chapterTitle: "HTML & CSS foundations",
          chapterContent: (() => {
            const l = L("cur_fs1");
            return [
              l("pQN-pnXPaLg", "HTML Crash Course For Absolute Beginners", 120, true),
              l("1Rs2ND1ryYc", "CSS Crash Course For Absolute Beginners", 120, true),
            ];
          })(),
        },
        {
          chapterId: "ch_cur_fs1_2",
          chapterOrder: 2,
          chapterTitle: "JavaScript fundamentals",
          chapterContent: (() => {
            const l = L("cur_fs1b");
            return [l("W6NZfCO5SIk", "JavaScript Crash Course For Beginners", 90, true)];
          })(),
        },
        {
          chapterId: "ch_cur_fs1_3",
          chapterOrder: 3,
          chapterTitle: "React — UI layer",
          chapterContent: (() => {
            const l = L("cur_fs1c");
            return [l("w7ejDZLYHYM", "React JS Crash Course", 120, true)];
          })(),
        },
        {
          chapterId: "ch_cur_fs1_4",
          chapterOrder: 4,
          chapterTitle: "Node.js & Express — backend",
          chapterContent: (() => {
            const l = L("cur_fs1d");
            return [
              l("TlB_eWDSMt4", "Node.js Crash Course", 90, true),
              l("G8uL0lFFoN0", "Express JS Crash Course", 60, true),
            ];
          })(),
        },
      ],
    },
    {
      courseTitle: "Full Stack Web Development — Long-form Bootcamp (HTML → MongoDB) (Free · YouTube)",
      courseDescription: `<p>Single-track <strong>full-stack beginner course</strong> comparable to long paid bootcamps. All lectures play inside the LMS player.</p>
        <p>Covers front-end + Node + MongoDB style stack in one guided series.</p>`,
      courseThumbnail: thumb("nu_pCVPKzTk"),
      coursePrice: 84.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_fs2_1",
          chapterOrder: 1,
          chapterTitle: "Full stack beginner course (complete workshop)",
          chapterContent: (() => {
            const l = L("cur_fs2");
            return [
              l("nu_pCVPKzTk", "Full Stack Web Development for Beginners — HTML, CSS, JS, Node, MongoDB", 450, true),
            ];
          })(),
        },
        {
          chapterId: "ch_cur_fs2_2",
          chapterOrder: 2,
          chapterTitle: "MERN-style project build",
          chapterContent: (() => {
            const l = L("cur_fs2b");
            return [l("pgw2KPfgK1E", "Build a Full Stack Book Store App — React, Node, MongoDB", 550, true)];
          })(),
        },
        {
          chapterId: "ch_cur_fs2_3",
          chapterOrder: 3,
          chapterTitle: "Next.js full stack on Vercel",
          chapterContent: (() => {
            const l = L("cur_fs2c");
            return [l("KjY94sAKLlw", "Next.js React Framework Course — Build & deploy full stack app", 290, true)];
          })(),
        },
      ],
    },

    // ─── Frontend (2) ──────────────────────────────────────────────────────
    {
      courseTitle: "Frontend Engineering — React, Hooks & Modern UI (Free · YouTube)",
      courseDescription: `<p>Curated <strong>front-end–only</strong> track (similar scope to <strong>$40–$70</strong> React specials on Udemy). Focus on components, hooks, and layout patterns.</p>`,
      courseThumbnail: thumb("w7ejDZLYHYM"),
      coursePrice: 69.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_fe1_1",
          chapterOrder: 1,
          chapterTitle: "React core",
          chapterContent: (() => {
            const l = L("cur_fe1");
            return [
              l("w7ejDZLYHYM", "React JS Crash Course (classic)", 120, true),
              l("LDB4uaJ87e0", "React Crash Course (2024) — job listings app", 185, true),
            ];
          })(),
        },
        {
          chapterId: "ch_cur_fe1_2",
          chapterOrder: 2,
          chapterTitle: "Hooks & layout patterns",
          chapterContent: (() => {
            const l = L("cur_fe1b");
            return [
              l("Rh3tobg7hEo", "Learn React With This One Project — state, effects, hooks", 42, true),
              l("yfoY53QXEnI", "CSS Grid Layout Crash Course", 60, true),
            ];
          })(),
        },
      ],
    },
    {
      courseTitle: "Frontend Layout Mastery — CSS, Flexbox & Grid (Free · YouTube)",
      courseDescription: `<p>Deep dive into <strong>responsive layout</strong> — what many paid “HTML/CSS” courses emphasize. Real lecture embeds only.</p>`,
      courseThumbnail: thumb("JJSoEoIoFns"),
      coursePrice: 49.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_fe2_1",
          chapterOrder: 1,
          chapterTitle: "CSS essentials & Flexbox",
          chapterContent: (() => {
            const l = L("cur_fe2");
            return [
              l("1Rs2ND1ryYc", "CSS Crash Course For Absolute Beginners", 120, true),
              l("JJSoEoIoFns", "Flexbox CSS In 20 Minutes", 20, true),
            ];
          })(),
        },
        {
          chapterId: "ch_cur_fe2_2",
          chapterOrder: 2,
          chapterTitle: "Grid & responsive design",
          chapterContent: (() => {
            const l = L("cur_fe2b");
            return [
              l("9zBsdzdE9sU", "CSS Grid Layout Crash Course", 60, true),
              l("3JluqTojuME", "Responsive Web Design — media queries & mobile-first", 20, true),
            ];
          })(),
        },
      ],
    },

    // ─── Backend (2) ─────────────────────────────────────────────────────────
    {
      courseTitle: "Backend with Node.js — Express, REST & MongoDB (Free · YouTube)",
      courseDescription: `<p>JavaScript backend track aligned with <strong>Node/Express</strong> courses commonly sold for <strong>$50–$80</strong>. APIs, middleware, and persistence basics.</p>`,
      courseThumbnail: thumb("TlB_eWDSMt4"),
      coursePrice: 74.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_be1_1",
          chapterOrder: 1,
          chapterTitle: "Node & npm",
          chapterContent: (() => {
            const l = L("cur_be1");
            return [l("TlB_eWDSMt4", "Node.js Crash Course", 90, true)];
          })(),
        },
        {
          chapterId: "ch_cur_be1_2",
          chapterOrder: 2,
          chapterTitle: "Express & REST APIs",
          chapterContent: (() => {
            const l = L("cur_be1b");
            return [
              l("G8uL0lFFoN0", "Express JS Crash Course", 60, true),
              l("ofme2o29ngU", "REST API Design — Node.js", 45, true),
            ];
          })(),
        },
        {
          chapterId: "ch_cur_be1_3",
          chapterOrder: 3,
          chapterTitle: "MongoDB with Node",
          chapterContent: (() => {
            const l = L("cur_be1c");
            return [l("zbMJhmJRGQs", "MongoDB Crash Course", 60, true)];
          })(),
        },
      ],
    },
    {
      courseTitle: "Backend with Python — Django Web Framework (Free · YouTube)",
      courseDescription: `<p><strong>Django</strong> path comparable to paid Python web courses. Includes crash course + longer freeCodeCamp walkthrough.</p>`,
      courseThumbnail: thumb("0roB7wZMLqI"),
      coursePrice: 69.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_be2_1",
          chapterOrder: 1,
          chapterTitle: "Django crash course",
          chapterContent: (() => {
            const l = L("cur_be2");
            return [l("0roB7wZMLqI", "Django Crash Course — Python Web Framework", 70, true)];
          })(),
        },
        {
          chapterId: "ch_cur_be2_2",
          chapterOrder: 2,
          chapterTitle: "Django full course for beginners",
          chapterContent: (() => {
            const l = L("cur_be2b");
            return [l("F5mRW0jo-U4", "Python Django Web Framework — Full Course for Beginners", 240, true)];
          })(),
        },
        {
          chapterId: "ch_cur_be2_3",
          chapterOrder: 3,
          chapterTitle: "Django project — social app",
          chapterContent: (() => {
            const l = L("cur_be2c");
            return [l("xSUm6iMtREA", "Create a Social Media App with Django", 300, true)];
          })(),
        },
      ],
    },

    // ─── DSA (2) — additional to Striver already in seed ───────────────────
    {
      courseTitle: "Data Structures — Easy to Advanced (Free · YouTube / MIT)",
      courseDescription: `<p>In-depth structures &amp; algorithms lecture series (often compared to university / premium DS&A programs). Heavy single-course format.</p>`,
      courseThumbnail: thumb("RBSGKlAvoiM"),
      coursePrice: 89.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_dsa1_1",
          chapterOrder: 1,
          chapterTitle: "Core data structures (full course)",
          chapterContent: (() => {
            const l = L("cur_dsa1");
            return [l("RBSGKlAvoiM", "Data Structures Easy to Advanced — Full Course", 500, true)];
          })(),
        },
        {
          chapterId: "ch_cur_dsa1_2",
          chapterOrder: 2,
          chapterTitle: "Graph algorithms",
          chapterContent: (() => {
            const l = L("cur_dsa1b");
            return [l("BEb9PuUc8Z0", "Graph Algorithms for Technical Interviews", 180, true)];
          })(),
        },
      ],
    },
    {
      courseTitle: "Dynamic Programming & Interview Problem Solving (Free · YouTube)",
      courseDescription: `<p>Second DSA-focused track emphasizing <strong>dynamic programming</strong> and patterns common in interviews — aligned with long freeCodeCamp specials that often mirror <strong>$50–$90</strong> paid courses.</p>`,
      courseThumbnail: thumb("oBt53YbR9Kk"),
      coursePrice: 79.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_dsa2_1",
          chapterOrder: 1,
          chapterTitle: "Dynamic programming — full course",
          chapterContent: (() => {
            const l = L("cur_dsa2");
            return [
              l(
                "oBt53YbR9Kk",
                "Dynamic Programming — Learn to Solve Algorithmic Problems & Coding Challenges",
                310,
                true
              ),
            ];
          })(),
        },
        {
          chapterId: "ch_cur_dsa2_2",
          chapterOrder: 2,
          chapterTitle: "DP with visuals",
          chapterContent: (() => {
            const l = L("cur_dsa2b");
            return [l("66hDgWottdA", "Learn Dynamic Programming Through Dynamic Visuals", 120, true)];
          })(),
        },
        {
          chapterId: "ch_cur_dsa2_3",
          chapterOrder: 3,
          chapterTitle: "DP techniques in Java",
          chapterContent: (() => {
            const l = L("cur_dsa2c");
            return [l("oFkDldu3C_4", "Learn Dynamic Programming Techniques in Java", 180, true)];
          })(),
        },
      ],
    },

    // ─── Data science (2) ─────────────────────────────────────────────────
    {
      courseTitle: "Python for Data Science — NumPy, Pandas & Matplotlib (Free · YouTube)",
      courseDescription: `<p>Long-form <strong>Python data science</strong> course comparable to <strong>$60–$100</strong> intro specials — pandas, numpy, visualization.</p>`,
      courseThumbnail: thumb("LHBE6Q9XlzI"),
      coursePrice: 84.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_ds1_1",
          chapterOrder: 1,
          chapterTitle: "Python data science — full beginner course",
          chapterContent: (() => {
            const l = L("cur_ds1");
            return [l("LHBE6Q9XlzI", "Python Data Science — 12 Hour Beginner Course", 720, true)];
          })(),
        },
        {
          chapterId: "ch_cur_ds1_2",
          chapterOrder: 2,
          chapterTitle: "Pandas deep dive (follow-along)",
          chapterContent: (() => {
            const l = L("cur_ds1b");
            return [l("2uvysYbKdjM", "Complete Python Pandas Data Science Tutorial", 95, true)];
          })(),
        },
      ],
    },
    {
      courseTitle: "Data Science & Analytics — Projects & EDA (Free · YouTube)",
      courseDescription: `<p>Project-oriented analytics (EDA, BI-style workflows) — similar to applied data science courses on marketplaces.</p>`,
      courseThumbnail: thumb("FTpmwX94_Yo"),
      coursePrice: 72.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_ds2_1",
          chapterOrder: 1,
          chapterTitle: "Hands-on data science projects",
          chapterContent: (() => {
            const l = L("cur_ds2");
            return [l("FTpmwX94_Yo", "Python Data Science — EDA, AB Testing & BI Projects", 330, true)];
          })(),
        },
        {
          chapterId: "ch_cur_ds2_2",
          chapterOrder: 2,
          chapterTitle: "Data analysis refresher",
          chapterContent: (() => {
            const l = L("cur_ds2b");
            return [l("CMEWVn1uZpQ", "Learn Python for Data Science — Full Course for Beginners", 600, true)];
          })(),
        },
      ],
    },

    // ─── AI / ML (2) ───────────────────────────────────────────────────────
    {
      courseTitle: "Machine Learning for Everybody (Free · YouTube)",
      courseDescription: `<p>Accessible <strong>ML foundations</strong> — supervised/unsupervised ideas, classic models, and intro neural nets (typical <strong>$40–$60</strong> intro ML courses).</p>`,
      courseThumbnail: thumb("i_LwzRVP7bg"),
      coursePrice: 59.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_ml1_1",
          chapterOrder: 1,
          chapterTitle: "ML for everybody — full course",
          chapterContent: (() => {
            const l = L("cur_ml1");
            return [l("i_LwzRVP7bg", "Machine Learning for Everybody — Full Course", 120, true)];
          })(),
        },
        {
          chapterId: "ch_cur_ml1_2",
          chapterOrder: 2,
          chapterTitle: "Neural networks intuition",
          chapterContent: (() => {
            const l = L("cur_ml1b");
            return [l("aircAruvnKk", "But what is a neural network? — Deep learning, chapter 1", 20, true)];
          })(),
        },
      ],
    },
    {
      courseTitle: "Machine Learning with Python — 10 Hour Course (Free · YouTube)",
      courseDescription: `<p>Broad <strong>Python ML</strong> survey (regression, classification, trees, clustering) — comparable to long introductory ML bootcamps.</p>`,
      courseThumbnail: thumb("NWONeJKn6kc"),
      coursePrice: 89.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_ml2_1",
          chapterOrder: 1,
          chapterTitle: "ML with Python — complete workshop",
          chapterContent: (() => {
            const l = L("cur_ml2");
            return [l("NWONeJKn6kc", "Machine Learning with Python — Full Course", 600, true)];
          })(),
        },
        {
          chapterId: "ch_cur_ml2_2",
          chapterOrder: 2,
          chapterTitle: "ML in 2024 — roadmap & practice",
          chapterContent: (() => {
            const l = L("cur_ml2b");
            return [l("bmmQA8A-yUA", "Machine Learning in 2024 — Beginner's Course", 260, true)];
          })(),
        },
      ],
    },

    // ─── Cybersecurity (2) ─────────────────────────────────────────────────
    {
      courseTitle: "CS50’s Introduction to Cybersecurity — Harvard (Free · YouTube)",
      courseDescription: `<p>University-grade <strong>security fundamentals</strong> (accounts, data, systems, software, privacy). Comparable to premium intro security courses.</p>`,
      courseThumbnail: thumb("9HOpanT0GRs"),
      coursePrice: 99.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_cy1_1",
          chapterOrder: 1,
          chapterTitle: "Harvard CS50 Cybersecurity — full lecture series",
          chapterContent: (() => {
            const l = L("cur_cy1");
            return [l("9HOpanT0GRs", "CS50’s Introduction to Cybersecurity — Full Course", 465, true)];
          })(),
        },
      ],
    },
    {
      courseTitle: "Cybersecurity & Ethical Hacking with Kali Linux (Free · YouTube)",
      courseDescription: `<p>Hands-on <strong>Kali Linux</strong> intro — tools, scanning, Wi‑Fi &amp; lab-style demos (similar to practical ethical hacking courses online).</p>`,
      courseThumbnail: thumb("ug8W0sFiVJo"),
      coursePrice: 64.99,
      discount: 100,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_cur_cy2_1",
          chapterOrder: 1,
          chapterTitle: "Kali Linux & ethical hacking — full beginner course",
          chapterContent: (() => {
            const l = L("cur_cy2");
            return [l("ug8W0sFiVJo", "Cybersecurity and Ethical Hacking with Kali Linux", 240, true)];
          })(),
        },
      ],
    },
  ];
}

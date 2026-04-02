import React, { useState } from "react";

/* =====================================================
   LMS DATA — BACKEND READY
===================================================== */

const COURSES = [
  {
    id: 1,
    title: "AI & Data Foundations",
    description: "Core concepts of AI, ML and data-driven thinking",
    progress: 42,
    modules: [
      {
        id: 11,
        title: "Introduction to AI",
        completed: true,
        lessons: [
          "What is Artificial Intelligence?",
          "History of AI",
          "Types of AI",
          "AI vs ML vs DL",
          "Applications of AI",
          "Ethical Considerations",
          "AI in Industry"
        ]
      },
      {
        id: 12,
        title: "Python Basics",
        completed: true,
        lessons: [
          "Python Syntax",
          "Variables & Data Types",
          "Control Flow",
          "Functions",
          "Lists & Tuples",
          "Dictionaries",
          "Mini Coding Exercises"
        ]
      },
      {
        id: 13,
        title: "Data Handling",
        completed: false,
        lessons: [
          "NumPy Arrays",
          "Pandas DataFrames",
          "Data Cleaning",
          "Missing Values",
          "Data Transformation",
          "Exploratory Analysis",
          "Hands-on Lab"
        ]
      }
    ]
  },

  {
    id: 2,
    title: "SQL & Databases",
    description: "Structured querying and database fundamentals",
    progress: 28,
    modules: [
      {
        id: 21,
        title: "SQL Basics",
        completed: false,
        lessons: [
          "What is SQL?",
          "SELECT Queries",
          "WHERE & Filters",
          "ORDER BY",
          "LIMIT & OFFSET",
          "Practice Queries",
          "Quiz"
        ]
      },
      {
        id: 22,
        title: "Joins & Relationships",
        completed: false,
        lessons: [
          "Primary & Foreign Keys",
          "INNER JOIN",
          "LEFT & RIGHT JOIN",
          "FULL JOIN",
          "Self Join",
          "Case Studies",
          "Assignments"
        ]
      }
    ]
  },

  {
    id: 3,
    title: "Power BI & Data Visualization",
    description: "Transform raw data into meaningful insights",
    progress: 0,
    modules: [
      {
        id: 31,
        title: "Power BI Fundamentals",
        completed: false,
        lessons: [
          "Power BI Interface Overview",
          "Connecting to Data Sources",
          "Data Modeling Basics",
          "Relationships",
          "Calculated Columns & Measures",
          "Visual Types",
          "Hands-on Dashboard Lab"
        ]
      }
    ]
  },

  {
    id: 4,
    title: "Machine Learning Essentials",
    description: "Algorithms and real-world ML workflows",
    progress: 0,
    modules: [
      {
        id: 41,
        title: "Supervised Learning",
        completed: false,
        lessons: [
          "What is Supervised Learning?",
          "Regression Algorithms",
          "Classification Algorithms",
          "Model Evaluation Metrics",
          "Overfitting & Underfitting",
          "Mini Project",
          "Assessment Quiz"
        ]
      }
    ]
  },

  {
    id: 5,
    title: "Career & Placement Readiness",
    description: "Resume, interviews and industry preparation",
    progress: 12,
    modules: [
      {
        id: 51,
        title: "Resume & Interview Preparation",
        completed: false,
        lessons: [
          "Resume Structure & Formatting",
          "ATS Optimization Techniques",
          "LinkedIn Profile Building",
          "HR Interview Questions",
          "Technical Interview Strategy",
          "Mock Interview Session",
          "Industry Expectations"
        ]
      }
    ]
  }
];


/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function StudyMaterial() {
  const [openCourse, setOpenCourse] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [hoveredHeader, setHoveredHeader] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);

  const toggleModule = (courseId, moduleId) => {
    setOpenModules(prev => ({
      ...prev,
      [courseId]: prev[courseId] === moduleId ? null : moduleId
    }));
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h2 style={headerTitle}>Study Material</h2>
        <p style={headerSub}>
          Progress through courses sequentially to unlock advanced modules and build placement-ready skills.
        </p>
      </div>

      {/* COURSES */}
      <div style={courseGrid}>
        {COURSES.map(course => {
          const expanded = openCourse === course.id;
          const isHovered = hoveredCourse === course.id;
          const isHeaderHovered = hoveredHeader === course.id;

          return (
            <div 
              key={course.id}
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
              style={{
                ...courseCard,
                ...(isHovered ? {
                  boxShadow: "0 4px 16px rgba(80,60,180,0.08)",
                  borderColor: "#a5b4fc"
                } : {})
              }}
            >
              {/* COURSE HEADER */}
              <div
                onMouseEnter={() => setHoveredHeader(course.id)}
                onMouseLeave={() => setHoveredHeader(null)}
                style={{
                  ...courseHeader,
                  ...(isHeaderHovered ? {
                    background: "#f5f5f7"
                  } : {})
                }}
                onClick={() =>
                  setOpenCourse(expanded ? null : course.id)
                }
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                aria-label={`${course.title}. ${course.progress}% complete. Click to ${expanded ? 'collapse' : 'expand'} modules.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenCourse(expanded ? null : course.id);
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={courseTitleRow}>
                    <h3 style={courseTitle}>{course.title}</h3>
                    <span style={expandIcon(expanded)}>▼</span>
                  </div>
                  <p style={courseDesc}>{course.description}</p>

                  {/* PROGRESS BAR */}
                  <div style={progressContainer}>
                    <div style={progressBarBg}>
                      <div
                        style={{
                          ...progressBarFill,
                          width: `${course.progress}%`
                        }}
                      />
                    </div>
                    <span style={progressText}>{course.progress}% completed</span>
                  </div>
                </div>

                <span style={progressBadge}>
                  {course.progress}%
                </span>
              </div>

              {/* MODULES */}
              {expanded && (
                <div style={moduleWrap}>
                  {course.modules.map(module => {
                    const moduleOpen =
                      openModules[course.id] === module.id;
                    const moduleKey = `${course.id}-${module.id}`;
                    const isModuleHovered = hoveredModule === moduleKey;

                    return (
                      <div 
                        key={module.id} 
                        style={{
                          ...moduleCard,
                          ...(module.completed ? moduleCardCompleted : {})
                        }}
                      >
                        <div
                          onMouseEnter={() => setHoveredModule(moduleKey)}
                          onMouseLeave={() => setHoveredModule(null)}
                          style={{
                            ...moduleHeader,
                            ...(isModuleHovered ? {
                              background: module.completed ? "#ecfdf5" : "#fafafa"
                            } : {})
                          }}
                          onClick={() =>
                            toggleModule(course.id, module.id)
                          }
                          role="button"
                          tabIndex={0}
                          aria-expanded={moduleOpen}
                          aria-label={`${module.title}. ${module.completed ? 'Completed' : 'In progress'}. Click to ${moduleOpen ? 'collapse' : 'expand'} lessons.`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleModule(course.id, module.id);
                            }
                          }}
                        >
                          <div style={moduleTitleRow}>
                            <span style={moduleStatus(module.completed)}>
                              {module.completed ? '✓' : '○'}
                            </span>
                            <strong style={moduleTitle}>{module.title}</strong>
                          </div>
                          <span
                            style={{
                              transform: moduleOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s",
                              fontSize: 14,
                              color: "#6b7280"
                            }}
                          >
                            ▼
                          </span>
                        </div>

                        {moduleOpen && (
                          <div style={lessonList}>
                            {module.lessons.map((l, i) => (
                              <LessonItem
                                key={i}
                                title={l}
                                unlocked={
                                  module.completed || i === 0
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={tip}>
        <span role="img" aria-label="info" style={{ marginRight: 8 }}>💡</span>
        Complete lessons sequentially to unlock advanced modules. Consistent progress improves placement readiness.
      </div>
    </div>
  );
}

/* =====================================================
   SUB COMPONENTS
===================================================== */

function LessonItem({ title, unlocked }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => unlocked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...lessonRow,
        ...(unlocked ? {} : lessonRowLocked),
        ...(unlocked && isHovered ? {
          background: "#f5f3ff",
          borderColor: "#c4b5fd",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(124,58,237,0.12)"
        } : {}),
        cursor: unlocked ? "pointer" : "not-allowed"
      }}
      role={unlocked ? "button" : undefined}
      tabIndex={unlocked ? 0 : undefined}
      aria-label={`${title}. ${unlocked ? 'Available' : 'Locked - complete previous lessons first'}`}
      onKeyDown={(e) => {
        if (unlocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          // Lesson click handler would go here
        }
      }}
    >
      <div style={lessonLeft}>
        <span style={lessonDot(unlocked)}>
          {unlocked ? '' : '🔒'}
        </span>
        <span style={{ fontSize: 14, color: unlocked ? "#334155" : "#9ca3af" }}>{title}</span>
      </div>
      <span style={lessonStatus(unlocked)}>
        {unlocked ? "Available" : "Locked"}
      </span>
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const page = { padding: 32, maxWidth: 1200, margin: "0 auto" };
const header = { marginBottom: 32 };

const headerTitle = {
  fontSize: 26,
  fontWeight: 800,
  color: "#1e293b",
  margin: 0,
  letterSpacing: -0.5
};

const headerSub = {
  fontSize: 15,
  color: "#475569",
  marginTop: 10,
  fontWeight: 500,
  maxWidth: 520
};

const courseGrid = {
  display: "flex",
  flexDirection: "column",
  gap: 22
};

const courseCard = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  overflow: "hidden",
  boxShadow: "0 1px 4px rgba(80,60,180,0.02)",
  transition: "box-shadow .18s, border-color .18s"
};

const courseHeader = {
  padding: 22,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  cursor: "pointer",
  background: "#f9fafb",
  transition: "background .15s ease"
};

const courseTitleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6
};

const courseTitle = {
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  color: "#1e293b",
  letterSpacing: -0.3
};

const courseDesc = {
  fontSize: 14,
  color: "#64748b",
  margin: "4px 0 12px 0",
  lineHeight: 1.5
};

const expandIcon = (expanded) => ({
  fontSize: 16,
  color: "#6b7280",
  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.2s"
});

const progressContainer = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginTop: 8
};

const progressBarBg = {
  flex: 1,
  height: 8,
  background: "#e5e7eb",
  borderRadius: 6
};

const progressBarFill = {
  height: "100%",
  background: "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
  borderRadius: 6,
  transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
  boxShadow: "0 0 8px rgba(124,58,237,0.2)"
};

const progressText = {
  fontSize: 13,
  color: "#6b7280",
  fontWeight: 600,
  minWidth: 100
};

const progressBadge = {
  background: "#f3f4f6",
  color: "#334155",
  fontWeight: 700,
  borderRadius: 999,
  padding: "8px 16px",
  fontSize: 15,
  border: "1px solid #e5e7eb",
  minWidth: 60,
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
};

const moduleWrap = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  background: "#fafafa"
};

const moduleCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
};

const moduleCardCompleted = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0"
};

const moduleHeader = {
  padding: "14px 18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  background: "#fff",
  transition: "background .15s ease"
};

const moduleTitleRow = {
  display: "flex",
  alignItems: "center",
  gap: 10
};

const moduleTitle = {
  fontSize: 15,
  fontWeight: 700,
  color: "#1e293b"
};

const moduleStatus = (completed) => ({
  fontSize: 16,
  fontWeight: 700,
  color: completed ? "#22c55e" : "#cbd5e1"
});

const lessonList = {
  padding: "12px 18px 16px 18px",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  background: "#f9fafb"
};

const lessonRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  borderRadius: 8,
  background: "#fff",
  border: "1px solid #e5e7eb",
  fontSize: 14,
  transition: "all .2s cubic-bezier(.4,0,.2,1)"
};

const lessonRowLocked = {
  background: "#fafafa",
  borderColor: "#f3f4f6",
  opacity: 0.6
};

const lessonLeft = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flex: 1
};

const lessonDot = unlocked => ({
  minWidth: 10,
  height: 10,
  borderRadius: "50%",
  background: unlocked ? "#7c3aed" : "transparent",
  fontSize: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

const lessonStatus = unlocked => ({
  fontSize: 12,
  fontWeight: 700,
  color: unlocked ? "#7c3aed" : "#9ca3af",
  background: unlocked ? "#f5f3ff" : "#f3f4f6",
  padding: "5px 14px",
  borderRadius: 999,
  minWidth: 78,
  textAlign: "center",
  border: unlocked ? "1px solid #e9d5ff" : "1px solid #e5e7eb",
  letterSpacing: 0.3
});

const tip = {
  marginTop: 36,
  background: "#f0fdf4",
  padding: 20,
  borderRadius: 14,
  fontWeight: 600,
  color: "#047857",
  borderLeft: "6px solid #10b981",
  fontSize: 15,
  lineHeight: 1.6
};

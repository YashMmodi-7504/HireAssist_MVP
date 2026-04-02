// ===================== REMOVE ACTION =====================
function RemoveAction({ enroll, name, isLeader, isCurrentUser, canRemove, onRemove, submitted }) {
  const [hovered, setHovered] = useState(false);
  // Disabled if not allowed to remove
  const disabled = submitted || !canRemove;
  return (
    <span
      style={{
        ...removeIcon,
        ...(hovered && !disabled ? removeIconHover : {}),
        ...(disabled ? removeIconDisabled : {})
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Remove team member"
      title={disabled ? "Cannot remove after submission" : "Remove member"}
      onClick={disabled ? undefined : onRemove}
      onKeyDown={e => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onRemove();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: 18, fontWeight: 700, pointerEvents: "none" }}>✕</span>
    </span>
  );
}

// Minimal styles for remove icon and confirmation UI
const removeIcon = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "50%",
  fontSize: 18,
  color: "#64748b",
  background: "transparent",
  cursor: "pointer",
  transition: "background .15s, color .15s, opacity .15s",
  outline: "none",
  marginLeft: 8,
  position: "relative"
};
const removeIconHover = {
  background: "#fee2e2",
  color: "#dc2626"
};
const removeIconDisabled = {
  opacity: 0.5,
  cursor: "not-allowed"
};
const confirmRow = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 10,
  padding: "14px 18px",
  margin: "10px 0"
};
const confirmBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 18px",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  marginRight: 6,
  transition: "background .15s"
};
const cancelBtn = {
  background: "#f3f4f6",
  color: "#374151",
  border: "none",
  borderRadius: 8,
  padding: "8px 18px",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  transition: "background .15s"
};
import React, { useState, useMemo, useRef, useEffect } from "react";

/* =====================================================
   CAPSTONE PROJECT – ENTERPRISE LMS MODULE
===================================================== */

/* ===================== STUDENT MASTER ===================== */

const STUDENTS = [
  { name: "Yash Modi", enroll: "220090107001" },
  { name: "Praful Bhoyar", enroll: "220090107002" },
  { name: "Nikhil Bansal", enroll: "220090107003" },
  { name: "Aarav Sharma", enroll: "220090107004" },
  { name: "Rohan Mehta", enroll: "220090107005" },
  { name: "Sanya Patel", enroll: "220090107006" },
  { name: "Kunal Verma", enroll: "220090107007" },
  { name: "Neha Joshi", enroll: "220090107008" },
  { name: "Aditya Singh", enroll: "220090107009" },
  { name: "Isha Desai", enroll: "220090107010" },
  { name: "Rahul Khanna", enroll: "220090107011" },
  { name: "Pooja Nair", enroll: "220090107012" },
  { name: "Amit Kulkarni", enroll: "220090107013" },
  { name: "Sneha Iyer", enroll: "220090107014" },
  { name: "Vivek Pandey", enroll: "220090107015" },       
  { name: "Ritika Shah", enroll: "220090107016" },
  { name: "Mohit Agarwal", enroll: "220090107017" },
  { name: "Ananya Rao", enroll: "220090107018" },
  { name: "Harsh Jain", enroll: "220090107019" },
  { name: "Kriti Malhotra", enroll: "220090107020" },

  { name: "Manav Kapoor", enroll: "220090107021" },
  { name: "Simran Kaur", enroll: "220090107022" },
  { name: "Rishabh Mishra", enroll: "220090107023" },
  { name: "Tanvi Choudhary", enroll: "220090107024" },
  { name: "Arjun Reddy", enroll: "220090107025" },
  { name: "Naina Gupta", enroll: "220090107026" },
  { name: "Saurabh Yadav", enroll: "220090107027" },
  { name: "Palak Arora", enroll: "220090107028" },
  { name: "Shubham Tiwari", enroll: "220090107029" },
  { name: "Ayesha Khan", enroll: "220090107030" },
  { name: "Dev Patel", enroll: "220090107031" },
  { name: "Kavya Joshi", enroll: "220090107032" },
  { name: "Akash Verma", enroll: "220090107033" },
  { name: "Rhea Sengupta", enroll: "220090107034" },
  { name: "Varun Malhotra", enroll: "220090107035" },
  { name: "Pankaj Soni", enroll: "220090107036" },
  { name: "Ishita Banerjee", enroll: "220090107037" },
  { name: "Siddharth Roy", enroll: "220090107038" },
  { name: "Komal Solanki", enroll: "220090107039" },
  { name: "Naveen Chandra", enroll: "220090107040" },

  { name: "Rajat Saxena", enroll: "230090107041" },
  { name: "Muskan Jain", enroll: "230090107042" },
  { name: "Ayush Tripathi", enroll: "230090107043" },
  { name: "Bhavya Goyal", enroll: "230090107044" },
  { name: "Karan Oberoi", enroll: "230090107045" },
  { name: "Mehul Shah", enroll: "230090107046" },
  { name: "Shreya Kulkarni", enroll: "230090107047" },
  { name: "Lakshya Bhatia", enroll: "230090107048" },
  { name: "Tanya Mathur", enroll: "230090107049" },
  { name: "Ankit Rawat", enroll: "230090107050" },
  { name: "Pallavi Deshpande", enroll: "230090107051" },
  { name: "Rohini Patil", enroll: "230090107052" },
  { name: "Yuvraj Singh", enroll: "230090107053" },
  { name: "Chirag Doshi", enroll: "230090107054" },
  { name: "Nidhi Saxena", enroll: "230090107055" },
  { name: "Parth Vora", enroll: "230090107056" },
  { name: "Sonal Mehra", enroll: "230090107057" },
  { name: "Hemant Kapse", enroll: "230090107058" },
  { name: "Divya Shetty", enroll: "230090107059" },
  { name: "Om Prakash", enroll: "230090107060" },

  { name: "Aakash Nanda", enroll: "230090107061" },
  { name: "Rupal Trivedi", enroll: "230090107062" },
  { name: "Nitesh Parmar", enroll: "230090107063" },
  { name: "Kushal Naik", enroll: "230090107064" },
  { name: "Payal Joshi", enroll: "230090107065" },
  { name: "Deepak Yadav", enroll: "230090107066" },
  { name: "Shruti Kulshreshtha", enroll: "230090107067" },
  { name: "Abhinav Shukla", enroll: "230090107068" },
  { name: "Mitali Ghosh", enroll: "230090107069" },
  { name: "Sagar Pawar", enroll: "230090107070" }
];


/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function CapstoneProject() {

  // Core team formation state
  const [members, setMembers] = useState([]);
  const [leaderEnroll, setLeaderEnroll] = useState(null);
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evaluationStatus, setEvaluationStatus] = useState("Pending");
  // Simulated current user - in production, this would come from auth context
  // For demo: assume first team member added is the current logged-in user
  const [currentUserEnroll, setCurrentUserEnroll] = useState(null);
  // Remove confirmation state
  const [pendingRemove, setPendingRemove] = useState(null); // enroll of member to confirm removal
  // Check if current user is the team leader
  const isCurrentUserLeader = currentUserEnroll && leaderEnroll === currentUserEnroll;
  const canUpload = isCurrentUserLeader || members.length === 0; // Allow upload if leader or for demo purposes
  const dropdownRef = useRef(null);
  // Remove member function
  function removeMember(enroll) {
    // Do not allow removal after submission
    if (submitted) return;
    const memberToRemove = members.find(m => m.enroll === enroll);
    if (!memberToRemove) return;
    let newMembers = members.filter(m => m.enroll !== enroll);
    // If removing leader, auto-select new leader if possible
    if (leaderEnroll === enroll) {
      setLeaderEnroll(newMembers.length > 0 ? newMembers[0].enroll : null);
    }
    // If removing current user, reset leader and permissions
    if (currentUserEnroll === enroll) {
      setCurrentUserEnroll(null);
      setLeaderEnroll(newMembers.length > 0 ? newMembers[0].enroll : null);
    }
    setMembers(newMembers);
    setPendingRemove(null);
  }

  /* ===================== CLOSE DROPDOWN ===================== */
  useEffect(() => {
    function close(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ===================== AVAILABLE STUDENTS ===================== */
  const availableStudents = useMemo(() => {
    const used = new Set(members.map(m => m.enroll));
    return STUDENTS.filter(s => !used.has(s.enroll));
  }, [members]);

  const suggestions = useMemo(() => {
    if (!openDropdown) return [];
    if (!search) return availableStudents;
    return availableStudents.filter(
      s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.enroll.includes(search)
    );
  }, [search, availableStudents, openDropdown]);

  function addMember(student) {
    setMembers(prev => [...prev, student]);
    // Set first member as current user and auto-assign as leader
    if (members.length === 0) {
      setCurrentUserEnroll(student.enroll);
      setLeaderEnroll(student.enroll);
    }
    setSearch("");
    setOpenDropdown(false);
  }

  /* ===================== TEAM ORDER ===================== */
  const team = useMemo(() => {
    const leader = members.find(m => m.enroll === leaderEnroll);
    const rest = members.filter(m => m.enroll !== leaderEnroll);
    return leader
      ? [{ ...leader, role: "Leader" }, ...rest.map(m => ({ ...m, role: "Member" }))]
      : [];
  }, [members, leaderEnroll]);

  /* ===================== SUBMISSION ===================== */
  function submitProject() {
    if (!leaderEnroll || members.length === 0) return;
    setSubmitted(true);
    setEvaluationStatus("In Review");
  }

  function completeEvaluation() {
    setEvaluationStatus("Completed");
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div style={page}>
      <header style={header}>
        <h2 style={headerTitle}>Capstone Project</h2>
        <p style={headerSub}>
          Industry-level team project with structured evaluation and certification pathway.
        </p>
      </header>

      {/* Project Context Banner */}
      {members.length === 0 && (
        <div style={guideBanner}>
          <span style={{ fontSize: 20, marginRight: 10 }}>💡</span>
          <div>
            <strong style={{ display: 'block', marginBottom: 4 }}>Getting Started</strong>
            <span>Form your team (2-5 members), select a leader, submit deliverables, and track evaluation progress.</span>
          </div>
        </div>
      )}

      {/* ================= TEAM FORMATION ================= */}
      <section style={card}>
        <h3 style={sectionTitle}>Team Formation</h3>

        {/* SIDE-BY-SIDE: ADD MEMBER + SELECT LEADER */}
        <div style={formationRow}>
          {/* ADD TEAM MEMBER */}
          <div style={formationCol} ref={dropdownRef}>
            <label style={label}>
              <span>Add Team Member</span>
              <span style={optionalBadge}>Search & Add</span>
            </label>
            <input
              style={searchInput}
              placeholder="Type name or enrollment number..."
              value={search}
              onFocus={() => setOpenDropdown(true)}
              onChange={e => {
                setSearch(e.target.value);
                setOpenDropdown(true);
              }}
              aria-label="Search for team members"
            />

            {openDropdown && suggestions.length > 0 && (
              <div style={dropdown}>
                {suggestions.map(s => (
                  <DropdownItem
                    key={s.enroll}
                    student={s}
                    onAdd={() => addMember(s)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* TEAM LEADER SELECTION */}
          {members.length > 0 && (
            <div style={formationCol}>
              <label style={label}>
                <span>Team Leader</span>
                <span style={leaderBadge}>👑 Required</span>
              </label>
              <select
                style={leaderSelect}
                value={leaderEnroll || ""}
                onChange={e => setLeaderEnroll(e.target.value)}
                aria-label="Select team leader"
              >
                <option value="" disabled>Choose team leader...</option>
                {members.map(m => (
                  <option key={m.enroll} value={m.enroll}>
                    {m.name} ({m.enroll})
                  </option>
                ))}
              </select>
              <p style={helperText}>
                📌 Leader coordinates submissions and has upload permissions.
              </p>
            </div>
          )}
        </div>

        {/* TEAM TABLE */}
        {members.length > 0 && (
          <div style={teamHeader}>
            <strong>Team Roster</strong>
            <span style={teamCount}>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
          </div>
        )}
        <div style={table}>
          <div style={{ ...thead, gridTemplateColumns: "2.2fr 1.3fr 1fr 1.2fr 0.7fr" }}>
            <span>Name</span>
            <span>Enrollment</span>
            <span>Role</span>
            <span>Status</span>
            <span></span>
          </div>
          {team.length === 0 ? (
            <div style={emptyState}>
              <span style={{ fontSize: 32, opacity: 0.3 }}>👥</span>
              <p style={{ margin: "8px 0 0 0", color: "#9ca3af" }}>No team members yet. Start by adding members above.</p>
            </div>
          ) : (
            team.map((m, i) => {
              const canRemove = !submitted && team.length > 1;
              return (
                <div key={i} style={{ ...row(m.role === "Leader"), gridTemplateColumns: "2.2fr 1.3fr 1fr 1.2fr 0.7fr" }}>
                  <div style={{ fontWeight: m.role === "Leader" ? 700 : 400 }}>
                    {m.role === "Leader" && "👑 "} {m.name}
                  </div>
                  <div style={mono}>{m.enroll}</div>
                  <div>
                    <span style={m.role === "Leader" ? leaderPill : memberPill}>
                      {m.role}
                    </span>
                  </div>
                  <div>
                    <span style={statusPill}>Notified on LMS</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <RemoveAction
                      enroll={m.enroll}
                      name={m.name}
                      isLeader={m.role === "Leader"}
                      isCurrentUser={currentUserEnroll === m.enroll}
                      canRemove={canRemove}
                      onRemove={() => setPendingRemove(m.enroll)}
                      submitted={submitted}
                    />
                  </div>
                </div>
              );
            })
          )}
          {/* Inline confirmation UI */}
          {pendingRemove && (() => {
            const member = members.find(m => m.enroll === pendingRemove);
            if (!member) return null;
            return (
              <div style={confirmRow}>
                <span style={{ fontWeight: 700, color: "#dc2626" }}>Remove {member.name} ({member.enroll})?</span>
                <button
                  style={confirmBtn}
                  onClick={() => removeMember(member.enroll)}
                  aria-label={`Confirm remove ${member.name}`}
                >Confirm</button>
                <button
                  style={cancelBtn}
                  onClick={() => setPendingRemove(null)}
                  aria-label="Cancel removal"
                >Cancel</button>
              </div>
            );
          })()}
        </div>

      </section>

      {/* ================= SUBMISSION ================= */}
      <section style={card}>
        <div style={submissionHeader}>
          <div>
            <h3 style={sectionTitle}>Project Submission</h3>
            {leaderEnroll && (
              <div style={leaderIndicator}>
                <span>👑</span>
                <span>Only <strong>{members.find(m => m.enroll === leaderEnroll)?.name}</strong> (Team Leader) can upload files</span>
              </div>
            )}
          </div>
        </div>
        
        {!submitted && (
          <div style={submissionGuide}>
            <strong>📋 Submission Requirements</strong>
            <ul style={requirementList}>
              <li>Source code with README.md documentation</li>
              <li>Project presentation (10-15 slides)</li>
              <li>Technical report (minimum 10 pages)</li>
            </ul>
          </div>
        )}

        <div style={uploadGrid}>
          <Upload 
            label="Source Code" 
            accept=".zip" 
            required={true}
            disabled={!canUpload}
            lockedReason={!canUpload ? "Only team leader can upload" : null}
          />
          <Upload 
            label="Presentation" 
            accept=".pdf, .pptx" 
            required={true}
            disabled={!canUpload}
            lockedReason={!canUpload ? "Only team leader can upload" : null}
          />
          <Upload 
            label="Project Report" 
            accept=".pdf" 
            required={true}
            disabled={!canUpload}
            lockedReason={!canUpload ? "Only team leader can upload" : null}
          />
        </div>

        <button
          onClick={submitProject}
          disabled={!leaderEnroll || submitted || members.length === 0 || !canUpload}
          style={{
            ...submitBtn,
            opacity: (!leaderEnroll || submitted || members.length === 0 || !canUpload) ? 0.6 : 1,
            cursor: (!leaderEnroll || submitted || members.length === 0 || !canUpload) ? 'not-allowed' : 'pointer'
          }}
          aria-label={submitted ? "Project already submitted" : "Submit capstone project"}
        >
          {submitted ? "✓ Project Submitted" : "Submit Capstone Project"}
        </button>
        
        {!leaderEnroll && members.length > 0 && (
          <p style={warningText}>Please select a team leader before submitting.</p>
        )}
        {!canUpload && !submitted && members.length > 0 && (
          <p style={warningText}>🔒 You must be the team leader to upload and submit files.</p>
        )}
      </section>

      {/* ================= STATUS ================= */}
      <section style={card}>
        <h3 style={sectionTitle}>Evaluation Status</h3>

        {/* Progress Timeline */}
        <div style={timeline}>
          <TimelineStep 
            title="Submission" 
            completed={submitted} 
            active={!submitted}
            icon="📝"
          />
          <TimelineStep 
            title="Review" 
            completed={evaluationStatus === "Completed"} 
            active={evaluationStatus === "In Review"}
            icon="🔍"
          />
          <TimelineStep 
            title="Result" 
            completed={evaluationStatus === "Completed"} 
            active={false}
            icon="🎓"
          />
        </div>

        <div style={statusGrid}>
          <Status 
            title="Submission" 
            value={submitted ? "Submitted" : "Pending"}
            status={submitted ? "success" : "pending"}
          />
          <Status 
            title="Review" 
            value={evaluationStatus}
            status={evaluationStatus === "In Review" ? "active" : evaluationStatus === "Completed" ? "success" : "pending"}
          />
          <Status 
            title="Result" 
            value={evaluationStatus === "Completed" ? "Passed" : "—"}
            status={evaluationStatus === "Completed" ? "success" : "pending"}
          />
        </div>

        {evaluationStatus === "In Review" && (
          <button style={completeBtn} onClick={completeEvaluation}>
            Mark Evaluation as Completed (Faculty Only)
          </button>
        )}
        
        {evaluationStatus === "Completed" && (
          <div style={successBanner}>
            <span style={{ fontSize: 20, marginRight: 10 }}>🎉</span>
            <div>
              <strong style={{ display: 'block', marginBottom: 4 }}>Congratulations!</strong>
              <span>Your capstone project has been evaluated and approved. Certificate will be issued shortly.</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ===================== SMALL COMPONENTS ===================== */

function DropdownItem({ student, onAdd }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      style={{
        ...dropdownItem,
        ...(isHovered ? dropdownItemHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onAdd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onAdd();
        }
      }}
    >
      <div>
        <strong style={{ color: "#1e293b" }}>{student.name}</strong>
        <div style={muted}>{student.enroll}</div>
      </div>
      <span style={add}>＋</span>
    </div>
  );
}

function Upload({ label, accept, required, disabled, lockedReason }) {
  const [fileName, setFileName] = useState("");
  
  return (
    <div style={{
      ...uploadBox,
      ...(disabled ? uploadBoxDisabled : {})
    }}>
      <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <strong style={{ color: disabled ? "#9ca3af" : "#1e293b" }}>{label}</strong>
        {required && <span style={requiredBadge}>Required</span>}
        {disabled && <span style={lockedBadge}>🔒 Locked</span>}
      </div>
      
      <input 
        type="file" 
        accept={accept}
        style={{
          ...fileInput,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files[0]) {
            setFileName(e.target.files[0].name);
          }
        }}
      />
      
      {disabled && lockedReason && (
        <div style={lockedMessage}>
          <span style={{ fontSize: 12 }}>⚠️</span>
          <span>{lockedReason}</span>
        </div>
      )}
      
      {fileName && !disabled && (
        <div style={filePreview}>
          <span style={{ fontSize: 12 }}>📎</span>
          <span style={{ fontSize: 13, color: "#047857" }}>{fileName}</span>
        </div>
      )}
    </div>
  );
}

function Status({ title, value, status }) {
  const getStatusColor = () => {
    if (status === "success") return { bg: "#d1fae5", text: "#047857" };
    if (status === "active") return { bg: "#fef9c3", text: "#b45309" };
    return { bg: "#f3f4f6", text: "#6b7280" };
  };
  
  const colors = getStatusColor();
  
  return (
    <div style={{
      ...statusBox,
      borderColor: colors.bg,
      background: colors.bg,
      backgroundImage: status === "active" ? "linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)" : "none"
    }}>
      <div style={statusTitle}>{title}</div>
      <div style={{ ...statusValue, color: colors.text }}>{value}</div>
    </div>
  );
}

function TimelineStep({ title, completed, active, icon }) {
  return (
    <div style={timelineStep}>
      <div style={{
        ...timelineIcon,
        background: completed ? "#22c55e" : active ? "#facc15" : "#e5e7eb",
        color: completed || active ? "#fff" : "#9ca3af"
      }}>
        {icon}
      </div>
      <div style={{
        ...timelineLabel,
        color: completed || active ? "#1e293b" : "#9ca3af",
        fontWeight: active ? 700 : 600
      }}>
        {title}
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const page = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
const header = { marginBottom: 28 };

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
  maxWidth: 580
};

const guideBanner = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: "16px 20px",
  display: "flex",
  alignItems: "flex-start",
  marginBottom: 28,
  color: "#1e40af",
  fontSize: 14,
  lineHeight: 1.6
};

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 28,
  marginBottom: 28,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
};

const sectionTitle = { 
  marginBottom: 20,
  fontSize: 19,
  fontWeight: 800,
  color: "#1e293b"
};

const label = { 
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 14, 
  fontWeight: 700,
  marginBottom: 8,
  color: "#374151"
};

const formationRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 48, // More separation for enterprise look
  marginBottom: 32,
  alignItems: "start",
  minHeight: 180
};

const formationCol = {
  position: "relative",
  minWidth: 0,
  padding: "0 18px 0 0", // More right space, left flush for grid
  boxSizing: "border-box",
  background: "#f9fafb",
  borderRadius: 12,
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  transition: "box-shadow .18s, background .18s"
};

const optionalBadge = {
  fontSize: 11,
  background: "#e0e7ff",
  color: "#4338ca",
  padding: "4px 10px",
  borderRadius: 999,
  fontWeight: 700,
  lineHeight: 1
};

const leaderBadge = {
  fontSize: 11,
  background: "#fef9c3",
  color: "#b45309",
  padding: "4px 10px",
  borderRadius: 999,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 4,
  lineHeight: 1
};

const searchInput = { 
  padding: "12px 14px", 
  borderRadius: 10, 
  width: "100%",
  border: "1.5px solid #d1d5db",
  fontSize: 15,
  outline: "none",
  transition: "border-color .15s, box-shadow .15s",
  background: "#fff",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

const leaderSelect = { 
  padding: "12px 14px", 
  borderRadius: 10, 
  width: "100%",
  border: "2px solid #fbbf24",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  background: "#fffbeb",
  transition: "border-color .2s, box-shadow .2s",
  boxShadow: "0 1px 2px rgba(251,191,36,0.08)"
};

const helperText = {
  fontSize: 13,
  color: "#6b7280",
  marginTop: 8,
  marginBottom: 0,
  lineHeight: 1.5
};

const submissionHeader = {
  marginBottom: 20,
  display: "flex",
  flexDirection: "column",
  gap: 0
};

const leaderIndicator = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 16px",
  background: "#fef3c7",
  border: "1px solid #fde68a",
  borderRadius: 10,
  fontSize: 14,
  color: "#92400e",
  marginTop: 10,
  lineHeight: 1.4
};

const dropdown = {
  position: "absolute",
  width: "100%",
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginTop: 6,
  maxHeight: 280,
  overflowY: "auto",
  zIndex: 10,
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
};

const dropdownItem = {
  padding: "12px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  borderBottom: "1px solid #f3f4f6",
  transition: "background .15s, box-shadow .15s",
  borderRadius: 8,
  outline: "none"
};

const dropdownItemHover = {
  background: "#f3f4f6",
  boxShadow: "0 2px 8px rgba(59,130,246,0.08)"
};

const add = { 
  fontSize: 20, 
  color: "#4f46e5",
  fontWeight: 700
};

const muted = { 
  fontSize: 13, 
  color: "#6b7280",
  marginTop: 2
};

const teamHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 24,
  marginBottom: 12,
  fontSize: 15,
  paddingBottom: 8
};

const teamCount = {
  background: "#ede9fe",
  color: "#6d28d9",
  padding: "5px 14px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 13,
  lineHeight: 1.2
};

const table = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
};

const thead = {
  display: "grid",
  gridTemplateColumns: "2.2fr 1.3fr 1fr 1.2fr",
  padding: "14px 18px",
  background: "#f9fafb",
  fontWeight: 700,
  fontSize: 14,
  color: "#374151",
  alignItems: "center"
};

const row = isLeader => ({
  display: "grid",
  gridTemplateColumns: "2.2fr 1.3fr 1fr 1.2fr",
  padding: "14px 18px",
  background: isLeader ? "#f0f9ff" : "#fff",
  borderTop: "1px solid #e5e7eb",
  alignItems: "center",
  fontSize: 15
});

const emptyState = {
  padding: "48px 20px",
  textAlign: "center",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

const mono = { 
  fontFamily: "'Courier New', monospace", 
  fontSize: 13,
  color: "#6b7280",
  letterSpacing: -0.3
};

const leaderPill = {
  background: "#eef2ff",
  color: "#3730a3",
  padding: "5px 14px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 13,
  display: "inline-block",
  lineHeight: 1.2
};

const memberPill = {
  background: "#f1f5f9",
  color: "#475569",
  padding: "5px 14px",
  borderRadius: 999,
  fontSize: 13,
  display: "inline-block",
  lineHeight: 1.2
};

const statusPill = {
  background: "#ecfdf5",
  color: "#047857",
  padding: "5px 14px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 13,
  display: "inline-block",
  lineHeight: 1.2
};

const submissionGuide = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: 12,
  padding: "16px 20px",
  marginBottom: 24,
  fontSize: 14,
  color: "#047857",
  lineHeight: 1.6
};

const requirementList = {
  marginTop: 10,
  marginBottom: 0,
  paddingLeft: 20,
  lineHeight: 1.8
};

const uploadGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
  marginBottom: 4
};

const uploadBox = {
  border: "2px dashed #d1d5db",
  padding: 20,
  borderRadius: 12,
  background: "#fafafa",
  transition: "border-color .2s, background .2s"
};

const uploadBoxDisabled = {
  background: "#f3f4f6",
  borderColor: "#e5e7eb",
  opacity: 0.7
};

const lockedBadge = {
  fontSize: 11,
  background: "#fee2e2",
  color: "#dc2626",
  padding: "4px 10px",
  borderRadius: 999,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  lineHeight: 1
};

const lockedMessage = {
  marginTop: 10,
  padding: "8px 12px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "#dc2626",
  fontWeight: 600
};

const fileInput = {
  fontSize: 14,
  cursor: "pointer"
};

const filePreview = {
  marginTop: 10,
  padding: "8px 12px",
  background: "#d1fae5",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  gap: 8
};

const requiredBadge = {
  fontSize: 11,
  background: "#fef9c3",
  color: "#b45309",
  padding: "4px 10px",
  borderRadius: 999,
  fontWeight: 700,
  lineHeight: 1
};

const submitBtn = {
  marginTop: 24,
  padding: "16px 28px",
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  fontSize: 16,
  transition: "background .2s, transform .15s",
  boxShadow: "0 4px 12px rgba(34,197,94,0.3)"
};

const warningText = {
  marginTop: 12,
  color: "#dc2626",
  fontSize: 14,
  fontWeight: 600
};

const timeline = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "flex-start",
  marginBottom: 32,
  padding: "0 20px",
  position: "relative"
};

const timelineStep = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
  flex: 1,
  maxWidth: 180
};

const timelineIcon = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  fontWeight: 700,
  transition: "all .3s",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const timelineLabel = {
  fontSize: 13,
  fontWeight: 600
};

const statusGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 18,
  marginBottom: 20
};

const statusBox = {
  borderRadius: 14,
  padding: 20,
  border: "2px solid",
  textAlign: "center",
  transition: "transform .2s"
};

const statusTitle = {
  fontSize: 13,
  marginBottom: 8,
  fontWeight: 700,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  opacity: 0.8
};

const statusValue = {
  fontSize: 20,
  fontWeight: 800
};

const completeBtn = {
  marginTop: 20,
  padding: "14px 24px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 15,
  transition: "background .2s, transform .15s",
  boxShadow: "0 4px 12px rgba(79,70,229,0.3)"
};

const successBanner = {
  marginTop: 24,
  background: "#d1fae5",
  border: "1px solid #86efac",
  borderRadius: 14,
  padding: "18px 22px",
  display: "flex",
  alignItems: "flex-start",
  color: "#047857",
  fontSize: 14,
  lineHeight: 1.6
};

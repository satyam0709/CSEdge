import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "../utils/axios";
import {
  User, GraduationCap, Briefcase, FolderGit2, Wrench,
  Award, FileText, Plus, Trash2, Save, Printer,
  Loader2, CheckCircle2, ArrowLeft, ChevronDown, ChevronUp,
  Globe, Linkedin, Github, Phone, Mail, MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Blank resume template ─────────────────────────────────────────────────────
const BLANK_RESUME = {
  personal: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "", summary: "" },
  education: [{ degree: "", institution: "", year: "", cgpa: "" }],
  experience: [],
  projects: [{ name: "", description: "", techStack: "", link: "" }],
  skills: { languages: "", frameworks: "", tools: "", databases: "", others: "" },
  certifications: [],
  achievements: "",
  template: "modern",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function InputField({ label, value, onChange, placeholder, type = "text", multiline = false, rows = 3 }) {
  const cls = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children, accent = "indigo" }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-${accent}-50`}>
        <Icon className={`w-4 h-4 text-${accent}-600`} />
        <h3 className={`text-sm font-bold text-${accent}-800`}>{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ── Resume Preview ────────────────────────────────────────────────────────────
function ResumePreview({ resume }) {
  const { personal: p, education, experience, projects, skills, certifications, achievements } = resume;
  const hasSkills = Object.values(skills).some((v) => v.trim());

  return (
    <div id="resume-print" className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden text-sm leading-relaxed font-serif">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 text-white px-8 py-6">
        <h1 className="text-2xl font-bold tracking-tight">{p.name || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-indigo-200 text-xs">
          {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>}
          {p.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{p.linkedin}</span>}
          {p.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{p.github}</span>}
          {p.portfolio && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{p.portfolio}</span>}
        </div>
        {p.summary && <p className="mt-3 text-indigo-100 text-xs leading-relaxed italic">{p.summary}</p>}
      </div>

      <div className="px-8 py-5 space-y-5">
        {/* Education */}
        {education.some((e) => e.degree || e.institution) && (
          <div>
            <SectionDivider title="Education" />
            {education.filter((e) => e.degree || e.institution).map((e, i) => (
              <div key={i} className="flex justify-between items-start mt-2">
                <div>
                  <p className="font-bold text-slate-800">{e.degree}</p>
                  <p className="text-slate-500 text-xs">{e.institution}</p>
                </div>
                <div className="text-right text-xs text-slate-500 shrink-0 ml-4">
                  {e.year && <p>{e.year}</p>}
                  {e.cgpa && <p>CGPA: {e.cgpa}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {hasSkills && (
          <div>
            <SectionDivider title="Technical Skills" />
            <div className="mt-2 space-y-1 text-xs">
              {skills.languages && <p><span className="font-semibold text-slate-700">Languages:</span> {skills.languages}</p>}
              {skills.frameworks && <p><span className="font-semibold text-slate-700">Frameworks:</span> {skills.frameworks}</p>}
              {skills.tools && <p><span className="font-semibold text-slate-700">Tools:</span> {skills.tools}</p>}
              {skills.databases && <p><span className="font-semibold text-slate-700">Databases:</span> {skills.databases}</p>}
              {skills.others && <p><span className="font-semibold text-slate-700">Others:</span> {skills.others}</p>}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.some((e) => e.company || e.role) && (
          <div>
            <SectionDivider title="Experience" />
            {experience.filter((e) => e.company || e.role).map((e, i) => (
              <div key={i} className="mt-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-800">{e.role}</p>
                    <p className="text-slate-500 text-xs">{e.company}</p>
                  </div>
                  {e.duration && <p className="text-xs text-slate-400 shrink-0 ml-4">{e.duration}</p>}
                </div>
                {e.description && <p className="text-slate-600 text-xs mt-1 whitespace-pre-wrap">{e.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.some((p) => p.name) && (
          <div>
            <SectionDivider title="Projects" />
            {projects.filter((p) => p.name).map((p, i) => (
              <div key={i} className="mt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-800">{p.name}</p>
                  {p.techStack && <span className="text-xs text-indigo-700 bg-indigo-50 rounded px-2 py-0.5">{p.techStack}</span>}
                  {p.link && <a href={p.link} className="text-xs text-indigo-500 underline truncate max-w-[140px]">{p.link}</a>}
                </div>
                {p.description && <p className="text-slate-600 text-xs mt-1 whitespace-pre-wrap">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.some((c) => c.name) && (
          <div>
            <SectionDivider title="Certifications" />
            {certifications.filter((c) => c.name).map((c, i) => (
              <div key={i} className="flex justify-between items-center mt-2 text-xs">
                <span className="font-medium text-slate-800">{c.name}{c.issuer ? ` — ${c.issuer}` : ""}</span>
                {c.year && <span className="text-slate-400 ml-4">{c.year}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {achievements?.trim() && (
          <div>
            <SectionDivider title="Achievements" />
            <p className="text-xs text-slate-600 mt-2 whitespace-pre-wrap">{achievements}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-black uppercase tracking-widest text-indigo-700">{title}</span>
      <div className="flex-1 h-px bg-indigo-200" />
    </div>
  );
}

// ── Repeatable list item ──────────────────────────────────────────────────────
function ListItem({ children, onDelete, canDelete }) {
  return (
    <div className="relative border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [resume, setResume] = useState(deepClone(BLANK_RESUME));
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "saved" | "error" | ""
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const saveTimer = useRef(null);

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [getToken]);

  // Load resume on mount
  useEffect(() => {
    (async () => {
      try {
        const cfg = await authHeaders();
        const { data } = await axios.get("/api/resume", cfg);
        if (data.success && data.resume) {
          const r = data.resume;
          setResume({
            personal: r.personal || BLANK_RESUME.personal,
            education: r.education?.length ? r.education : BLANK_RESUME.education,
            experience: r.experience || [],
            projects: r.projects?.length ? r.projects : BLANK_RESUME.projects,
            skills: r.skills || BLANK_RESUME.skills,
            certifications: r.certifications || [],
            achievements: r.achievements || "",
            template: r.template || "modern",
          });
        } else if (user) {
          // Prefill with Clerk profile data
          setResume((prev) => ({
            ...prev,
            personal: {
              ...prev.personal,
              name: user.fullName || "",
              email: user.primaryEmailAddress?.emailAddress || "",
            },
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (loading) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(handleSave, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [resume]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cfg = await authHeaders();
      await axios.post("/api/resume", resume, cfg);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2500);
    } catch (e) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => window.print();

  // ── Field updaters ──────────────────────────────────────────────────────────
  const setPersonal = (key, val) =>
    setResume((r) => ({ ...r, personal: { ...r.personal, [key]: val } }));

  const setSkill = (key, val) =>
    setResume((r) => ({ ...r, skills: { ...r.skills, [key]: val } }));

  const setListItem = (list, index, key, val) =>
    setResume((r) => {
      const arr = [...r[list]];
      arr[index] = { ...arr[index], [key]: val };
      return { ...r, [list]: arr };
    });

  const addListItem = (list, blank) =>
    setResume((r) => ({ ...r, [list]: [...r[list], blank] }));

  const removeListItem = (list, index) =>
    setResume((r) => ({ ...r, [list]: r[list].filter((_, i) => i !== index) }));

  // ── Tabs ────────────────────────────────────────────────────────────────────
  const TABS = [
    { id: "personal", label: "Personal", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "achievements", label: "Achievements", icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-print, #resume-print * { visibility: visible !important; }
          #resume-print { position: fixed; inset: 0; width: 100%; padding: 0; margin: 0; box-shadow: none; border: none; border-radius: 0; font-size: 12px; }
          #resume-print .text-2xl { font-size: 20px; }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-bold text-slate-900 text-lg leading-none">Resume Builder</h1>
                <p className="text-xs text-slate-400 mt-0.5">Auto-saves as you type</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {saveStatus === "saved" && (
                <span className="hidden sm:flex items-center gap-1 text-xs text-green-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                </span>
              )}
              {saving && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white font-bold hover:bg-indigo-700 transition"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <Printer className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* ── Left: Form ── */}
          <div className="space-y-4">
            {/* Tab bar */}
            <div className="flex flex-wrap gap-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                    activeTab === id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Personal Info */}
            {activeTab === "personal" && (
              <Section icon={User} title="Personal Information" accent="indigo">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <InputField label="Full Name" value={resume.personal.name} onChange={(v) => setPersonal("name", v)} placeholder="John Doe" />
                  </div>
                  <InputField label="Email" type="email" value={resume.personal.email} onChange={(v) => setPersonal("email", v)} placeholder="john@example.com" />
                  <InputField label="Phone" value={resume.personal.phone} onChange={(v) => setPersonal("phone", v)} placeholder="+91-XXXXXXXXXX" />
                  <InputField label="Location" value={resume.personal.location} onChange={(v) => setPersonal("location", v)} placeholder="Bangalore, India" />
                  <InputField label="LinkedIn" value={resume.personal.linkedin} onChange={(v) => setPersonal("linkedin", v)} placeholder="linkedin.com/in/johndoe" />
                  <InputField label="GitHub" value={resume.personal.github} onChange={(v) => setPersonal("github", v)} placeholder="github.com/johndoe" />
                  <InputField label="Portfolio" value={resume.personal.portfolio} onChange={(v) => setPersonal("portfolio", v)} placeholder="johndoe.dev" />
                  <div className="col-span-2">
                    <InputField label="Professional Summary" multiline rows={4} value={resume.personal.summary} onChange={(v) => setPersonal("summary", v)} placeholder="A brief summary about yourself, your skills, and career goals…" />
                  </div>
                </div>
              </Section>
            )}

            {/* Education */}
            {activeTab === "education" && (
              <Section icon={GraduationCap} title="Education" accent="blue">
                {resume.education.map((e, i) => (
                  <ListItem key={i} onDelete={() => removeListItem("education", i)} canDelete={resume.education.length > 1}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <InputField label="Degree / Programme" value={e.degree} onChange={(v) => setListItem("education", i, "degree", v)} placeholder="B.Tech Computer Science" />
                      </div>
                      <div className="col-span-2">
                        <InputField label="Institution" value={e.institution} onChange={(v) => setListItem("education", i, "institution", v)} placeholder="XYZ University" />
                      </div>
                      <InputField label="Year" value={e.year} onChange={(v) => setListItem("education", i, "year", v)} placeholder="2021 – 2025" />
                      <InputField label="CGPA / Percentage" value={e.cgpa} onChange={(v) => setListItem("education", i, "cgpa", v)} placeholder="8.5 / 10" />
                    </div>
                  </ListItem>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("education", { degree: "", institution: "", year: "", cgpa: "" })}
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </Section>
            )}

            {/* Experience */}
            {activeTab === "experience" && (
              <Section icon={Briefcase} title="Work Experience / Internships" accent="green">
                {resume.experience.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No experience added yet.</p>
                )}
                {resume.experience.map((e, i) => (
                  <ListItem key={i} onDelete={() => removeListItem("experience", i)} canDelete>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField label="Company / Organisation" value={e.company} onChange={(v) => setListItem("experience", i, "company", v)} placeholder="Google, TCS, Startup…" />
                      <InputField label="Role / Position" value={e.role} onChange={(v) => setListItem("experience", i, "role", v)} placeholder="Software Intern" />
                      <div className="col-span-2">
                        <InputField label="Duration" value={e.duration} onChange={(v) => setListItem("experience", i, "duration", v)} placeholder="Jun 2024 – Aug 2024" />
                      </div>
                      <div className="col-span-2">
                        <InputField label="Description / Key Points" multiline rows={3} value={e.description} onChange={(v) => setListItem("experience", i, "description", v)} placeholder="Describe your responsibilities, tech used, and impact…" />
                      </div>
                    </div>
                  </ListItem>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("experience", { company: "", role: "", duration: "", description: "" })}
                  className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-800 transition"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </Section>
            )}

            {/* Projects */}
            {activeTab === "projects" && (
              <Section icon={FolderGit2} title="Projects" accent="violet">
                {resume.projects.map((p, i) => (
                  <ListItem key={i} onDelete={() => removeListItem("projects", i)} canDelete={resume.projects.length > 1}>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <InputField label="Project Name" value={p.name} onChange={(v) => setListItem("projects", i, "name", v)} placeholder="LMS Platform" />
                      </div>
                      <InputField label="Tech Stack" value={p.techStack} onChange={(v) => setListItem("projects", i, "techStack", v)} placeholder="React, Node.js, MongoDB" />
                      <InputField label="GitHub / Live Link" value={p.link} onChange={(v) => setListItem("projects", i, "link", v)} placeholder="github.com/user/project" />
                      <div className="col-span-2">
                        <InputField label="Description" multiline rows={3} value={p.description} onChange={(v) => setListItem("projects", i, "description", v)} placeholder="What did you build? What problem does it solve?" />
                      </div>
                    </div>
                  </ListItem>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("projects", { name: "", description: "", techStack: "", link: "" })}
                  className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800 transition"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </Section>
            )}

            {/* Skills */}
            {activeTab === "skills" && (
              <Section icon={Wrench} title="Technical Skills" accent="teal">
                <InputField label="Programming Languages" value={resume.skills.languages} onChange={(v) => setSkill("languages", v)} placeholder="C++, Python, JavaScript, Java" />
                <InputField label="Frameworks & Libraries" value={resume.skills.frameworks} onChange={(v) => setSkill("frameworks", v)} placeholder="React, Node.js, Express, Spring Boot" />
                <InputField label="Tools & Platforms" value={resume.skills.tools} onChange={(v) => setSkill("tools", v)} placeholder="Git, Docker, Linux, VS Code" />
                <InputField label="Databases" value={resume.skills.databases} onChange={(v) => setSkill("databases", v)} placeholder="MongoDB, MySQL, PostgreSQL, Redis" />
                <InputField label="Others" value={resume.skills.others} onChange={(v) => setSkill("others", v)} placeholder="REST APIs, GraphQL, Agile, AWS Basics" />
              </Section>
            )}

            {/* Certifications */}
            {activeTab === "certifications" && (
              <Section icon={Award} title="Certifications" accent="amber">
                {resume.certifications.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No certifications added yet.</p>
                )}
                {resume.certifications.map((c, i) => (
                  <ListItem key={i} onDelete={() => removeListItem("certifications", i)} canDelete>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <InputField label="Certification Name" value={c.name} onChange={(v) => setListItem("certifications", i, "name", v)} placeholder="AWS Cloud Practitioner" />
                      </div>
                      <InputField label="Issuing Organisation" value={c.issuer} onChange={(v) => setListItem("certifications", i, "issuer", v)} placeholder="Amazon / Coursera" />
                      <InputField label="Year" value={c.year} onChange={(v) => setListItem("certifications", i, "year", v)} placeholder="2024" />
                    </div>
                  </ListItem>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("certifications", { name: "", issuer: "", year: "" })}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-800 transition"
                >
                  <Plus className="w-4 h-4" /> Add Certification
                </button>
              </Section>
            )}

            {/* Achievements */}
            {activeTab === "achievements" && (
              <Section icon={FileText} title="Achievements & Extra-curriculars" accent="rose">
                <InputField
                  label="Achievements"
                  multiline
                  rows={6}
                  value={resume.achievements}
                  onChange={(v) => setResume((r) => ({ ...r, achievements: v }))}
                  placeholder={`• Ranked top 5% on LeetCode\n• National Hackathon winner 2024\n• Published research paper on ML\n• Core member of IEEE student chapter`}
                />
              </Section>
            )}
          </div>

          {/* ── Right: Preview ── */}
          <div className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-5rem)] xl:overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Preview</p>
            </div>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </>
  );
}

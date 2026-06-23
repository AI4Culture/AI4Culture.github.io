const repositories = [
  {
    name: "ai4c-project-template",
    description: "AI4C 项目模板，用于统一 README、环境配置、许可证、引用格式和维护规范。",
    tags: ["template", "docs", "ai4c"],
    url: "repos/project-template/"
  },
  {
    name: "cultural-intelligence-pipeline",
    description: "文化智能相关的数据处理、模型训练、评测和可复现实验流程入口。",
    tags: ["pipeline", "research"],
    url: "repos/analysis-pipeline/"
  },
  {
    name: "dataset-and-resources",
    description: "数据说明、下载链接、预处理脚本、元数据和数据使用规范的集中入口。",
    tags: ["dataset", "metadata"],
    url: "repos/dataset-resources/"
  }
];

const dataFiles = {
  research: "assets/research-areas.json",
  members: "assets/members.json",
  publications: "assets/publications.json",
  partners: "assets/partners.json"
};

const repoGrid = document.querySelector("#repo-grid");
const topicGrid = document.querySelector(".topic-grid");
const memberGroups = document.querySelector("#member-groups");
const publicationList = document.querySelector("#publication-list");
const partnerGrid = document.querySelector("#partner-grid");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const loadJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }
  return response.json();
};

repoGrid.innerHTML = repositories
  .map(
    (repo) => `
      <article class="repo-card">
        <h3>${repo.name}</h3>
        <p>${repo.description}</p>
        <div class="repo-meta">
          ${repo.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <a href="${repo.url}">打开仓库</a>
      </article>
    `
  )
  .join("");

const renderResearch = (items) => {
  topicGrid.innerHTML = items
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(
      (item) => `
        <article class="topic-card">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.details || item.description)}</p>
        </article>
      `
    )
    .join("");
};

const renderMembers = (items) => {
  const facultyRoles = ["head", "professor", "associate_professor"];
  const faculty = items.filter((item) => facultyRoles.includes(item.role));
  const students = items.filter((item) =>
    ["phd", "master", "undergraduate", "postdoctoral"].includes(item.role)
  );
  const alumni = items.filter((item) => item.role === "graduate");

  const memberCard = (member) => `
    <article class="member-card">
      <h4>${escapeHtml(member.name)}</h4>
      <p>${escapeHtml(member.title || member.role_display)}</p>
      <p>${escapeHtml(member.specialty || "")}</p>
      <p>${escapeHtml(member.email || "")}</p>
    </article>
  `;

  const alumniCard = (member) => `
    <article class="member-card">
      <h4>${escapeHtml(member.name)}</h4>
      <p>${escapeHtml(member.title || member.role_display)}</p>
      <p>${escapeHtml(member.research_result || "")}</p>
      <p>${escapeHtml(member.graduation_destination || "")}</p>
    </article>
  `;

  memberGroups.innerHTML = `
    <div class="member-group">
      <h3>教师团队</h3>
      <div class="member-grid">${faculty.map(memberCard).join("")}</div>
    </div>
    <div class="member-group">
      <h3>学生团队</h3>
      <div class="member-grid">${students.map(memberCard).join("")}</div>
    </div>
    <div class="member-group">
      <h3>毕业校友</h3>
      <div class="member-grid">${alumni.map(alumniCard).join("")}</div>
    </div>
  `;
};

const renderPublications = (items) => {
  publicationList.innerHTML = items
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (a.order ?? 0) - (b.order ?? 0))
    .map(
      (item) => `
        <article class="publication-card">
          <h3>
            <a href="${escapeHtml(item.paper_url || "#")}" target="_blank" rel="noreferrer">
              ${escapeHtml(item.title)}
            </a>
          </h3>
          <p>${escapeHtml(item.authors)}</p>
          <p>${escapeHtml(item.venue)}, ${escapeHtml(item.year)}</p>
        </article>
      `
    )
    .join("");
};

const renderPartners = (items) => {
  partnerGrid.innerHTML = items
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(
      (item) => `
        <article class="partner-card">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <p><a href="${escapeHtml(item.website)}" target="_blank" rel="noreferrer">访问官网</a></p>
        </article>
      `
    )
    .join("");
};

Promise.all([
  loadJson(dataFiles.research),
  loadJson(dataFiles.members),
  loadJson(dataFiles.publications),
  loadJson(dataFiles.partners)
])
  .then(([research, members, publications, partners]) => {
    renderResearch(research);
    renderMembers(members);
    renderPublications(publications);
    renderPartners(partners);
  })
  .catch((error) => {
    console.error(error);
  });

document.querySelector("#year").textContent = new Date().getFullYear();

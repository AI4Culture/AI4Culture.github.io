const projectGroups = [
  {
    title: "高性能计算",
    description: "面向大模型训练、分布式计算、并发优化和可复现实验环境的工程项目。",
    moreUrl: "repos/high-performance-computing/",
    repositories: [
      {
        name: "AlignMalloc",
        description: "CUDA 内存分配与对齐相关项目，归入高性能计算工程方向。",
        tags: ["cuda", "memory", "hpc"],
        url: "https://github.com/AI4Culture/AlignMalloc"
      },
      {
        name: "SyncMalloc",
        description: "CUDA 同步内存分配相关项目，面向并发与性能优化实验。",
        tags: ["cuda", "sync", "hpc"],
        url: "https://github.com/AI4Culture/SyncMalloc"
      },
      {
        name: "One-waySync",
        description: "C 语言同步机制相关项目，归入高性能计算与系统优化方向。",
        tags: ["c", "sync", "systems"],
        url: "https://github.com/AI4Culture/One-waySync"
      }
    ]
  },
  {
    title: "文化理解生成",
    description: "面向文化语义理解、多模态生成、智能创作和应用原型的研究代码入口。",
    moreUrl: "repos/cultural-understanding-generation/",
    repositories: [
      {
        name: "HiGarment",
        description: "跨模态 harmony-based diffusion 框架，用于从平面服装草图和文本提示生成真实服装图像。",
        tags: ["diffusion", "generation", "ICCV 2025"],
        url: "https://github.com/AI4Culture/HiGarment"
      }
    ]
  },
  {
    title: "文化数据集与测评",
    description: "面向文化数据集、元数据、评测基准、测试流程和引用规范的项目集合。",
    moreUrl: "repos/cultural-datasets-evaluation/",
    repositories: [
      {
        name: "CulTi",
        description: "面向中国文化遗产文档跨模态检索的数据集，包含图文对、协议与 benchmark 结果。",
        tags: ["dataset", "retrieval", "heritage"],
        url: "https://github.com/AI4Culture/CulTi"
      },
      {
        name: "DunhuangBench",
        description: "面向多模态大模型敦煌艺术理解能力的文化遗产 benchmark。",
        tags: ["benchmark", "MLLM", "Dunhuang"],
        url: "https://github.com/AI4Culture/DunhuangBench"
      }
    ]
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
const publicationPreviewCount = 10;
let allPublications = [];
let publicationsExpanded = false;

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const secureUrl = (value) => String(value ?? "").replace(/^http:\/\/ai4c\.net/i, "https://ai4c.net");

const loadJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }
  return response.json();
};

repoGrid.innerHTML = projectGroups
  .map(
    (group) => `
      <section class="project-group">
        <div class="project-group-header">
          <h3>${escapeHtml(group.title)}</h3>
          <p>${escapeHtml(group.description)}</p>
          <a class="project-more-link" href="${escapeHtml(group.moreUrl)}">More</a>
        </div>
        <div class="project-repos">
          ${group.repositories
            .map(
              (repo) => `
                <article class="repo-card">
                  <h4>${escapeHtml(repo.name)}</h4>
                  <p>${escapeHtml(repo.description)}</p>
                  <div class="repo-meta">
                    ${repo.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                  </div>
                  <a href="${escapeHtml(repo.url)}">打开仓库</a>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
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
  const facultyRoles = [
    "head",
    "professor",
    "associate_professor",
    "assistant_professor",
  ];
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

  const facultyCard = (member) => `
    <article class="member-card faculty-card">
      <div class="member-avatar">
        ${
          member.avatar
            ? `<img src="${escapeHtml(secureUrl(member.avatar))}" alt="${escapeHtml(member.name)}" loading="lazy" />`
            : `<span>${escapeHtml(member.name?.slice(0, 1) || "")}</span>`
        }
      </div>
      <div class="member-info">
        <h4>${escapeHtml(member.name)}</h4>
        <p>${escapeHtml(member.title || member.role_display)}</p>
        <p>${escapeHtml(member.specialty || "")}</p>
        <p>${escapeHtml(member.email || "")}</p>
      </div>
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
      <div class="member-grid faculty-grid">${faculty.map(facultyCard).join("")}</div>
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

const publicationCard = (item) => `
  <article class="publication-card">
    <h3>
      <a href="${escapeHtml(item.paper_url || "#")}" target="_blank" rel="noreferrer">
        ${escapeHtml(item.title)}
      </a>
    </h3>
    <p>${escapeHtml(item.authors)}</p>
    <p>${escapeHtml(item.venue)}, ${escapeHtml(item.year)}</p>
  </article>
`;

const renderPublications = (items) => {
  allPublications = items
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (a.order ?? 0) - (b.order ?? 0))
    .slice();
  renderPublicationList();
};

const renderPublicationList = () => {
  const visiblePublications = publicationsExpanded
    ? allPublications
    : allPublications.slice(0, publicationPreviewCount);

  publicationList.innerHTML = `
    ${visiblePublications.map(publicationCard).join("")}
    ${
      allPublications.length > publicationPreviewCount
        ? `<button class="publication-toggle" type="button">
            ${publicationsExpanded ? "收起" : `显示全部 ${allPublications.length} 篇`}
          </button>`
        : ""
    }
  `;

  publicationList.querySelector(".publication-toggle")?.addEventListener("click", () => {
    publicationsExpanded = !publicationsExpanded;
    renderPublicationList();
  });
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

document.querySelector(".back-to-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// src/utils/templateRenderer.js

/**
 * Safely replace all {{variable}} placeholders inside template HTML
 * Supports unlimited dynamic fields.
 */
function replaceFields(html, data) {
  return html.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    return data[key] || "";
  });
}

/**
 * Render project blocks into {{projects}} placeholder.
 */
function renderProjects(projects = []) {
  if (!projects.length) return "";

  return projects
    .map(
      (p) => `
        <div class="project-block">
          <h3>${p.title || ""}</h3>
          <p>${p.description || ""}</p>
          ${
            p.link
              ? `<a href="${p.link}" target="_blank" class="project-link">
                   View Project →
                 </a>`
              : ""
          }
        </div>
      `
    )
    .join("\n");
}

/**
 * Render skill chips into {{skills}} placeholder.
 */
function renderSkills(skills) {
  if (!skills) return "";

  const list = skills.split(",").map((s) => s.trim());
  return list
    .map((s) => `<span class="skill-chip">${s}</span>`)
    .join("\n");
}

/**
 * Render profile picture into {{profile_image}} placeholder.
 */
function renderProfileImage(url) {
  if (!url) return "";
  return `<img src="${url}" alt="Profile" class="profile-image" />`;
}

/**
 * Final Renderer — generates full static HTML page.
 */
export function renderTemplateHtml(html, css, js, data) {
  if (!html) return "<h1>Error: Missing template HTML</h1>";

  let output = html;

  // 1️⃣ Insert dynamic lists
  output = output.replace("{{projects}}", renderProjects(data.projects));
  output = output.replace("{{skills}}", renderSkills(data.skills));
  output = output.replace("{{profile_image}}", renderProfileImage(data.profile_image));

  // 2️⃣ Replace simple placeholders: {{name}}, {{bio}}, etc.
  output = replaceFields(output, data);

  // 3️⃣ Wrap CSS and JS
  const finalHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8"/>
        <title>${data.name || "Portfolio"}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, sans-serif;
          }
          .skill-chip {
            display: inline-block;
            padding: 6px 12px;
            background: #efefef;
            border-radius: 8px;
            margin: 4px;
            font-size: 0.9rem;
          }
          .project-block {
            padding: 12px 0;
            border-bottom: 1px solid #ddd;
          }
          .profile-image {
            width: 140px;
            height: 140px;
            object-fit: cover;
            border-radius: 50%;
            margin-bottom: 12px;
          }
          ${css || ""}
        </style>
    </head>
    <body>
        ${output}

        <script>
          ${js || ""}
        </script>
    </body>
    </html>
  `;

  return finalHtml.trim();
}

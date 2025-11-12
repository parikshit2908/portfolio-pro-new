import React from "react";
import "./TemplateCard.css";

export default function TemplateCard({ template }) {
  if (!template) {
    return (
      <div className="template-card-empty">
        <p>No template selected</p>
      </div>
    );
  }

  return (
    <div className="template-card">
      <div className="template-card-header">
        <h4>{template.name}</h4>
      </div>

      <div className="template-card-body">
        <p className="template-desc">{template.description || "No description available."}</p>
      </div>
    </div>
  );
}

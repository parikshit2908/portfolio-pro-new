import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Templates.css";


const templates = [
{ id: "photon", name: "Photon", desc: "Minimal portfolio with parallax and hero." },
{ id: "editorial", name: "Editorial", desc: "Magazine-like layout great for content." },
{ id: "forty", name: "Forty", desc: "Bold hero + gallery portfolio." },
];


export default function Templates() {
const navigate = useNavigate();


return (
<div className="templates-wrapper container py-5">
<motion.h1
className="templates-title text-center mb-4"
initial={{ opacity: 0, y: -15 }}
animate={{ opacity: 1, y: 0 }}
>
Choose a Template
</motion.h1>


<p className="templates-subtitle text-center mb-4">
Pick a template to start building your portfolio. After choosing, you can fill your
details and publish to a public URL.
</p>


<div className="templates-list">
{templates.map((tpl, idx) => (
<motion.div
key={tpl.id}
className="template-item"
initial={{ opacity: 0, y: 25 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: idx * 0.05 }}
onClick={() => navigate(`/create-portfolio?tpl=${tpl.id}`)}
role="button"
tabIndex={0}
>
<div className="template-content">
<h3 className="template-title">{tpl.name}</h3>
<p className="template-desc">{tpl.desc}</p>
<div className="template-actions">
<button className="btn btn-outline-primary me-2">Preview</button>
<button
className="btn btn-primary"
onClick={() => navigate(`/create-portfolio?tpl=${tpl.id}`)}
>
Use Template
</button>
</div>
</div>
</motion.div>
))}
</div>
</div>
);
}
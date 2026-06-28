export interface Testimonial {
  id: number;
  author: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    author: "Kayner Cueva",
    role: "Soporte Técnico Web",
    company: "Desarrollo Web",
    content: "Interesante proyecto. Por lo que entiendo, ¿la idea es exponer una interfaz ligera para gestionar un NAS local que normalmente no tiene UI, priorizado bajo consumo de recursos?",
    avatar: "/avatars/kayner-cueva.svg"
  },
  {
    id: 2,
    author: "Luis Alberto Bentancur",
    role: "Analista de Sistemas",
    company: "Programación",
    content: "Excelente trabajo. No es solo una UI, sino una capa de control y automatización pensada para integrarse con otros servicios y flujos. Muy profesional.",
    avatar: "/avatars/luis-bentancur.svg"
  },
  {
    id: 3,
    author: "Rujuta Singh",
    role: "AI Strategy & Accelerator",
    company: "CxOs Laser-Focused on ROI",
    content: "Excelente enfoque en transformación de procesos empresariales. Demuestras expertise en automatización con IA y soluciones escalables.",
    avatar: "/avatars/rujuta-singh.svg"
  },
  {
    id: 4,
    author: "Fred Amaya",
    role: "Founder",
    company: "Biome Health",
    content: "Profesional comprometido con soluciones robustas de automatización. Excelente capacidad técnica y mucha atención al detalle en cada proyecto.",
    avatar: "/avatars/fred-amaya.svg"
  },
  {
    id: 5,
    author: "Corina Taban",
    role: "CEO",
    company: "934 Advisors",
    content: "Cristofer demuestra expertise sólida en automatización empresarial y DevOps. Altamente recomendado para proyectos complejos de integración de sistemas.",
    avatar: "/avatars/corina-taban.svg"
  }
];

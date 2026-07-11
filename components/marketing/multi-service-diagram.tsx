const SERVICES = [
  "Sonorisation",
  "DJ",
  "Décoration",
  "Traiteur",
  "Photographe",
  "Éclairage",
];

/**
 * Diagramme signature défini dans la charte graphique : un nœud central
 * (l'entreprise) relié à plusieurs services. Rendu en SVG pur (statique,
 * pas de dépendance client) — les angles sont répartis uniformément autour
 * du centre.
 */
export function MultiServiceDiagram() {
  const size = 440;
  const center = size / 2;
  const radius = 165;
  const nodeRadius = 52;

  const positions = SERVICES.map((label, i) => {
    const angle = (i / SERVICES.length) * 2 * Math.PI - Math.PI / 2;
    return {
      label,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto h-auto w-full max-w-md"
      role="img"
      aria-label="Un prestataire peut couvrir plusieurs services : sonorisation, DJ, décoration, traiteur, photographe, éclairage."
    >
      <defs>
        <linearGradient id="el-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6a3ec9" />
          <stop offset="55%" stopColor="#e94e8b" />
          <stop offset="100%" stopColor="#ff8a00" />
        </linearGradient>
      </defs>

      {positions.map((pos) => (
        <line
          key={pos.label}
          x1={center}
          y1={center}
          x2={pos.x}
          y2={pos.y}
          stroke="url(#el-line-gradient)"
          strokeWidth={2}
          strokeOpacity={0.5}
        />
      ))}

      {positions.map((pos) => (
        <g key={pos.label}>
          <circle cx={pos.x} cy={pos.y} r={nodeRadius} fill="#ffffff" stroke="#e1e4ee" />
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fontWeight={600}
            fill="#2c1e47"
          >
            {pos.label}
          </text>
        </g>
      ))}

      <circle cx={center} cy={center} r={nodeRadius + 12} fill="url(#el-line-gradient)" />
      <text
        x={center}
        y={center - 6}
        textAnchor="middle"
        fontSize="13"
        fontWeight={700}
        fill="#ffffff"
      >
        Une
      </text>
      <text x={center} y={center + 12} textAnchor="middle" fontSize="13" fontWeight={700} fill="#ffffff">
        entreprise
      </text>
    </svg>
  );
}

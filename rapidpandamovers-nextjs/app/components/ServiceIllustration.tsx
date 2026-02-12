// Fun, consistent SVG illustrations for each service
// Style: Simple shapes, orange/black/white color scheme, friendly appearance

import React from 'react'

interface ServiceIllustrationProps {
  service: string;
  className?: string;
}

export default function ServiceIllustration({ service, className = "w-24 h-24" }: ServiceIllustrationProps) {
  const illustrations: Record<string, React.ReactElement> = {
    'packing-services': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Box with items */}
        <rect x="15" y="35" width="50" height="45" rx="3" fill="#f97316" />
        <rect x="15" y="35" width="50" height="12" rx="3" fill="#ea580c" />
        <path d="M30 41 L50 41" stroke="white" strokeWidth="3" strokeLinecap="round" />
        {/* Small box */}
        <rect x="55" y="55" width="30" height="25" rx="2" fill="#fdba74" />
        <path d="M62 67 L78 67" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        {/* Tape */}
        <rect x="70" y="20" width="20" height="25" rx="10" fill="#1f2937" />
        <rect x="75" y="25" width="10" height="15" rx="5" fill="#f97316" />
      </svg>
    ),
    'local-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Moving truck */}
        <rect x="10" y="40" width="55" height="35" rx="3" fill="#f97316" />
        <rect x="65" y="50" width="25" height="25" rx="3" fill="#ea580c" />
        <rect x="70" y="55" width="15" height="12" rx="2" fill="#bfdbfe" />
        {/* Wheels */}
        <circle cx="30" cy="80" r="8" fill="#1f2937" />
        <circle cx="30" cy="80" r="4" fill="#6b7280" />
        <circle cx="75" cy="80" r="8" fill="#1f2937" />
        <circle cx="75" cy="80" r="4" fill="#6b7280" />
        {/* House icon on truck */}
        <path d="M25 55 L37 45 L49 55 L49 67 L25 67 Z" fill="white" />
        <rect x="33" y="58" width="6" height="9" fill="#f97316" />
      </svg>
    ),
    'long-distance-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Road */}
        <path d="M0 75 Q50 60 100 75" stroke="#1f2937" strokeWidth="20" />
        <path d="M10 75 Q50 62 90 75" stroke="white" strokeWidth="2" strokeDasharray="8 6" />
        {/* Truck */}
        <rect x="35" y="40" width="35" height="22" rx="2" fill="#f97316" />
        <rect x="55" y="45" width="18" height="17" rx="2" fill="#ea580c" />
        <rect x="58" y="48" width="10" height="8" rx="1" fill="#bfdbfe" />
        <circle cx="45" cy="65" r="5" fill="#1f2937" />
        <circle cx="62" cy="65" r="5" fill="#1f2937" />
        {/* Distance markers */}
        <circle cx="15" cy="30" r="8" fill="#fdba74" />
        <text x="15" y="34" textAnchor="middle" fill="#1f2937" fontSize="10" fontWeight="bold">A</text>
        <circle cx="85" cy="30" r="8" fill="#fdba74" />
        <text x="85" y="34" textAnchor="middle" fill="#1f2937" fontSize="10" fontWeight="bold">B</text>
        <path d="M25 30 L75 30" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    ),
    'residential-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* House */}
        <path d="M50 15 L85 40 L85 85 L15 85 L15 40 Z" fill="#f97316" />
        <path d="M50 15 L85 40 L50 40 L15 40 Z" fill="#ea580c" />
        {/* Door */}
        <rect x="40" y="55" width="20" height="30" rx="2" fill="#1f2937" />
        <circle cx="55" cy="72" r="2" fill="#f97316" />
        {/* Windows */}
        <rect x="22" y="50" width="12" height="12" rx="1" fill="#bfdbfe" />
        <rect x="66" y="50" width="12" height="12" rx="1" fill="#bfdbfe" />
        {/* Moving box */}
        <rect x="70" y="70" width="18" height="15" rx="2" fill="#fdba74" />
        <path d="M74 77 L84 77" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'commercial-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Office building */}
        <rect x="20" y="20" width="40" height="65" rx="2" fill="#f97316" />
        <rect x="60" y="40" width="25" height="45" rx="2" fill="#ea580c" />
        {/* Windows */}
        {[0, 1, 2, 3].map((row) => (
          [0, 1, 2].map((col) => (
            <rect key={`w1-${row}-${col}`} x={25 + col * 12} y={25 + row * 14} width="8" height="8" rx="1" fill="#bfdbfe" />
          ))
        )).flat()}
        {[0, 1, 2].map((row) => (
          [0, 1].map((col) => (
            <rect key={`w2-${row}-${col}`} x={63 + col * 10} y={45 + row * 12} width="6" height="6" rx="1" fill="#bfdbfe" />
          ))
        )).flat()}
        {/* Dolly with boxes */}
        <rect x="5" y="65" width="12" height="10" rx="1" fill="#fdba74" />
        <rect x="5" y="55" width="10" height="10" rx="1" fill="#fdba74" />
        <path d="M8 75 L8 82 L18 82" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <circle cx="18" cy="82" r="3" fill="#1f2937" />
      </svg>
    ),
    'furniture-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Couch */}
        <rect x="10" y="45" width="60" height="25" rx="5" fill="#f97316" />
        <rect x="15" y="40" width="50" height="15" rx="3" fill="#ea580c" />
        {/* Armrests */}
        <rect x="5" y="45" width="12" height="20" rx="4" fill="#ea580c" />
        <rect x="63" y="45" width="12" height="20" rx="4" fill="#ea580c" />
        {/* Legs */}
        <rect x="18" y="70" width="5" height="8" rx="1" fill="#1f2937" />
        <rect x="57" y="70" width="5" height="8" rx="1" fill="#1f2937" />
        {/* Cushions */}
        <ellipse cx="27" cy="52" rx="8" ry="5" fill="#fdba74" />
        <ellipse cx="52" cy="52" rx="8" ry="5" fill="#fdba74" />
        {/* Lamp */}
        <rect x="82" y="50" width="4" height="30" rx="1" fill="#1f2937" />
        <path d="M75 50 L84 35 L93 50 Z" fill="#fdba74" />
      </svg>
    ),
    'celebrity-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* VIP truck */}
        <rect x="15" y="45" width="45" height="30" rx="3" fill="#1f2937" />
        <rect x="60" y="52" width="22" height="23" rx="3" fill="#1f2937" />
        <rect x="65" y="56" width="12" height="10" rx="2" fill="#374151" />
        {/* Gold accents */}
        <path d="M20 55 L55 55" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 65 L55 65" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        {/* Wheels */}
        <circle cx="30" cy="80" r="7" fill="#f97316" />
        <circle cx="30" cy="80" r="3" fill="#1f2937" />
        <circle cx="70" cy="80" r="7" fill="#f97316" />
        <circle cx="70" cy="80" r="3" fill="#1f2937" />
        {/* Star */}
        <path d="M50 15 L53 25 L64 25 L55 32 L59 42 L50 35 L41 42 L45 32 L36 25 L47 25 Z" fill="#f97316" />
      </svg>
    ),
    'apartment-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Apartment building */}
        <rect x="25" y="15" width="50" height="70" rx="2" fill="#f97316" />
        {/* Windows/units */}
        {[0, 1, 2, 3, 4].map((row) => (
          [0, 1, 2].map((col) => (
            <rect key={`apt-${row}-${col}`} x={30 + col * 15} y={20 + row * 13} width="10" height="10" rx="1" fill={row === 2 && col === 1 ? "#fdba74" : "#bfdbfe"} />
          ))
        )).flat()}
        {/* Entrance */}
        <rect x="42" y="68" width="16" height="17" rx="2" fill="#1f2937" />
        {/* Person with box */}
        <circle cx="15" cy="55" r="6" fill="#fdba74" />
        <rect x="10" y="61" width="10" height="15" rx="2" fill="#1f2937" />
        <rect x="8" y="68" width="14" height="10" rx="2" fill="#ea580c" />
      </svg>
    ),
    'full-service-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Checkmark circle */}
        <circle cx="50" cy="45" r="30" fill="#f97316" />
        <path d="M35 45 L45 55 L65 35" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Service icons around */}
        <rect x="10" y="70" width="15" height="12" rx="2" fill="#fdba74" />
        <rect x="30" y="75" width="15" height="12" rx="2" fill="#ea580c" />
        <rect x="55" y="75" width="15" height="12" rx="2" fill="#fdba74" />
        <rect x="75" y="70" width="15" height="12" rx="2" fill="#ea580c" />
        {/* Small truck */}
        <rect x="42" y="78" width="16" height="10" rx="1" fill="#1f2937" />
        <circle cx="46" cy="90" r="3" fill="#1f2937" />
        <circle cx="54" cy="90" r="3" fill="#1f2937" />
      </svg>
    ),
    'labor-only-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Two workers */}
        <circle cx="30" cy="25" r="10" fill="#fdba74" />
        <rect x="20" y="35" width="20" height="25" rx="3" fill="#f97316" />
        <circle cx="70" cy="25" r="10" fill="#fdba74" />
        <rect x="60" y="35" width="20" height="25" rx="3" fill="#f97316" />
        {/* Arms carrying */}
        <rect x="35" y="42" width="30" height="6" rx="2" fill="#fdba74" />
        {/* Large box being carried */}
        <rect x="30" y="48" width="40" height="30" rx="3" fill="#ea580c" />
        <path d="M40 63 L60 63" stroke="white" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <rect x="22" y="60" width="6" height="20" rx="2" fill="#1f2937" />
        <rect x="32" y="60" width="6" height="20" rx="2" fill="#1f2937" />
        <rect x="62" y="60" width="6" height="20" rx="2" fill="#1f2937" />
        <rect x="72" y="60" width="6" height="20" rx="2" fill="#1f2937" />
      </svg>
    ),
    'military-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Military truck */}
        <rect x="15" y="45" width="45" height="30" rx="2" fill="#4b5563" />
        <rect x="60" y="52" width="22" height="23" rx="2" fill="#374151" />
        <rect x="65" y="56" width="12" height="10" rx="1" fill="#6b7280" />
        {/* Canvas cover */}
        <path d="M15 45 Q37 30 60 45" fill="#f97316" />
        {/* Wheels */}
        <circle cx="30" cy="80" r="7" fill="#1f2937" />
        <circle cx="50" cy="80" r="7" fill="#1f2937" />
        <circle cx="70" cy="80" r="7" fill="#1f2937" />
        {/* Star emblem */}
        <path d="M37 55 L39 60 L44 60 L40 64 L42 69 L37 66 L32 69 L34 64 L30 60 L35 60 Z" fill="#f97316" />
        {/* Flag */}
        <rect x="78" y="20" width="2" height="35" fill="#1f2937" />
        <rect x="80" y="20" width="15" height="10" fill="#f97316" />
      </svg>
    ),
    'same-day-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Clock */}
        <circle cx="50" cy="45" r="30" fill="#f97316" />
        <circle cx="50" cy="45" r="25" fill="white" />
        <circle cx="50" cy="45" r="3" fill="#1f2937" />
        {/* Clock hands */}
        <path d="M50 45 L50 28" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 45 L62 50" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
        {/* Speed lines */}
        <path d="M10 40 L25 45" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 50 L25 50" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M10 60 L25 55" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        {/* Small truck */}
        <rect x="30" y="78" width="25" height="12" rx="2" fill="#ea580c" />
        <rect x="55" y="82" width="12" height="8" rx="2" fill="#1f2937" />
        <circle cx="38" cy="92" r="4" fill="#1f2937" />
        <circle cx="58" cy="92" r="4" fill="#1f2937" />
      </svg>
    ),
    'senior-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Senior figure */}
        <circle cx="35" cy="28" r="12" fill="#fdba74" />
        <rect x="25" y="40" width="20" height="30" rx="3" fill="#f97316" />
        {/* Cane */}
        <path d="M48 50 L55 80" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
        <path d="M48 50 Q55 48 58 52" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Heart */}
        <path d="M70 30 C70 25 75 20 80 25 C85 20 90 25 90 30 C90 40 80 50 80 50 C80 50 70 40 70 30" fill="#f97316" />
        {/* Moving box with care label */}
        <rect x="60" y="60" width="28" height="22" rx="2" fill="#fdba74" />
        <text x="74" y="74" textAnchor="middle" fill="#ea580c" fontSize="8" fontWeight="bold">CARE</text>
      </svg>
    ),
    'student-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Student figure */}
        <circle cx="50" cy="28" r="12" fill="#fdba74" />
        {/* Graduation cap */}
        <rect x="38" y="18" width="24" height="4" fill="#1f2937" />
        <path d="M40 18 L50 10 L60 18" fill="#1f2937" />
        <circle cx="60" cy="18" r="2" fill="#f97316" />
        <path d="M60 18 L65 28" stroke="#f97316" strokeWidth="2" />
        {/* Body with backpack */}
        <rect x="40" y="40" width="20" height="25" rx="3" fill="#f97316" />
        <rect x="55" y="42" width="10" height="18" rx="2" fill="#ea580c" />
        {/* Boxes */}
        <rect x="15" y="60" width="20" height="16" rx="2" fill="#fdba74" />
        <rect x="20" y="50" width="15" height="12" rx="2" fill="#fdba74" />
        {/* Books */}
        <rect x="70" y="55" width="18" height="25" rx="1" fill="#f97316" />
        <rect x="72" y="57" width="14" height="4" fill="#ea580c" />
        <rect x="72" y="63" width="14" height="4" fill="#fdba74" />
        <rect x="72" y="69" width="14" height="4" fill="#ea580c" />
      </svg>
    ),
    'safe-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Safe */}
        <rect x="25" y="30" width="50" height="50" rx="4" fill="#1f2937" />
        <rect x="30" y="35" width="40" height="40" rx="2" fill="#374151" />
        {/* Dial */}
        <circle cx="50" cy="55" r="12" fill="#4b5563" />
        <circle cx="50" cy="55" r="8" fill="#f97316" />
        <path d="M50 47 L50 52" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Handle */}
        <rect x="65" y="50" width="8" height="4" rx="1" fill="#f97316" />
        <circle cx="75" cy="52" r="4" fill="#ea580c" />
        {/* Dolly underneath */}
        <rect x="20" y="80" width="60" height="5" rx="2" fill="#ea580c" />
        <circle cx="30" cy="90" r="5" fill="#1f2937" />
        <circle cx="70" cy="90" r="5" fill="#1f2937" />
        {/* Lock icon */}
        <path d="M45 15 L45 25 L55 25 L55 15" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="42" y="22" width="16" height="10" rx="2" fill="#f97316" />
      </svg>
    ),
    'piano-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Grand piano body */}
        <ellipse cx="50" cy="55" rx="35" ry="25" fill="#1f2937" />
        {/* Piano lid */}
        <path d="M20 45 Q50 20 80 45" fill="#374151" />
        {/* Keys */}
        <rect x="25" y="50" width="50" height="15" rx="1" fill="white" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={`key-${i}`} x={27 + i * 7} y="50" width="5" height="15" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        {[0, 1, 3, 4, 5].map((i) => (
          <rect key={`black-${i}`} x={30 + i * 7} y="50" width="4" height="9" fill="#1f2937" />
        ))}
        {/* Legs */}
        <rect x="28" y="75" width="5" height="15" rx="1" fill="#1f2937" />
        <rect x="67" cy="75" width="5" height="15" rx="1" fill="#1f2937" />
        {/* Music notes */}
        <circle cx="80" cy="25" r="4" fill="#f97316" />
        <path d="M84 25 L84 12" stroke="#f97316" strokeWidth="2" />
        <circle cx="88" cy="20" r="3" fill="#f97316" />
        <path d="M91 20 L91 10 L84 12" stroke="#f97316" strokeWidth="2" fill="none" />
      </svg>
    ),
    'pool-table-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Table surface */}
        <rect x="10" y="35" width="80" height="45" rx="3" fill="#059669" />
        {/* Rails */}
        <rect x="8" y="33" width="84" height="49" rx="4" fill="none" stroke="#8b4513" strokeWidth="4" />
        {/* Pockets */}
        <circle cx="12" cy="37" r="4" fill="#1f2937" />
        <circle cx="88" cy="37" r="4" fill="#1f2937" />
        <circle cx="12" cy="78" r="4" fill="#1f2937" />
        <circle cx="88" cy="78" r="4" fill="#1f2937" />
        <circle cx="50" cy="37" r="3" fill="#1f2937" />
        <circle cx="50" cy="78" r="3" fill="#1f2937" />
        {/* Balls */}
        <circle cx="35" cy="57" r="5" fill="#f97316" />
        <circle cx="50" cy="57" r="5" fill="#1f2937" />
        <text x="50" y="60" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">8</text>
        <circle cx="65" cy="57" r="5" fill="#ef4444" />
        <circle cx="42" cy="48" r="4" fill="#3b82f6" />
        <circle cx="58" cy="48" r="4" fill="#a855f7" />
        {/* Cue stick */}
        <line x1="20" y1="15" x2="75" y2="45" stroke="#deb887" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="15" x2="28" y2="20" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    'hot-tub-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Hot tub body */}
        <rect x="15" y="40" width="70" height="40" rx="8" fill="#6b7280" />
        <rect x="20" y="45" width="60" height="30" rx="5" fill="#38bdf8" />
        {/* Water bubbles */}
        <circle cx="35" cy="60" r="3" fill="white" opacity="0.6" />
        <circle cx="50" cy="55" r="4" fill="white" opacity="0.6" />
        <circle cx="65" cy="62" r="3" fill="white" opacity="0.6" />
        <circle cx="42" cy="68" r="2" fill="white" opacity="0.6" />
        <circle cx="58" cy="65" r="2" fill="white" opacity="0.6" />
        {/* Steam */}
        <path d="M30 35 Q35 25 30 15" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M50 35 Q55 25 50 15" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M70 35 Q75 25 70 15" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Control panel */}
        <rect x="78" y="50" width="10" height="20" rx="2" fill="#1f2937" />
        <circle cx="83" cy="55" r="2" fill="#f97316" />
        <circle cx="83" cy="62" r="2" fill="#22c55e" />
      </svg>
    ),
    'gun-safe-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Heavy safe */}
        <rect x="25" y="20" width="50" height="65" rx="3" fill="#1f2937" />
        <rect x="28" y="23" width="44" height="59" rx="2" fill="#374151" />
        {/* Reinforced door lines */}
        <line x1="35" y1="30" x2="65" y2="30" stroke="#4b5563" strokeWidth="2" />
        <line x1="35" y1="45" x2="65" y2="45" stroke="#4b5563" strokeWidth="2" />
        <line x1="35" y1="60" x2="65" y2="60" stroke="#4b5563" strokeWidth="2" />
        {/* Digital keypad */}
        <rect x="40" y="35" width="20" height="12" rx="1" fill="#f97316" />
        <rect x="42" y="37" width="16" height="5" fill="#1f2937" />
        {/* Handle */}
        <circle cx="68" cy="55" r="6" fill="#f97316" />
        <circle cx="68" cy="55" r="3" fill="#ea580c" />
        {/* Weight indicator */}
        <text x="50" y="75" textAnchor="middle" fill="#f97316" fontSize="8" fontWeight="bold">500 LBS</text>
        {/* Dolly wheels */}
        <circle cx="35" cy="90" r="5" fill="#f97316" />
        <circle cx="65" cy="90" r="5" fill="#f97316" />
      </svg>
    ),
    'appliance-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Refrigerator */}
        <rect x="15" y="15" width="30" height="70" rx="3" fill="#e5e7eb" />
        <rect x="18" y="18" width="24" height="30" rx="2" fill="#9ca3af" />
        <rect x="18" y="52" width="24" height="30" rx="2" fill="#9ca3af" />
        <rect x="40" y="35" width="4" height="10" rx="1" fill="#6b7280" />
        <rect x="40" y="65" width="4" height="10" rx="1" fill="#6b7280" />
        {/* Washing machine */}
        <rect x="55" y="35" width="35" height="50" rx="3" fill="#d1d5db" />
        <circle cx="72" cy="60" r="15" fill="#9ca3af" />
        <circle cx="72" cy="60" r="10" fill="#bfdbfe" />
        {/* Control panel */}
        <rect x="58" y="38" width="29" height="10" rx="1" fill="#6b7280" />
        <circle cx="65" cy="43" r="2" fill="#f97316" />
        <circle cx="75" cy="43" r="2" fill="#22c55e" />
        <rect x="80" y="41" width="5" height="4" rx="1" fill="#1f2937" />
        {/* Plug */}
        <path d="M50 10 L50 18" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M46 10 L54 10" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    'antique-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Antique dresser */}
        <rect x="20" y="40" width="60" height="35" rx="2" fill="#92400e" />
        <rect x="25" y="45" width="20" height="12" rx="1" fill="#78350f" />
        <rect x="55" y="45" width="20" height="12" rx="1" fill="#78350f" />
        <rect x="25" y="60" width="50" height="12" rx="1" fill="#78350f" />
        {/* Ornate handles */}
        <circle cx="35" cy="51" r="2" fill="#f97316" />
        <circle cx="65" cy="51" r="2" fill="#f97316" />
        <ellipse cx="50" cy="66" rx="4" ry="2" fill="#f97316" />
        {/* Ornate legs */}
        <path d="M25 75 Q22 85 25 90" stroke="#92400e" strokeWidth="4" fill="none" />
        <path d="M75 75 Q78 85 75 90" stroke="#92400e" strokeWidth="4" fill="none" />
        {/* Mirror frame */}
        <rect x="30" y="10" width="40" height="25" rx="2" fill="#f97316" />
        <rect x="34" y="14" width="32" height="17" rx="1" fill="#bfdbfe" />
        {/* White glove */}
        <path d="M85 55 Q90 50 85 45" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <rect x="82" y="55" width="8" height="15" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      </svg>
    ),
    'art-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Framed painting */}
        <rect x="20" y="15" width="50" height="40" rx="2" fill="#f97316" />
        <rect x="25" y="20" width="40" height="30" rx="1" fill="#fef3c7" />
        {/* Abstract art */}
        <circle cx="38" cy="30" r="8" fill="#ef4444" />
        <rect x="50" y="25" width="10" height="20" rx="1" fill="#3b82f6" />
        <path d="M28 45 L42 35 L55 45" stroke="#22c55e" strokeWidth="3" fill="none" />
        {/* Sculpture */}
        <ellipse cx="80" cy="75" rx="10" ry="5" fill="#9ca3af" />
        <path d="M75 75 Q70 50 80 45 Q90 50 85 75" fill="#d1d5db" />
        {/* Padding/crate */}
        <rect x="15" y="60" width="55" height="30" rx="2" fill="#fde68a" />
        <path d="M20 65 L65 65" stroke="#ea580c" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M20 80 L65 80" stroke="#ea580c" strokeWidth="2" strokeDasharray="4 2" />
        <text x="42" y="76" textAnchor="middle" fill="#ea580c" fontSize="8" fontWeight="bold">FRAGILE</text>
      </svg>
    ),
    'storage-solutions': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Storage unit */}
        <rect x="15" y="25" width="70" height="55" rx="2" fill="#f97316" />
        {/* Roll-up door */}
        <rect x="20" y="30" width="60" height="45" rx="1" fill="#fdba74" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`door-${i}`} x1="22" y1={35 + i * 9} x2="78" y2={35 + i * 9} stroke="#ea580c" strokeWidth="1" />
        ))}
        {/* Lock */}
        <rect x="46" y="68" width="8" height="6" rx="1" fill="#1f2937" />
        <circle cx="50" cy="71" r="1.5" fill="#f97316" />
        {/* Boxes inside */}
        <rect x="25" y="50" width="15" height="12" rx="1" fill="white" opacity="0.8" />
        <rect x="42" y="55" width="12" height="10" rx="1" fill="white" opacity="0.8" />
        <rect x="56" y="48" width="18" height="14" rx="1" fill="white" opacity="0.8" />
        {/* Calendar with checkmark */}
        <rect x="75" y="10" width="18" height="16" rx="2" fill="white" />
        <rect x="75" y="10" width="18" height="5" rx="2" fill="#1f2937" />
        <path d="M79 20 L82 23 L89 16" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'white-glove-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* White glove */}
        <path d="M30 60 L30 40 Q30 30 40 30 L45 30 Q50 30 50 35 L50 45" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <path d="M50 45 L50 35 Q50 28 55 28 L55 35" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <path d="M55 35 L55 28 Q55 22 60 22 L60 35" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <path d="M60 35 L60 28 Q60 25 65 25 L65 40" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <rect x="30" y="55" width="35" height="25" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        {/* Star quality badge */}
        <circle cx="75" cy="35" r="15" fill="#f97316" />
        <path d="M75 25 L77 31 L84 31 L79 35 L81 42 L75 38 L69 42 L71 35 L66 31 L73 31 Z" fill="white" />
        {/* Premium box */}
        <rect x="55" y="70" width="30" height="20" rx="2" fill="#1f2937" />
        <path d="M62 80 L78 80" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        <text x="70" y="87" textAnchor="middle" fill="#f97316" fontSize="6">PREMIUM</text>
      </svg>
    ),
    'specialty-item-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Various specialty items */}
        {/* Vase */}
        <path d="M20 80 L25 50 Q27 40 35 40 Q43 40 45 50 L50 80 Z" fill="#f97316" />
        <ellipse cx="35" cy="40" rx="8" ry="3" fill="#ea580c" />
        {/* Chandelier */}
        <circle cx="70" cy="20" r="3" fill="#fbbf24" />
        <path d="M70 23 L70 30" stroke="#fbbf24" strokeWidth="2" />
        <path d="M55 35 L70 30 L85 35" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <circle cx="55" cy="40" r="4" fill="#fef3c7" />
        <circle cx="70" cy="38" r="4" fill="#fef3c7" />
        <circle cx="85" cy="40" r="4" fill="#fef3c7" />
        {/* Wine bottle */}
        <rect x="55" y="60" width="10" height="25" rx="3" fill="#7c3aed" />
        <rect x="57" y="55" width="6" height="8" rx="1" fill="#7c3aed" />
        {/* Fragile crate */}
        <rect x="70" y="55" width="22" height="30" rx="2" fill="#fde68a" />
        <text x="81" y="72" textAnchor="middle" fill="#ea580c" fontSize="7" fontWeight="bold">!</text>
        <text x="81" y="82" textAnchor="middle" fill="#ea580c" fontSize="5">FRAGILE</text>
      </svg>
    ),
    'last-minute-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Alarm clock */}
        <circle cx="50" cy="45" r="28" fill="#f97316" />
        <circle cx="50" cy="45" r="23" fill="white" />
        {/* Clock bells */}
        <circle cx="30" cy="22" r="8" fill="#ea580c" />
        <circle cx="70" cy="22" r="8" fill="#ea580c" />
        <rect x="48" y="10" width="4" height="8" rx="1" fill="#1f2937" />
        {/* Clock face */}
        <circle cx="50" cy="45" r="3" fill="#1f2937" />
        <path d="M50 45 L50 30" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 45 L60 45" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
        {/* Exclamation marks */}
        <text x="20" y="55" fill="#f97316" fontSize="20" fontWeight="bold">!</text>
        <text x="75" y="55" fill="#f97316" fontSize="20" fontWeight="bold">!</text>
        {/* Running truck */}
        <rect x="25" y="75" width="30" height="15" rx="2" fill="#1f2937" />
        <rect x="55" y="80" width="15" height="10" rx="2" fill="#374151" />
        <circle cx="35" cy="92" r="4" fill="#f97316" />
        <circle cx="55" cy="92" r="4" fill="#f97316" />
        {/* Speed lines */}
        <path d="M10 80 L20 82" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 87 L18 87" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'office-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Office desk */}
        <rect x="15" y="50" width="50" height="5" rx="1" fill="#92400e" />
        <rect x="18" y="55" width="4" height="20" rx="1" fill="#92400e" />
        <rect x="58" y="55" width="4" height="20" rx="1" fill="#92400e" />
        {/* Computer monitor */}
        <rect x="30" y="30" width="25" height="18" rx="2" fill="#1f2937" />
        <rect x="32" y="32" width="21" height="14" rx="1" fill="#bfdbfe" />
        <rect x="40" y="48" width="5" height="4" fill="#1f2937" />
        <rect x="35" y="50" width="15" height="2" rx="1" fill="#1f2937" />
        {/* Office chair */}
        <ellipse cx="80" cy="60" rx="12" ry="8" fill="#f97316" />
        <rect x="77" y="60" width="6" height="15" rx="1" fill="#1f2937" />
        <ellipse cx="80" cy="78" rx="10" ry="3" fill="#1f2937" />
        {/* Files/papers */}
        <rect x="20" y="35" width="8" height="12" rx="1" fill="#fdba74" />
        <rect x="22" y="37" width="4" height="1" fill="#ea580c" />
        <rect x="22" y="40" width="4" height="1" fill="#ea580c" />
        {/* Moving box with office supplies */}
        <rect x="70" y="30" width="22" height="18" rx="2" fill="#ea580c" />
        <path d="M75 39 L87 39" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'same-building-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Building */}
        <rect x="25" y="20" width="50" height="65" rx="2" fill="#f97316" />
        {/* Windows - different floors */}
        {[0, 1, 2, 3].map((row) => (
          [0, 1, 2].map((col) => (
            <rect key={`bldg-${row}-${col}`} x={30 + col * 15} y={25 + row * 15} width="10" height="10" rx="1" fill={row === 1 && col === 1 ? "#fdba74" : row === 3 && col === 1 ? "#22c55e" : "#bfdbfe"} />
          ))
        )).flat()}
        {/* Arrow between floors */}
        <path d="M85 40 L85 70" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M80 65 L85 72 L90 65" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Elevator */}
        <rect x="42" y="70" width="16" height="15" rx="1" fill="#1f2937" />
        <path d="M47 77 L50 73 L53 77" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M47 80 L50 84 L53 80" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Small box icon */}
        <rect x="10" y="45" width="12" height="10" rx="1" fill="#ea580c" />
      </svg>
    ),
    'hourly-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Stopwatch */}
        <circle cx="50" cy="50" r="30" fill="#f97316" />
        <circle cx="50" cy="50" r="25" fill="white" />
        {/* Button on top */}
        <rect x="47" y="12" width="6" height="10" rx="2" fill="#1f2937" />
        {/* Crown/ring */}
        <rect x="45" y="18" width="10" height="4" rx="1" fill="#ea580c" />
        {/* Clock marks */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = Math.round((50 + 20 * Math.cos(angle)) * 100) / 100;
          const y1 = Math.round((50 + 20 * Math.sin(angle)) * 100) / 100;
          const x2 = Math.round((50 + 23 * Math.cos(angle)) * 100) / 100;
          const y2 = Math.round((50 + 23 * Math.sin(angle)) * 100) / 100;
          return <line key={`mark-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1f2937" strokeWidth="2" />;
        })}
        {/* Hands */}
        <circle cx="50" cy="50" r="3" fill="#1f2937" />
        <path d="M50 50 L50 32" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 50 L62 55" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        {/* Dollar signs */}
        <text x="20" y="88" fill="#f97316" fontSize="14" fontWeight="bold">$</text>
        <text x="50" y="92" fill="#f97316" fontSize="14" fontWeight="bold">/hr</text>
      </svg>
    ),
    'special-needs-moving': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Wheelchair symbol */}
        <circle cx="50" cy="45" r="25" fill="#f97316" />
        {/* Person in wheelchair */}
        <circle cx="50" cy="35" r="6" fill="white" />
        <rect x="46" y="41" width="8" height="12" rx="2" fill="white" />
        <path d="M42 50 L58 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="55" cy="58" r="6" stroke="white" strokeWidth="3" fill="none" />
        <path d="M48 53 L48 58 L55 58" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Heart showing care */}
        <path d="M75 25 C75 20 80 15 85 20 C90 15 95 20 95 25 C95 35 85 45 85 45 C85 45 75 35 75 25" fill="#f97316" />
        {/* Boxes */}
        <rect x="15" y="65" width="20" height="18" rx="2" fill="#fdba74" />
        <rect x="65" y="70" width="22" height="15" rx="2" fill="#ea580c" />
        <path d="M70 78 L82 78" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Helping hand */}
        <path d="M40 75 L40 85 Q40 90 45 90 L55 90" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
    'junk-removal': (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Dumpster body */}
        <path d="M15 45 L20 80 L80 80 L85 45 Z" fill="#f97316" />
        <path d="M15 45 L85 45 L82 55 L18 55 Z" fill="#ea580c" />
        {/* Junk items sticking out */}
        <rect x="30" y="28" width="8" height="20" rx="1" fill="#1f2937" />
        <circle cx="55" cy="35" r="8" fill="#fdba74" />
        <rect x="62" y="30" width="12" height="4" rx="1" fill="#1f2937" transform="rotate(-20 68 32)" />
        <path d="M40 32 L48 25 L44 38 Z" fill="#1f2937" />
        {/* Wheels */}
        <circle cx="30" cy="83" r="5" fill="#1f2937" />
        <circle cx="70" cy="83" r="5" fill="#1f2937" />
        <circle cx="30" cy="83" r="2" fill="#f97316" />
        <circle cx="70" cy="83" r="2" fill="#f97316" />
        {/* Recycling arrows on side */}
        <path d="M42 65 L50 58 L58 65" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M50 58 L50 72" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  };

  // Default illustration for unknown services
  const defaultIllustration = (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Generic moving box */}
      <rect x="20" y="35" width="60" height="45" rx="3" fill="#f97316" />
      <rect x="20" y="35" width="60" height="12" rx="3" fill="#ea580c" />
      <path d="M35 41 L65 41" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Panda face on box */}
      <circle cx="50" cy="62" r="15" fill="white" />
      <ellipse cx="42" cy="58" rx="5" ry="6" fill="#1f2937" />
      <ellipse cx="58" cy="58" rx="5" ry="6" fill="#1f2937" />
      <circle cx="43" cy="57" r="2" fill="white" />
      <circle cx="59" cy="57" r="2" fill="white" />
      <ellipse cx="50" cy="66" rx="4" ry="3" fill="#1f2937" />
      <circle cx="50" cy="70" r="2" fill="#f97316" />
    </svg>
  );

  return illustrations[service] || defaultIllustration;
}

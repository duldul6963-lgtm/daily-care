import React from 'react';

interface PandaProps {
  className?: string;
  size?: number | string;
}

export const WavingPanda: React.FC<PandaProps> = ({ className = 'w-32 h-32', size }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} transition-transform duration-300`}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Ears */}
    <circle cx="50" cy="55" r="28" fill="#292524" />
    <circle cx="50" cy="55" r="16" fill="#44403C" />
    <circle cx="150" cy="55" r="28" fill="#292524" />
    <circle cx="150" cy="55" r="16" fill="#44403C" />

    {/* Body */}
    <ellipse cx="100" cy="148" rx="65" ry="46" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="100" cy="148" rx="44" ry="30" fill="#FFFFFF" />

    {/* Right arm resting, Left arm waving */}
    <ellipse cx="46" cy="145" rx="18" ry="14" fill="#292524" transform="rotate(-15 46 145)" />
    <ellipse cx="160" cy="115" rx="18" ry="14" fill="#292524" transform="rotate(45 160 115)" />

    {/* Head */}
    <ellipse cx="100" cy="92" rx="62" ry="54" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="3" />

    {/* Eye Patches */}
    <ellipse cx="70" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(-12 70 86)" />
    <ellipse cx="130" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(12 130 86)" />

    {/* Friendly Bright Eyes */}
    <circle cx="70" cy="84" r="7" fill="#FFFFFF" />
    <circle cx="71" cy="83" r="3.5" fill="#1E293B" />
    <circle cx="69" cy="81" r="1.5" fill="#FFFFFF" />

    <circle cx="130" cy="84" r="7" fill="#FFFFFF" />
    <circle cx="129" cy="83" r="3.5" fill="#1E293B" />
    <circle cx="131" cy="81" r="1.5" fill="#FFFFFF" />

    {/* Cheerful Blush */}
    <ellipse cx="56" cy="106" rx="11" ry="6" fill="#FED7AA" opacity="0.8" />
    <ellipse cx="144" cy="106" rx="11" ry="6" fill="#FED7AA" opacity="0.8" />

    {/* Nose & Smile */}
    <ellipse cx="100" cy="98" rx="8" ry="5.5" fill="#292524" />
    <path d="M92 105 Q100 114 108 105" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Sparkle */}
    <path d="M175 90 L178 95 L183 97 L178 99 L175 104 L172 99 L167 97 L172 95 Z" fill="#FBBF24" />
  </svg>
);

export const ThumbsUpPanda: React.FC<PandaProps> = ({ className = 'w-32 h-32', size }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} transition-transform duration-300`}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="55" r="28" fill="#292524" />
    <circle cx="150" cy="55" r="28" fill="#292524" />
    <ellipse cx="100" cy="148" rx="65" ry="46" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="100" cy="148" rx="44" ry="30" fill="#FFFFFF" />

    {/* Bamboo in hand */}
    <path d="M46 160 Q52 120 58 85" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
    <path d="M52 110 Q62 105 68 95" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="#34D399" />

    <ellipse cx="50" cy="142" rx="18" ry="14" fill="#292524" transform="rotate(-15 50 142)" />
    <ellipse cx="145" cy="135" rx="18" ry="14" fill="#292524" transform="rotate(20 145 135)" />
    <circle cx="160" cy="122" r="9" fill="#292524" />
    <rect x="157" y="110" width="7" height="15" rx="3.5" fill="#292524" />

    <ellipse cx="100" cy="92" rx="62" ry="54" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="70" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(-12 70 86)" />
    <ellipse cx="130" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(12 130 86)" />

    <path d="M63 86 Q70 77 77 86" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M123 86 Q130 77 137 86" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />

    <ellipse cx="56" cy="106" rx="11" ry="6" fill="#FED7AA" opacity="0.8" />
    <ellipse cx="144" cy="106" rx="11" ry="6" fill="#FED7AA" opacity="0.8" />
    <ellipse cx="100" cy="98" rx="8" ry="5.5" fill="#292524" />
    <path d="M92 105 Q100 115 108 105" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const WaterPanda: React.FC<PandaProps> = ({ className = 'w-32 h-32', size }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} transition-transform duration-300`}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="55" r="28" fill="#292524" />
    <circle cx="150" cy="55" r="28" fill="#292524" />
    <ellipse cx="100" cy="148" rx="65" ry="46" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="100" cy="148" rx="44" ry="30" fill="#FFFFFF" />

    <rect x="88" y="128" width="24" height="34" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
    <rect x="90" y="142" width="20" height="18" rx="2" fill="#38BDF8" opacity="0.85" />
    <line x1="97" y1="114" x2="105" y2="152" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

    <ellipse cx="74" cy="144" rx="14" ry="11" fill="#292524" transform="rotate(-20 74 144)" />
    <ellipse cx="126" cy="144" rx="14" ry="11" fill="#292524" transform="rotate(20 126 144)" />

    <ellipse cx="100" cy="92" rx="62" ry="54" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="70" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(-12 70 86)" />
    <ellipse cx="130" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(12 130 86)" />

    <circle cx="70" cy="85" r="7" fill="#FFFFFF" />
    <circle cx="72" cy="84" r="3.5" fill="#1E293B" />
    <circle cx="130" cy="85" r="7" fill="#FFFFFF" />
    <circle cx="128" cy="84" r="3.5" fill="#1E293B" />

    <ellipse cx="56" cy="106" rx="10" ry="6" fill="#BAE6FD" opacity="0.6" />
    <ellipse cx="144" cy="106" rx="10" ry="6" fill="#BAE6FD" opacity="0.6" />
    <ellipse cx="100" cy="98" rx="8" ry="5.5" fill="#292524" />
    <path d="M94 105 Q100 112 106 105" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />

    <path
      d="M100 35 C100 35 92 47 92 53 C92 58 95.5 61 100 61 C104.5 61 108 58 108 53 C108 47 100 35 100 35 Z"
      fill="#0EA5E9"
    />
  </svg>
);

export const CheeringPanda: React.FC<PandaProps> = ({ className = 'w-32 h-32', size }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} transition-transform duration-300`}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="35" cy="45" r="4" fill="#10B981" />
    <circle cx="165" cy="40" r="4" fill="#3B82F6" />
    <path d="M100 15 L103 21 L109 23 L103 25 L100 31 L97 25 L91 23 L97 21 Z" fill="#FBBF24" />

    <circle cx="50" cy="55" r="28" fill="#292524" />
    <circle cx="150" cy="55" r="28" fill="#292524" />
    <ellipse cx="100" cy="148" rx="65" ry="46" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="100" cy="148" rx="44" ry="30" fill="#FFFFFF" />

    <ellipse cx="40" cy="115" rx="18" ry="14" fill="#292524" transform="rotate(-45 40 115)" />
    <ellipse cx="160" cy="115" rx="18" ry="14" fill="#292524" transform="rotate(45 160 115)" />

    <ellipse cx="100" cy="92" rx="62" ry="54" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="70" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(-12 70 86)" />
    <ellipse cx="130" cy="86" rx="20" ry="24" fill="#292524" transform="rotate(12 130 86)" />

    <path d="M62 88 Q70 78 78 88" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M122 88 Q130 78 138 88" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />

    <ellipse cx="56" cy="106" rx="12" ry="7" fill="#FED7AA" opacity="0.85" />
    <ellipse cx="144" cy="106" rx="12" ry="7" fill="#FED7AA" opacity="0.85" />
    <ellipse cx="100" cy="97" rx="8" ry="5.5" fill="#292524" />
    <path d="M90 104 Q100 122 110 104 Z" fill="#34D399" stroke="#292524" strokeWidth="2.5" />
  </svg>
);

export const SleepingPanda: React.FC<PandaProps> = ({ className = 'w-32 h-32', size }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} transition-transform duration-300`}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Crescent Moon in sky */}
    <path
      d="M165 30 A18 18 0 1 0 178 52 A14 14 0 1 1 165 30 Z"
      fill="#FBBF24"
    />
    {/* Floating Zzz */}
    <text x="145" y="75" fill="#818CF8" fontSize="16" fontWeight="bold" fontFamily="sans-serif">z</text>
    <text x="156" y="62" fill="#A5B4FC" fontSize="13" fontWeight="bold" fontFamily="sans-serif">z</text>
    <text x="165" y="50" fill="#C7D2FE" fontSize="10" fontWeight="bold" fontFamily="sans-serif">z</text>

    {/* Ears */}
    <circle cx="50" cy="65" r="26" fill="#292524" />
    <circle cx="150" cy="65" r="26" fill="#292524" />

    {/* Soft Pillow / Cloud */}
    <ellipse cx="100" cy="160" rx="75" ry="25" fill="#EDE9FE" stroke="#DDD6FE" strokeWidth="3" />

    {/* Sleeping Panda Body resting */}
    <ellipse cx="100" cy="138" rx="60" ry="38" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="100" cy="138" rx="42" ry="24" fill="#FFFFFF" />

    {/* Paws tucked in */}
    <ellipse cx="65" cy="148" rx="14" ry="10" fill="#292524" />
    <ellipse cx="135" cy="148" rx="14" ry="10" fill="#292524" />

    {/* Head resting down */}
    <ellipse cx="100" cy="100" rx="58" ry="48" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="3" />

    {/* Eye Patches */}
    <ellipse cx="72" cy="96" rx="18" ry="20" fill="#292524" transform="rotate(-10 72 96)" />
    <ellipse cx="128" cy="96" rx="18" ry="20" fill="#292524" transform="rotate(10 128 96)" />

    {/* Peaceful Sleeping Curved Closed Eyes (- -) */}
    <path d="M64 96 Q72 102 80 96" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M120 96 Q128 102 136 96" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />

    {/* Soft Sleepy Blush */}
    <ellipse cx="58" cy="110" rx="10" ry="5" fill="#FED7AA" opacity="0.8" />
    <ellipse cx="142" cy="110" rx="10" ry="5" fill="#FED7AA" opacity="0.8" />

    {/* Nose & tiny calm sleeping smile */}
    <ellipse cx="100" cy="106" rx="7" ry="5" fill="#292524" />
    <path d="M96 112 Q100 116 104 112" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const CozyTeaPanda: React.FC<PandaProps> = ({ className = 'w-32 h-32', size }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} transition-transform duration-300`}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Ears */}
    <circle cx="50" cy="55" r="28" fill="#292524" />
    <circle cx="150" cy="55" r="28" fill="#292524" />

    {/* Body */}
    <ellipse cx="100" cy="148" rx="65" ry="46" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="3" />
    <ellipse cx="100" cy="148" rx="44" ry="30" fill="#FFFFFF" />

    {/* Cozy Warm Scarf */}
    <path d="M60 118 Q100 134 140 118 L138 132 Q100 148 62 132 Z" fill="#F472B6" />
    <rect x="115" y="128" width="16" height="32" rx="4" fill="#F472B6" transform="rotate(10 115 128)" />

    {/* Warm Tea Mug held gently in paws */}
    <rect x="86" y="136" width="28" height="26" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
    <path d="M114 142 Q122 142 122 150 Q122 156 114 156" stroke="#D97706" strokeWidth="2" fill="none" />
    {/* Tea steam */}
    <path d="M94 130 Q97 122 93 116 M104 130 Q107 122 103 116" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

    {/* Arms holding mug */}
    <ellipse cx="76" cy="146" rx="14" ry="11" fill="#292524" transform="rotate(-15 76 146)" />
    <ellipse cx="124" cy="146" rx="14" ry="11" fill="#292524" transform="rotate(15 124 146)" />

    {/* Head */}
    <ellipse cx="100" cy="90" rx="60" ry="52" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="3" />

    {/* Eye Patches */}
    <ellipse cx="70" cy="84" rx="20" ry="24" fill="#292524" transform="rotate(-12 70 84)" />
    <ellipse cx="130" cy="84" rx="20" ry="24" fill="#292524" transform="rotate(12 130 84)" />

    {/* Happy gentle relaxed eyes */}
    <circle cx="70" cy="83" r="7" fill="#FFFFFF" />
    <circle cx="71" cy="82" r="3.5" fill="#1E293B" />
    <circle cx="130" cy="83" r="7" fill="#FFFFFF" />
    <circle cx="129" cy="82" r="3.5" fill="#1E293B" />

    {/* Warm Pink Cheeks */}
    <ellipse cx="56" cy="102" rx="11" ry="6" fill="#FBCFE8" opacity="0.9" />
    <ellipse cx="144" cy="102" rx="11" ry="6" fill="#FBCFE8" opacity="0.9" />

    {/* Nose & Sweet Grateful Smile */}
    <ellipse cx="100" cy="96" rx="8" ry="5.5" fill="#292524" />
    <path d="M92 103 Q100 112 108 103" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

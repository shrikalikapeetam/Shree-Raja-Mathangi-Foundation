type Ornament = "sun" | "leaves" | "arches" | "rings" | "diamonds";

/** Decorative linework only; content and focusable elements remain above it. */
export default function SectionOrnament({ kind = "leaves" }: { kind?: Ornament }) {
  return (
    <span aria-hidden="true" className={`slice-ornament slice-ornament--${kind}`}>
      <svg viewBox="0 0 240 240" fill="none" focusable="false" stroke="currentColor" strokeWidth="1">
        {kind === "sun" && <>
          <circle cx="120" cy="120" r="48" />
          <circle cx="120" cy="120" r="61" />
          {Array.from({ length: 16 }, (_, index) => (
            <path key={index} d="M120 38V17 M114 29L120 17L126 29" transform={`rotate(${index * 22.5} 120 120)`} />
          ))}
        </>}
        {kind === "leaves" && <>
          <path d="M20 232C60 196 104 135 176 18M81 164C102 168 143 164 183 128M119 104C104 85 92 56 96 25" />
          <path d="M51 201C26 171 35 145 57 129C66 158 63 181 51 201ZM74 173C106 173 124 152 124 128C94 135 81 149 74 173ZM97 138C71 115 70 86 80 65C100 88 107 111 97 138ZM127 94C151 101 177 87 187 64C156 64 139 77 127 94ZM151 57C133 30 148 12 169 5C173 29 165 45 151 57ZM116 162C117 137 138 121 158 121C151 144 134 157 116 162ZM146 152C162 155 183 147 197 127C173 125 156 135 146 152Z" />
        </>}
        {kind === "arches" && <>
          {[0, 18, 36, 54].map((inset) => <path key={inset} d={`M${24 + inset} 235V115C${24 + inset} ${45 + inset} 120 ${16 + inset} 120 ${16 + inset}S${216 - inset} ${45 + inset} ${216 - inset} 115V235`} />)}
        </>}
        {kind === "rings" && <>
          {[35, 57, 79, 101].map(radius => <circle key={radius} cx="120" cy="120" r={radius} />)}
          <path d="M0 120H240M120 0V240" />
        </>}
        {kind === "diamonds" && <>
          {[36, 60, 84, 108].map(radius => <path key={radius} d={`M120 ${120 - radius}L${120 + radius} 120L120 ${120 + radius}L${120 - radius} 120Z`} />)}
        </>}
      </svg>
    </span>
  );
}

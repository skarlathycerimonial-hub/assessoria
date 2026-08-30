import type { AvatarConfig } from "@/lib/avatar/types";
import { hairColorOptions, skinToneOptions } from "@/lib/avatar/types";

function hexFor<T extends { value: string; hex: string }>(options: T[], value: string) {
  return options.find((o) => o.value === value)?.hex ?? options[0].hex;
}

export function CoupleAvatar({
  config,
  size = 64,
  flip = false,
  className = "",
}: {
  config: AvatarConfig;
  size?: number;
  flip?: boolean;
  className?: string;
}) {
  const skin = hexFor(skinToneOptions, config.skinTone);
  const hair = hexFor(hairColorOptions, config.hairColor);
  const isDress = config.outfit === "vestido";
  const outfitColor = isDress ? "#a67c52" : "#33302c";

  return (
    <svg
      viewBox="0 0 120 160"
      width={size}
      height={(size * 160) / 120}
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* hair (behind head) */}
      {config.hairStyle === "longo_solto" && (
        <ellipse cx="60" cy="60" rx="30" ry="46" fill={hair} />
      )}
      {(config.hairStyle === "preso" || config.hairStyle === "curto") && (
        <ellipse cx="60" cy="48" rx="27" ry={config.hairStyle === "preso" ? 28 : 26} fill={hair} />
      )}
      {config.hairStyle === "preso" && <circle cx="60" cy="19" r="8" fill={hair} />}

      {/* neck */}
      <rect x="50" y="68" width="20" height="20" fill={skin} />

      {/* body / outfit */}
      {isDress ? (
        <>
          <path d="M20,150 L38,92 L82,92 L100,150 Z" fill={outfitColor} />
          <path d="M54,92 L60,107 L66,92 Z" fill={skin} />
        </>
      ) : (
        <>
          <path d="M32,150 L38,92 L82,92 L88,150 Z" fill={outfitColor} />
          <path d="M50,92 L60,112 L47,99 Z" fill="#f5efe6" />
          <path d="M70,92 L60,112 L73,99 Z" fill="#f5efe6" />
          <rect x="57" y="97" width="6" height="28" fill="#a67c52" />
        </>
      )}

      {/* head */}
      <circle cx="60" cy="50" r="24" fill={skin} />
    </svg>
  );
}

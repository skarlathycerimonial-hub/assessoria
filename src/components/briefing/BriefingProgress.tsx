import { CoupleAvatar } from "@/components/avatar/CoupleAvatar";
import { defaultAvatar1, defaultAvatar2, type AvatarConfig } from "@/lib/avatar/types";

function encouragement(stepIndex: number, totalSteps: number) {
  const remaining = totalSteps - stepIndex - 1;
  if (remaining === 0) return "Última etapa! Vocês chegaram até aqui 🎉";
  if (remaining === 1) return "Falta só mais 1 etapinha!";
  if (stepIndex === 0) return `${totalSteps} etapas rapidinhas até vocês estarem prontos.`;
  return `Faltam só mais ${remaining} etapas. Vocês estão indo muito bem!`;
}

export function BriefingProgress({
  stepIndex,
  totalSteps,
  avatar1,
  avatar2,
  saving,
}: {
  stepIndex: number;
  totalSteps: number;
  avatar1?: AvatarConfig;
  avatar2?: AvatarConfig;
  saving?: boolean;
}) {
  const progress = (stepIndex + 1) / totalSteps;
  // each avatar travels from its edge (0%) to just short of center (42%) as progress goes 0 -> 1
  const travel = progress * 42;

  return (
    <div className="mb-8">
      <div className="relative h-16 mb-2">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-brand-soft overflow-hidden">
          <div
            className="h-full rounded-full bg-brand transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-y-[60%] transition-all duration-500"
          style={{ left: `calc(${travel}% - 20px)` }}
        >
          <CoupleAvatar config={avatar1 ?? defaultAvatar1} size={44} />
        </div>
        <div
          className="absolute top-1/2 -translate-y-[60%] transition-all duration-500"
          style={{ right: `calc(${travel}% - 20px)` }}
        >
          <CoupleAvatar config={avatar2 ?? defaultAvatar2} size={44} flip />
        </div>
        {progress > 0.92 && (
          <div className="absolute left-1/2 top-0 -translate-x-1/2 text-xl">💍</div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Etapa {stepIndex + 1} de {totalSteps}
          {saving !== undefined && <span className="ml-2">· {saving ? "salvando…" : "salvo"}</span>}
        </span>
        <span className="text-brand-dark font-medium">{encouragement(stepIndex, totalSteps)}</span>
      </div>
    </div>
  );
}

export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-1.5">
      <h2 className="displayText text-[2rem] font-semibold">{title}</h2>
      {subtitle ? <p className="text-[.97rem] text-black/60">{subtitle}</p> : null}
    </div>
  );
}

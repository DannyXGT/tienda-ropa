import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { getStyles } from "@/lib/catalog";

export default async function StylesPage() {
  const styles = await getStyles();

  return (
    <div className="mx-auto max-w-7xl space-y-4 md:space-y-5">
      <SectionTitle
        title="Estilos"
        subtitle="Selecciona una seccion para ver las piezas disponibles."
      />

      {!styles.length && (
        <div className="card p-6 text-black/60">Aun no hay estilos disponibles por ahora.</div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {styles.map((style) => (
          <Link
            key={style.id}
            href={`/estilos/${style.id}`}
            className="card cardHover group rounded-2xl border border-white/10 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[1.02rem] font-semibold tracking-tight">{style.name}</div>
                <div className="mt-1 text-sm text-black/60">
                  {style.productCount} producto{style.productCount === 1 ? "" : "s"}
                </div>
              </div>
              <span className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-semibold">Ver</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-black/62">
              <p>Descubre piezas seleccionadas en {style.name.toLowerCase()}.</p>
              <span aria-hidden className="text-base">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { getStyles } from "@/lib/catalog";

export default async function StylesPage() {
  const styles = await getStyles();

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Estilos"
        subtitle="Selecciona una seccion para ver las piezas disponibles."
      />

      {!styles.length && (
        <div className="card p-6 text-black/60">Aun no hay estilos disponibles por ahora.</div>
      )}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {styles.map((style) => (
          <Link
            key={style.id}
            href={`/estilos/${style.id}`}
            className="card cardHover group p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[1.02rem] font-semibold tracking-tight">{style.name}</div>
                <div className="mt-1 text-sm text-black/60">
                  {style.productCount} producto{style.productCount === 1 ? "" : "s"}
                </div>
              </div>
              <span className="rounded-full border border-black/10 px-2 py-1 text-xs font-semibold group-hover:border-black/20">
                Ver
              </span>
            </div>
            <p className="mt-3 text-sm text-black/62">Descubre piezas seleccionadas en {style.name.toLowerCase()}.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

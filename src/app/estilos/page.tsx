import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { getStyles } from "@/lib/catalog";

export default async function StylesPage() {
  const styles = await getStyles();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Estilos"
        subtitle="Selecciona una seccion para ver las piezas disponibles."
      />

      {!styles.length && (
        <div className="card p-6 text-black/60">Aun no hay estilos disponibles por ahora.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {styles.map((style) => (
          <Link
            key={style.id}
            href={`/estilos/${style.id}`}
            className="card p-6 hover:shadow-[0_18px_40px_rgba(0,0,0,.08)] transition"
          >
            <div className="text-lg font-semibold">{style.name}</div>
            <div className="mt-1 text-sm text-black/60">
              {style.productCount} producto{style.productCount === 1 ? "" : "s"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

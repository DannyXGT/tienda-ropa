export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="containerX">
        <div className="card revealIn p-7">
          <div className="grid gap-7 md:grid-cols-3">
            <div>
              <div className="text-[1.08rem] font-semibold tracking-tight">bea milli&apos;s</div>
              <p className="mt-2 text-sm muted">
                Boutique femenina con piezas seleccionadas, colores reales y pedido agil por
                WhatsApp.
              </p>
            </div>

            <div>
              <div className="text-[.83rem] font-black uppercase tracking-[0.18em] text-black/55">
                Informacion
              </div>
              <ul className="mt-2.5 space-y-1.5 text-sm muted">
                <li>Envios en ciudad y departamentos</li>
                <li>Cambios segun disponibilidad</li>
                <li>Atencion de lunes a sabado</li>
              </ul>
            </div>

            <div>
              <div className="text-[.83rem] font-black uppercase tracking-[0.18em] text-black/55">
                Contacto
              </div>
              <p className="mt-2.5 text-sm muted">
                Atencion directa por WhatsApp. Confirmamos disponibilidad, total y tiempo de
                entrega en chat.
              </p>
              <div className="mt-4 text-xs muted">(c) {new Date().getFullYear()} bea milli&apos;s</div>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </footer>
  );
}

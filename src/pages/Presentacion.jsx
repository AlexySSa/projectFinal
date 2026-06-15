import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import './presentacion.css'

const heroStats = [
  { value: '4', label: 'categorias listas para la demo', icon: 'dashboard_customize' },
  { value: '2', label: 'roles principales en la plataforma', icon: 'groups' },
  { value: '1', label: 'flujo de reserva y pago integrado', icon: 'bolt' },
]

const capabilities = [
  {
    icon: 'travel_explore',
    title: 'Explora en un solo lugar',
    text: 'Reune autos, motocicletas, maquinaria pesada y categoria agricola en una experiencia simple de navegar.',
  },
  {
    icon: 'event_available',
    title: 'Reserva con disponibilidad real',
    text: 'Consulta fechas ocupadas, evita cruces y muestra una ruta clara para confirmar una reserva.',
  },
  {
    icon: 'sell',
    title: 'Publica y administra vehiculos',
    text: 'El arrendador puede crear unidades, gestionar su catalogo y mantener visible su oferta.',
  },
  {
    icon: 'payments',
    title: 'Conecta pago, factura y control',
    text: 'Integra PayPal, favoritos, facturas y panel administrativo para cerrar el ciclo completo.',
  },
]

const objectives = [
  {
    icon: 'sync_alt',
    title: 'Digitalizar el proceso',
    text: 'Pasar de mensajes dispersos y acuerdos informales a un flujo ordenado, medible y reproducible.',
  },
  {
    icon: 'verified',
    title: 'Transmitir confianza',
    text: 'Mostrar una interfaz seria, clara y utilizable que se sienta como producto real y no solo como prototipo.',
  },
  {
    icon: 'school',
    title: 'Demostrar nivel universitario',
    text: 'Presentar una solucion que combine experiencia visual, arquitectura funcional y objetivos concretos.',
  },
]

const flow = [
  {
    step: 'Descubrir',
    text: 'La persona entra, entiende la propuesta y ve de inmediato las categorias principales.',
  },
  {
    step: 'Comparar',
    text: 'Explora fichas, favoritos y detalle del vehiculo con informacion suficiente para decidir.',
  },
  {
    step: 'Reservar',
    text: 'Selecciona fechas disponibles y confirma con una experiencia guiada y facil de explicar en el stand.',
  },
  {
    step: 'Gestionar',
    text: 'El sistema contempla pagos, facturacion y vistas administrativas para completar el relato del producto.',
  },
]

const techStack = [
  {
    layer: 'Frontend',
    stack: 'React + Vite',
    detail: 'Interfaz rapida, modular y ligera, ideal para una demo fluida en Hostinger.',
  },
  {
    layer: 'Backend',
    stack: 'Node + Express',
    detail: 'API sencilla, mantenible y lista para servir el build de produccion desde un mismo proceso.',
  },
  {
    layer: 'Datos',
    stack: 'MySQL',
    detail: 'Persistencia clara para usuarios, vehiculos, reservas, favoritos y facturas.',
  },
  {
    layer: 'Integraciones',
    stack: 'JWT + PayPal',
    detail: 'Autenticacion por roles y flujo de pago compatible con entornos reales o de demostracion.',
  },
]

const standReasons = [
  {
    icon: 'visibility',
    title: 'Se entiende rapido',
    text: 'La narrativa combina problema, solucion y recorrido de usuario en pocos minutos.',
  },
  {
    icon: 'tv',
    title: 'Luce bien en pantalla grande',
    text: 'Tipografia fuerte, tarjetas amplias y contraste alto para leerse a distancia.',
  },
  {
    icon: 'smart_display',
    title: 'Permite demo real',
    text: 'No depende solo del discurso: el visitante puede pasar de la presentacion al producto.',
  },
]

const nextSteps = [
  {
    icon: 'shield',
    title: 'Confianza y reputacion',
    text: 'Calificaciones, verificacion y mas controles para mejorar la seguridad de la plataforma.',
  },
  {
    icon: 'monitoring',
    title: 'Analitica y crecimiento',
    text: 'Metricas de demanda, ocupacion y conversion para tomar decisiones mas inteligentes.',
  },
  {
    icon: 'route',
    title: 'Escalado por zonas',
    text: 'Expandir categorias, ciudades y reglas de disponibilidad sin rehacer la base del sistema.',
  },
]

const gallery = [
  { label: 'Autos', src: '/img/autos.jpg' },
  { label: 'Motocicletas', src: '/img/motos.jpg' },
  { label: 'Maquinaria', src: '/img/maquinaria.jpg' },
  { label: 'Agricola', src: '/img/agricola.jpg' },
]

export default function Presentacion() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Bahn | Presentacion'

    const existingMeta = document.querySelector('meta[name="robots"]')
    const previousContent = existingMeta?.getAttribute('content') ?? null
    const meta = existingMeta || document.createElement('meta')

    if (!existingMeta) {
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }

    meta.setAttribute('content', 'noindex, nofollow, noarchive')

    return () => {
      document.title = previousTitle

      if (existingMeta) {
        if (previousContent === null) existingMeta.removeAttribute('content')
        else existingMeta.setAttribute('content', previousContent)
      } else {
        meta.remove()
      }
    }
  }, [])

  return (
    <div className="presentation-page">
      <div className="presentation-shell presentation-hero">
        <div className="presentation-topbar">
          <Link to="/" className="presentation-brand" aria-label="Ir al inicio de Bahn">
            <img className="presentation-brand-logo" src="/bahn-logo.svg" alt="Bahn Renta de Vehiculos" />
          </Link>

          <nav className="presentation-mini-nav" aria-label="Secciones de la presentacion">
            <a href="#que-es">Que es</a>
            <a href="#objetivos">Objetivos</a>
            <a href="#demo">Demo</a>
            <a href="#tecnologia">Tecnologia</a>
          </nav>
        </div>

        <div className="presentation-hero-grid">
          <div className="presentation-copy">
            <span className="presentation-kicker">Presentacion del proyecto</span>
            <h1>Una plataforma de movilidad y renta para gestionar reservas en un solo lugar.</h1>
            <p>
              Bahn convierte una idea universitaria en una experiencia con forma de producto real:
              busqueda, publicacion, reserva, pago y administracion dentro de una sola plataforma
              web lista para mostrarse en vivo.
            </p>

            <div className="presentation-hero-pills">
              <span>Universitario</span>
              <span>Renta de vehiculos</span>
              <span>Reservas y gestion</span>
            </div>

            <div className="presentation-actions">
              <a className="presentation-btn presentation-btn-primary" href="#demo">
                Ver recorrido
              </a>
              <Link className="presentation-btn presentation-btn-secondary" to="/catalogo">
                Abrir demo real
              </Link>
            </div>

            <div className="presentation-stat-grid">
              {heroStats.map((item) => (
                <article key={item.label} className="presentation-stat-card">
                  <span className="presentation-stat-icon">
                    <Icon name={item.icon} />
                  </span>
                  <strong>{item.value}</strong>
                  <p>{item.label}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="presentation-showcase">
            <div className="presentation-orbit presentation-orbit-one" />
            <div className="presentation-orbit presentation-orbit-two" />

            <div className="presentation-preview-card">
              <div className="presentation-preview-top">
                <div className="presentation-lights">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="presentation-preview-chip">bahn</span>
              </div>

              <div className="presentation-preview-copy">
                <span>Que hace</span>
                <strong>Busqueda, comparacion, reserva y gestion</strong>
                <p>Todo dentro de una misma narrativa visual, sin perder claridad ni ritmo.</p>
              </div>

              <div className="presentation-gallery">
                {gallery.map((item) => (
                  <article key={item.label} className="presentation-gallery-card">
                    <img src={item.src} alt={item.label} />
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>
            </div>

            <article className="presentation-floating-card presentation-floating-card-top">
              <span>Valor del proyecto</span>
              <strong>Proyecto funcional y propuesta clara</strong>
            </article>

            <article className="presentation-floating-card presentation-floating-card-bottom">
              <Icon name="rocket_launch" />
              <div>
                <span>Listo para explicar</span>
                <strong>en 90 segundos o en una navegacion completa</strong>
              </div>
            </article>
          </div>
        </div>
      </div>

      <main className="presentation-shell presentation-main">
        <section id="que-es" className="presentation-section">
          <div className="presentation-section-head">
            <div>
              <span className="presentation-tag">Que es</span>
              <h2>Bahn es una plataforma web para publicar, explorar y reservar vehiculos.</h2>
            </div>
            <p>
              La propuesta junta catalogo, disponibilidad, favoritos, pagos y control por roles en
              una sola experiencia. Para un stand, esto ayuda porque la idea se explica rapido y la
              demostracion se siente real desde la primera pantalla.
            </p>
          </div>

          <div className="presentation-two-col">
            <article className="presentation-story-card">
              <span className="presentation-card-tag">Identidad</span>
              <h3>Un proyecto universitario con aspiracion de producto real</h3>
              <p>
                No se presenta como una maqueta vacia. La interfaz, el flujo y la arquitectura
                cuentan una historia consistente: hacer mas facil la renta de vehiculos y
                maquinaria en un entorno digital claro y moderno.
              </p>
            </article>

            <article className="presentation-story-card">
              <span className="presentation-card-tag">Propuesta de valor</span>
              <h3>Menos friccion, mas orden, mejor experiencia</h3>
              <p>
                Centraliza informacion, reduce pasos innecesarios y ofrece visibilidad tanto para
                quien busca rentar como para quien administra la oferta disponible.
              </p>
            </article>
          </div>
        </section>

        <section className="presentation-section">
          <div className="presentation-section-head">
            <div>
              <span className="presentation-tag">Que hace</span>
              <h2>Resuelve varias piezas del proceso dentro de una sola plataforma.</h2>
            </div>
            <p>
              Eso permite que la pagina de presentacion no solo hable bonito: tambien conecta de
              inmediato con funciones concretas que ya existen en la app.
            </p>
          </div>

          <div className="presentation-grid presentation-grid-four">
            {capabilities.map((item) => (
              <article key={item.title} className="presentation-feature-card">
                <span className="presentation-feature-icon">
                  <Icon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="objetivos" className="presentation-section">
          <div className="presentation-goal-banner">
            <div>
              <span className="presentation-tag">Objetivos</span>
              <h2>Mostrar una solucion util, visualmente fuerte y tecnicamente demostrable.</h2>
            </div>
            <p>
              El objetivo general es convertir una necesidad cotidiana en una experiencia digital
              creible, escalable y facil de presentar frente a docentes, jurados o visitantes.
            </p>
          </div>

          <div className="presentation-grid presentation-grid-three">
            {objectives.map((item) => (
              <article key={item.title} className="presentation-goal-card">
                <span className="presentation-feature-icon">
                  <Icon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="presentation-section">
          <div className="presentation-problem-grid">
            <article className="presentation-problem-card presentation-problem-card-negative">
              <span className="presentation-card-tag">Problema</span>
              <h3>La renta suele depender de informacion dispersa y procesos poco claros.</h3>
              <p>
                Publicaciones incompletas, disponibilidad incierta y seguimiento manual hacen que
                la experiencia sea mas lenta y menos confiable para ambas partes.
              </p>
            </article>

            <article className="presentation-problem-card presentation-problem-card-positive">
              <span className="presentation-card-tag">Solucion</span>
              <h3>Bahn unifica catalogo, disponibilidad y conversion en un mismo flujo.</h3>
              <p>
                Esto facilita explicar el valor del proyecto porque el visitante puede ver una
                solucion concreta y luego pasar a la demostracion del producto real.
              </p>
            </article>
          </div>
        </section>

        <section id="demo" className="presentation-section">
          <div className="presentation-section-head">
            <div>
              <span className="presentation-tag">Demo</span>
              <h2>Como se cuenta y como se muestra en el stand.</h2>
            </div>
            <p>
              La pagina esta pensada para introducir el proyecto y luego abrir la aplicacion sin
              romper la historia. Primero entienden la idea, despues la ven funcionando.
            </p>
          </div>

          <div className="presentation-demo-grid">
            <article className="presentation-flow-card">
              <h3>Recorrido sugerido</h3>
              <div className="presentation-flow-list">
                {flow.map((item, index) => (
                  <div key={item.step} className="presentation-flow-item">
                    <span className="presentation-flow-step">{index + 1}</span>
                    <div>
                      <strong>{item.step}</strong>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <div className="presentation-side-stack">
              <article className="presentation-side-card">
                <span className="presentation-card-tag">Por que funciona para un stand</span>
                <div className="presentation-mini-list">
                  {standReasons.map((item) => (
                    <div key={item.title} className="presentation-mini-item">
                      <span className="presentation-mini-icon">
                        <Icon name={item.icon} />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="presentation-side-card presentation-side-card-accent">
                <span className="presentation-card-tag">Mucho mas</span>
                <h3>Un proyecto pequeno en escala, pero ambicioso en experiencia.</h3>
                <p>
                  Tiene suficiente complejidad para verse serio, pero sigue siendo claro para una
                  presentacion universitaria sin saturar a quien lo visita.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="tecnologia" className="presentation-section">
          <div className="presentation-section-head">
            <div>
              <span className="presentation-tag">Tecnologia</span>
              <h2>Una base moderna, sencilla de mantener y compatible con Hostinger.</h2>
            </div>
            <p>
              La app ya usa un backend que sirve el frontend compilado en produccion, asi que esta
              presentacion comparte el mismo despliegue y no exige una infraestructura aparte.
            </p>
          </div>

          <div className="presentation-tech-grid">
            <article className="presentation-stack-card">
              <h3>Stack del proyecto</h3>
              <div className="presentation-stack-list">
                {techStack.map((item) => (
                  <div key={item.layer} className="presentation-stack-row">
                    <span>{item.layer}</span>
                    <strong>{item.stack}</strong>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="presentation-stack-visual">
              <div className="presentation-layer-block">
                <span>Entrada privada</span>
                <strong>/presentacion</strong>
              </div>
              <div className="presentation-layer-block">
                <span>Presentacion visual</span>
                <strong>React route dedicada</strong>
              </div>
              <div className="presentation-layer-block">
                <span>Producto real</span>
                <strong>Catalogo, reserva, favoritos, admin</strong>
              </div>
              <div className="presentation-layer-block">
                <span>Produccion</span>
                <strong>Express sirviendo dist en Hostinger</strong>
              </div>
            </article>
          </div>
        </section>

        <section className="presentation-section presentation-final-section">
          <div className="presentation-final-copy">
            <span className="presentation-tag">Siguiente nivel</span>
            <h2>Hay espacio para crecer sin perder la esencia del proyecto.</h2>
            <p>
              Esta presentacion tambien deja claro que Bahn no termina en la expo: la base actual
              permite sumar reputacion, analitica y expansion por zonas con una ruta creible.
            </p>
          </div>

          <div className="presentation-grid presentation-grid-three">
            {nextSteps.map((item) => (
              <article key={item.title} className="presentation-goal-card">
                <span className="presentation-feature-icon">
                  <Icon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="presentation-closing-bar">
            <div>
              <strong>Listo para abrir solo con el link directo.</strong>
              <p>
                Sin enlace publico en la app y pensado para mostrarse en
                {' '}
                <code className="presentation-inline-code">bahn.es/presentacion</code>.
              </p>
            </div>
            <div className="presentation-actions">
              <Link className="presentation-btn presentation-btn-primary" to="/catalogo">
                Ir al catalogo
              </Link>
              <Link className="presentation-btn presentation-btn-secondary" to="/">
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

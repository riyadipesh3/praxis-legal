import { useEffect, useRef, useState, type ReactNode } from 'react'

/* ============================================================================
   PRAXIS - solicitors, Bristol.
   Trust-first brief. Layout families, each used exactly once:
     1. hero            plain typographic hero, left aligned
     2. practice        two-column list with plain descriptions
     3. charges         asymmetric 2+1 rate block
     4. people          plain row list, not cards
     5. quote           single editorial quotation
     6. enquiry         form beside contact details

   MOTION 2: the only motion on this page is a short fade on section entry.
   Nothing translates, nothing bounces, nothing loops. Scroll reveal uses
   IntersectionObserver and never a scroll listener.
   ========================================================================= */

/* Small mono-free tracked label. Budget for this page is ceil(6 / 3) = 2.
   Used once in the hero, once above the practice areas. Nowhere else. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const NAV = [
  { id: 'practice', label: 'Practice areas' },
  { id: 'charges', label: 'Charges' },
  { id: 'people', label: 'People' },
  { id: 'enquiry', label: 'Enquiry' },
]

const PRACTICE = [
  {
    title: 'Employment law',
    body: 'Restrictive covenants, settlement agreements, disciplinary hearings and collective consultation. We take the employment tribunal timetable seriously and tell you early when a claim is weak.',
    detail: 'Advice, settlement negotiation, tribunal representation',
  },
  {
    title: 'Commercial contracts',
    body: 'Supply, distribution, software as a service and shareholder agreements. Drafted to survive the supplier who changes pricing and the customer who stops paying.',
    detail: 'Drafting, review, renegotiation, exit terms',
  },
  {
    title: 'Property',
    body: 'Commercial leases, acquisitions and disposals, development agreements and licence to assign. Files are closed on the same day the completion statement is signed.',
    detail: 'Leases, acquisitions, development, finance',
  },
  {
    title: 'Dispute resolution',
    body: 'Commercial disputes from the first letter to the final hearing. Most of our matters resolve before a claim is issued, which is the outcome we plan for from day one.',
    detail: 'Mediation, pre-action, arbitration, court',
  },
]

const PEOPLE = [
  {
    name: 'Rhiannon Pritchard',
    role: 'Partner, Employment',
    bio: 'Called to the bar in 2003 and in practice since 2004. Acts for employers and for senior employees, and has appeared in more than sixty employment tribunal hearings.',
    admitted: 'Admitted 2004',
    seed: 'praxis-portrait-rhiannon-pritchard-partner',
    alt: 'Rhiannon Pritchard, partner in employment law, photographed in the Bristol office',
  },
  {
    name: 'Ewan Maunders',
    role: 'Partner, Commercial Contracts',
    bio: 'Drafts and negotiates long-term supply and framework agreements for manufacturers. Writes a widely read monthly note on force majeure and supply chain risk.',
    admitted: 'Admitted 2007',
    seed: 'praxis-portrait-ewan-maunders-contracts',
    alt: 'Ewan Maunders, partner in commercial contracts, standing by the meeting room window',
  },
  {
    name: 'Farida Haddad',
    role: 'Associate, Property',
    bio: 'Handles acquisitions and landlord side lease work for independent businesses. Built her practice on returning calls the same day, including during conveyancing weeks.',
    admitted: 'Admitted 2015',
    seed: 'praxis-portrait-farida-haddad-property',
    alt: 'Farida Haddad, associate in property, photographed against a wall of bound lease files',
  },
  {
    name: 'Jonty Ashworth',
    role: 'Associate, Dispute Resolution',
    bio: 'Commercial litigator with a mediation practice alongside court work. Usually the first person asked to take the phone call when a counterparty stops answering.',
    admitted: 'Admitted 2018',
    seed: 'praxis-portrait-jonty-ashworth-disputes',
    alt: 'Jonty Ashworth, associate in dispute resolution, seated at a desk with case files open',
  },
]

const RATES = [
  { who: 'Partner', rate: '395 per hour' },
  { who: 'Associate or senior fee-earner', rate: '245 per hour' },
  { who: 'Paralegal and support', rate: '95 per hour' },
]

type Fields = {
  name: string
  email: string
  organisation: string
  matter: string
  message: string
}

const EMPTY: Fields = {
  name: '',
  email: '',
  organisation: '',
  matter: '',
  message: '',
}

const MATTERS = [
  'Employment',
  'Commercial contracts',
  'Property',
  'Dispute resolution',
  'Something else',
]

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [values, setValues] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  function update(key: keyof Fields, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Partial<Record<keyof Fields, string>> = {}
    if (!values.name.trim()) next.name = 'Please give us a name to reply to.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = 'Please give an email address we can reach you on.'
    if (!values.matter) next.matter = 'Please choose the closest practice area.'
    if (values.message.trim().length < 12)
      next.message = 'A sentence or two about the matter helps us route it.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setState('sending')
    window.setTimeout(() => setState('sent'), 700)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-[var(--color-canvas)]"
      >
        Skip to content
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* NAV - one line at desktop, 68px, nothing decorative                */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/94 backdrop-blur-sm">
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <a
            href="#top"
            className="flex items-baseline gap-2.5 text-[var(--color-ink)]"
          >
            <span className="font-editorial text-[1.375rem] font-semibold tracking-[-0.01em]">
              Praxis
            </span>
            <span className="hidden text-[0.75rem] font-medium tracking-[0.13em] text-[var(--color-mute)] uppercase sm:inline">
              Solicitors
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[0.875rem] font-medium text-[var(--color-body)] transition-colors hover:text-[var(--color-accent)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a href="tel:+441174960218" className="hidden md:block">
            <span className="num text-[0.875rem] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]">
              0117 496 0218
            </span>
          </a>

          <button
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center border border-[var(--color-hairline)] text-[var(--color-ink)] md:hidden"
          >
            <span className="flex w-4 flex-col gap-[4px]">
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? 'translate-y-[2.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? '-translate-y-[2.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {navOpen ? (
          <div
            id="mobile-nav"
            className="border-t border-[var(--color-hairline)] md:hidden"
          >
            <nav className="shell flex flex-col py-2">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setNavOpen(false)}
                  className="border-b border-[var(--color-hairline)] py-3.5 text-[0.9375rem] font-medium text-[var(--color-ink)] last:border-b-0"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="tel:+441174960218"
                className="num py-3.5 text-[0.9375rem] font-semibold text-[var(--color-accent)]"
              >
                0117 496 0218
              </a>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main">
        {/* -------------------------------------------------------------- */}
        {/* HERO - plain typographic, left aligned, fits the first viewport   */}
        {/* -------------------------------------------------------------- */}
        <section id="top" className="shell pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="micro mb-7">Solicitors</p>
              <h1 className="editorial editorial-hero">
                Clear advice on the law
                <br />
                behind your decision.
              </h1>
              <p className="lede mt-8">
                A Bristol practice working on employment, commercial contracts,
                property and business disputes. Partners do the work.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#enquiry" className="btn btn-primary">
                  Request a callback
                </a>
                <a href="#charges" className="btn btn-secondary">
                  See our charges
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal>
                <div className="plate aspect-3/4 w-full">
                  <img
                    src="https://picsum.photos/seed/praxis-clifton-harbourside-concrete-facade/1200/1600"
                    alt="Concrete and glass office facade on the harbourside in Bristol"
                    loading="eager"
                    width={1200}
                    height={1600}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* PRACTICE AREAS - two-column list, plain descriptions             */}
        {/* -------------------------------------------------------------- */}
        <section
          id="practice"
          className="border-t border-[var(--color-hairline)] py-20 md:py-28"
        >
          <div className="shell">
            <Reveal>
              <div className="max-w-2xl">
                <p className="micro mb-6">Practice areas</p>
                <h2 className="display display-lg">
                  Four areas. Nobody here
                  <br />
                  works outside them.
                </h2>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2 md:gap-y-12">
              {PRACTICE.map((p, i) => (
                <Reveal key={p.title} delay={i * 60}>
                  <article className="border-t border-[var(--color-hairline)] pt-6">
                    <h3 className="editorial editorial-md">{p.title}</h3>
                    <p className="prose-small mt-3.5 max-w-[54ch]">{p.body}</p>
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-[var(--color-mute)]">
                      {p.detail}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CHARGES - asymmetric 2+1, a rate block and a fixed-fee block    */}
        {/* -------------------------------------------------------------- */}
        <section
          id="charges"
          className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 md:py-28"
        >
          <div className="shell">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <h2 className="display display-lg">
                  Published hourly
                  <br />
                  rates, before
                  <br />
                  you instruct us.
                </h2>
                <p className="lede mt-7">
                  Figures below exclude VAT. We will not change the rate of a
                  partner you have already instructed.
                </p>
                <dl className="mt-10">
                  {RATES.map((r) => (
                    <div
                      key={r.who}
                      className="flex items-baseline justify-between gap-6 border-b border-[var(--color-hairline)] py-4 last:border-b-0"
                    >
                      <dt className="text-[0.9375rem] font-medium text-[var(--color-ink)]">
                        {r.who}
                      </dt>
                      <dd className="num shrink-0 text-[0.9375rem] text-[var(--color-body)]">
                        {r.rate}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal className="lg:col-span-7" delay={80}>
                <div className="grid gap-px bg-[var(--color-hairline)] sm:grid-cols-2">
                  <div className="bg-[var(--color-canvas)] p-7 md:p-9">
                    <p className="text-[0.8125rem] font-semibold tracking-[-0.005em] text-[var(--color-ink)]">
                      First consultation
                    </p>
                    <p className="num mt-4 text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
                      240
                    </p>
                    <p className="prose-small mt-3">
                      Forty-five minutes with a partner, including VAT. Fixed
                      price whether the meeting runs short or long.
                    </p>
                  </div>
                  <div className="bg-[var(--color-canvas)] p-7 md:p-9">
                    <p className="text-[0.8125rem] font-semibold tracking-[-0.005em] text-[var(--color-ink)]">
                      Fixed fee work
                    </p>
                    <p className="mt-4 text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
                      Quoted in writing
                    </p>
                    <p className="prose-small mt-3">
                      Defined drafting, settlement agreements and lease
                      reviews are quoted as a fixed sum before we start.
                    </p>
                  </div>
                </div>

                <div className="mt-px bg-[var(--color-canvas)] p-7 md:p-9">
                  <p className="text-[0.8125rem] font-semibold tracking-[-0.005em] text-[var(--color-ink)]">
                    How the bill is built
                  </p>
                  <p className="prose-small mt-3 max-w-[64ch]">
                    Time is recorded in six-minute units against the matter
                    code, and you can see the running total on request. Unused
                    time on a fixed fee is not invoiced. In roughly two thirds
                    of our matters the fee is agreed before the first meeting.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* PEOPLE - plain row list. Portrait sits in the row, not a card.  */}
        {/* -------------------------------------------------------------- */}
        <section
          id="people"
          className="border-t border-[var(--color-hairline)] py-20 md:py-28"
        >
          <div className="shell">
            <Reveal>
              <div className="max-w-2xl">
                <h2 className="display display-lg">The people you will deal with</h2>
                <p className="lede mt-6">
                  Four of the nine solicitors here. The rest are in property
                  and private client work.
                </p>
              </div>
            </Reveal>

            <ul className="mt-14">
              {PEOPLE.map((person, i) => (
                <Reveal key={person.name} delay={i * 50}>
                  <li className="grid gap-6 border-t border-[var(--color-hairline)] py-8 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-2">
                      <div className="plate w-full max-w-[112px]">
                        <img
                          src={`https://picsum.photos/seed/${person.seed}/340/440`}
                          alt={person.alt}
                          loading="lazy"
                          width={340}
                          height={440}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                        {person.name}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] font-medium text-[var(--color-accent)]">
                        {person.role}
                      </p>
                      <p className="num mt-4 text-[0.8125rem] text-[var(--color-mute)]">
                        {person.admitted}
                      </p>
                    </div>
                    <div className="md:col-span-6">
                      <p className="prose-small max-w-[58ch]">{person.bio}</p>
                      <a
                        href={`mailto:${person.name.toLowerCase().split(' ')[0]}@praxis-law.co.uk`}
                        className="mt-3 inline-block text-[0.8125rem] font-medium text-[var(--color-body)] underline decoration-[var(--color-hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
                      >
                        Write to {person.name.split(' ')[0]}
                      </a>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* QUOTE - one quotation, editorial serif, three lines maximum      */}
        {/* -------------------------------------------------------------- */}
        <section className="border-t border-[var(--color-hairline)] py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <figure className="max-w-4xl">
                <blockquote className="editorial editorial-quote">
                  &ldquo;They put the commercial risk in writing before we
                  signed anything, then held the supplier to it. We settled
                  in seven weeks without a hearing.&rdquo;
                </blockquote>
                <figcaption className="mt-8 text-[0.9375rem] text-[var(--color-mute)]">
                  Devlin Markham, managing director at Corrymore Logistics Ltd
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* ENQUIRY - label above every input, real htmlFor, inline errors   */}
        {/* -------------------------------------------------------------- */}
        <section
          id="enquiry"
          className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] py-20 md:py-28"
        >
          <div className="shell">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <h2 className="display display-lg">Tell us what has happened</h2>
                <p className="lede mt-7">
                  A paragraph is enough. A partner reads every enquiry and you
                  will hear back within one working day, including when we
                  think you do not need a solicitor.
                </p>

                <dl className="mt-10 space-y-6">
                  <div>
                    <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                      Telephone
                    </dt>
                    <dd className="num mt-1.5 text-[0.9375rem]">
                      <a
                        href="tel:+441174960218"
                        className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        0117 496 0218
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                      Email
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem]">
                      <a
                        href="mailto:enquiries@praxis-law.co.uk"
                        className="text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                      >
                        enquiries@praxis-law.co.uk
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                      Office
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] leading-relaxed">
                      Second floor, 14 Redcliff Street,
                      <br />
                      Bristol BS1 6GR
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">
                      Opening hours
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem]">
                      Monday to Friday, 8:30am to 6pm
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal className="lg:col-span-7" delay={80}>
                {state === 'sent' ? (
                  <div
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-8"
                    role="status"
                  >
                    <h3 className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                      Thank you. Your enquiry is with a partner.
                    </h3>
                    <p className="prose-small mt-3 max-w-[52ch]">
                      You will have a reply within one working day. If it is
                      urgent, telephone the office on 0117 496 0218.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setValues(EMPTY)
                        setState('idle')
                      }}
                      className="btn btn-secondary mt-6"
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <form
                    className="grid gap-6 bg-[var(--color-canvas)] p-7 md:p-9"
                    onSubmit={onSubmit}
                    noValidate
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="field">
                        <label htmlFor="name" className="field-label">
                          Your name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={values.name}
                          onChange={(e) => update('name', e.target.value)}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'name-err' : 'name-hint'}
                          className="control"
                        />
                        {errors.name ? (
                          <p id="name-err" className="err">
                            {errors.name}
                          </p>
                        ) : (
                          <p id="name-hint" className="hint">
                            The partner who replies will use this name.
                          </p>
                        )}
                      </div>

                      <div className="field">
                        <label htmlFor="email" className="field-label">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={(e) => update('email', e.target.value)}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={
                            errors.email ? 'email-err' : 'email-hint'
                          }
                          className="control"
                        />
                        {errors.email ? (
                          <p id="email-err" className="err">
                            {errors.email}
                          </p>
                        ) : (
                          <p id="email-hint" className="hint">
                            Used only to reply to you.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="organisation" className="field-label">
                        Organisation, if any
                      </label>
                      <input
                        id="organisation"
                        name="organisation"
                        type="text"
                        value={values.organisation}
                        onChange={(e) => update('organisation', e.target.value)}
                        aria-describedby="organisation-hint"
                        className="control"
                      />
                      <p id="organisation-hint" className="hint">
                        Leave this blank if you are asking for yourself.
                      </p>
                    </div>

                    <div className="field">
                      <label htmlFor="matter" className="field-label">
                        Closest practice area
                      </label>
                      <select
                        id="matter"
                        name="matter"
                        value={values.matter}
                        onChange={(e) => update('matter', e.target.value)}
                        aria-invalid={Boolean(errors.matter)}
                        aria-describedby={
                          errors.matter ? 'matter-err' : 'matter-hint'
                        }
                        className="control"
                      >
                        <option value="">Choose one</option>
                        {MATTERS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      {errors.matter ? (
                        <p id="matter-err" className="err">
                          {errors.matter}
                        </p>
                      ) : (
                        <p id="matter-hint" className="hint">
                          We will move it to a colleague if it belongs elsewhere.
                        </p>
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="message" className="field-label">
                        What has happened
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={values.message}
                        onChange={(e) => update('message', e.target.value)}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={
                          errors.message ? 'message-err' : 'message-hint'
                        }
                        className="control resize-y"
                      />
                      {errors.message ? (
                        <p id="message-err" className="err">
                          {errors.message}
                        </p>
                      ) : (
                        <p id="message-hint" className="hint">
                          Dates and documents you already hold are useful.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={state === 'sending'}
                      >
                        {state === 'sending' ? 'Sending' : 'Send enquiry'}
                      </button>
                      <p className="text-[0.8125rem] text-[var(--color-mute)]">
                        Please do not send anything confidential until we have a
                        conflict check.
                      </p>
                    </div>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER - credit rendered as plain visible text, once, small        */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-[var(--color-hairline)] py-12">
        <div className="shell">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-editorial text-[1.125rem] font-semibold text-[var(--color-ink)]">
                Praxis
              </p>
              <p className="mt-2 max-w-[42ch] text-[0.8125rem] leading-relaxed text-[var(--color-mute)]">
                Praxis Solicitors LLP, registered in England and Wales. Second
                floor, 14 Redcliff Street, Bristol BS1 6GR.
              </p>
            </div>

            <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-[0.8125rem] text-[var(--color-mute)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--color-hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.75rem] leading-relaxed text-[var(--color-mute)]">
              Sample template. Names, rates and figures are illustrative.
            </p>
            <p className="text-[0.8125rem] text-[var(--color-mute)]">
              Developed by{' '}
              <a
                href="https://thediyadevelopers.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--color-body)] underline decoration-[var(--hairline-strong)] underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
              >
                Diya Developers
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

# Visual refinement — Liberty Digital Consulting

**Date:** 2026-08-11
**Scope:** Whole site (tokens, homepage, services, about, contact, legal)
**Direction:** Refine the existing brand. Keep the deep green + gold palette and the
serif / Manrope pairing. Fix the system underneath them.

## Problem

Three issues, in order of impact.

**1. Layered background noise.** `src/app/globals.css` defines eight overlapping surface
classes — `.premium-light-section`, `.section-band`, `.section-band-deep`,
`.premium-panel`, `.surface-card`, `.luxury-section`, `.luxury-glass`, plus
`.site-stage::before/::after`. Several stack six to eight gradients each; `.section-band`
alone carries eight background layers plus inset shadows. `.site-stage` additionally
paints a `position: fixed` radial wash and a 120px grid behind the entire page.

Effect: every section is a slightly different beige carrying a slightly different grid.
Because everything is textured, nothing reads as emphasis. A section's surface is
currently chosen ad hoc, so hierarchy cannot be inherited. The fixed layers plus
`backdrop-filter` on static cards also force repaints during scroll.

**2. The hero runs four competing attention systems.** A three-line `clamp()` serif `h1`
up to `7.25rem` with a rotating word, an uppercase tracked subtitle, a four-sentence
rotating paragraph, three CTAs, a shield disclaimer, four tab buttons, and four dots.
The tabs and dots are two controls for one carousel. Every rotating slide ends with the
same ~30-word boilerplate sentence, so switching services reveals little new
information, and the reserved `min-h-[10.5rem]` leaves a visible gap.

**3. Numbering that does not encode sequence.** `Preparation item 01–04` labels the
documents list, which is an unordered set of offerings. Implying a required order is
misleading on a document-preparation site.

## Design

### Surface ladder

Three surfaces, each with one stated job. A section picks its tier by what it is, not by
what sat next to it.

| Token | Appearance | Job | Used by |
| --- | --- | --- | --- |
| `--surface-base` | deep green, near-flat | reading | long copy, FAQ, legal, disclaimers |
| `--surface-raised` | one step lighter, hairline border | data | service cards, pricing, checklists, forms |
| `--surface-brand` | darkest, gold accent | moment | hero, primary CTA, proof |

Rules:

- At most one gradient per surface.
- The page wash and grid live on a single owner element. No `position: fixed` layers.
- `backdrop-filter` is reserved for genuinely floating elements: the nav and the cookie
  modal. It comes off static cards.
- Gold is an accent only — type, rules, small marks. Never a fill behind body copy.
- **Consecutive sections may not repeat a tier.** This single constraint produces rhythm
  without per-section decisions.
- One spacing scale owns section padding, so vertical rhythm is inherited rather than
  re-declared. Watch selector specificity between type-based (`.section`) and
  element-based (`.cta`) rules — the current file has padding rules that cancel.

The eight existing classes are replaced. If review burden becomes a problem, the ladder
can be introduced additively so old class names keep working during migration.

### Hero

Keep the four-service rotation — Passport / NIN / BVN / E-Visa is a true content set and
tells a visitor within a second whether the site is for them. Cut the redundancy.

```
┌──────────────────────────────────────────────────────────────┐
│ ◦ ROME-BASED DOCUMENT PREPARATION                            │
│                                                              │
│ Get help with Nigerian                    ┌───────────────┐  │
│ Passport                                  │               │  │
│ support in Rome, Italy                    │   document    │  │
│                                           │    visual     │  │
│ One sentence, specific to this service.   │               │  │
│                                           └───────────────┘  │
│ [ Book document support ]  [ WhatsApp ]                      │
│                                                              │
│ PASSPORT · NIN · BVN · E-VISA   ← the only control           │
└──────────────────────────────────────────────────────────────┘
```

- **One control.** The four tabs become the segmented service switcher. The four dots are
  removed — they duplicated the tabs and read as a slideshow widget.
- **One line of supporting copy per service, each genuinely different.** This removes the
  shared boilerplate sentence and the reserved-height gap, and makes switching feel
  consequential.
- **Two CTAs.** `Book document support` primary, `WhatsApp` secondary — WhatsApp is the
  lowest-friction path for this audience and earns its place. `View services` moves down
  to the services section.
- **Disclaimer stays, quieter.** It is a credibility asset, not a headline. Smaller, still
  legible, still above the fold.
- **Headline top end drops from `7.25rem` to ~`5.5rem`.** At full clamp the rotating word
  overpowers the two fixed lines it belongs to, and the sentence stops reading as a
  sentence.

**Signature element:** the document visual — the actual artifact of this business — held
at a slight angle with the gold security-pattern glow behind it. It already exists in the
codebase and is the most characteristic thing in the subject's world. The parallax tilt
stays on pointer devices and is the hero's only motion.

### Pages on the ladder

Each page gets an explicit tier assignment, applied with the no-repeat rule.

**Homepage:** brand hero → base intro → raised service cards → base process → raised
proof → brand CTA.

**Services and about:** same alternation, starting from `base` after the page header.

**Contact and legal:** mostly `base`. These pages are reading and form-filling, not
browsing, so alternation would be noise.

Forms and cards inherit `--surface-raised`, which is what resolves the current
inconsistency between the contact form and the booking form — they are individually
styled today.

Two content fixes travel with this work:

- **Remove `01–04` from the documents list.** Four unordered offerings; numbering implies
  a sequence the visitor must follow, which is wrong here. Replace with a small service
  mark per item.
- **Keep `01–04` on the process section.** That is a real sequence and the numbers carry
  information the reader needs.

### Motion

Budget: hero document tilt, scroll-reveal on section entry, hover states on interactive
elements. Nothing else. Scattered ambient effects are most of what makes a page read as
machine-generated, and they are also what costs frames here.

### Performance

Removing `position: fixed` from the wash and grid, plus pulling `backdrop-filter` off
static cards, is expected to be the bulk of the scroll-jank fix.

This is a hypothesis, not a claim. Take a Performance trace on the homepage before and
after and report the actual numbers — including if the improvement is smaller than
expected.

### Accessibility floor

Not negotiable:

- `prefers-reduced-motion` disables the tilt and the scroll reveals.
- The service switcher is real keyboard-operable buttons with visible focus rings and
  `aria-selected`.
- Gold-on-green text combinations are contrast-checked against WCAG AA.
- **The rotation pauses on focus.** Keyboard users currently fight a moving target — this
  is a genuine bug in the present build, not a nice-to-have.

Note: full WCAG conformance requires manual testing with assistive technology and expert
review. This floor is a baseline, not a certification.

## Verification

- Run the project's build and lint commands.
- Check the homepage and one inner page at 1440px and 375px.
- Confirm the cookie modal still traps focus correctly after the surface changes.
- Confirm no section repeats a surface tier consecutively.
- Report failures with output rather than summarizing them as passes.

## Out of scope

Copy rewrites beyond the hero's four service sentences. Palette and typeface changes.
Backend, Prisma schema, and booking logic. New pages or sections.


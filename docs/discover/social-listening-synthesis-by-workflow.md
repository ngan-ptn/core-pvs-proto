# Social Listening Synthesis by Workflow
## German & EU Healthcare Digital Pain Points

**Date:** 2026-03-23  
**Prepared for:** CorePVS  
**Scope:** Germany first, EU context second  
**Method:** Merged synthesis of practitioner surveys, public policy papers, implementation reports, and workflow-oriented product framing. This is not a statistically pure social-media scrape; it is a social-listening synthesis built from public sentiment-bearing sources and implementation evidence.  
**Purpose:** Reframe market pain signals from German and EU healthcare digitalisation into a workflow-based synthesis that is directly usable for product strategy, UX prioritisation, and prototype scoping.

---

## 1) Executive summary

The clearest pattern across Germany and the EU is **not "digital resistance"**. It is **workflow friction**.

Across ambulatory care, hospital interfaces, and broader EU policy discussions, the recurring complaints are:

- digital tools add steps instead of removing them,
- interoperability remains uneven across settings,
- practice software is widely seen as error-prone, expensive, and hard to use,
- cross-sector information flow is still too dependent on workarounds,
- clinicians fear that shared records can become **information overload** rather than decision support,
- regulatory progress is ahead of workflow quality in daily care.

For CorePVS, this means the opportunity is best framed **by workflow**, not by feature list. The winning product story is:

> **Make high-frequency workflows faster, clearer, and safer while keeping compliance in the background layer.**

---

## 2) Source signals used

This synthesis combines:

### Public market / policy signals
- **KBV / IGES PraxisBarometer Digitalisierung 2024** — practice-side adoption and experience with digital tools in Germany.
- **Zi PVS monitoring (2025–2026 publications)** — dissatisfaction drivers around PVS usability, cost, support, and error frequency.
- **gematik / BMG ePA materials** — rollout reality and new obligations tied to ePA for all.
- **CPME statement on EHR systems** — European physician-side concerns about digital burden and data overload.
- **European Court of Auditors report 25/2024** — macro-level EU gaps in healthcare digitalisation and funding execution.
- **DigitalRadar / German hospital digital maturity publications** — progress in hospitals, but persistent structural deficits around cross-institutional cooperation and scaling.

### CorePVS internal framing
- Product context, roadmap, and compliance inventory already define the main workflow surface: patient registration, coding, billing, prescription, forms/ePA/eAU, eDMP, and MVZ operations. These internal materials were used only to **organise** the external signals into product-relevant workflow buckets, not to replace market evidence. fileciteturn1file8 fileciteturn1file9

---

## 3) Workflow synthesis

## A. Patient registration & intake

### What the market signal says
Registration is still a high-friction workflow because it sits at the intersection of **insurance validation, patient identity, cost carrier logic, and quarter/billing correctness**. Public signals show that German practices continue to experience software dissatisfaction and operational burden in the day-to-day use of PVS tools, not just in headline TI applications.

### Pain pattern
- Front desk work is still vulnerable to **duplicate entry**, validation detours, and software-specific workaround knowledge.
- Errors made at intake propagate downstream into **billing rejection**, wrong Schein context, and manual correction loops.
- The problem is not only legal complexity; it is that systems often expose the complexity too directly to users.

### Workflow interpretation for CorePVS
Registration should be treated as a **speed-critical workflow with downstream risk**. The interface must compress complexity into guided resolution states rather than showing raw field logic.

### Product implication
- Make registration feel like **one guided flow**, not several disconnected forms.
- Surface blocking issues only when they are truly blocking.
- Convert insurance / cost-carrier ambiguity into clear next-step choices.
- Preserve auditability without making the user think in compliance primitives.

### Strategic note
This is where CorePVS can differentiate from certification-shaped legacy PVS: the market pain is not "missing fields"; it is **cognitive overload at the first touchpoint**.

---

## B. Scheduling, referral intake & cross-sector handoff

### What the market signal says
Cross-institutional cooperation remains a weak point. German hospital digital maturity work reports progress, but still highlights structural deficits in **cross-institutional cooperation, interoperability, and sustainable scaling**. External evidence and CorePVS internal context align strongly here: the hospital-to-practice / practice-to-practice handoff is where paper, fax, calls, and manual reconciliation still cluster. fileciteturn1file10

### Pain pattern
- Referral intake is often **media-broken**: partial digital data, partial attachments, partial phone clarification.
- Scheduling happens without a complete shared view of **resource availability, referral context, and patient readiness**.
- Cross-location organisations such as MVZs suffer a second-layer problem: even when each site works locally, the network is not orchestrated globally.

### Workflow interpretation for CorePVS
This workflow is less about calendar UI in isolation and more about **turning inbound context into schedulable work**.

### Product implication
- Make referral intake and scheduling a linked workflow.
- Preserve source provenance: what came from external systems vs. what was entered locally.
- Show handoff completeness explicitly: missing findings, unclear reason, missing attachment, unsigned order, etc.
- For MVZs, expose **cross-location capacity** as part of the workflow, not as a management report discovered later.

### Strategic note
This is one of the strongest category-creation angles for CorePVS because current PVS products typically support multi-location administration, but not true **cross-location orchestration**. fileciteturn1file3

---

## C. Clinical documentation & coding

### What the market signal says
European physician organisations repeatedly warn that EHR systems must not become an additional digital burden, and that doctors should not be overloaded with excessive data because it delays consultations. The criticism is not anti-digital; it is about **workflow mismatch**.

### Pain pattern
- Clinicians face too much switching between **documentation, coding logic, prior data, and submission rules**.
- Shared records can increase visibility but also increase **signal-to-noise problems**.
- Poor UX turns coding correctness into a navigation burden instead of contextual support.

### Workflow interpretation for CorePVS
Documentation and coding should behave like a **single clinical workspace** in which the user documents care and receives coding support in context.

### Product implication
- Keep the patient narrative and structured coding in one working surface.
- Present rule feedback inline and late enough to be useful, not early enough to interrupt thought flow.
- Distinguish clearly between read-only external evidence and editable local documentation.
- Optimise for dense, desktop-first work without scroll hunting.

### Strategic note
The biggest opportunity is not "AI coding". It is **reducing context switching** while still satisfying German coding and validation rules.

---

## D. Prescribing & medication workflow

### What the market signal says
E-Rezept is now embedded in practice reality, but the social signal remains mixed: usage has normalised, while outages, card/service dependencies, and workflow brittleness still matter whenever the chain fails. Practice sentiment around software error frequency and support quality makes this especially painful, because prescribing is both high-frequency and high-consequence.

### Pain pattern
- When core services fail, prescription work stalls quickly.
- Medication workflows carry multiple layers at once: search, dosage, safety, substitution/economic logic, contract logic, signing, and transmission.
- Users do not experience these as separate modules; they experience them as **one prescribing moment**.

### Workflow interpretation for CorePVS
Prescription UX should be designed as a **resilient transaction workflow**.

### Product implication
- Keep the workflow stable even when external services are degraded.
- Make queue state, signing state, and transmission state impossible to confuse.
- Collapse drug search, decision support, and legal completion into a single visible progression.
- Optimise for repeat work and batch patterns, not only one-by-one perfect cases.

### Strategic note
This is an ideal pilot workflow for CorePVS because it concentrates the exact product thesis: **speed + clarity + compliance under operational pressure**. fileciteturn1file13

---

## E. Forms, submissions & admin-after-care workflows

### What the market signal says
German healthcare digitalisation has improved the availability of structured workflows such as eAU, eArztbrief, and digital communication, but daily operational burden remains high when the system forces users into fragmented submission steps or opaque failure handling.

### Pain pattern
- Users still hit workflows that feel like **document production machines**, not care workflows.
- Submission failures are often hard to diagnose.
- Administrative follow-up work remains separated from the primary clinical moment, which increases rework.

### Workflow interpretation for CorePVS
These flows should be treated as **post-encounter completion workflows** with strong state visibility.

### Product implication
- Make every submission object stateful and legible: draft, ready, signed, sent, failed, corrected, resubmitted.
- Prefer action-oriented recovery messages over system-oriented error messages.
- Keep form generation, communication, and audit trail connected to the patient and encounter context.
- Design for operators who process many items in sequence.

### Strategic note
This is where legacy software often feels most "bureaucratic." A better PVS does not remove regulation; it removes **hunt-and-repair labour**.

---

## F. Shared longitudinal record / ePA / EHR workflows

### What the market signal says
The ePA rollout has materially changed the baseline. Since 15 January 2025, the ePA for all began rollout, and since 1 October 2025 practices, hospitals, and pharmacies have been required to use it. At the same time, physician organisations stress that EHRs must stay usable in daily care and must avoid creating additional administrative burnout.

### Pain pattern
- Policy success does not automatically create workflow success.
- More available data can become **more review burden** if the record is not prioritised.
- Shared longitudinal records create tension between completeness and actionability.

### Workflow interpretation for CorePVS
The ePA should not be treated as a document repository view. It should be treated as a **task-relevant evidence layer**.

### Product implication
- Prioritise "what matters now" over showing all available documents equally.
- Separate imported evidence, local interpretation, and next action.
- Build strong provenance and read-only treatment into the UI.
- Design for quick retrieval during real encounters, not archival browsing.

### Strategic note
This is a key place where CorePVS can translate a national policy mandate into an actual workflow advantage.

---

## G. Billing, reconciliation & end-of-cycle control

### What the market signal says
Even when public discourse focuses on ePA or E-Rezept, practice dissatisfaction with PVS usability, support, price, and error frequency indicates that billing-adjacent workflows remain a core source of pain. In real practice life, trust in the software is often won or lost during quarter-end correctness and correction handling.

### Pain pattern
- Errors accumulate upstream and surface late.
- Users often lack a clear mental model of what is blocking submission vs. what is merely incomplete.
- Correction work can feel like searching for invisible dependencies.

### Workflow interpretation for CorePVS
Billing should be treated as a **continuous validation workflow**, not a quarter-end panic workflow.

### Product implication
- Shift detection earlier in the patient / encounter lifecycle.
- Make dependencies transparent: diagnosis, Schein, service code, cost carrier, contract state.
- Differentiate warning vs. blocker vs. recommendation.
- Support batch review with drill-down into item-level fixes.

### Strategic note
A PVS that feels calm at quarter-end creates disproportionate trust.

---

## H. MVZ operations & cross-location management

### What the market signal says
This pain is less visible in public physician commentary than in product strategy analysis, but it is structurally important. Existing PVS systems may support multiple sites administratively, yet still leave each location functioning like an independent island. CorePVS internal research identifies this as the open orchestration gap. fileciteturn1file0 fileciteturn1file4

### Pain pattern
- No unified operational picture across locations.
- Resource balancing happens by phone, spreadsheet, or manager intuition.
- Scheduling, utilisation, and throughput are reviewed after the fact instead of during operations.

### Workflow interpretation for CorePVS
Management workflows should be built as **decision-support workflows**, not static reporting screens.

### Product implication
- Use operational dashboards to surface bottlenecks that map back to concrete workflow states.
- Let managers move from network signal to site signal to patient/work item quickly.
- Keep recommendations human-in-the-loop; do not auto-execute.

### Strategic note
This is where CorePVS stops being "better practice software" and starts to look like an **MVZ operating system**.

---

## 4) Cross-workflow themes

The same themes show up repeatedly across workflows:

| Cross-workflow theme | What users actually feel |
|---|---|
| **Reliability anxiety** | "Will this work right now, or do I need a workaround?" |
| **State ambiguity** | "Did it save, sign, send, fail, or just disappear?" |
| **Data overload** | "I can access more information, but I cannot see what matters now." |
| **Workflow fragmentation** | "One real-world task is split across several disconnected modules." |
| **Late error discovery** | "The system tells me too late, after the work has already branched." |
| **Cross-sector opacity** | "I still cannot trust what came from outside, what I can edit, or what is missing." |
| **Cross-location blindness** | "Each site works, but the organisation does not learn or rebalance as one system." |

---

## 5) What this means for CorePVS

## Product strategy
CorePVS should position itself around **workflow quality under German healthcare constraints**, not generic modern UI.

## UX strategy
Three priorities become clearer:

1. **Speed** for high-frequency workflows (registration, coding, prescribing, submission).  
2. **Clarity** of state, provenance, and editability.  
3. **Density** for desktop clinical work without scroll hunting.

These priorities align directly with the existing CorePVS UX axes and product principles. fileciteturn1file14

## MVP / prototype strategy
The best prototype story is not to show many modules. It is to show **one or two workflows solved end-to-end** better than legacy systems solve them.

Recommended demo stack:
- **Prescription** as the flagship doctor workflow.
- **Patient registration / intake** as the flagship MFA workflow.
- **Cross-location scheduling signal** as the flagship MVZ differentiation layer.

---

## 6) Recommended workflow prioritisation

| Priority | Workflow | Why it matters |
|---|---|---|
| **P0** | Prescription (E-Rezept + medication decision support + state handling) | High-frequency, high-risk, easy to demonstrate speed/clarity gains |
| **P0** | Registration & cost-carrier resolution | Front-desk pain is immediate and strongly tied to trust in the system |
| **P1** | Documentation + coding workspace | Strong clinical productivity lever and dense UX differentiator |
| **P1** | Referral intake + scheduling handoff | Strongest bridge to MVZ orchestration and cross-sector story |
| **P1** | Billing validation visibility | Creates trust and reduces quarter-end panic |
| **P2** | ePA / longitudinal record prioritisation | Important strategic layer, but should be workflow-integrated rather than standalone |
| **P2** | Management dashboards & rebalancing | Critical differentiator, but strongest after core workflow instrumentation exists |

---

## 7) Sharp positioning statement

A concise market-facing synthesis could be:

> **German healthcare does not mainly suffer from lack of digital tools. It suffers from digital workflows that are fragmented, opaque, and hard to trust under real workload. CorePVS wins by turning compliance-heavy healthcare work into fast, legible, end-to-end workflows — especially for multi-location MVZ operations.**

---

## 8) Source notes

### External sources
1. KBV — Praxisbarometer Digitalisierung overview: https://www.kbv.de/infothek/zahlen-und-fakten/studien-und-berichte/praxisbarometer-digitalisierung  
2. IGES / KBV — PraxisBarometer Digitalisierung 2024 Kurzbericht (PDF): https://www.iges.com/sites/igesgruppe/iges/content/e2622/e2634/e11899/e11949/e11950/e11952/attr_objs11954/2024-11-19_kurzbericht_IGES_praxisbarometer_digitalisierung_2024_ger.pdf  
3. Zi — PVS dissatisfaction / switching pressure (2026): https://www.zi.de/das-zi/medien/medieninformationen-und-statements/detailansicht/unzufriedenheit-mit-praxissoftware-nach-wie-vor-weit-verbreitet-hohe-fehleranfaelligkeit-starker-belastungsfaktor-im-behandlungsalltag-zi-monitoring-wichtige-entscheidungshilfe-bei-potenziellem-pvs-wechsel  
4. KBV news on Zi survey (2026): https://www.kbv.de/praxis/tools-und-services/praxisnachrichten/2026/01-15/zi-befragung-hohe-unzufriedenheit-mit-pvs-jede-dritte-praxis-denkt-ueber-wechsel-nach  
5. gematik — ePA für alle / Praxen: https://www.gematik.de/anwendungen/epa-fuer-alle/praxen  
6. BMG — ePA für alle overview: https://www.bundesgesundheitsministerium.de/epa-na-sicher/  
7. CPME — Statement on Electronic Health Record Systems (PDF): https://www.cpme.eu/api/documents/adopted/2024/03/cpme.2024-004.statement-on-electronic-health-record-systems.pdf  
8. European Court of Auditors — Special Report 25/2024: https://www.eca.europa.eu/en/publications?ref=SR-2024-25  
9. DigitalRadar — scientific publications overview: https://www.digitalradar-krankenhaus.de/wissenschaftliche-publikationen/  
10. Geissler et al. — nationwide digital maturity assessment of hospitals: https://www.sciencedirect.com/science/article/pii/S2211883724000674

### Internal CorePVS sources used for workflow structure
- Product context  
- PVS core roadmap  
- Competitive landscape  
- Compliance inventory

---

## 9) Workflow Opportunity Matrix

| Workflow | User role | Current pain | Failure cost | Compliance pressure | UX opportunity | CorePVS differentiation angle | Prototype priority |
|---|---|---|---|---|---|---|---|
| **Registration & intake** | MFA / front desk | Duplicate entry, insurance ambiguity, Schein mistakes, workaround-heavy validation | Billing rejection, manual correction loops, slower reception throughput, loss of trust at first touchpoint | **High** — eGK, cost carrier, quarter, referral, and billing correctness shape downstream validity | Turn intake into one guided flow with progressive validation and explicit next-step resolution states | Make complex German registration feel calm and fast instead of rule-heavy and fragmented | **P0** |
| **Referral intake & scheduling handoff** | MFA, scheduler, site coordinator | Inbound context arrives fragmented across calls, referrals, attachments, and partial digital records | Delays, incomplete bookings, avoidable clarification calls, underused capacity | **Medium** — referral completeness and provenance matter, but most friction is orchestration rather than certification logic | Join referral review and scheduling into one handoff workflow with source provenance and missing-context signals | Show cross-site schedulable capacity as an operational workflow, not a later management report | **P1** |
| **Clinical documentation & coding** | Doctor | Constant switching between narrative, prior data, ICD logic, and billing/coding rules | Slower consultations, coding errors, rework, clinician frustration, reduced data quality | **High** — ICD-10-GM, Diagnosensicherheit, SDKRW, and encounter-linked documentation rules are non-optional | Create one dense clinical workspace with inline coding support and clear separation of local vs. external evidence | Reduce context switching instead of adding another "coding module" layer | **P1** |
| **Prescribing & medication workflow** | Doctor | Brittle flow across drug search, dosage, checks, signing, and transmission; outages break momentum | Delayed treatment, resend/rework burden, safety risk, high frustration in a high-frequency task | **High** — E-Rezept, QES signing, medication safety, transmission state, and audit trail are tightly regulated | Design a resilient transaction flow with unmistakable queue, signing, and send states | Demonstrate speed, clarity, and compliance under pressure in the most tangible doctor workflow | **P0** |
| **Forms, submissions & admin-after-care** | MFA, doctor, back office | Document generation and sending feel fragmented; failure handling is opaque | Submission failures, manual chase work, delayed follow-up, hidden backlog buildup | **High** — eAU, KIM, forms, signatures, and communication states require traceability | Expose every item as a legible state machine: draft, ready, signed, sent, failed, corrected, resubmitted | Replace hunt-and-repair admin work with recoverable, high-throughput completion workflows | **P1** |
| **Shared longitudinal record / ePA** | Doctor, MFA | More data is available, but relevance is unclear and review burden grows | Slower encounters, missed context, duplicated review effort, low trust in imported information | **High** — ePA usage is mandatory, provenance and read-only handling matter, imported data cannot blur ownership | Prioritise "what matters now" with task-relevant evidence summaries instead of flat document browsing | Translate a national mandate into a practical encounter advantage through prioritised evidence retrieval | **P2** |
| **Billing, reconciliation & end-of-cycle control** | MFA, billing staff, practice lead | Errors surface late, blockers are opaque, correction work feels like dependency hunting | Quarter-end panic, delayed submission, lost revenue, mistrust in system correctness | **High** — KV billing, KVDT, diagnosis/service dependencies, and contract logic drive acceptance and payment | Shift validation upstream and distinguish blocker vs. warning vs. recommendation clearly | Win trust by making quarter-end feel controlled rather than chaotic | **P1** |
| **MVZ operations & cross-location management** | MVZ management, site manager, operations lead | No unified live view across locations; rebalancing depends on calls, spreadsheets, and intuition | Missed capacity balancing, underused resources, slower decisions, weak organisation-wide learning | **Medium** — less certification pressure, but high organisational and economic impact | Build dashboards as decision-support workflows with drill-down from network signal to actionable work item | Occupy the open orchestration gap that legacy PVS vendors do not cover | **P2** |

---

## 10) What to do with this matrix next

This matrix is now the bridge from social listening to delivery decisions.

Recommended immediate use:

1. Use the **P0 rows** to define the first end-to-end prototype narrative: registration for MFA, prescribing for doctors.
2. Break each workflow into **failure states and recovery states**, because the strongest market signal is not missing features, but broken or ambiguous flow states.
3. Turn each row into a **design backlog slice** with four artefacts: primary user, critical path, blocking states, and proof of differentiation vs. legacy PVS.
4. Treat **cross-location orchestration** as the strategic layer that follows once the core transactional workflows generate reliable workflow state data.

If CorePVS wants one sharp thesis for prototype scoping, it is:

> **Start where failure is expensive and frequent, prove that workflow state can stay fast and legible under compliance pressure, then extend that same operating model into cross-location orchestration.**

---

## 11) Appendix: source-level signal highlights

This appendix preserves the strongest source-first observations from the earlier synthesis so the workflow framing remains anchored in specific public signals.

### Germany-specific signal highlights

#### A. TI / E-Rezept friction still breaks trust
- In KBV's 2024 PraxisBarometer, the gap between best and worst-performing PVS was stark for digital signature speed: **74%** of users of the best-performing PVS finished in under 10 seconds, versus **14%** for the worst-performing PVS.
- In the same report, **45%** of users of the worst-performing PVS reported **daily TI disruptions**, versus **3%** for the best-performing PVS.
- The report also states that **73%** of practices regularly had to restart card terminals or the connector, and **58%** said practice organisation was impaired by disruptions.

**Interpretation:** the technical layer still leaks directly into front-desk flow, prescribing flow, and daily scheduling rhythm.

#### B. Hospital-to-practice communication remains too paper-heavy
- KBV's 2024 report says communication between practices and hospitals still happens **almost exclusively on paper**, even though **72%** of respondents see high value in a digital discharge letter.

**Interpretation:** Germany's pain is not merely missing standards. It is the persistence of media breaks in transitions where time pressure and clinical risk are highest.

#### C. PVS quality varies too much by vendor
- Zi's 2025 PVS monitoring found major variation between systems in stability and error frequency.
- Among the small share of respondents already using ePA in practice, the study reports high error frequency: **39.3% daily**, **21.9% weekly**, and **38.8% monthly** errors among users with practical ePA experience.
- Zi's conclusion is blunt: digital working conditions in most PVS are experienced **more as a burden than as a relief**.

**Interpretation:** the German market is suffering from wide operational inconsistency across vendors, which makes trust fragile and migration decisions harder.

#### D. Support, migration, and switching remain pain multipliers
- In Zi 2025, **about one third** of respondents were dissatisfied with customer support overall, and **47%** were dissatisfied with support costs.
- Even though many respondents remain unhappy, willingness to switch fell from **44.4% in 2024** to **33.3% in 2025**. Zi attributes this partly to switching barriers such as migration worries, high switching costs, and organisational disruption.

**Interpretation:** the market is sticky even when users are unhappy. This leaves room for a challenger that makes migration and onboarding visibly safer.

#### E. Training and change management are uneven
- Zi's 2025 monitoring also shows meaningful differences across systems in how helpful training and retraining were perceived.

**Interpretation:** adoption pain is not just about interface quality. It is also about whether teams can re-learn workflows without burning time and morale.

### EU-wide signal highlights

#### A. Interoperability remains the dominant structural blocker
- CPME's EHDS policy position argues that European doctors cannot keep manually entering the same information across different EHR systems because it wastes time, increases administrative workload, and creates errors.
- The Digital Health Uptake policy brief says low interoperability, insufficient exchange between heterogeneous providers, and lack of universally adopted semantic and syntactic standards remain major barriers.

**Interpretation:** across the EU, interoperability is not an abstract architecture topic. It is the user-visible cause of retyping, lost context, and fragmented care.

#### B. EHDS raises the bar, but also raises implementation anxiety
- CPME warns that new EHDS-related obligations may further increase economic and administrative burden if systems are not truly user-friendly.
- The same policy view argues that essential capabilities such as seamless integration and automated coding should not be premium add-ons.

**Interpretation:** regulatory progress can either catalyse better products or magnify bad UX if vendors pass complexity to clinicians.

#### C. Capacity and skills shortages are slowing execution
- Digital Health Uptake reports that about **36%** of EU countries lack sufficient technical and semantic interoperability experts, and **43%** of Member States have not yet implemented essential health IT terminologies.
- The same brief notes broader ICT workforce shortages and weak reskilling pathways.

**Interpretation:** the EU pain is not only whether systems can talk to each other, but whether organisations have the people to implement and govern that interoperability.

#### D. Funding and programme complexity are barriers in their own right
- The European Court of Auditors found that Member States faced obstacles using EU funds for healthcare digitalisation because programmes had different rules and management arrangements, creating administrative burden and making applications harder, especially for smaller entities.

**Interpretation:** even where funding exists, execution can stall because the operating model is too complex.

#### E. Trust and transparency remain adoption preconditions
- Digital Health Uptake argues that trust in health data sharing grows when systems are transparent, involve caregivers, and offer customisable sharing options that respect patient autonomy.

**Interpretation:** adoption is not solved by compliance alone. Users need to understand what is shared, with whom, and why.

### Pain cluster synthesis

| Pain cluster | Germany signal | EU signal | What users really mean |
|---|---|---|---|
| **Workflow slowness** | Slow signing, unstable TI flows, extra recovery work | Burden from non-user-friendly digital tools | "The digital process takes longer than the old one." |
| **Duplicate work** | Paper hospital exchange, manual reconciliation | Re-typing across systems, poor reuse of data | "Why do I enter the same thing again?" |
| **Interoperability gaps** | PVS/TI/hospital coordination still fragile | Uneven standards and readiness across Member States | "The system knows something somewhere else, but not here when I need it." |
| **Reliability / stability** | Daily or weekly errors in key workflows for some users | Cross-system implementation quality varies widely | "I don't trust this to work during peak hours." |
| **Administrative overload** | More burden than relief in many PVS environments | EHDS obligations may worsen burden without better UX | "Digital work keeps stealing patient time." |
| **Vendor lock-in** | Low switching despite dissatisfaction | Standards still uneven, migration maturity uneven | "I'm stuck with a system I don't like." |
| **Training / capacity** | Uneven training quality by system | Shortage of interoperability experts and reskilling gaps | "Even good systems fail if nobody can implement or learn them properly." |
| **Cross-sector continuity** | Practice-to-hospital exchange still paper-heavy | Cross-border and cross-entity exchange still fragmented | "The patient journey is connected, but the software isn't." |

---

## 12) Appendix: messaging and product checklist

### Additional product implications

#### 1. Build for time saved under pressure, not feature count
The strongest complaints are tied to operational stress moments: check-in, card reading, E-Rezept, signatures, support, and recovery from failures.

**Implication:** benchmark workflows against the paper or legacy equivalent. If the digital path is slower, users will still call it bad even if it is compliant.

#### 2. Treat interoperability as a front-stage UX problem
Users experience interoperability failure as missing data, duplicate entry, broken transitions, and unclear ownership of information.

**Implication:** show provenance, sync status, and cross-system state visibly inside the workflow.

#### 3. Reduce documentation tax aggressively
The CPME and EHDS discussion shows that clinicians are increasingly hostile to digital systems that add burden without reducing cognitive load.

**Implication:** capture data once, reuse everywhere, background-code where possible, and surface only the exceptions that need clinician judgment.

#### 4. Make migration part of the product promise
German PVS users often remain trapped because migration feels dangerous.

**Implication:** migration tooling, mapping visibility, data-quality checks, and post-migration confidence signals should be productised rather than treated as services-only work.

#### 5. Stability matters as much as elegance
German sentiment shows that even widely adopted tools lose trust if they fail during routine work.

**Implication:** CorePVS should market not just usability, but predictability under real clinic load.

### Recommended messaging angles

#### If positioning against legacy German PVS
- From digital burden to digital flow
- From paper breaks to connected care transitions
- From compliance-first UI to workflow-first UI
- From vendor lock-in to migration confidence

#### If positioning in an EU / EHDS context
- EHDS-ready without EHDS burden
- Document once, reuse everywhere
- Interoperability that clinicians can actually feel
- User-friendly by design, not by add-on module

### Suggested design / product checklist

#### Must-have
- Fast-path flows for eGK read, Schein creation, coding, and E-Rezept
- Visible cross-system state and provenance
- Failure recovery that preserves progress
- Inline validation instead of end-of-process error dumps
- One-time data capture with downstream reuse
- Performance targets for high-frequency tasks

#### Should-have
- Migration cockpit with mapping, reconciliation, and confidence logs
- Workflow analytics on error hotspots and time loss
- Vendor-agnostic import/export pathways
- Role-specific training modes and guided onboarding

#### Avoid
- Modal-heavy signing and prescribing flows
- Forcing users to re-enter known data
- Hidden sync states
- Support models that offload diagnosis of system issues onto practice staff
- "EHDS-ready" claims without visible workflow benefit

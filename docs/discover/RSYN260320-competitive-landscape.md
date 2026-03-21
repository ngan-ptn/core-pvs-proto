# CorePVS --- MVZ Competitive Landscape

## 1. Context

CorePVS positions itself as:

> "The PVS that masters MVZ complexity --- intelligent, connected,
> scalable."

Traditional German **PVS systems were built for single practices**,
while MVZ organizations operate across multiple locations and
specialties. This creates a structural gap between **existing PVS
capabilities** and **MVZ operational needs**.

------------------------------------------------------------------------

# 2. Reality of "MVZ Support" in Existing PVS

Many vendors claim **MVZ compatibility**, but their support typically
includes only:

| Capability | Typical Support |
|-----------|----------------|
| Multiple BSNR locations | Yes |
| Shared patient master data | Partial |
| Central billing | Yes |
| User access per location | Yes |

However, **true MVZ orchestration is missing**.

| Capability | Existing PVS |
|-----------|--------------|
| Cross-location scheduling | ❌ |
| Shared resource optimization | ❌ |
| Device capacity balancing | ❌ |
| Organization dashboards | ❌ |
| Cross-location analytics | ❌ |

In practice, **each location still behaves like an independent
practice**.

------------------------------------------------------------------------

# 3. Architectural Reason (Why Competitors Don't Support MVZ)

Legacy PVS systems were designed around **one practice location
(BSNR)**.

Typical model:

- Practice
  - Patient database
  - Appointment calendar
  - Billing
  - Devices

But MVZ organizations operate differently:

- MVZ organization
  - Multiple locations
  - Shared resources (doctors, devices)
  - Shared patient pool

A real MVZ platform requires an **organization layer above locations**,
which most legacy PVS systems lack.

------------------------------------------------------------------------

# 4. Positioning Matrix

Mapping **practice scale vs operational intelligence vs UX capability** reveals a market gap.

| Quadrant | Vendors | UX Model |
|----------|--------|----------|
| Single practice / low intelligence | tomedo, Epikur | legacy, dense but rigid |
| Multi practice / low intelligence | CGM, medatixx | legacy enterprise |
| Single practice / medium intelligence | T2med | modern but limited |
| Modern SaaS PVS | Clinicos | clean, low-density, usability-focused |
| Multi-location orchestration | (empty market space) | (not yet defined — CorePVS opportunity) |

### UX Benchmark Layer (Modern SaaS PVS)

Beyond feature capability, competitors also differ in **interaction model and UX optimization**.

Clinicos represents a **modern SaaS PVS baseline**:

| Axis | Strength | Limitation |
|------|----------|------------|
| Speed | Easy to learn, clean navigation | Multi-step flows, mouse-heavy interaction |
| Clarity / Safety | Clean UI, readable forms | Weak state signaling, limited validation logic |
| Density | Spacious, modern layout | Low information density, excessive scrolling |

### UX Positioning Insight

- Modern SaaS PVS (e.g. Clinicos) optimize for **usability and adoption**
- Legacy PVS optimize for **compliance and completeness**
- Neither optimizes for **high-throughput clinical workflows**

### Strategic Implication

CorePVS must differentiate not only by **capabilities**, but by **interaction model**:

- **Speed:** optimize for high-frequency workflows (keyboard-first, inline actions)
- **Clarity:** explicit system state (traffic-light logic, validation, read-only separation)
- **Density:** high-information workspace (no scroll for critical workflows on 24” screens)

> This creates a second differentiation layer:
> not just *what the system can do*, but *how efficiently it enables work at scale*.

------------------------------------------------------------------------

# 5. Operational Intelligence (Simplified Criteria)

Operational intelligence describes **how well the system helps
understand and optimize operations**, not just record data.

### Low Intelligence

- Data stored but little analysis
- Static reports only
- Per-location view
- Decisions done manually

### High Intelligence

- Real-time operational dashboards
- Cross-location visibility
- Resource utilization tracking
- System suggests actions or improvements

| Capability | Low Intelligence | High Intelligence |
|-----------|------------------|--------------------|
| Dashboard | none / static | real-time |
| Organization view | per practice | cross-location |
| Resource tracking | limited | doctors + devices |
| Decision support | manual | system suggestions |

Most existing **PVS systems are still in the low-intelligence
category**.

------------------------------------------------------------------------

# 6. Cross-Sector Competitors

Closest competition may come **outside the PVS market**.

| Vendor | System | Strength |
|--------|--------|----------|
| Dedalus | ORBIS | Hospital workflow orchestration |
| Nexus | Nexus HIS | Hospital network operations |
| Doctolib | Platform | Scheduling & patient routing |
| Doctena | SaaS scheduling | Appointment optimization |

These platforms provide **network orchestration**, but lack **certified
PVS billing capabilities**.

------------------------------------------------------------------------

# 7. Strategic Insight

Healthcare software is currently split into two worlds:

| Domain | Strength |
|--------|----------|
| Hospital HIS | Network orchestration |
| PVS systems | Practice workflows + billing |

MVZ organizations sit **between these two domains**, creating a
structural gap.

------------------------------------------------------------------------

# 8. Strategic Positioning for CorePVS

Instead of positioning as **another PVS**, CorePVS can define a new
category:

## MVZ Operating System

| Layer | Capability |
|-------|------------|
| Clinical | Documentation, diagnosis, coding |
| Administrative | Billing, contracts |
| Operational | Scheduling & resource optimization |
| Management | Cross-location analytics |

------------------------------------------------------------------------

# 9. Key Answer: Is Cross-Location Orchestration Already Solved?

| Capability | Market Status |
|------------|---------------|
| Cross-location patient records | Partial |
| Cross-location scheduling | Not available |
| Cross-location resource allocation | Not available |
| Organization-wide optimization | Not available |

**Conclusion:**
The space for **true MVZ orchestration inside a PVS is largely
unoccupied.**

------------------------------------------------------------------------

# 10. Strategic Risks

Future competitors may come from **platform companies rather than legacy
PVS vendors**.

| Player | Risk |
|--------|------|
| Doctolib | expanding from scheduling to practice management |
| Hospital HIS vendors | moving into outpatient networks |
| Cloud-native PVS startups | modern architectures |

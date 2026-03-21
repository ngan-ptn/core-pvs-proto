# Open Questions — Product Direction & Vision

**Version:** 1.7.0
**Last Updated:** 2026-03-17 by Ngan

**Sources:**
- [product-context.md](../../product-context/product-context.md)
- [HIS ED- MVZ PVS Core Knowledge.md](../research/_HIS ED-MVZ PVS Knowledge.md)
- [RSYN260320-competitive-landscape.md](../../discover/RSYN260320-competitive-landscape.md)

---

## Priority Questions

1. The HIS knowledge doc frames the product as an "MVZ Operating System" and "Healthcare Operations Platform" — but product-context calls it a "white-label practice management system." Which framing is the actual vision?
   *Two source documents use conflicting identity language — this cascades into every downstream decision.*

2. The four-layer model (Clinical → Administrative → Operational → Management) appears in both source documents. Should this become the official framework for explaining CorePVS positioning?
   *A shared strategic language would align product, engineering, and sales around the same story.*

3. "Partial" cross-location patient records already exist in some PVS systems. Who offers this, how good is it, and does it erode part of the value prop?
   *Partial solutions may be "good enough" for some MVZs, narrowing the addressable market.*

4. Are the problems validated with actual MVZ operators, or derived internally from the demo use cases?
   *Internal assumptions risk building for a problem that real users frame differently.*

5. The vision says "intelligent, connected, scalable" — but Phases 1-7 are mostly certification-baseline PVS functionality. Where does the MVZ orchestration layer (cross-location scheduling, capacity balancing, dashboards) actually live in the roadmap?
   *The differentiator is not on the roadmap — this is the most critical gap between vision and execution.*

6. Is the cross-sector HIS↔MVZ integration a Phase 1 priority or a future differentiator? If future, what's the interim story for hospital referrals?
   *Hospital referrals are a daily workflow — no interim story means a broken user experience at launch.*

7. Phase 7 (Foundation & Practice Infrastructure) is described as "system backbone that every downstream module depends on" — why is it last? Is there a subset already built, or is there hidden technical debt accumulating in Phases 1-6?
   *If the backbone isn't solid, Phases 1-6 may need rework — a classic "build on sand" risk.*

8. The recurring framework (Clinical → Administrative → Operational → Management) positions current PVS at layers 1-2, with CorePVS owning layers 3-4. Is this the intended long-term architecture — or must CorePVS also rebuild layers 1-2 from scratch?
   *Rebuilding all 4 layers is a multi-year effort; owning only 3-4 is faster but depends on partner PVS quality.*

9. If the differentiation lives in layers 3-4 (operational + management), should those layers be buildable on top of any PVS — making CorePVS a platform rather than a replacement?
   *Platform = larger addressable market but harder to control UX; replacement = tighter experience but smaller initial market.*

10. The "MVZ Operating System" framing implies owning all four layers. Is that realistic for a single product, or does it require an ecosystem/partner strategy?
    *Single-product ownership gives control; ecosystem gives speed — the choice shapes the company's DNA.*

11. "The PVS that masters MVZ complexity" — does CorePVS aim to be the only PVS an MVZ uses, or a complementary layer on top of an existing PVS?
    *Only-PVS means total replacement (high switching cost); complementary means coexistence (lower bar but weaker lock-in).*

12. The differentiator is orchestration (cross-location intelligence), but the roadmap is 7 phases of certification-baseline PVS. How is this tension resolved — build the table stakes first, then differentiate? Or ship orchestration early without full PVS?
    *Getting the sequencing wrong means either no market entry or no differentiation.*

---

## Parked Questions

### Positioning & Category

13. The competitive landscape identifies that MVZ sits between two domains: Hospital HIS (has orchestration, no billing) and PVS (has billing, no orchestration). Does CorePVS bridge from the PVS side or build a new category?
    *Determines whether the go-to-market message is "better PVS" or "new thing entirely."*

### Fragmented Software Stack

14. MVZs currently run 7-8 disconnected systems (PVS + Doctolib + Excel + BI tools + fax). Is the strategy to replace all of these, or integrate with them?
    *Replace-all is ambitious but coherent; integrate is faster but risks becoming "just another tool in the stack."*

15. Excel is used for capacity planning, BI tools for analytics, fax for referrals. Which of these workarounds represents the biggest pain (and therefore the strongest entry point)?
    *Identifies the wedge feature that gets CorePVS into an MVZ before the full platform is ready.*

16. How much of the integration pain is technical (no APIs) vs. organizational (no one owns the cross-system workflow)?
    *If the root cause is organizational, software alone won't fix it — the product needs a change-management story.*

### Architectural Defensibility

17. The competitive landscape argues competitors can't easily add MVZ orchestration because they'd need a fundamental architectural change (an organization layer above locations). Has this been validated — are any competitors attempting this rewrite?
    *The entire competitive moat rests on this assumption — if wrong, the window may be shorter than expected.*

18. Doctena appears in the competitive landscape but is missing from the product-context threats table. Should it be added?
    *Minor consistency gap between documents — quick fix but signals incomplete threat tracking.*

### Problem Validation

19. How many MVZs are in the target market, and what's the size segmentation (2-3 locations vs. 10+)? Does the product target all sizes or a specific tier?
    *Without market sizing, it's impossible to evaluate whether the opportunity justifies the investment.*

20. Which of the four pain-point categories (structural, operational blind spots, integration failures, management gaps) is the most acute — what would customers pay to solve first?
    *Prioritizes which pain to lead with in demos, sales, and Phase 1 scope.*

21. Is there quantified market data that MVZs are actively looking for alternatives, or is this a latent need?
    *Active demand means faster sales cycles; latent need means heavy education spend before revenue.*

### Target Customer

22. Who is the buyer — MVZ management, the owning hospital group, or individual practice leads? How does the buyer differ from the daily user?
    *Buyer ≠ user means the value prop must speak to two audiences with different priorities.*

23. Is the initial target greenfield MVZs (no PVS yet) or migrations from existing systems (CGM, medatixx)? Migration carries very different design and onboarding implications.
    *Greenfield is easier to sell but rare; migration is the real market but requires data import, training, and coexistence.*

24. What's the minimum MVZ configuration the product must support at launch — 2 locations? 1 specialty? What's the upper bound?
    *Defines the technical floor for launch and prevents over-engineering for edge cases.*

### Solution Boundaries

25. "Rule-based, no AI required" — is this a permanent positioning decision or a Phase 1 constraint? Does the long-term vision include ML-based optimization?
    *Caps the intelligence ceiling and affects long-term hiring, architecture, and competitive positioning.*

26. What does "certification-ready" mean concretely — KBV certification, gematik TI certification, or both? Which certification must be achieved before go-to-market?
    *Certification scope directly determines timeline, cost, and which features are non-negotiable.*

### Competitive Positioning

27. The orchestration gap assumes competitors won't close it. What's the defensibility if CGM or medatixx ships cross-location features?
    *Incumbents have distribution and installed base — even a weaker feature set could block CorePVS.*

28. Doctolib, Dedalus, Nexus are listed as threats — is there a timeline estimate for when they become real competitors in MVZ space?
    *Timing determines urgency — a 2-year window is very different from a 5-year window.*

29. "CorePVS needs both" (certified billing + network orchestration) — which capability is built first, and can the product go to market with only one?
    *Sequencing determines the earliest possible revenue and what the first customer actually buys.*

### Go-to-Market Sequencing

30. The roadmap has 7 phases of PVS baseline. When does the product become usable enough to deploy in a real MVZ? After Phase 1? Phase 3?
    *Defines when revenue starts and how long the company must self-fund.*

31. Is there a pilot MVZ or design partner committed? If not, what's the validation strategy before building all 7 phases?
    *Building 7 phases without a committed pilot risks years of work with no market feedback.*

32. Can the product launch as a module alongside an existing PVS (e.g., dashboard-only or scheduling-only), or must it replace the entire system?
    *Side-by-side launch lowers switching cost; full replacement raises the bar dramatically.*

33. What's the MVP — the minimum feature set where an MVZ would switch from their current PVS?
    *The answer to this question determines what "done" means for the first sellable version.*

### Value Proposition Gaps

34. The value props are operational — reduced idle time, fewer errors. Are there revenue-generation or compliance value props that matter more to buyers?
    *Buyers often prioritize revenue and compliance over efficiency — the messaging may be misaligned.*

35. "First PVS to give MVZ leadership real operational transparency" — is this validated as a purchase driver, or is it a nice-to-have behind billing and prescriptions?
    *If transparency doesn't drive purchases, leading with it wastes sales cycles.*

36. What's the pricing model assumption — per location, per seat, per module? This affects which features must ship together.
    *Pricing model shapes bundling, which shapes what must be built together vs. separately.*

### White-Label & Multi-Tenancy

37. Who are the white-label customers — hospital groups, PVS resellers, MVZ chains? What are their customization expectations beyond branding?
    *White-label without a named customer is an architecture tax with no guaranteed return.*

38. Does white-label mean feature toggles per customer, or purely visual theming? This fundamentally shapes the architecture.
    *Feature toggles add orders of magnitude more complexity than theming alone.*

39. How many white-label configurations must be supported at launch?
    *The number determines whether this is a config file or a full multi-tenant platform.*

### Success Metrics

40. What does success look like for Phase 1 — certification passed, pilot deployed, or something else?
    *Without a clear Phase 1 exit criterion, the team won't know when to stop building and start selling.*

41. Are there quantified targets for the value propositions (e.g., "reduce no-show rate by X%", "cut registration time by Y seconds")?
    *Quantified targets make the value prop testable and the sales pitch credible.*

42. What's the timeline expectation for reaching market with a sellable product?
    *Aligns engineering pace with business runway and investor expectations.*

### Category Creation Risk

43. Defining a new category ("MVZ Operating System") is powerful but expensive — the market doesn't search for a product that doesn't exist yet. What's the awareness strategy?
    *Category creation requires thought leadership, education, and patience — all expensive without revenue.*

44. Is the market ready for a new category, or would "better PVS for MVZ" be an easier sell even if it's less ambitious?
    *"Better PVS" fits existing buying behavior; "new category" requires changing how buyers think.*

45. If CorePVS creates the category, what happens when a large player (CGM, Dedalus) copies the framing and applies it to their installed base?
    *Category creators often lose to fast followers with distribution — the moat must be deeper than the name.*

### Vision Clarity

46. "Independent, certification-ready components that compose into a white-label practice management system" — is the vision to be a PVS or a platform that PVS products are built on? These lead to very different products.
    *This is the single most important strategic fork — every other decision flows from it.*

47. Is the end state a single product or a family of products (e.g., CorePVS Billing, CorePVS Scheduler, CorePVS Dashboard sold separately)?
    *Product family enables land-and-expand but fragments the brand and support.*

### Strategic Identity

48. Is CorePVS a healthcare product company or an infrastructure/platform company? The white-label framing suggests platform, but the roadmap is feature-complete PVS.
    *Product companies own the customer relationship; platform companies own the ecosystem — different cultures and metrics.*

49. What's the primary moat — certification expertise, MVZ domain knowledge, technical architecture, or go-to-market speed?
    *Knowing the moat determines where to invest disproportionately.*

50. In 5 years, does CorePVS want to be known as "the MVZ PVS" or "the platform that powers MVZ software"?
    *Brand aspiration drives hiring, partnerships, and which customers to say no to.*

### Orchestration vs. Certification Tension

51. If orchestration is the vision, why isn't it Phase 1?
    *Building the differentiator last is a common startup trap — by the time you get there, the market may have moved.*

52. Is there a risk of spending years on certification parity and never reaching the differentiated layer?
    *Certification is a treadmill — requirements keep changing, and "almost done" can last forever.*

### Build vs. Integrate

53. Does CorePVS need to build the entire PVS stack (billing, prescriptions, forms, eDMP), or could it integrate with existing certified PVS engines and focus on the orchestration layer?
    *Integration is faster to market but creates dependency; full build is slower but gives total control.*

54. What's the build-everything rationale — is it control, certification requirements, or the belief that existing engines can't support MVZ workflows?
    *Each rationale implies different trade-offs and different conditions for revisiting the decision.*

55. Has a "thin orchestration layer + certified partner PVS" model been evaluated and rejected? Why?
    *If not evaluated, the build-everything path may be an assumption rather than a deliberate choice.*

### Market Thesis

56. Is the bet that MVZs will grow significantly in Germany (market tailwind), or that existing MVZs are underserved enough to switch (displacement)?
    *Tailwind means patience pays off; displacement means the product must be dramatically better today.*

57. What's the assumption about market timing — is there a regulatory change, reimbursement shift, or TI mandate that creates urgency?
    *External forcing functions compress sales cycles — without one, adoption is purely discretionary.*

58. Is the addressable market MVZs only, or is MVZ the wedge into broader multi-location healthcare (hospital outpatient departments, Praxisnetze, überörtliche BAGs)?
    *MVZ-only is focused but small; broader multi-location is larger but dilutes the "MVZ specialist" positioning.*

### Scope vs. Focus

59. The roadmap covers ~800+ requirements across 7 phases. Is this a 2-year plan, a 5-year plan, or aspirational?
    *The answer determines staffing, funding needs, and whether the scope is realistic or a wish list.*

60. What happens if only Phases 1-3 get built — is that a viable product, or does the vision collapse without the full stack?
    *If Phases 1-3 aren't independently viable, the project is all-or-nothing — a high-risk bet.*

61. Is there a "good enough" version of CorePVS that delivers on the vision without all 7 phases?
    *Finding the minimum viable vision prevents overbuilding and gets to market feedback faster.*

### Intelligence Ambition

62. The positioning matrix places CorePVS in "multi-location orchestration" — but "rule-based, no AI" limits the intelligence ceiling. What level of intelligence is the vision actually aiming for?
    *The positioning promises more intelligence than rule-based logic can deliver — expectations may outpace capability.*

63. Competitors will eventually add cross-location features. If CorePVS caps at rule-based logic, what prevents commoditization?
    *Rule-based features are easy to copy — long-term differentiation may require a higher intelligence ceiling.*

64. Is "no AI" a product principle or a resource constraint? Would the vision change with more resources?
    *Principle means architecture stays simple; constraint means architecture should be AI-ready from day one.*

### Modularity Promise

65. "Each component is a standalone mini-app" — can a customer actually buy/deploy just one module, or is that theoretical? What's the minimum viable bundle?
    *Theoretical modularity adds architectural cost without business benefit.*

66. If components are truly independent, who owns the integrated experience? Fragmented mini-apps risk feeling like a toolkit, not a product.
    *Users don't want to assemble their own PVS — someone must own the "it just works together" layer.*

67. Is modularity driven by customer demand ("I only want scheduling") or engineering preference ("microservices are better")?
    *Engineering-driven modularity often solves a problem customers don't have.*

### White-Label Direction

68. White-label for whom — and why? Is it a distribution strategy (resellers reach MVZs faster), a revenue model (licensing to hospital groups), or a product requirement (each MVZ wants its own brand)?
    *The "why" determines how much white-label investment is justified and when it should ship.*

69. Does white-label create a conflict with building a recognizable CorePVS brand in the market?
    *Invisible brands struggle to attract talent, press, and direct customers.*

70. How many white-label customers are needed to sustain the business — 3 large ones or 50 small ones?
    *3-large means key-account dependency; 50-small means self-serve infrastructure — very different businesses.*

### Success Definition

71. What does winning look like — market share percentage, number of MVZs deployed, revenue target, or successful exit/acquisition?
    *Without a defined finish line, every decision is debatable and priorities shift constantly.*

72. Is the goal to become the dominant MVZ PVS, or to prove the concept and get acquired by a CGM or Dedalus?
    *Build-to-sell and build-to-scale require fundamentally different product and business decisions.*

73. If the product succeeds, what's the expansion path — international MVZ equivalents, hospital inpatient, or adjacent healthcare verticals?
    *The expansion path influences today's architecture — international needs i18n, hospital needs different data models.*

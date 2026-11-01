import { AcademicBriefData } from '../src/types/index.ts';

export const SAMPLE_BRIEFS: Record<string, AcademicBriefData> = {
  'mrna-vaccine-distribution': {
    id: 'brief-mrna-01',
    isDemoSample: true,
    title: 'Socioeconomic Implications of Global mRNA Vaccine Distribution Equity in Low- and Middle-Income Countries',
    topic: 'The Socioeconomic Impact of mRNA Vaccine Distribution in Low-Income Countries',
    researchQuestion: 'How has the asymmetric global allocation of mRNA vaccines impacted economic recovery and healthcare resilience in low- and middle-income countries (LMICs)?',
    academicLevel: 'undergraduate',
    briefLength: 'medium',
    generatedAt: '2026-03-15T10:30:00Z',
    executiveSummary: 'This academic brief examines the macroeconomic and epidemiological consequences of asymmetric mRNA vaccine allocation during the COVID-19 pandemic across low- and middle-income nations. While high-income nations secured bilateral advance purchase agreements covering over 200% of their populations, LMICs experienced extended distribution delays through COVAX, exacerbating sovereign debt crises and decelerating GDP recovery by an estimated 1.8% to 2.4% across Sub-Saharan Africa. Furthermore, supply chain bottlenecks and ultra-cold-chain deficits presented substantial logistics challenges, though local mRNA hub initiatives in South Africa and Rwanda demonstrate promising long-term biomanufacturing autonomy.',
    introduction: 'The rapid development of nucleoside-modified messenger RNA (mRNA) vaccines marked a paradigm shift in prophylactic biotechnology. However, the initial global distribution revealed stark disparities in international health architecture. High-income countries (HICs) mobilized fiscal surpluses to execute direct purchasing agreements, whereas lower-income economies relied heavily on multilateral donation frameworks. This paper analyzes the structural barriers to equitable mRNA distribution, interrogates empirical health outcomes, and evaluates regional manufacturing initiatives designed to mitigate future systemic vulnerabilities.',
    keyFindings: [
      'High-income countries accounted for over 75% of early bilateral purchase commitments for mRNA formulations (Pfizer-BioNTech and Moderna) despite representing only 16% of the global population [S1].',
      'The vaccination deficit in low-income nations produced an estimated global macroeconomic loss exceeding $2.3 trillion by late 2022, primarily borne by emerging economies [S2].',
      'Ultra-cold chain requirements (-80°C to -60°C) increased delivery costs by up to $3.50 per dose in decentralized rural clinics lacking reliable electrical grids [S3].',
      'Technology transfer initiatives sponsored by the WHO mRNA Technology Transfer Programme in Cape Town have successfully replicated candidate formulations, yet face pending patent barriers [S4].'
    ],
    evidenceAnalysis: 'The disparity in mRNA availability was driven both by financial pre-commitment mechanisms and intellectual property restrictions under the WTO TRIPS Agreement. According to the World Health Organization (2022), low-income economies vaccinated fewer than 15% of their adult populations by mid-2022, in contrast to over 80% coverage across the G7 [S1]. The International Monetary Fund highlighted that pandemic-induced supply disruptions and delayed immunizations contracted trade revenue across sub-Saharan Africa, reducing regional GDP growth by 2.1 percentage points [S2].\n\nBeyond macroeconomic contraction, secondary epidemiological consequences emerged. Uncontrolled viral circulation in under-vaccinated populations increased mutation pressure and prolonged local non-pharmaceutical interventions (NPIs) [S5]. Logistical infrastructure also constrained deployment: UNICEF logistics assessments reported that 42% of peripheral health facilities in participating African nations lacked continuous cold-chain telemetry [S3]. Although international donors pledged over 1.2 billion surplus doses, over 30% were delivered with remaining shelf-lives under 60 days, leading to preventable vaccine expiration in regional storage hubs [S4].',
    limitationsAndConflictingInfo: 'Conflicting estimates persist regarding the direct net mortality attributable specifically to mRNA vaccine shortages versus overall healthcare infrastructure collapse. While macroeconomic modeling by the IMF and World Bank projects multitrillion-dollar losses, local microeconomic household surveys show divergent recovery trajectories across urban versus pastoralist populations. Furthermore, early claims that waiving patent protections alone would immediately resolve local manufacturing deficits are contradicted by technical transfer audits, which identify bioreactor access and skilled chromatography personnel as the true binding constraints.',
    conclusion: 'Asymmetric distribution of mRNA vaccines during the pandemic underscored the limitations of donation-based international relief frameworks. Mitigating future global health inequities requires decentralized regional manufacturing capacity, relaxed patent monopolies under emergency protocols, and subsidized investments in decentralized renewable cold-storage infrastructure.',
    sources: [
      {
        id: 'S1',
        title: 'Global Vaccine Inequity: Epidemiological and Macroeconomic Monitoring Report',
        url: 'https://www.who.int/publications/i/item/global-vaccine-inequity-2022',
        publisher: 'World Health Organization (WHO)',
        domain: 'who.int',
        publishedDate: '2022-09-14',
        sourceType: 'Government',
        credibilityScore: 96,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Official international health agency document with vetted multi-country epidemiological telemetry.',
        excerpt: 'By mid-2022, only 14.8% of people in low-income countries had received at least one dose of a COVID-19 vaccine, compared to 82.3% in high-income countries, driven largely by bilateral purchase commitments and delayed multilateral disbursements.',
        accessible: true
      },
      {
        id: 'S2',
        title: 'World Economic Outlook: Recovery During a Pandemic',
        url: 'https://www.imf.org/en/Publications/WEO/Issues/2021/10/12/world-economic-outlook-october-2021',
        publisher: 'International Monetary Fund (IMF)',
        domain: 'imf.org',
        publishedDate: '2021-10-12',
        sourceType: 'Official Report',
        credibilityScore: 94,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Authoritative multilateral financial institution tracking macroeconomic output and sovereign debt metrics.',
        excerpt: 'Vaccine access remains the principal fault line along which the global economic recovery diverges. In emerging and developing economies, prolonged infection waves and delayed rollouts are projected to reduce cumulative output by $2.3 trillion.',
        accessible: true
      },
      {
        id: 'S3',
        title: 'Cold Chain Assessment in Sub-Saharan Health Systems',
        url: 'https://www.unicef.org/reports/cold-chain-logistics-health-systems',
        publisher: 'UNICEF Supply Division',
        domain: 'unicef.org',
        publishedDate: '2022-04-18',
        sourceType: 'Official Report',
        credibilityScore: 91,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Comprehensive field telemetry across 34 low-income healthcare jurisdictions.',
        excerpt: 'Ultra-low temperature storage (-60°C to -80°C) requirements created logistical friction, with over 40% of secondary health posts reporting frequent power outages and an average incremental logistics cost of $3.20 to $3.60 per administered dose.',
        accessible: true
      },
      {
        id: 'S4',
        title: 'The mRNA Technology Transfer Programme: Establishing Regional Capacity',
        url: 'https://www.nature.com/articles/d41587-023-00012-4',
        publisher: 'Nature Biotechnology',
        domain: 'nature.com',
        publishedDate: '2023-02-08',
        sourceType: 'Research Paper',
        credibilityScore: 95,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Peer-reviewed academic journal covering molecular diagnostics and global biotechnology infrastructure.',
        excerpt: 'South African consortium Afrigen Biologics successfully synthesized candidate mRNA constructs using publicly disclosed sequence data, demonstrating proof-of-concept for localized mRNA manufacturing in emerging markets.',
        accessible: true
      },
      {
        id: 'S5',
        title: 'Global Health Governance and Vaccine Nationalism: A Review',
        url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)00829-9/fulltext',
        publisher: 'The Lancet Global Health',
        domain: 'thelancet.com',
        publishedDate: '2021-06-25',
        sourceType: 'Research Paper',
        credibilityScore: 97,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Top-tier medical journal evaluating global pharmaceutical governance and treaty obligations.',
        excerpt: 'Bilateral advance procurement contracts pre-empted COVAX allocations, concentrating initial global supply in 16% of the world population during the critical first six months of rollout.',
        accessible: true
      }
    ],
    claims: [
      {
        id: 'CLM-001',
        claimText: 'High-income nations secured over 75% of early bilateral mRNA vaccine purchase agreements while representing only 16% of the global population.',
        sourceIds: ['S1', 'S5'],
        evidenceExcerpt: 'By mid-2022, only 14.8% of people in low-income countries had received at least one dose, compared to 82.3% in high-income countries... Bilateral advance procurement contracts pre-empted COVAX allocations, concentrating initial global supply in 16% of the world population.',
        status: 'supported',
        confidenceScore: 98,
        rationale: 'Directly corroborated by WHO epidemiological reports and Lancet governance analyses confirming the ~16% population concentration and severe early supply capture.',
        sectionRef: 'Key Findings'
      },
      {
        id: 'CLM-002',
        claimText: 'The asymmetric vaccine distribution caused an estimated cumulative macroeconomic loss of over $2.3 trillion across developing economies.',
        sourceIds: ['S2'],
        evidenceExcerpt: 'In emerging and developing economies, prolonged infection waves and delayed rollouts are projected to reduce cumulative output by $2.3 trillion.',
        status: 'supported',
        confidenceScore: 95,
        rationale: 'The IMF World Economic Outlook explicitly projects cumulative output losses of $2.3 trillion directly attributed to delayed vaccine access and infection waves.',
        sectionRef: 'Key Findings'
      },
      {
        id: 'CLM-003',
        claimText: 'Ultra-cold-chain requirements increased per-dose delivery costs by $3.50 in rural clinics.',
        sourceIds: ['S3'],
        evidenceExcerpt: 'Ultra-low temperature storage (-60°C to -80°C) requirements created logistical friction... with an average incremental logistics cost of $3.20 to $3.60 per administered dose.',
        status: 'supported',
        confidenceScore: 92,
        rationale: 'UNICEF supply audit confirms average incremental logistics costs between $3.20 and $3.60 per dose, aligning squarely with the stated $3.50 mid-point estimate.',
        sectionRef: 'Key Findings'
      },
      {
        id: 'CLM-004',
        claimText: 'Intellectual property waivers alone would have immediately solved mRNA production shortages within 30 days of ratification.',
        sourceIds: ['S4'],
        evidenceExcerpt: 'South African consortium Afrigen Biologics successfully synthesized candidate mRNA constructs... however, technical bottlenecks including lipid nanoparticle formulation, specialized chromatography, and cleanroom qualification require multi-year technical investments.',
        status: 'contradicted',
        contradictionFlag: true,
        confidenceScore: 94,
        rationale: 'Nature Biotechnology and WHO audits demonstrate that specialized raw materials, GMP bioreactors, and lipid nanoparticle encapsulation—not merely legal patent waivers—represented the binding technical rate-limiting step.',
        sectionRef: 'Limitations & Conflicts',
        revisedText: 'While patent waivers address legal barriers, immediate production remained constrained by specialized raw materials and bioreactor qualification.',
        originalClaimBeforeRevision: 'Intellectual property waivers alone would have immediately solved mRNA production shortages within 30 days.'
      },
      {
        id: 'CLM-005',
        claimText: 'Over 30% of donated vaccine doses arrived in recipient nations with remaining shelf-lives under 60 days.',
        sourceIds: ['S4'],
        evidenceExcerpt: 'International donation monitoring documented rapid expiration risks and delivery delays, but specific global percentage figures for short-dated shipments varied across regional receiving docks.',
        status: 'partially_supported',
        confidenceScore: 78,
        rationale: 'While regional reports from African health ministries confirm widespread short shelf-life shipments, exact aggregated global proportion requires ongoing standardized telemetry.',
        sectionRef: 'Evidence Analysis'
      },
      {
        id: 'CLM-006',
        claimText: 'The mRNA technology transfer program in South Africa has completely eliminated all African pharmaceutical import dependencies as of 2024.',
        sourceIds: ['S4'],
        evidenceExcerpt: 'Afrigen Biologics successfully synthesized candidate mRNA constructs... clinical trials and commercial scale manufacturing remain scheduled for subsequent multi-year phases.',
        status: 'contradicted',
        contradictionFlag: true,
        confidenceScore: 96,
        rationale: 'Nature Biotechnology confirms the project is a candidate-stage milestone, not full commercial phase elimination of African pharmaceutical imports.',
        sectionRef: 'Limitations & Conflicts',
        revisedText: 'The South African mRNA hub marks a pioneering proof-of-concept milestone, but commercial scale deployment remains a multi-year phased undertaking.',
        originalClaimBeforeRevision: 'The mRNA technology transfer program in South Africa has completely eliminated all African pharmaceutical import dependencies.'
      }
    ],
    references: [
      {
        id: 'S1',
        citationNumber: 1,
        authorsOrPublisher: 'World Health Organization',
        title: 'Global Vaccine Inequity: Epidemiological and Macroeconomic Monitoring Report',
        publicationDate: '2022-09-14',
        url: 'https://www.who.int/publications/i/item/global-vaccine-inequity-2022',
        sourceType: 'Government / Multilateral',
        formattedCitation: 'World Health Organization. (2022). Global Vaccine Inequity: Epidemiological and Macroeconomic Monitoring Report. Geneva: WHO Press.'
      },
      {
        id: 'S2',
        citationNumber: 2,
        authorsOrPublisher: 'International Monetary Fund',
        title: 'World Economic Outlook: Recovery During a Pandemic',
        publicationDate: '2021-10-12',
        url: 'https://www.imf.org/en/Publications/WEO/Issues/2021/10/12/world-economic-outlook-october-2021',
        sourceType: 'Official Report',
        formattedCitation: 'International Monetary Fund. (2021). World Economic Outlook: Recovery During a Pandemic (October 2021). Washington, DC: IMF Publications.'
      },
      {
        id: 'S3',
        citationNumber: 3,
        authorsOrPublisher: 'UNICEF Supply Division',
        title: 'Cold Chain Assessment in Sub-Saharan Health Systems',
        publicationDate: '2022-04-18',
        url: 'https://www.unicef.org/reports/cold-chain-logistics-health-systems',
        sourceType: 'Official Report',
        formattedCitation: 'UNICEF Supply Division. (2022). Cold Chain Assessment and Infrastructure Telemetry in Primary Healthcare Networks. Copenhagen: UNICEF.'
      },
      {
        id: 'S4',
        citationNumber: 4,
        authorsOrPublisher: 'Nature Biotechnology Editorial Team',
        title: 'The mRNA Technology Transfer Programme: Establishing Regional Capacity',
        publicationDate: '2023-02-08',
        url: 'https://www.nature.com/articles/d41587-023-00012-4',
        sourceType: 'Academic Research Paper',
        formattedCitation: 'Nature Biotechnology. (2023). Establishing regional biomanufacturing via the mRNA technology transfer hub. Nature Biotechnology, 41(2), 154-156.'
      },
      {
        id: 'S5',
        citationNumber: 5,
        authorsOrPublisher: 'The Lancet Global Health',
        title: 'Global Health Governance and Vaccine Nationalism: A Review',
        publicationDate: '2021-06-25',
        url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)00829-9/fulltext',
        sourceType: 'Academic Research Paper',
        formattedCitation: 'The Lancet Global Health. (2021). Vaccine nationalism and bilateral procurement asymmetries in international health governance. Lancet Glob Health, 9(8), e1042-e1044.'
      }
    ],
    stages: [
      {
        stageNumber: 1,
        name: 'Topic Interpretation & Question Formulation',
        description: 'Parsed user brief parameters, scoped socioeconomic focus, and established academic rubric.',
        status: 'completed',
        durationMs: 412,
        detailSummary: 'Defined research boundaries spanning macroeconomics, cold-chain logistics, and biotechnology sovereignty.'
      },
      {
        stageNumber: 2,
        name: 'Multi-Source Discovery & Live Retrieval',
        description: 'Executed search grounding queries targeting WHO, IMF, UNICEF, Nature, and Lancet repositories.',
        status: 'completed',
        durationMs: 1450,
        detailSummary: 'Discovered 14 relevant documents; filtered duplicate domains and non-verifiable forum posts.'
      },
      {
        stageNumber: 3,
        name: 'Credibility, Freshness & Authority Evaluation',
        description: 'Evaluated source tier classifications, institutional backing, publication recency, and peer-review status.',
        status: 'completed',
        durationMs: 380,
        detailSummary: 'Validated 5 primary high-authority sources; average source credibility calculated at 94.6/100.'
      },
      {
        stageNumber: 4,
        name: 'Evidence Excerpt Extraction & Normalization',
        description: 'Extracted verbatim excerpts with numerical parameters, dates, and direct factual propositions.',
        status: 'completed',
        durationMs: 620,
        detailSummary: 'Isolated 6 primary factual excerpts with direct citation anchors.'
      },
      {
        stageNumber: 5,
        name: 'Evidence-Backed Academic Brief Drafting',
        description: 'Synthesized 6 structured sections with formal academic tone and inline [S#] citations.',
        status: 'completed',
        durationMs: 1890,
        detailSummary: 'Generated Executive Summary, Background, Findings, Analysis, Limitations, and Conclusion.'
      },
      {
        stageNumber: 6,
        name: 'Claim-Level Verification & Adversarial Audit',
        description: 'Audited 6 individual factual claims against source evidence excerpts to detect hyperbole or false attribution.',
        status: 'flagged',
        durationMs: 980,
        detailSummary: '3 Supported, 1 Partially Supported, 2 Contradicted claims identified during audit.'
      },
      {
        stageNumber: 7,
        name: 'Revision, Contradiction Flagging & Synthesis',
        description: 'Revised contradicted claims, flagged technical rate-limiting factors in Limitations section.',
        status: 'completed',
        durationMs: 510,
        detailSummary: 'Down-regulated hyperbolic claims regarding patent-only solutions and total immediate self-sufficiency.'
      },
      {
        stageNumber: 8,
        name: 'Traceable Reference Ledger Compilation',
        description: 'Built final bibliographic citations with active hyperlinks and audit metrics.',
        status: 'completed',
        durationMs: 240,
        detailSummary: 'Brief successfully assembled with 100% traceable claim-to-source mappings.'
      }
    ],
    metrics: {
      totalSourcesFound: 14,
      sourcesRetained: 5,
      totalClaimsEvaluated: 6,
      supportedCount: 3,
      partiallySupportedCount: 1,
      contradictedCount: 2,
      unverifiedCount: 0,
      verificationRigorScore: 92,
      averageSourceCredibility: 95
    }
  },

  'post-quantum-cryptography': {
    id: 'brief-pqc-02',
    isDemoSample: true,
    title: 'Post-Quantum Cryptography: NIST Standards, Migration Complexity, and Public Key Vulnerabilities',
    topic: 'Quantum Computing vs Post-Quantum Cryptography Standards NIST',
    researchQuestion: 'What are the technical and operational challenges associated with transitioning critical cyberinfrastructure from classical public key algorithms to NIST-standardized Post-Quantum Cryptographic algorithms?',
    academicLevel: 'advanced',
    briefLength: 'medium',
    generatedAt: '2026-03-20T14:15:00Z',
    executiveSummary: 'Shor’s algorithm poses an existential vulnerability to widely deployed asymmetric cryptographic primitives, including RSA and Elliptic Curve Cryptography (ECC). In August 2024, the National Institute of Standards and Technology (NIST) released its initial set of finalized post-quantum standards: ML-KEM (FIPS 203), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205). While these lattice-based and stateless hash-based algorithms offer robust theoretical protection against fault-tolerant quantum computers, real-world deployment faces severe friction. Key challenges include orders-of-magnitude larger public keys and ciphertext sizes, legacy protocol buffer overruns in TLS handshakes, algorithmic side-channel vulnerabilities, and the urgent phenomenon of "Harvest Now, Decrypt Later" (HNDL) espionage.',
    introduction: 'The cryptographic security underpinning modern global finance, internet communications, and defense telemetry relies fundamentally on the computational intractability of integer factorization and the discrete logarithm problem. Peter Shor’s 1994 quantum polynomial-time algorithm demonstrated that a sufficiently fault-tolerant quantum computer running error-corrected qubits would compromise standard RSA-2048 and ECC-256 within minutes. Consequently, NIST initiated an 8-year global standardization effort to identify, stress-test, and standardize quantum-resistant replacements based on alternative mathematical problems, predominantly Module Learning with Errors (M-LWE).',
    keyFindings: [
      'In August 2024, NIST formally released FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA), designating them as the primary post-quantum cryptographic standards [S1].',
      'ML-KEM-768 ciphertext sizes (1,088 bytes) and public keys (1,184 bytes) represent an approximate 35x expansion compared to X25519 elliptic-curve public keys [S2].',
      'Nation-state threat actors are actively conducting "Harvest Now, Decrypt Later" (HNDL) data exfiltration of high-value encrypted traffic with decades-long strategic shelf-lives [S3].',
      'Hybrid key exchange mechanisms combining X25519 with ML-KEM (X25519MLKEM768) have been implemented in Chromium and OpenSSL to guard against both classical and quantum regression [S4].'
    ],
    evidenceAnalysis: 'The operational integration of post-quantum standards exposes deep architectural assumptions in legacy protocol stacks. As detailed in NIST FIPS 203, ML-KEM relies on the hardness of the Module Learning with Errors problem over cyclotomic rings [S1]. While mathematically resilient, the parameter sizes require substantial bandwidth adaptations. IETF Internet-Draft measurements documented that packet fragmentation occurred in 4.7% of enterprise TLS 1.3 handshakes when raw post-quantum certificates exceeded standard Maximum Transmission Unit (MTU) thresholds of 1,500 bytes [S2].\n\nTo address transition risks, federal directives from the US Cybersecurity and Infrastructure Security Agency (CISA) and the White House National Security Memorandum-10 mandated cryptographic inventory baselining and prioritized hybrid key encapsulation [S3]. Hybrid deployments ensure that even if unexpected mathematical cryptanalysis emerges against newly standardized lattice schemes, classical elliptic-curve security guarantees remain intact as a fallback [S4]. However, side-channel power analysis during private key expansion in low-power IoT microcontrollers remains an active research concern, necessitating masked hardware implementations [S5].',
    limitationsAndConflictingInfo: 'Conflicting projections exist regarding the cryptographic relevance horizon—the estimated timeline until a fault-tolerant quantum computer capable of breaking RSA-2048 (requiring approximately 20 million physical qubits under surface-code architectures) is realized. While conservative estimates place this milestone in the 2035–2040 timeframe, aggressive commercial roadmaps cite 2030. Furthermore, claims that transitioning to post-quantum cryptography induces unacceptable latency overhead are contradicted by real-world CDN telemetry from Cloudflare and Google, which demonstrates sub-15ms median connection handshake deltas for hybrid ML-KEM.',
    conclusion: 'The transition to post-quantum cryptography represents the largest cryptographic migration in digital history. Organizations must adopt cryptographic agility, migrate to NIST FIPS 203/204 hybrid suites, and audit legacy hardware for MTU packet handling capacity.',
    sources: [
      {
        id: 'S1',
        title: 'FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard',
        url: 'https://csrc.nist.gov/pubs/fips/203/final',
        publisher: 'National Institute of Standards and Technology (NIST)',
        domain: 'nist.gov',
        publishedDate: '2024-08-13',
        sourceType: 'Government',
        credibilityScore: 99,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Official US Federal Information Processing Standard defining primary PQC KEM specifications.',
        excerpt: 'NIST has finalized FIPS 203 (ML-KEM), derived from the CRYSTALS-Kyber submission, specifying key-encapsulation algorithms designed to resist cryptanalytic attacks by quantum computers.',
        accessible: true
      },
      {
        id: 'S2',
        title: 'Post-Quantum Cryptography in TLS: Bandwidth, Fragmentation, and Latency Telemetry',
        url: 'https://www.ietf.org/archive/id/draft-ietf-tls-hybrid-design-09.html',
        publisher: 'Internet Engineering Task Force (IETF)',
        domain: 'ietf.org',
        publishedDate: '2024-06-11',
        sourceType: 'Official Report',
        credibilityScore: 95,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Standardization body tracking real-world internet protocol measurements.',
        excerpt: 'The substantial increase in public key and ciphertext sizes in lattice-based algorithms introduces MTU packet fragmentation across ~4.7% of tested middlebox networks when packet size exceeds 1,500 bytes.',
        accessible: true
      },
      {
        id: 'S3',
        title: 'Quantum-Readiness: Migration to Post-Quantum Cryptography Roadmap',
        url: 'https://www.cisa.gov/quantum',
        publisher: 'Cybersecurity and Infrastructure Security Agency (CISA)',
        domain: 'cisa.gov',
        publishedDate: '2024-04-02',
        sourceType: 'Government',
        credibilityScore: 97,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Federal operational cybersecurity agency directing national infrastructure defenses.',
        excerpt: 'Adversaries are currently executing "Harvest Now, Decrypt Later" operations, intercepting and retaining encrypted communications today to decrypt them when quantum cryptanalytic capabilities become operational.',
        accessible: true
      },
      {
        id: 'S4',
        title: 'Deploying Hybrid Post-Quantum Key Exchange in Real-World Web Browsers',
        url: 'https://blog.cloudflare.com/post-quantum-to-the-masses/',
        publisher: 'Cloudflare Engineering',
        domain: 'cloudflare.com',
        publishedDate: '2024-03-19',
        sourceType: 'News',
        credibilityScore: 90,
        credibilityTier: 'Moderate Authority',
        credibilityNotes: 'Global CDN provider processing billions of real-world TLS connections daily.',
        excerpt: 'Over 20% of internet traffic routed through Cloudflare now negotiates hybrid X25519+MLKEM768 key exchanges with negligible median latency degradation of under 10 milliseconds.',
        accessible: true
      },
      {
        id: 'S5',
        title: 'Physical Side-Channel Attacks on Lattice-Based Cryptographic Hardware Implementations',
        url: 'https://ieeexplore.ieee.org/document/9845321',
        publisher: 'IEEE Transactions on Computers',
        domain: 'ieee.org',
        publishedDate: '2023-11-15',
        sourceType: 'Research Paper',
        credibilityScore: 96,
        credibilityTier: 'High Authority',
        credibilityNotes: 'Top-tier peer-reviewed electrical engineering and computer science transaction.',
        excerpt: 'Unprotected FPGA implementations of polynomial multiplication in ML-KEM and ML-DSA remain vulnerable to correlation power analysis, emphasizing the requirement for algorithmic masking.',
        accessible: true
      }
    ],
    claims: [
      {
        id: 'CLM-001',
        claimText: 'NIST finalized FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA) in August 2024.',
        sourceIds: ['S1'],
        evidenceExcerpt: 'NIST has finalized FIPS 203 (ML-KEM), derived from the CRYSTALS-Kyber submission... on August 13, 2024.',
        status: 'supported',
        confidenceScore: 99,
        rationale: 'Official NIST FIPS publication records confirm the precise August 2024 release date and standard designations.',
        sectionRef: 'Key Findings'
      },
      {
        id: 'CLM-002',
        claimText: 'Packet fragmentation occurs in approximately 4.7% of enterprise TLS 1.3 handshakes when post-quantum certificates exceed standard MTU.',
        sourceIds: ['S2'],
        evidenceExcerpt: 'The substantial increase in public key and ciphertext sizes in lattice-based algorithms introduces MTU packet fragmentation across ~4.7% of tested middlebox networks...',
        status: 'supported',
        confidenceScore: 94,
        rationale: 'IETF empirical telemetry corroborates the exact 4.7% fragmentation frequency under standard 1,500 byte Ethernet MTU.',
        sectionRef: 'Evidence Analysis'
      },
      {
        id: 'CLM-003',
        claimText: 'Adversaries are actively executing Harvest Now, Decrypt Later operations against high-value communications.',
        sourceIds: ['S3'],
        evidenceExcerpt: 'Adversaries are currently executing "Harvest Now, Decrypt Later" operations, intercepting and retaining encrypted communications today to decrypt them when quantum cryptanalytic capabilities become operational.',
        status: 'supported',
        confidenceScore: 97,
        rationale: 'Directly corroborated by CISA and NSA national security directives highlighting active adversary exfiltration.',
        sectionRef: 'Key Findings'
      },
      {
        id: 'CLM-004',
        claimText: 'Transitioning to hybrid post-quantum key exchange slows down web browsing speeds by more than 500 milliseconds for everyday users.',
        sourceIds: ['S4'],
        evidenceExcerpt: 'Over 20% of internet traffic routed through Cloudflare now negotiates hybrid X25519+MLKEM768 key exchanges with negligible median latency degradation of under 10 milliseconds.',
        status: 'contradicted',
        contradictionFlag: true,
        confidenceScore: 95,
        rationale: 'Directly contradicted by empirical CDN measurements indicating median latency overhead is under 10 milliseconds, not 500ms.',
        sectionRef: 'Limitations & Conflicts',
        revisedText: 'Empirical CDN telemetry demonstrates that hybrid post-quantum key exchange incurs negligible latency penalties under 10ms for web clients.',
        originalClaimBeforeRevision: 'Transitioning to hybrid post-quantum key exchange slows down web browsing speeds by more than 500 milliseconds.'
      },
      {
        id: 'CLM-005',
        claimText: 'Side-channel power analysis requires masking countermeasures in hardware implementations of post-quantum polynomial multiplication.',
        sourceIds: ['S5'],
        evidenceExcerpt: 'Unprotected FPGA implementations of polynomial multiplication in ML-KEM and ML-DSA remain vulnerable to correlation power analysis, emphasizing the requirement for algorithmic masking.',
        status: 'supported',
        confidenceScore: 96,
        rationale: 'IEEE peer-reviewed experiments demonstrate differential power analysis vulnerabilities in unmasked silicon implementations.',
        sectionRef: 'Evidence Analysis'
      }
    ],
    references: [
      {
        id: 'S1',
        citationNumber: 1,
        authorsOrPublisher: 'National Institute of Standards and Technology',
        title: 'FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard',
        publicationDate: '2024-08-13',
        url: 'https://csrc.nist.gov/pubs/fips/203/final',
        sourceType: 'Government Standard',
        formattedCitation: 'NIST. (2024). Module-Lattice-Based Key-Encapsulation Mechanism Standard (FIPS PUB 203). U.S. Department of Commerce. https://doi.org/10.6028/NIST.FIPS.203'
      },
      {
        id: 'S2',
        citationNumber: 2,
        authorsOrPublisher: 'Internet Engineering Task Force (IETF)',
        title: 'Post-Quantum Cryptography in TLS: Bandwidth, Fragmentation, and Latency Telemetry',
        publicationDate: '2024-06-11',
        url: 'https://www.ietf.org/archive/id/draft-ietf-tls-hybrid-design-09.html',
        sourceType: 'Technical Standard',
        formattedCitation: 'IETF TLS Working Group. (2024). Hybrid key exchange in TLS 1.3 (draft-ietf-tls-hybrid-design-09). IETF Secretariat.'
      },
      {
        id: 'S3',
        citationNumber: 3,
        authorsOrPublisher: 'Cybersecurity and Infrastructure Security Agency',
        title: 'Quantum-Readiness: Migration to Post-Quantum Cryptography Roadmap',
        publicationDate: '2024-04-02',
        url: 'https://www.cisa.gov/quantum',
        sourceType: 'Official Government Directive',
        formattedCitation: 'CISA. (2024). Post-Quantum Cryptography Initiative Roadmap & Risk Assessment Guide. Washington, DC: Department of Homeland Security.'
      },
      {
        id: 'S4',
        citationNumber: 4,
        authorsOrPublisher: 'Cloudflare Research',
        title: 'Deploying Hybrid Post-Quantum Key Exchange in Real-World Web Browsers',
        publicationDate: '2024-03-19',
        url: 'https://blog.cloudflare.com/post-quantum-to-the-masses/',
        sourceType: 'Industry Whitepaper',
        formattedCitation: 'Cloudflare Research & Engineering. (2024). Telemetry and latency implications of large-scale hybrid post-quantum key exchange. Cloudflare Blog.'
      },
      {
        id: 'S5',
        citationNumber: 5,
        authorsOrPublisher: 'IEEE Computer Society',
        title: 'Physical Side-Channel Attacks on Lattice-Based Cryptographic Hardware Implementations',
        publicationDate: '2023-11-15',
        url: 'https://ieeexplore.ieee.org/document/9845321',
        sourceType: 'Peer-Reviewed Journal',
        formattedCitation: 'IEEE Transactions on Computers. (2023). Side-channel vulnerabilities in polynomial multiplication accelerators for lattice-based cryptosystems. IEEE Trans Comput, 72(11), 3120-3132.'
      }
    ],
    stages: [
      {
        stageNumber: 1,
        name: 'Topic Interpretation & Question Formulation',
        description: 'Framed cryptographic migration challenges and evaluated mathematical hardness foundations.',
        status: 'completed',
        durationMs: 390,
        detailSummary: 'Scoped analysis across Shor’s algorithm, lattice schemes (ML-KEM/DSA), and network layer packet impacts.'
      },
      {
        stageNumber: 2,
        name: 'Multi-Source Discovery & Live Retrieval',
        description: 'Queried NIST CSRC, IETF Datatracker, CISA, Cloudflare, and IEEE Xplore databases.',
        status: 'completed',
        durationMs: 1320,
        detailSummary: 'Discovered 11 authoritative standards and reports; deduplicated overlapping draft RFCs.'
      },
      {
        stageNumber: 3,
        name: 'Credibility, Freshness & Authority Evaluation',
        description: 'Assessed federal standard validity, peer review ratings, and technical currency through 2024-2026.',
        status: 'completed',
        durationMs: 340,
        detailSummary: '5 top-tier sources approved; average credibility score 95.4/100.'
      },
      {
        stageNumber: 4,
        name: 'Evidence Excerpt Extraction & Normalization',
        description: 'Parsed key size comparisons, fragmentation rates, and adversary operational intelligence.',
        status: 'completed',
        durationMs: 510,
        detailSummary: 'Extracted exact numerical telemetry from IETF and Cloudflare benchmark suites.'
      },
      {
        stageNumber: 5,
        name: 'Evidence-Backed Academic Brief Drafting',
        description: 'Composed technical brief conforming to advanced graduate-level computer science standards.',
        status: 'completed',
        durationMs: 1740,
        detailSummary: 'Synthesized 6 core sections with precise inline citations and mathematical context.'
      },
      {
        stageNumber: 6,
        name: 'Claim-Level Verification & Adversarial Audit',
        description: 'Audited claims against FIPS specifications and real-world network measurement data.',
        status: 'flagged',
        durationMs: 890,
        detailSummary: '4 Supported, 1 Contradicted claim regarding user latency overhead.'
      },
      {
        stageNumber: 7,
        name: 'Revision, Contradiction Flagging & Synthesis',
        description: 'Corrected inaccurate claim asserting massive consumer latency penalties.',
        status: 'completed',
        durationMs: 440,
        detailSummary: 'Updated Limitations section with empirical CDN latency figures (<10ms).'
      },
      {
        stageNumber: 8,
        name: 'Traceable Reference Ledger Compilation',
        description: 'Generated APA/IEEE formatted citations with persistent identifiers and audit scores.',
        status: 'completed',
        durationMs: 220,
        detailSummary: 'Audit ledger assembled with 100% claim-to-source integrity.'
      }
    ],
    metrics: {
      totalSourcesFound: 11,
      sourcesRetained: 5,
      totalClaimsEvaluated: 5,
      supportedCount: 4,
      partiallySupportedCount: 0,
      contradictedCount: 1,
      unverifiedCount: 0,
      verificationRigorScore: 96,
      averageSourceCredibility: 95
    }
  }
};

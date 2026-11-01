/* CV content - taken from Jan Hrusovsky's current CV (PDF, 2026). No invented facts.
   Phone number intentionally NOT included on the web page. */
window.CV = {
  name: "Jan Hrusovsky",
  title: "Cloud Architect and Advisor",
  location: "Dublin, Ireland",
  email: "basis@janhrusovsky.eu",
  website: "https://www.janhrusovsky.eu",
  websiteLabel: "www.janhrusovsky.eu",
  pdf: "./CV.pdf",
  pdfName: "CV_Jan_Hrusovsky.pdf",
  github: "https://github.com/jicarosni",
  quote: { text: "Most good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.", by: "Linus Torvalds" },
  bio: [
    "As a Cloud Architect and Advisor, I am specialized in technical advisory for RISE with SAP transitions and hyperscaler architecture planning.",
    "With over 15 years of experience in the SAP field, I deliver projects with 100% customer satisfaction by maintaining a positive mindset and an eye for detail.",
    "I specialize in RISE with SAP, Cloud Solutions, and the interconnection between business and IT."
  ],
  highlights: [
    "Over 15 years of experience in the SAP field (since 2010)",
    "RISE with SAP S/4HANA Cloud (private edition) advisory",
    "Hyperscaler architecture: Microsoft Azure, Google Cloud Platform (GCP), AWS",
    "Cloud Solutions and the interconnection between business and IT",
    "SAP certified (S/4HANA, HANA, OS/DB Migration, NetWeaver) and Azure / Google Cloud certified"
  ],
  profile: "I am a quick learner with hard-working attitude. Reliable with extensive professional experience in SAP system administration. I am goal-orientated and structured. I have extended experience carrying out various SAP projects. Perform under pressure, team player, seeking challenges.",
  experience: [
    { id: "EXP-004", from: "2025", to: "present", position: "Cloud Architect & Advisor", company: "SAP", location: "Dublin, Ireland",
      summary: "Responsibilities",
      duties: [
        "RISE with SAP Strategy: Presenting detailed technical and operational aspects of RISE with SAP S/4HANA Cloud (private edition) and managed service offerings to C-suite stakeholders and IT leadership.",
        "Hyperscaler Architecture: Defining technical requirements and value propositions for SAP private cloud across SAP Data Centres and hyperscalers including Microsoft Azure, Google Cloud Platform (GCP), and AWS.",
        "Non-Functional Governance: Guiding customers on critical capabilities including Business Continuity, Cybersecurity & Compliance, Networking, and Technical Operations.",
        "Commercial Orchestration: Utilizing SAP configuration and quoting tools to generate pricing models and provide continuous deal support to sales teams.",
        "Technical Ownership: Leading customer-facing technical discussions and orchestrating expertise from the SAP Enterprise Cloud Services delivery organization to resolve complex architectural challenges.",
        "Presales & Post-Sales Engagement: Serving as the primary technical point of contact throughout the customer lifecycle to ensure seamless service consumption and satisfaction."] },
    { id: "EXP-003", from: "2019", to: "2025", position: "SAP Basis Consultant", company: "TCS", location: "Dublin, Ireland",
      summary: "Primarily responsible for maintaining and enhancing all the NetWeaver components including S/4H, ERP, CRM, BO, Governance, Risk and Compliance (GRC), Enterprise Portal (EP), FIORI, Solution Manager and HANA. This includes SAP Basis configuration, installation, performance tuning, upgrades, transports and client implementation. Technical support for ERP to S/4HANA conversion.",
      duties: [
        "SAP S/4Hana 1909 FPS01 to SAP S/4Hana 2023 upgrade",
        "SAP Data Services upgrade from 4.2 to 4.3 and migration from DB2 to SAP HANA",
        "SAML and OAuth authentication mechanism configured on client Gateway systems to enhance security and streamline user access",
        "SSL configuration across entire client landscape. SSL configuration on ABAP, JAVA, SAP BO systems",
        "SAP ECC EHP6 conversion to S/4Hana 1909 FPS01, FIORI (go-live December 2020)",
        "Software Installations and upgrades",
        "Support Packs and Kernel upgrades",
        "CHARM administration",
        "System refreshes",
        "Database administration \u2013 HANA, DB2, Database upgrades, fix packs, optimization and tuning"] },
    { id: "EXP-002", from: "2013", to: "2019", position: "SAP Basis Administrator", company: "IBM", location: "Brno, Czech Republic",
      summary: "As a member of technical project team delivery (from 2016) I have worked on listed project as Basis support responsible for technical part of the projects.",
      duties: [
        "SAP SRM 7.4 EHP4 running on Oracle/AIX Unicode conversion",
        "SAP CRM 7.0 EHP4 running on Oracle/AIX migration combined with Oracle 12.1 upgrade",
        "SAP ECC 6.0 EHP7 running on Oracle/AIX upgrade combined with DB2 upgrade",
        "SAP ECC 7.4 EHP7 running on DB2/AIX migration to Linux environment",
        "BAU activities: SAP NW System configuration, administration and troubleshooting",
        "BAU activities: Kernel Upgrades, Installation of SAP Notes",
        "BAU activities: SAP Client Administration - Client Copy/Export/Import/Delete",
        "AIX, LINUX Administration",
        "Performance monitoring and fine-tuning",
        "Maintaining profile parameters",
        "Oracle Database Administration Patching",
        "SAP/DB System sizing"] },
    { id: "EXP-001", from: "2010", to: "2013", position: "SAP Basis Administrator", company: "T-Systems", location: "Kosice, Slovak Republic",
      summary: "Activities",
      duties: [
        "SAP Netweaver administration running on ORACLE DB",
        "User management and authorization",
        "Kernel Upgrades, Installation of SAP Notes, Support packages",
        "System copy and System refresh, Add on Installations and upgrades",
        "SAP BASIS System Configuration, administration and troubleshooting",
        "Customer Focal Point",
        "On-call duty L2"] }
  ],
  projects: [
    { id: "PRJ-009", company: "TCS", product: "SAP S/4HANA", stack: "1909 FPS01 \u2192 2023", type: "Release upgrade", desc: "SAP S/4Hana 1909 FPS01 to SAP S/4Hana 2023 upgrade", status: "Completed" },
    { id: "PRJ-008", company: "TCS", product: "SAP Data Services", stack: "DB2 \u2192 SAP HANA", type: "Upgrade 4.2 \u2192 4.3 + DB migration", desc: "SAP Data Services upgrade from 4.2 to 4.3 and migration from DB2 to SAP HANA.", status: "Completed" },
    { id: "PRJ-007", company: "TCS", product: "SAP Gateway", stack: "SAML / OAuth", type: "Security / authentication", desc: "SAML and OAuth authentication mechanism configured on client Gateway systems to enhance security and streamline user access.", status: "Completed" },
    { id: "PRJ-006", company: "TCS", product: "ABAP, JAVA, SAP BO", stack: "SSL", type: "Security / SSL configuration", desc: "SSL configuration across entire client landscape. SSL configuration on ABAP, JAVA, SAP BO systems.", status: "Completed" },
    { id: "PRJ-005", company: "TCS", product: "SAP ECC EHP6 \u2192 S/4HANA 1909", stack: "S/4HANA, FIORI", type: "S/4HANA conversion", desc: "SAP ECC EHP6 conversion to S/4Hana 1909 FPS01, FIORI (go-live December 2020)", status: "Go-live 12/2020" },
    { id: "PRJ-004", company: "IBM", product: "SAP ECC 7.4 EHP7", stack: "DB2 / AIX \u2192 Linux", type: "OS migration", desc: "SAP ECC 7.4 EHP7 running on DB2/AIX migration to Linux environment", status: "Completed" },
    { id: "PRJ-003", company: "IBM", product: "SAP ECC 6.0 EHP7", stack: "Oracle / AIX", type: "SAP upgrade + DB2 upgrade", desc: "SAP ECC 6.0 EHP7 running on Oracle/AIX upgrade combined with DB2 upgrade", status: "Completed" },
    { id: "PRJ-002", company: "IBM", product: "SAP CRM 7.0 EHP4", stack: "Oracle / AIX", type: "Migration + Oracle 12.1 upgrade", desc: "SAP CRM 7.0 EHP4 running on Oracle/AIX migration combined with Oracle 12.1 upgrade", status: "Completed" },
    { id: "PRJ-001", company: "IBM", product: "SAP SRM 7.4 EHP4", stack: "Oracle / AIX", type: "Unicode conversion", desc: "SAP SRM 7.4 EHP4 running on Oracle/AIX Unicode conversion", status: "Completed" }
  ],
  skills: [
    ["Cloud advisory", "RISE with SAP S/4HANA Cloud (private edition) strategy and managed service offerings", "SAP"],
    ["Cloud advisory", "Hyperscaler architecture: SAP Data Centres, Microsoft Azure, GCP, AWS", "SAP"],
    ["Cloud advisory", "Non-functional governance: Business Continuity, Cybersecurity & Compliance, Networking, Technical Operations", "SAP"],
    ["Cloud advisory", "Commercial orchestration: SAP configuration and quoting tools, pricing models, deal support", "SAP"],
    ["Cloud advisory", "Presales & post-sales engagement, customer-facing technical ownership", "SAP"],
    ["SAP Basis", "NetWeaver components: S/4H, ERP, CRM, BO, GRC, Enterprise Portal, FIORI, Solution Manager, HANA", "TCS"],
    ["SAP Basis", "ERP to S/4HANA conversion and S/4HANA upgrades", "TCS"],
    ["SAP Basis", "Configuration, installation, performance tuning, upgrades, transports, client implementation", "TCS"],
    ["SAP Basis", "Support Packs and Kernel upgrades, Installation of SAP Notes", "TCS / IBM / T-Systems"],
    ["SAP Basis", "CHARM administration", "TCS"],
    ["SAP Basis", "System copy and system refreshes, add-on installations and upgrades", "TCS / T-Systems"],
    ["SAP Basis", "Unicode conversion, OS/DB migrations, SAP/DB upgrades", "IBM"],
    ["SAP Basis", "Client administration - Client Copy/Export/Import/Delete", "IBM"],
    ["SAP Basis", "SAP/DB system sizing, profile parameters, performance monitoring and fine-tuning", "IBM"],
    ["SAP Basis", "User management and authorization", "T-Systems"],
    ["Security", "SAML and OAuth on Gateway systems; SSL on ABAP, JAVA, SAP BO", "TCS"],
    ["Database", "SAP HANA, DB2 - upgrades, fix packs, optimization and tuning", "TCS"],
    ["Database", "Oracle Database administration and patching", "IBM / T-Systems"],
    ["Database", "SAP HANA monitoring, performance, installation & operations; Sybase ASE", "SAP trainings"],
    ["Operating systems", "AIX, LINUX administration", "IBM"],
    ["Cloud platforms", "Microsoft Azure (AZ-104, AZ-120), Google Cloud (Associate Cloud Engineer)", "Certifications"],
    ["Other", "Customer Focal Point, On-call duty L2", "T-Systems"]
  ],
  certs: [
    ["SAP", "SAP Certified Technology Associate - SAP S/4HANA System Administration"],
    ["SAP", "SAP Certified Technology Associate \u2013 SAP HANA (Edition 2015)"],
    ["SAP", "SAP Certified Technology Associate \u2013 OS DB Migration for SAP NW 7.30"],
    ["SAP", "SAP Certified Technology Associate \u2013 System Administration (Oracle) with SAP NetWeaver 7.0"],
    ["Azure / Cloud", "Microsoft Certified: Azure Administrator Associate (AZ-104)"],
    ["Azure / Cloud", "Microsoft Certified: Azure for SAP Workloads Specialty (AZ-120)"],
    ["Azure / Cloud", "Google Cloud Certified: Associate Cloud Engineer"]
  ],
  trainings: [
    ["ADM315", "SAP Workload Analysis as ABAP"],
    ["TADM70", "SAP System OS and DB Migration"],
    ["ADM540", "Database Administration Sybase ASE (for SAP systems)"],
    ["HA100", "SAP HANA Introduction"],
    ["HA200", "SAP HANA Installation & Operations"],
    ["HA215", "SAP HANA Monitoring and Performance analysis"]
  ],
  education: {
    school: "University of Economics in Bratislava",
    location: "Bratislava, Slovak Republic",
    period: "2005 - 2010",
    degree: "Master degree in Department of public administration and regional development",
    subjects: "Economics, Informatics, Accounting, Mathematics, Management, Marketing and Business Policy, Public administration.",
    languages: "English, Czech"
  },
  /* the current CV lists languages only in the education section, without levels */
  languages: [
    ["English", "Listed in CV (Education)"],
    ["Czech", "Listed in CV (Education)"]
  ]
};

export const mockCategories = [
  { id: "cat-1", name: "Tech", order: 0 },
  { id: "cat-2", name: "Finance", order: 1 },
  { id: "cat-3", name: "Startup", order: 2 },
  { id: "cat-4", name: "Remote", order: 3 },
];

export const mockDomains = [
  {
    id: "dom-1",
    name: "linkedin.com",
    color: "#0077b5",
    order: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "dom-2",
    name: "welcometothejungle.com",
    color: "#ffcd00",
    order: 1,
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

export const mockCompanies = [
  // Inspirational favorite - a company you admire but don't actively pursue
  {
    id: "company-1",
    name: "Airbus",
    categories: ["Tech"],
    website: "https://airbus.com",
    jobUrl: "",
    contactEmail: "",
    contactName: "",
    note: "Aviation de reve, software embarque innovant",
    status: "none" as const,
    applicationStage: "research" as const,
    timeline: [],
    isFavorite: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  // Active candidates - companies you're actually pursuing
  {
    id: "company-2",
    name: "BigBank Inc",
    categories: ["Finance"],
    website: "https://bigbank.com",
    jobUrl: "",
    contactEmail: "hr@bigbank.com",
    contactName: "Jane Smith",
    note: "",
    status: "waiting" as const,
    applicationStage: "applied" as const,
    timeline: [
      {
        id: "tl-1",
        type: "email_sent" as const,
        date: "2024-01-10T00:00:00.000Z",
        content: "Sent application email",
      },
    ],
    contactedAt: "2024-01-10T00:00:00.000Z",
    isFavorite: false,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
  },
  {
    id: "company-4",
    name: "GlobalTech",
    categories: [],
    website: "https://globaltech.io",
    jobUrl: "https://globaltech.io/jobs/123",
    contactEmail: "apply@globaltech.io",
    contactName: "Recruiter",
    note: "",
    status: "waiting" as const,
    applicationStage: "interview" as const,
    timeline: [
      {
        id: "tl-2",
        type: "interview" as const,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        content: "First round interview scheduled",
      },
    ],
    contactedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z",
  },
  {
    id: "company-5",
    name: "Dream Company",
    categories: ["Tech", "Finance", "Remote"],
    website: "https://dream.co",
    jobUrl: "",
    contactEmail: "talent@dream.co",
    contactName: "Sarah Connor",
    note: "Perfect match for my skills",
    status: "waiting" as const,
    applicationStage: "offer" as const,
    timeline: [
      {
        id: "tl-3",
        type: "offer" as const,
        date: "2024-01-20T00:00:00.000Z",
        content: "Received offer!",
      },
    ],
    contactedAt: "2024-01-15T00:00:00.000Z",
    isFavorite: false,
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "company-7",
    name: "Recent Contact",
    categories: ["Startup"],
    website: "https://recent.io",
    jobUrl: "",
    contactEmail: "hello@recent.io",
    contactName: "Mike Brown",
    note: "Waiting for response",
    status: "waiting" as const,
    applicationStage: "applied" as const,
    timeline: [],
    contactedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isFavorite: false,
    createdAt: "2024-01-07T00:00:00.000Z",
    updatedAt: "2024-01-07T00:00:00.000Z",
  },
  {
    id: "company-8",
    name: "Rejected Corp",
    categories: ["Finance"],
    website: "https://rejected.com",
    jobUrl: "",
    contactEmail: "no@rejected.com",
    contactName: "",
    note: "Better luck next time",
    status: "follow_up" as const,
    applicationStage: "rejected" as const,
    timeline: [
      {
        id: "tl-4",
        type: "status_change" as const,
        date: "2024-01-18T00:00:00.000Z",
        content: "Application rejected",
      },
    ],
    contactedAt: "2024-01-05T00:00:00.000Z",
    isFavorite: false,
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-18T00:00:00.000Z",
  },
];

export const mockObjectives = [
  {
    id: "obj-1",
    type: "contact" as const,
    target: 5,
    current: 2,
    weekStart: new Date(Date.now() - new Date().getDay() * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
];

export const mockExportData = {
  companies: mockCompanies,
  zones: mockCategories,
  domains: mockDomains,
  objectives: mockObjectives,
  interactions: [],
  exportedAt: new Date().toISOString(),
  version: 1,
};

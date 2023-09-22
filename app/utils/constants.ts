export const USER_TYPE = {
  CLIENT: {
    ID: 1,
    TYPE: "CLIENT",
  },
  ADMIN: {
    ID: 2,
    TYPE: "ADMIN",
  },
  STREET: {
    ID: 3,
    TYPE: "STREET",
  },
} as const;
export const APPROVAL_TYPE = {
  QUALIFIED: {
    ID: 1,
    TYPE: "QUALIFIED",
  },
  ACCREDITED: {
    ID: 2,
    TYPE: "ACCREDITED",
  },
  RETAIL: {
    ID: 3,
    TYPE: "RETAIL",
  },
  DENIED: {
    ID: 4,
    TYPE: "DENIED",
  },
  PENDING: {
    ID: 5,
    TYPE: "PENDING",
  },
} as const;

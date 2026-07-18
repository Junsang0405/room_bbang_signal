/**
 * auth.ts
 * Lightweight auth utilities — expands as real auth (e.g. JWT, session) is added.
 */

export type AuthMode = "guest" | "explore";

/** Routes users are allowed to access without being "logged in" */
export const PUBLIC_ROUTES = ["/"] as const;

/** The default destination after entering the platform */
export const DASHBOARD_ROUTE = "/dashboard";

/** Landing page route */
export const LANDING_ROUTE = "/";

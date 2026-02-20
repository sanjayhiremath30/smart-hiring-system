import { auth } from "@/auth";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuth) return;
  if (isAuthRoute && req.auth) {
    return Response.redirect(new URL("/", req.url));
  }
  if (isDashboardRoute && !req.auth) {
    return Response.redirect(new URL("/login?callbackUrl=/dashboard", req.url));
  }
  if (isAdminRoute) {
    if (!req.auth) return Response.redirect(new URL("/login?callbackUrl=/admin", req.url));
    if (req.auth.user?.role !== "ADMIN") return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/jobs|api/applications).*)"],
};

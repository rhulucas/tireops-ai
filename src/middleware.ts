// Edge-safe: 仅使用 authConfig，不导入 Prisma/Credentials
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth-config";

const auth = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [], // 不加载 Credentials，避免 Prisma 被拉入 Edge
});

export default auth;

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api/auth (NextAuth)
     * - _next/static
     * - _next/image
     * - favicon
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

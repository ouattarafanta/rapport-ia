import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToset) {
          cookiesToset.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToset.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    console.log(
      "Erreur lors de la récupération des claims:===============",
      error,
    );
  }

  const claims = data?.claims;

  const user: any = claims?.sub ? claims : null;

  const pathname = request.nextUrl.pathname;

  const isPublicRoute =
    pathname.startsWith("/login") || pathname.startsWith("/auth");

  if (!user) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  }

  const user_id = user?.sub;
  let isAdmin = true;
  const isEquipeRoute = pathname.startsWith("/equipes");

  // cas user admin
  let { data: orgaId, error: orgaError }: any = await supabase
    .from("organizations")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();

  // cas user lamda
  if (!orgaId && !orgaError) {
    let { data: orgaId2, error: profileError } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user_id)
      .maybeSingle();

    orgaId = orgaId2;
    isAdmin = false;
  }

  const isEntrepriseRoute = pathname.startsWith("/entreprise");

  if (!orgaId && !isEntrepriseRoute) {
    console.log("entreprise introuvable", orgaId);
    return NextResponse.redirect(new URL("/entreprise", request.url));
  } else if (orgaId && isEntrepriseRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAdmin && isEquipeRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

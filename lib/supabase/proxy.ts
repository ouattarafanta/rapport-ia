import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request,
    })


    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll(){
                    return request.cookies.getAll()
                },

                setAll(cookiesToset) {
                    cookiesToset.forEach(({name, value}) => {
                        request.cookies.set(name, value)
                    })

                    response = NextResponse.next({
                        request,
                    })

                    cookiesToset.forEach(({name, value, options}) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

 const { data, error } = await supabase.auth.getClaims()


if (error || !data) {
  console.log('Erreur lors de la récupération des claims:===============', error)
}
  console.log('Erreur lors de la récupération des claims:===============00000',data, error)


const claims = data?.claims

const user = claims?.sub ? claims : null

    const pathname = request.nextUrl.pathname

    const isPublicRoute = 
    pathname.startsWith('/login')  ||
    pathname.startsWith('/auth')

    if (!user && !isPublicRoute){
        return NextResponse.redirect(
            new URL('/login', request.url)
        )
    }
    return response
}
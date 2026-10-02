import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
        console.log('===============================================000000xxxx')

    const { searchParams, origin } = new URL(request.url)

    const code = searchParams.get('code')
        console.log('===============================================11111', code)

    if(code) {
        const supabase = await createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        console.log( error, '===============================================')

        if(!error) {
            return NextResponse.redirect(`${origin}/dashboard`)
        }
    }
    return NextResponse.redirect(`${origin}/login`)
}
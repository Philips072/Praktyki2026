// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, code, newPassword } = await req.json()

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: codeData, error: codeError } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single()

    if (codeError || !codeData) {
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowy kod weryfikacyjny' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const expiresAt = new Date(codeData.expires_at)
    const now = new Date()

    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ error: 'Kod weryfikacyjny wygasł' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return new Response(
          JSON.stringify({ error: 'Hasło musi mieć co najmniej 6 znaków' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: users, error: listError } = await supabase.auth.admin.listUsers()

      if (listError) {
        return new Response(
          JSON.stringify({ error: 'Błąd wyszukiwania użytkownika' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const user = users?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())

      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Użytkownik nie znaleziony' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: newPassword
      })

      if (updateError) {
        console.error('Password update error:', updateError)
        return new Response(
          JSON.stringify({ error: 'Nie udało się zaktualizować hasła' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      await supabase
        .from('email_verification_codes')
        .delete()
        .eq('id', codeData.id)
    } else {
      await supabase
        .from('email_verification_codes')
        .update({ verified: true })
        .eq('id', codeData.id)
    }

    return new Response(
      JSON.stringify({ success: true, message: newPassword ? 'Hasło zostało zresetowane' : 'Kod zweryfikowany' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd serwera' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

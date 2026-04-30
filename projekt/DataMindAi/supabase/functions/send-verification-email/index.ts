import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

// Generuj 6-cyfrowy kod
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Inicjalizuj Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const resend = new Resend(resendApiKey)

    // Wygeneruj kod
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minut

    // Usuń stare kody dla tego emaila
    await supabase
      .from('email_verification_codes')
      .delete()
      .eq('email', email)

    // Zapisz nowy kod
    const { error: dbError } = await supabase
      .from('email_verification_codes')
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Wyślij email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'DataMind AI <onboarding@resend.dev>',
      to: email,
      subject: 'Kod weryfikacyjny - DataMind AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .code { font-size: 32px; font-weight: bold; text-align: center; background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
            .footer { background: #f5f5f5; padding: 15px; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 Kod weryfikacyjny</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <p>Witaj!</p>
              <p>Oto Twój kod weryfikacyjny do rejestracji w DataMind AI:</p>
              <div class="code">${code}</div>
              <p><strong>Kod wygasa za 15 minut.</strong></p>
              <p>Jeśli nie rejestrowałeś się w DataMind AI, zignoruj tę wiadomość.</p>
            </div>
            <div class="footer">
              <p>DataMind AI - Nauka SQL na miarę Twoich potrzeb</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (emailError) {
      console.error('Email error:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Verification email sent to:', email, 'Email ID:', emailData?.id)

    return new Response(
      JSON.stringify({ success: true, message: 'Verification code sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

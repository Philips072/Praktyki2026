// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { Resend } from 'npm:resend@2.0.0'

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

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
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const resend = new Resend(resendApiKey)

    const { data: users, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Error listing users:', listError)
      return new Response(
        JSON.stringify({ error: 'Failed to check email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userExists = users?.users?.some((u: any) => u.email?.toLowerCase() === email.toLowerCase())

    if (!userExists) {
      return new Response(
        JSON.stringify({ success: true, message: 'If email exists, code sent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await supabase
      .from('email_verification_codes')
      .delete()
      .eq('email', email)

    const { error: dbError } = await supabase
      .from('email_verification_codes')
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        verified: false,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error: emailError } = await resend.emails.send({
      from: 'DataMind AI <onboarding@lingaway.com>',
      to: email,
      subject: 'Reset hasła - DataMind AI',
      text: `Reset hasła - DataMind AI\n\nWitaj!\nOtrzymaliśmy prośbę o reset hasła do Twojego konta w DataMind AI.\n\nOto Twój kod weryfikacyjny:\n\n${code}\n\nKod wygasa za 15 minut.\nJeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.\n\nDataMind AI - Nauka SQL na miarę Twoich potrzeb`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset hasła - DataMind AI</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                      <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">🔑 Reset hasła</h2>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 40px 30px;">
                      <p style="margin: 0 0 20px; color: #333; font-size: 16px;">Witaj!</p>
                      <p style="margin: 0 0 20px; color: #333; font-size: 16px;">Otrzymaliśmy prośbę o reset hasła do Twojego konta w DataMind AI.</p>
                      <p style="margin: 0 0 20px; color: #333; font-size: 16px;">Oto Twój kod weryfikacyjny:</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="background-color: #f8f9fa; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center;">
                            <span style="font-size: 36px; font-weight: bold; color: #333; letter-spacing: 8px;">${code}</span>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 20px 0 0; color: #666; font-size: 14px;"><strong>Kod wygasa za 15 minut.</strong></p>
                      <p style="margin: 20px 0 0; color: #666; font-size: 14px;">Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0; color: #666; font-size: 12px;">DataMind AI - Nauka SQL na miarę Twoich potrzeb</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
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

    return new Response(
      JSON.stringify({ success: true, message: 'Code sent' }),
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

export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  supabase: {
    url:            process.env.SUPABASE_URL,
    anonKey:        process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  jwt:    { secret: process.env.JWT_SECRET },
  resend: { apiKey: process.env.RESEND_API_KEY, fromEmail: process.env.RESEND_FROM_EMAIL },
  at:     { apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME, senderId: process.env.AT_SENDER_ID },
});
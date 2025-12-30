// lib/liff.ts
export async function initLiff() {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID
  await liff.init({ liffId })
  
  if (!liff.isLoggedIn()) {
    liff.login()
  }
  
  const profile = await liff.getProfile()
  return profile // { userId, displayName, pictureUrl, statusMessage }
}

// Create ticket with LIFF user context
export async function createTicket(data: CreateTicketDto) {
  const profile = await liff.getProfile()
  
  const response = await fetch('/api/v1/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      lineUserId: profile.userId,
      nickname: profile.displayName
    })
  })
  
  // Close LIFF after success
  liff.closeWindow()
}
import { useRouter } from 'next/router'

export default function AutomationHub() {
  const router = useRouter()
  
  // Redirect to AWX instance
  React.useEffect(() => {
    window.location.href = 'https://awx.lvic-techlab.com'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to Automation Hub...</p>
    </div>
  )
} 
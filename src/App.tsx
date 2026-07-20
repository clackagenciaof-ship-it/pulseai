import './ui.css'
import './polish.css'
import AppPlus from './AppPlus'
import AuthPortal from './AuthPortal'
import { AdminArea, BusinessArea, DriverArea, UserArea } from './Areas'

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/entrar' || path === '/cadastro') return <AuthPortal />
  if (path === '/cadastro/negocio') return <AuthPortal forcedRole="business" />
  if (path === '/cadastro/motorista') return <AuthPortal forcedRole="driver" />
  if (path === '/app') return <UserArea />
  if (path === '/parceiro') return <BusinessArea />
  if (path === '/motorista') return <DriverArea />
  if (path === '/admin') return <AdminArea />

  return <AppPlus />
}

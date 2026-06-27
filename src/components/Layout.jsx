import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true'
  })

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('admin_sidebar_collapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-sage-50">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <main
        style={{
          marginLeft: collapsed ? '72px' : '260px',
          transition: 'margin-left 0.3s ease',
        }}
        className="flex-1 p-8 min-h-screen"
      >
        {children}
      </main>
    </div>
  )
}

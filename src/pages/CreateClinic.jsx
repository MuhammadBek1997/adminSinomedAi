import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClinicWithAdmin } from '../api/clinics'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { Building2, User, ChevronLeft, MapPin, Phone, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

function InputField({ label, icon: Icon, required, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-sage-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          {...props}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm bg-sage-50 focus:bg-white transition-all`}
        />
      </div>
    </div>
  )
}

export default function CreateClinic() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    clinic_name: '', clinic_address: '', clinic_phone: '',
    clinic_latitude: '', clinic_longitude: '',
    admin_full_name: '', admin_email: '', admin_phone: '', admin_password: '',
  })

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createClinicWithAdmin({
        ...form,
        clinic_latitude: form.clinic_latitude ? parseFloat(form.clinic_latitude) : undefined,
        clinic_longitude: form.clinic_longitude ? parseFloat(form.clinic_longitude) : undefined,
      })
      toast.success('Klinika va asosiy operator muvaffaqiyatli yaratildi!')
      navigate('/')
    } catch (err) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string') toast.error(detail)
      else if (Array.isArray(detail)) toast.error(detail[0]?.msg || "Ma'lumotlarni tekshiring")
      else toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sage-500 hover:text-sage-800 mb-6 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Orqaga
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sage-900">Yangi klinika qo'shish</h1>
          <p className="text-sage-500 mt-1 text-sm">Klinika ma'lumotlari va asosiy operatorni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-sage-100 bg-sage-50">
              <div className="w-9 h-9 bg-sage-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sage-900 text-sm">Klinika ma'lumotlari</h2>
                <p className="text-xs text-sage-500">Klinika haqida asosiy ma'lumotlar</p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField label="Klinika nomi" icon={Building2} type="text" placeholder="Masalan: Shift Medical Center"
                  value={form.clinic_name} onChange={(e) => update('clinic_name', e.target.value)} required />
              </div>
              <div className="md:col-span-2">
                <InputField label="Manzil" icon={MapPin} type="text" placeholder="To'liq manzilni kiriting"
                  value={form.clinic_address} onChange={(e) => update('clinic_address', e.target.value)} required />
              </div>
              <InputField label="Telefon raqami" icon={Phone} type="tel" placeholder="+998901234567"
                value={form.clinic_phone} onChange={(e) => update('clinic_phone', e.target.value)} />
              <div />
              <InputField label="Kenglik (Latitude)" type="number" step="any" placeholder="41.2995"
                value={form.clinic_latitude} onChange={(e) => update('clinic_latitude', e.target.value)} />
              <InputField label="Uzunlik (Longitude)" type="number" step="any" placeholder="69.2401"
                value={form.clinic_longitude} onChange={(e) => update('clinic_longitude', e.target.value)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-sage-100 bg-cream-50">
              <div className="w-9 h-9 bg-sage-700 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sage-900 text-sm">Asosiy operator ma'lumotlari</h2>
                <p className="text-xs text-sage-500">Klinikani boshqaradigan asosiy operator</p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField label="To'liq ism" icon={User} type="text" placeholder="Ism Familiya"
                  value={form.admin_full_name} onChange={(e) => update('admin_full_name', e.target.value)} required />
              </div>
              <InputField label="Email manzil" icon={Mail} type="email" placeholder="email@example.com"
                value={form.admin_email} onChange={(e) => update('admin_email', e.target.value)} required />
              <InputField label="Telefon raqami" icon={Phone} type="tel" placeholder="+998901234567"
                value={form.admin_phone} onChange={(e) => update('admin_phone', e.target.value)} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-sage-700 mb-1.5">Parol <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400 pointer-events-none" />
                  <input type={showPass ? 'text' : 'password'} placeholder="Kamida 6 ta belgi"
                    value={form.admin_password} onChange={(e) => update('admin_password', e.target.value)}
                    required minLength={6}
                    className="w-full pl-10 pr-12 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm bg-sage-50 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => navigate('/')} disabled={loading}
              className="px-6 py-3 border border-sage-200 rounded-xl text-sage-700 font-medium hover:bg-sage-50 transition-all disabled:opacity-50">
              Bekor qilish
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-3 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-sage-600/20">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Yaratilmoqda...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Klinika yaratish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

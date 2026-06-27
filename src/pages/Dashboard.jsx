import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClinics, deleteClinic, getClinicAdmins } from '../api/clinics'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'
import { Plus, Building2, MapPin, Phone, Trash2, RefreshCw, TrendingUp, Users, X, Mail } from 'lucide-react'

function AdminsModal({ isOpen, onClose, clinic }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && clinic) {
      setLoading(true)
      getClinicAdmins(clinic.id)
        .then((res) => setAdmins(Array.isArray(res.data) ? res.data : []))
        .catch(() => toast.error('Adminlarni yuklashda xatolik'))
        .finally(() => setLoading(false))
    }
  }, [isOpen, clinic])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-sage-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-sage-100">
          <div>
            <h3 className="font-semibold text-sage-900">Klinika operatorlari</h3>
            <p className="text-xs text-sage-500 mt-0.5">{clinic?.name}</p>
          </div>
          <button onClick={onClose} className="text-sage-400 hover:text-sage-600 p-1 rounded-lg hover:bg-sage-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-7 h-7 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8 text-sage-500 text-sm">Operatorlar topilmadi</div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
                  <div className="w-9 h-9 bg-sage-100 rounded-xl flex items-center justify-center font-semibold text-sage-700 text-sm flex-shrink-0">
                    {admin.full_name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sage-900 text-sm">{admin.full_name}</p>
                    <div className="flex items-center gap-1 text-xs text-sage-500 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ open: false, clinic: null })
  const [adminsModal, setAdminsModal] = useState({ open: false, clinic: null })
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const fetchClinics = async () => {
    setLoading(true)
    try {
      const res = await getClinics()
      setClinics(Array.isArray(res.data) ? res.data : [])
    } catch {
      toast.error('Klinikalarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClinics() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteClinic(deleteModal.clinic.id)
      toast.success(`"${deleteModal.clinic.name}" o'chirildi`)
      setDeleteModal({ open: false, clinic: null })
      fetchClinics()
    } catch (err) {
      toast.error(err.response?.data?.detail || "O'chirishda xatolik yuz berdi")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sage-900">Dashboard</h1>
            <p className="text-sage-500 mt-1 text-sm">Barcha klinikalar boshqaruvi</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchClinics} disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 border border-sage-200 rounded-xl text-sage-600 hover:bg-sage-50 text-sm font-medium transition-all disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Yangilash
            </button>
            <button onClick={() => navigate('/create-clinic')}
              className="flex items-center gap-2 px-4 py-2.5 bg-sage-600 text-white rounded-xl hover:bg-sage-700 text-sm font-medium transition-all shadow-lg shadow-sage-600/20">
              <Plus className="w-4 h-4" />
              Yangi klinika
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-sage-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-sage-900">{clinics.length}</div>
                <div className="text-sm text-sage-500 mt-0.5">Jami klinikalar</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-sage-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sage-700" />
              </div>
              <div>
                <div className="text-3xl font-bold text-sage-900">{clinics.length}</div>
                <div className="text-sm text-sage-500 mt-0.5">Faol klinikalar</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sage-100">
            <h2 className="font-semibold text-sage-900">Klinikalar ro'yxati</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-sage-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-sage-400" />
              </div>
              <h3 className="text-sage-900 font-medium mb-1">Klinikalar yo'q</h3>
              <p className="text-sage-500 text-sm mb-5">Hali birorta klinika qo'shilmagan</p>
              <button onClick={() => navigate('/create-clinic')}
                className="px-5 py-2.5 bg-sage-600 text-white rounded-xl hover:bg-sage-700 text-sm font-medium">
                Birinchi klinikani qo'shing
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sage-50 border-b border-sage-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Klinika nomi</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Manzil</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Telefon</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {clinics.map((clinic, i) => (
                    <tr key={clinic.id} className="hover:bg-sage-50/60 transition-colors group">
                      <td className="px-6 py-4 text-sm text-sage-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-sage-600" />
                          </div>
                          <span className="font-semibold text-sage-900 text-sm">{clinic.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-sage-600">
                          <MapPin className="w-3.5 h-3.5 text-sage-400 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{clinic.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-sage-600">
                          <Phone className="w-3.5 h-3.5 text-sage-400" />
                          {clinic.phone || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setAdminsModal({ open: true, clinic })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sage-600 hover:bg-sage-50 rounded-xl text-sm font-medium transition-all border border-sage-200">
                            <Users className="w-3.5 h-3.5" />
                            Operatorlar
                          </button>
                          <button onClick={() => setDeleteModal({ open: true, clinic })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                            O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AdminsModal isOpen={adminsModal.open} onClose={() => setAdminsModal({ open: false, clinic: null })} clinic={adminsModal.clinic} />
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => !deleting && setDeleteModal({ open: false, clinic: null })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Klinikani o'chirish"
        message={`"${deleteModal.clinic?.name}" klinikasini o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.`}
      />
    </Layout>
  )
}

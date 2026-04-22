import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { fetchMe } from '../store/slices/authSlice'
import type { RootState } from '../store'
import api from '../services/api'
import { Avatar } from '../components/ui/Avatar'
import { Spinner } from '../components/ui/Spinner'

const profileSchema = z.object({
  nom: z.string().min(2, 'Nom trop court'),
})

const passwordSchema = z.object({
  ancienMotDePasse: z.string().min(1, 'Requis'),
  nouveauMotDePasse: z.string().min(8, 'Min 8 caractères'),
  confirm: z.string(),
}).refine(d => d.nouveauMotDePasse === d.confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s: RootState) => s.auth.user)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nom: user?.nom ?? '' },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const handleProfileSubmit = async (data: ProfileForm) => {
    setSavingProfile(true)
    try {
      await api.put('/auth/profile', data)
      await dispatch(fetchMe())
      toast.success('Profil mis à jour !')
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (data: PasswordForm) => {
    setSavingPassword(true)
    try {
      await api.put('/auth/password', {
        ancienMotDePasse: data.ancienMotDePasse,
        nouveauMotDePasse: data.nouveauMotDePasse,
      })
      toast.success('Mot de passe modifié !')
      passwordForm.reset()
    } catch {
      toast.error('Ancien mot de passe incorrect')
    } finally {
      setSavingPassword(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors"

  if (!user) return null

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900">Profil</h1>
        <p className="text-sm text-gray-500 mt-1">Gérez vos informations personnelles</p>
      </div>

      {/* Avatar + infos */}
      <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl mb-6">
        <Avatar nom={user.nom} size="lg" />
        <div>
          <p className="font-medium text-gray-900">{user.nom}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span
            className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
            style={{
              background: user.role === 'ADMIN' ? '#EEEDFE' : '#E1F5EE',
              color: user.role === 'ADMIN' ? '#3C3489' : '#0F6E56',
            }}
          >
            {user.role}
          </span>
        </div>
      </div>

      {/* Formulaire profil */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          Informations générales
        </h2>
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Nom complet</label>
            <input {...profileForm.register('nom')} className={inputClass} />
            {profileForm.formState.errors.nom && (
              <p className="text-xs text-red-500 mt-1">
                {profileForm.formState.errors.nom.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Email</label>
            <input
              value={user.email}
              disabled
              className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
            />
            <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
            style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
          >
            {savingProfile ? <Spinner size="sm" /> : 'Sauvegarder'}
          </button>
        </form>
      </div>

      {/* Formulaire mot de passe */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          Changer le mot de passe
        </h2>
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
          {[
            { name: 'ancienMotDePasse', label: 'Ancien mot de passe' },
            { name: 'nouveauMotDePasse', label: 'Nouveau mot de passe' },
            { name: 'confirm', label: 'Confirmer le nouveau mot de passe' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm text-gray-600 mb-1.5">{field.label}</label>
              <input
                {...passwordForm.register(field.name as keyof PasswordForm)}
                type="password"
                placeholder="••••••••"
                className={inputClass}
              />
              {passwordForm.formState.errors[field.name as keyof PasswordForm] && (
                <p className="text-xs text-red-500 mt-1">
                  {passwordForm.formState.errors[field.name as keyof PasswordForm]?.message}
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
            style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
          >
            {savingPassword ? <Spinner size="sm" /> : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
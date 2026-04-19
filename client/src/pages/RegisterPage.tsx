import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { register as registerUser, clearError } from '../store/slices/authSlice'
import { Spinner } from '../components/ui/Spinner'

const schema = z.object({
  nom: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(8, 'Min 8 caractères'),
  confirm: z.string(),
}).refine(d => d.motDePasse === d.confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm'],
})

type FormData = z.infer<typeof schema>

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
}

export const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector(s => s.auth)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(registerUser({
      email: data.email,
      nom: data.nom,
      motDePasse: data.motDePasse,
    }))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Compte créé !')
      navigate('/')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white mb-2">Créer un compte</h1>
        <p className="text-sm" style={{ color: '#888780' }}>
          Rejoignez Digital Solutions
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { name: 'nom', label: 'Nom complet', type: 'text', placeholder: 'Alice Martin' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'vous@exemple.com' },
          { name: 'motDePasse', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
          { name: 'confirm', label: 'Confirmer', type: 'password', placeholder: '••••••••' },
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
            <input
              {...register(field.name as keyof FormData)}
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle}
            />
            {errors[field.name as keyof FormData] && (
              <p className="text-xs text-red-400 mt-1">
                {errors[field.name as keyof FormData]?.message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity disabled:opacity-60"
          style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
        >
          {loading ? <Spinner size="sm" /> : 'Créer mon compte'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: '#888780' }}>
        Déjà un compte ?{' '}
        <Link to="/login" className="text-[#5DCAA5] hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { login, clearError } from '../store/slices/authSlice'
import { Spinner } from '../components/ui/Spinner'

const schema = z.object({
  email: z.string().email('Email invalide'),
  motDePasse: z.string().min(1, 'Mot de passe requis'),
})

type FormData = z.infer<typeof schema>

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector(s => s.auth)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      toast.success('Bienvenue !')
      navigate('/')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-white mb-2">Connexion</h1>
        <p className="text-sm" style={{ color: '#888780' }}>
          Accédez à votre centre de contrôle
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="vous@exemple.com"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            }}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Mot de passe</label>
          <input
            {...register('motDePasse')}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
            }}
          />
          {errors.motDePasse && (
            <p className="text-xs text-red-400 mt-1">{errors.motDePasse.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity disabled:opacity-60"
          style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
        >
          {loading ? <Spinner size="sm" /> : 'Se connecter'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: '#888780' }}>
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-[#5DCAA5] hover:underline">
          S'inscrire
        </Link>
      </p>
    </div>
  )
}
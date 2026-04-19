import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Spinner } from '../ui/Spinner'

const schema = z.object({
  titre: z.string().min(2, 'Titre requis (min 2 caractères)'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ProjectFormProps {
  onSubmit: (data: FormData) => void
  loading: boolean
  defaultValues?: FormData
  submitLabel?: string
}

export const ProjectForm = ({
  onSubmit,
  loading,
  defaultValues,
  submitLabel = 'Créer',
}: ProjectFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1.5">
          Nom de l'orbite
        </label>
        <input
          {...register('titre')}
          placeholder="Ex: Refonte site corporate"
          className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors"
        />
        {errors.titre && (
          <p className="text-xs text-red-500 mt-1">{errors.titre.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1.5">
          Description
          <span className="text-gray-400 ml-1">(optionnel)</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Décrivez l'objectif de ce projet..."
          className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
        style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
      >
        {loading ? <Spinner size="sm" /> : submitLabel}
      </button>
    </form>
  )
}
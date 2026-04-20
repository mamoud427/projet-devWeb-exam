import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import type { Task, User } from '../../types'
import { Spinner } from '../ui/Spinner'
import { useState } from 'react'

const schema = z.object({
  titre: z.string().min(2, 'Titre requis'),
  description: z.string().optional(),
  assigneId: z.string().optional(),
  echeance: z.string().optional(),
  statut: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
})

type FormData = z.infer<typeof schema>

interface TaskFormModalProps {
  onSubmit: (data: Partial<Task>) => Promise<void>
  onClose: () => void
  membres: Pick<User, 'id' | 'nom' | 'avatar'>[]
  defaultValues?: Task
  title?: string
  submitLabel?: string
}

export const TaskFormModal = ({
  onSubmit,
  onClose,
  membres,
  defaultValues,
  title = 'Nouvelle mission',
  submitLabel = 'Créer',
}: TaskFormModalProps) => {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? {
      titre: defaultValues.titre,
      description: defaultValues.description ?? '',
      assigneId: defaultValues.assigneId ?? '',
      echeance: defaultValues.echeance
        ? new Date(defaultValues.echeance).toISOString().split('T')[0]
        : '',
      statut: defaultValues.statut,
    } : { statut: 'TODO' },
  })

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true)
    await onSubmit({
      ...data,
      assigneId: data.assigneId || undefined,
      echeance: data.echeance || undefined,
    })
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 outline-none focus:border-[#5DCAA5] transition-colors"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Titre</label>
            <input {...register('titre')} placeholder="Nom de la mission" className={inputClass} />
            {errors.titre && <p className="text-xs text-red-500 mt-1">{errors.titre.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Détails de la mission..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Assigné à</label>
              <select {...register('assigneId')} className={inputClass}>
                <option value="">Non assigné</option>
                {membres.map(m => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Statut</label>
              <select {...register('statut')} className={inputClass}>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5">Échéance</label>
            <input {...register('echeance')} type="date" className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60"
              style={{ background: 'var(--orbit-teal)', color: '#04342C' }}
            >
              {loading ? <Spinner size="sm" /> : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
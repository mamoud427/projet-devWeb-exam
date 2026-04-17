import { PrismaClient, Role, TaskStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  await prisma.comment.deleteMany()
  await prisma.fichier.deleteMany()
  await prisma.task.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()

  const hashed = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@orbit.com',
      nom: 'Admin Orbit',
      motDePasse: hashed,
      role: Role.ADMIN,
    },
  })

  const alice = await prisma.user.create({
    data: {
      email: 'alice@orbit.com',
      nom: 'Alice Martin',
      motDePasse: hashed,
      role: Role.MEMBER,
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@orbit.com',
      nom: 'Bob Dupont',
      motDePasse: hashed,
      role: Role.MEMBER,
    },
  })

  const projet1 = await prisma.project.create({
    data: {
      titre: 'Site Corporate',
      description: 'Refonte complète du site vitrine',
      createurId: admin.id,
      membres: {
        create: [
          { userId: admin.id },
          { userId: alice.id },
          { userId: bob.id },
        ],
      },
    },
  })

  const projet2 = await prisma.project.create({
    data: {
      titre: 'App Mobile RH',
      description: 'Gestion des congés et absences',
      createurId: alice.id,
      membres: {
        create: [
          { userId: alice.id },
          { userId: bob.id },
        ],
      },
    },
  })

  await prisma.task.createMany({
    data: [
      {
        titre: 'Maquettes UI/UX',
        description: 'Créer les wireframes Figma',
        statut: TaskStatus.DONE,
        projetId: projet1.id,
        assigneId: alice.id,
        echeance: new Date('2025-02-15'),
      },
      {
        titre: 'Développement Frontend',
        description: 'Intégration React',
        statut: TaskStatus.IN_PROGRESS,
        projetId: projet1.id,
        assigneId: bob.id,
        echeance: new Date('2025-03-30'),
      },
      {
        titre: 'Tests QA',
        description: 'Tests fonctionnels',
        statut: TaskStatus.TODO,
        projetId: projet1.id,
        assigneId: alice.id,
      },
      {
        titre: 'Analyse des besoins',
        description: 'Réunions avec RH',
        statut: TaskStatus.DONE,
        projetId: projet2.id,
        assigneId: alice.id,
      },
      {
        titre: 'API Backend congés',
        description: 'Endpoints REST',
        statut: TaskStatus.IN_PROGRESS,
        projetId: projet2.id,
        assigneId: bob.id,
      },
    ],
  })

  console.log('✅ Seed terminé !')
  console.log('👤 admin@orbit.com / password123 (ADMIN)')
  console.log('👤 alice@orbit.com / password123 (MEMBER)')
  console.log('👤 bob@orbit.com   / password123 (MEMBER)')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
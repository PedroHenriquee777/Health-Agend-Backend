import { prisma } from "../lib/prisma";

export const PatientRepository = {
  // cria paciente no banco
  create(data: {
    name: string;
    cpf: string;
    phone: string;
    email?: string | null;
  }) {
    return prisma.patient.create({ data });
  },
  // busca paciente pelo CPF (usado para evitar duplicidade, preciso fazer uma validação para isso e para a entrada)
  findByCpf(cpf: string) {
    return prisma.patient.findUnique({ where: { cpf } });
  },

  // lista todos ordenados pelos mais recentes
  findAll() {
    return prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
  },

  // busca paciente por ID
  findById(id: string) {
    return prisma.patient.findUnique({ where: { id } });
  },

  // busca paciente + consultas (relacionamento)
  findByIdWithAppointments(id: string) {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { date: "desc" },

          // inclui dados do médico em cada consulta
          include: { doctor: true },
        },
      },
    });
  },

  // atualiza campos do paciente
  update(
    id: string,
    data: { name?: string; phone?: string; email?: string | null },
  ) {
    return prisma.patient.update({ where: { id }, data });
  },

  // deleta um paciente
  delete(id: string) {
    return prisma.patient.delete({ where: { id } });
  },
};

import { prisma } from "../lib/prisma";

export const DoctorRepository = {
  create(data: {
    name: string;
    cpf: string;
    phone: string;
    email?: string | null;
    speciality: string;
  }) {
    return prisma.doctor.create({ data });
  },
  findAll(speciality?: string) {
    return prisma.doctor.findMany({
      where: speciality
        ? { speciality: { equals: speciality, mode: "insensitive" } }
        : undefined,
      orderBy: { name: "asc" },
    });
  },
  findById(id: string) {
    return prisma.doctor.findUnique({ where: { id } });
  },
  findByIdWithAgenda(id: string) {
    const now = new Date();
    return prisma.doctor.findUnique({
      where: { id },
      include: {
        schedules: {
          where: { date: { gt: now } },
          orderBy: { date: "asc" },
        },
        appointments: {
          orderBy: { date: "desc" },
          include: { patient: true },
        },
      },
    });
  },
  update(
    id: string,
    data: {
      name?: string;
      cpf?: string;
      phone?: string;
      email?: string | null;
      speciality?: string;
    },
  ) {
    return prisma.doctor.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.doctor.delete({ where: { id } });
  },
};

import { prisma } from "../lib/prisma";
import type { AppointmentStatus } from "../../generated/prisma/client";

export const AppointmentRepository = {
  create(data: { patientId: string; doctorId: string; date: Date }) {
    return prisma.appointment.create({ data });
  },

  findAll(status?: AppointmentStatus) {
    return prisma.appointment.findMany({
      where: status ? { status } : undefined,
      orderBy: { date: "desc" },
      include: { patient: true, doctor: true },
    });
  },

  findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });
  },

  findConflict(doctorId: string, date: Date) {
    return prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
  },

  updateStatus(id: string, status: AppointmentStatus) {
    return prisma.appointment.update({ where: { id }, data: { status } });
  },

  delete(id: string) {
    return prisma.appointment.delete({ where: { id } });
  },
};

import { prisma } from "../lib/prisma";

export const ScheduleRepository = {
  create(data: { doctorId: string; date: Date }) {
    return prisma.schedule.create({ data });
  },
  findAll() {
    return prisma.schedule.findMany({
      orderBy: { date: "asc" },
      include: { doctor: true },
    });
  },
  findByDoctorFuture(doctorId: string) {
    const now = new Date();
    return prisma.schedule.findMany({
      where: { doctorId, date: { gt: now } },
      orderBy: { date: "asc" },
    });
  },
  findByDoctorAndDate(doctorId: string, date: Date) {
    return prisma.schedule.findUnique({
      where: { doctorId_date: { doctorId, date } },
    });
  },
  delete(id: string) {
    return prisma.schedule.delete({ where: { id } });
  },
  deleteByDoctorAndDate(doctorId: string, date: Date) {
    return prisma.schedule.delete({
      where: { doctorId_date: { doctorId, date } },
    });
  },
};

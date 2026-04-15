import type { AppointmentStatus, Prisma } from "../../generated/prisma/client";
import { BadRequestError, ConflictError, NotFoundError } from "../http/errors";
import { prisma } from "../lib/prisma";
import { DoctorRepository } from "../repositories/doctor-repository";
import { PatientRepository } from "../repositories/patient-repository";
import { AppointmentRepository } from "../repositories/appointment-repository";
import { ScheduleRepository } from "../repositories/schedule-repository";

type CreateAppointmentInput = {
  patientId: string;
  doctorId: string;
  date: string; // ISO
};

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError(`Campo '${field}' é obrigatório.`);
  }
}

function parseDateOrThrow(value: string, field: string) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime()))
    throw new BadRequestError(`Campo '${field}' deve ser uma data ISO válida.`);
  return dt;
}

function parseStatusOrThrow(value: unknown): AppointmentStatus {
  if (typeof value !== "string") throw new BadRequestError("Status inválido.");
  const s = value.toUpperCase().trim();
  const allowed: AppointmentStatus[] = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ];
  if (!allowed.includes(s as AppointmentStatus))
    throw new BadRequestError("Status inválido.");
  return s as AppointmentStatus;
}

export const AppointmentService = {
  async create(data: CreateAppointmentInput) {
    requireString(data?.patientId, "patientId");
    requireString(data?.doctorId, "doctorId");
    requireString(data?.date, "date");

    const date = parseDateOrThrow(data.date, "date");
    const now = new Date();
    if (date <= now)
      throw new BadRequestError(
        "Não é possível agendar no passado.",
        "APPOINTMENT_IN_PAST",
      );

    const [patient, doctor] = await Promise.all([
      PatientRepository.findById(data.patientId),
      DoctorRepository.findById(data.doctorId),
    ]);
    if (!patient)
      throw new NotFoundError("Paciente não encontrado.", "PATIENT_NOT_FOUND");
    if (!doctor)
      throw new NotFoundError("Médico não encontrado.", "DOCTOR_NOT_FOUND");

    // Agendamento consistente: precisa existir horário disponível e não pode conflitar com consulta ativa
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const schedule = await tx.schedule.findUnique({
        where: { doctorId_date: { doctorId: data.doctorId, date } },
      });
      if (!schedule) {
        throw new NotFoundError(
          "Horário não disponível para este médico.",
          "SCHEDULE_NOT_FOUND",
        );
      }

      const conflict = await tx.appointment.findFirst({
        where: {
          doctorId: data.doctorId,
          date,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      });
      if (conflict) {
        throw new ConflictError(
          "Conflito de horário com outra consulta.",
          "APPOINTMENT_TIME_CONFLICT",
        );
      }

      const appointment = await tx.appointment.create({
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          date,
          // status default = PENDING (regra)
        },
      });

      // Consome o slot de disponibilidade
      await tx.schedule.delete({
        where: { doctorId_date: { doctorId: data.doctorId, date } },
      });

      return appointment;
    });
  },

  async findAll(status?: string) {
    const st =
      typeof status === "string" && status.trim() !== ""
        ? parseStatusOrThrow(status)
        : undefined;
    return AppointmentRepository.findAll(st);
  },

  async findById(id: string) {
    requireString(id, "id");
    const appt = await AppointmentRepository.findById(id);
    if (!appt)
      throw new NotFoundError(
        "Consulta não encontrada.",
        "APPOINTMENT_NOT_FOUND",
      );
    return appt;
  },

  async updateStatus(id: string, status: unknown) {
    requireString(id, "id");
    const st = parseStatusOrThrow(status);

    const exists = await AppointmentRepository.findById(id);
    if (!exists)
      throw new NotFoundError(
        "Consulta não encontrada.",
        "APPOINTMENT_NOT_FOUND",
      );

    return AppointmentRepository.updateStatus(id, st);
  },

  async delete(id: string) {
    requireString(id, "id");
    const exists = await AppointmentRepository.findById(id);
    if (!exists)
      throw new NotFoundError(
        "Consulta não encontrada.",
        "APPOINTMENT_NOT_FOUND",
      );

    // cancel/remover: aqui optamos por remover de vez (rota DELETE).
    // Se você quiser "cancelar" mantendo histórico, trocamos por updateStatus(CANCELLED).
    return AppointmentRepository.delete(id);
  },
};

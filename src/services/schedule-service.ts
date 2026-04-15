import { BadRequestError, ConflictError, NotFoundError } from "../http/errors";
import { DoctorRepository } from "../repositories/doctor-repository";
import { ScheduleRepository } from "../repositories/schedule-repository";

type CreateScheduleInput = {
  doctorId: string;
  date: string;
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

export const ScheduleService = {
  async create(data: CreateScheduleInput) {
    requireString(data?.doctorId, "doctorId");
    requireString(data?.date, "date");

    const date = parseDateOrThrow(data.date, "date");
    const now = new Date();
    if (date <= now)
      throw new BadRequestError(
        "Não é possível criar horários no passado.",
        "SCHEDULE_IN_PAST",
      );

    const doctor = await DoctorRepository.findById(data.doctorId);
    if (!doctor)
      throw new NotFoundError("Médico não encontrado.", "DOCTOR_NOT_FOUND");

    const exists = await ScheduleRepository.findByDoctorAndDate(
      data.doctorId,
      date,
    );
    if (exists)
      throw new ConflictError(
        "Horário já existe para este médico.",
        "SCHEDULE_ALREADY_EXISTS",
      );

    return ScheduleRepository.create({ doctorId: data.doctorId, date });
  },

  async findAll() {
    return ScheduleRepository.findAll();
  },

  async findByDoctor(doctorId: string) {
    requireString(doctorId, "doctorId");
    const doctor = await DoctorRepository.findById(doctorId);
    if (!doctor)
      throw new NotFoundError("Médico não encontrado.", "DOCTOR_NOT_FOUND");

    return ScheduleRepository.findByDoctorFuture(doctorId);
  },

  async delete(id: string) {
    requireString(id, "id");
    try {
      return await ScheduleRepository.delete(id);
    } catch {
      throw new NotFoundError("Horário não encontrado.", "SCHEDULE_NOT_FOUND");
    }
  },
};

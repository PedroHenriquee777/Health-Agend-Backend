import { BadRequestError, NotFoundError } from "../http/errors";
import { DoctorRepository } from "../repositories/doctor-repository";
import type { CreateDoctorInput } from "../types/create-doctor-input";
import type { UpdateDoctorInput } from "../types/update-doctor-input";

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError(`Campo '${field}' é obrigatório.`);
  }
}

export const DoctorService = {
  async create(data: CreateDoctorInput) {
    requireString(data?.name, "name");
    requireString(data?.cpf, "cpf");
    requireString(data?.phone, "phone");
    requireString(data?.speciality, "speciality");

    return DoctorRepository.create({
      name: data.name.trim(),
      cpf: data.cpf.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      speciality: data.speciality.trim(),
    });
  },

  async findAll(speciality?: string) {
    const filter =
      typeof speciality === "string" && speciality.trim() !== ""
        ? speciality.trim()
        : undefined;
    return DoctorRepository.findAll(filter);
  },

  async findById(id: string) {
    requireString(id, "id");
    const doctor = await DoctorRepository.findByIdWithAgenda(id);
    if (!doctor)
      throw new NotFoundError("Médico não encontrado.", "DOCTOR_NOT_FOUND");
    return doctor;
  },

  async update(id: string, data: UpdateDoctorInput) {
    requireString(id, "id");
    const exists = await DoctorRepository.findById(id);
    if (!exists)
      throw new NotFoundError("Médico não encontrado.", "DOCTOR_NOT_FOUND");

    return DoctorRepository.update(id, {
      name: data?.name?.trim(),
      cpf: data?.cpf?.trim(),
      phone: data?.phone?.trim(),
      email: data?.email === undefined ? undefined : data.email?.trim() || null,
      speciality: data?.speciality?.trim(),
    });
  },

  async delete(id: string) {
    requireString(id, "id");
    const exists = await DoctorRepository.findById(id);
    if (!exists)
      throw new NotFoundError("Médico não encontrado.", "DOCTOR_NOT_FOUND");
    return DoctorRepository.delete(id);
  },
};

import { BadRequestError, ConflictError, NotFoundError } from "../http/errors";
import { PatientRepository } from "../repositories/patient-repository";
import type { CreatePatientInput } from "../types/create-patient-input";
import type { UpdatePatientInput } from "../types/update-patient-input";

// validação genérica de string obrigatória (vou fortalecer essa validação e retirar daqui, zod talvez?)
function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError(`Campo '${field}' é obrigatório.`);
  }
}

export const PatientService = {
  async create(data: CreatePatientInput) {
    requireString(data?.name, "name");
    requireString(data?.cpf, "cpf");
    requireString(data?.phone, "phone");

    const cpf = data.cpf.trim();

    // regra de negócio: CPF não pode duplicar
    const cpfExists = await PatientRepository.findByCpf(cpf);
    if (cpfExists)
      throw new ConflictError("CPF já cadastrado.", "CPF_ALREADY_EXISTS");

    // formatação dos dados antes de enviar e salvar
    return PatientRepository.create({
      name: data.name.trim(),
      cpf,
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
    });
  },

  async findAll() {
    return PatientRepository.findAll();
  },

  async findById(id: string) {
    requireString(id, "id");

    // busca com relacionamento (consultas + médico)
    const patient = await PatientRepository.findByIdWithAppointments(id);

    // o paciente precisa existir para poder buscar o relacionamento
    if (!patient)
      throw new NotFoundError("Paciente não encontrado.", "PATIENT_NOT_FOUND");
    return patient;
  },

  async update(id: string, data: UpdatePatientInput) {
    requireString(id, "id");

    // verifica a existência de um paciente antes de atualizar
    const patientExists = await PatientRepository.findById(id);
    if (!patientExists)
      throw new NotFoundError("Paciente não encontrado.", "PATIENT_NOT_FOUND");

    return PatientRepository.update(id, {
      // atualiza apenas campos enviados
      name: data?.name?.trim(),
      phone: data?.phone?.trim(),
      email: data?.email === undefined ? undefined : data.email,
    });
  },

  async delete(id: string) {
    requireString(id, "id");

    //faz essa busca primeiro antes de deletar por segurança, pra não correr riscos inesperados
    const patientExists = await PatientRepository.findById(id);
    if (!patientExists)
      throw new NotFoundError("Paciente não encontrado.", "PATIENT_NOT_FOUND");
    return PatientRepository.delete(id);
  },
};

import type { FastifyReply, FastifyRequest } from "fastify";
import { PatientService } from "../services/patient-service";

export const PatientController = {
  // cria um novo paciente (ainda preciso tipar os dados do body, tenho um type no service que posso tornar uma intercace reutilizável)
  async create(req: FastifyRequest, reply: FastifyReply) {
    // envia os dados do body para a camada de service
    const patient = await PatientService.create(req.body as any);
    return reply.status(201).send(patient);
  },

  // lista todos os pacientes
  async findAll(_req: FastifyRequest, reply: FastifyReply) {
    const patients = await PatientService.findAll();
    return reply.send(patients);
  },

  // busca paciente por ID
  async findById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const patient = await PatientService.findById(req.params.id);
    return reply.send(patient);
  },

  // atualiza dados cadastrais do paciente
  async update(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const patient = await PatientService.update(req.params.id, req.body as any);
    return reply.send(patient);
  },

  // deleta paciente
  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const patient = await PatientService.delete(req.params.id);
    return reply.send(patient);
  },
};

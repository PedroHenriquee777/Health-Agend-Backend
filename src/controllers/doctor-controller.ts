import type { FastifyReply, FastifyRequest } from "fastify";
import { DoctorService } from "../services/doctor-service";

export const DoctorController = {
  async create(req: FastifyRequest, reply: FastifyReply) {
    const doctor = await DoctorService.create(req.body as any);
    return reply.status(201).send(doctor);
  },
  async findAll(req: FastifyRequest, reply: FastifyReply) {
    const { speciality } = (req.query as any) ?? {};
    const doctors = await DoctorService.findAll(speciality);
    return reply.send(doctors);
  },
  async findById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const doctor = await DoctorService.findById(req.params.id);
    return reply.send(doctor);
  },
  async update(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const doctor = await DoctorService.update(req.params.id, req.body as any);
    return reply.send(doctor);
  },
  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const doctor = await DoctorService.delete(req.params.id);
    return reply.send(doctor);
  },
};

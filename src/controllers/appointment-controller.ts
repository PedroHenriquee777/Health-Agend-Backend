import type { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentService } from "../services/appointment-service";

export const AppointmentController = {
  async create(req: FastifyRequest, reply: FastifyReply) {
    const appointment = await AppointmentService.create(req.body as any);
    return reply.status(201).send(appointment);
  },
  async findAll(req: FastifyRequest, reply: FastifyReply) {
    const { status } = (req.query as any) ?? {};
    const appointments = await AppointmentService.findAll(status);
    return reply.send(appointments);
  },
  async findById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const appointment = await AppointmentService.findById(req.params.id);
    return reply.send(appointment);
  },
  async updateStatus(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const appointment = await AppointmentService.updateStatus(
      req.params.id,
      (req.body as any)?.status,
    );
    return reply.send(appointment);
  },
  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const appointment = await AppointmentService.delete(req.params.id);
    return reply.send(appointment);
  },
};

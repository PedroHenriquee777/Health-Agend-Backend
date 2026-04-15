import type { FastifyReply, FastifyRequest } from "fastify";
import { ScheduleService } from "../services/schedule-service";

export const ScheduleController = {
  async create(req: FastifyRequest, reply: FastifyReply) {
    const schedule = await ScheduleService.create(req.body as any);
    return reply.status(201).send(schedule);
  },
  async findAll(_req: FastifyRequest, reply: FastifyReply) {
    const schedules = await ScheduleService.findAll();
    return reply.send(schedules);
  },
  async findByDoctor(
    req: FastifyRequest<{ Params: { doctorId: string } }>,
    reply: FastifyReply,
  ) {
    const schedules = await ScheduleService.findByDoctor(req.params.doctorId);
    return reply.send(schedules);
  },
  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const schedule = await ScheduleService.delete(req.params.id);
    return reply.send(schedule);
  },
};

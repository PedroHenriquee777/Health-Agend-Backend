export async function scheduleRoutes(app: any) {
  const { ScheduleController } =
    await import("../controllers/schedule-controller");

  // cada rota chama seu controller correspondente

  app.post("/api/schedules", async (req: any, reply: any) => {
    return ScheduleController.create(req, reply);
  });
  app.get("/api/schedules", async (req: any, reply: any) => {
    return ScheduleController.findAll(req, reply);
  });
  app.get("/api/schedules/doctor/:doctorId", async (req: any, reply: any) => {
    return ScheduleController.findByDoctor(req, reply);
  });
  app.delete("/api/schedules/:id", async (req: any, reply: any) => {
    return ScheduleController.delete(req, reply);
  });
}

export async function appointmentRoutes(app: any) {
  const { AppointmentController } =
    await import("../controllers/appointment-controller");

  // cada rota chama seu controller correspondente

  app.post("/api/appointments", async (req: any, reply: any) => {
    return AppointmentController.create(req, reply);
  });
  app.get("/api/appointments", async (req: any, reply: any) => {
    return AppointmentController.findAll(req, reply);
  });
  app.get("/api/appointments/:id", async (req: any, reply: any) => {
    return AppointmentController.findById(req, reply);
  });
  app.patch("/api/appointments/:id/status", async (req: any, reply: any) => {
    return AppointmentController.updateStatus(req, reply);
  });
  app.delete("/api/appointments/:id", async (req: any, reply: any) => {
    return AppointmentController.delete(req, reply);
  });
}

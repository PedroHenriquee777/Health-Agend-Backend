export async function doctorRoutes(app: any) {
  const { DoctorController } = await import("../controllers/doctor-controller");

  // cada rota chama seu controller correspondente

  app.post("/api/doctors", async (req: any, reply: any) => {
    return DoctorController.create(req, reply);
  });
  app.get("/api/doctors", async (req: any, reply: any) => {
    return DoctorController.findAll(req, reply);
  });
  app.get("/api/doctors/:id", async (req: any, reply: any) => {
    return DoctorController.findById(req, reply);
  });
  app.put("/api/doctors/:id", async (req: any, reply: any) => {
    return DoctorController.update(req, reply);
  });
  app.delete("/api/doctors/:id", async (req: any, reply: any) => {
    return DoctorController.delete(req, reply);
  });
}

export async function patientRoutes(app: any) {
  const { PatientController } =
    await import("../controllers/patient-controller");

  // cada rota chama seu controller correspondente
  app.post("/api/patients", async (req: any, reply: any) => {
    return PatientController.create(req as any, reply as any);
  });

  app.get("/api/patients", async (req: any, reply: any) => {
    return PatientController.findAll(req as any, reply as any);
  });

  app.get("/api/patients/:id", async (req: any, reply: any) => {
    return PatientController.findById(req as any, reply as any);
  });

  app.put("/api/patients/:id", async (req: any, reply: any) => {
    return PatientController.update(req as any, reply as any);
  });

  app.delete("/api/patients/:id", async (req: any, reply: any) => {
    return PatientController.delete(req as any, reply as any);
  });
}

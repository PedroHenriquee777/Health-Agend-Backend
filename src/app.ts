import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { patientRoutes } from "./routes/patitents";
import { doctorRoutes } from "./routes/doctors";
import { scheduleRoutes } from "./routes/schedules";
import { appointmentRoutes } from "./routes/appointments";
import { registerErrorHandler } from "./http/error-handler";

export async function buildApp() {
    const app = fastify({
        logger: true
    })

    await app.register(fastifyCors)
    await registerErrorHandler(app)

    await app.register(patientRoutes)
    await app.register(doctorRoutes)
    await app.register(scheduleRoutes)
    await app.register(appointmentRoutes)

    return app
}
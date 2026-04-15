import type { CreatePatientInput } from "./create-patient-input";

// tipagem de dados que precisam entrar pra atualizar dados de um paciente
export type UpdatePatientInput = Partial<CreatePatientInput>;

// tipagem de dados que precisam entrar pra atualizar dados de um paciente
export type UpdatePatientInput = {
    name?: string;
    phone?: string;
    email?: string | null;
  };
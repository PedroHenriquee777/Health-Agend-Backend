// tipagem de dados que precisam entrar pra criar um paciente
export type CreatePatientInput = {
    name: string;
    cpf: string;
    phone: string;
    email?: string;
  };
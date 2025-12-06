import { CreateUserInput } from "../users/user.types";

export interface RegisterInput
  extends Omit<CreateUserInput, "passwordHash"> {
  password: string;
}

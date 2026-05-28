import { CredentialsSignin } from "next-auth";

export class AuthorizationError extends CredentialsSignin {
  code = "Unauthorized";
}

export class InvalidUserError extends CredentialsSignin {
  code = "User Not Found";
}

export class InvalidCredentialsError extends CredentialsSignin {
  code = "Invalid Credentials";
}

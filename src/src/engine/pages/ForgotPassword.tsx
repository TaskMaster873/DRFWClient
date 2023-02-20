import { Container } from "react-bootstrap";
import { ComponentForgotPassword } from "../components/ComponentForgotPassword";

/**
 * La page pour envoyer le courriel de réinitialisation de mot de passe
 */
export function ForgotPassword() {
  document.title = "Mot de passe oublié - TaskMaster";
  /**
   *
   * @returns Le composant pour envoyer le courriel de réinitialisation de mot de passe
   */
  return (
    <Container>
      <ComponentForgotPassword />
    </Container>
  );
}

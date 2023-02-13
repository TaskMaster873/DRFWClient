import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Navigate, useSearchParams } from "react-router-dom";
import { API } from "../api/APIManager";
import { ComponentLoading } from "../components/ComponentLoading";
import { ComponentResetPassword } from "../components/ComponentResetPassword";
import { NotificationManager } from "react-notifications";


/**
 * La page pour réinitialiser le mot de passe
 */
export function ResetPassword() {
  document.title = "Réinitialisation de mot de passe - TaskMaster";
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");

  if (mode === null || actionCode === null) {
    //La page est accédée illégalement
    return <Navigate to="/forgot-password"></Navigate>;
  }

  //C'est comme "componentDidMount" d'un class component
  useEffect(() => {
    verifyActionCode();
  }, []);

  const verifyActionCode = async () => {
    setEmail(await API.verifyResetPassword(actionCode));
  };

  switch(email){
    case "":
      //Chargement pendant que verifyActionCode valide avec le serveur que le code est bon.
      return <ComponentLoading />;
    case "None":
      //Le actionCode est invalide
      NotificationManager.error(
        "Erreur",
        "L'hyperlien de réinitialisation de mot de passe est invalide ou expiré. Essayez à nouveau."
      );
      return <Navigate to="/forgot-password"/>;
    default:
      //Toutes les données sont correctes, l'utilisateur peut réinitialiser son mot de passe
      return (<Container>
        <ComponentResetPassword actionCode={actionCode} email={email} />
      </Container>);
  }
}

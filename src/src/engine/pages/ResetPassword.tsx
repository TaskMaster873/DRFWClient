import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {API} from "../api/APIManager";
import {ComponentLoading} from "../components/ComponentLoading";
import {ComponentResetPassword} from "../components/ComponentResetPassword";
import {errors} from "../messages/FormMessages";
import {RoutesPath} from "../RoutesPath";
import {NotificationManager} from "../api/NotificationManager";

enum ResetPasswordState {
    WAITING = 0,
    ERROR = 1,
    OK = 2,
}

/**
 * La page pour réinitialiser le mot de passe
 */
export function ResetPassword() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");

    const [emailState, setEmailState] = useState(ResetPasswordState.WAITING);

    const mode = searchParams.get("mode");
    const actionCode = searchParams.get("oobCode");

    if (mode === null || actionCode === null) {
        navigate(RoutesPath.FORGOT_PASSWORD);
        return <></>;
    }

    // C'est comme "componentDidMount" d'un class component
    useEffect(() => {
        document.title = "Réinitialisation de mot de passe - TaskMaster";

        verifyActionCode();
    }, []);

    const verifyActionCode = async () => {
        let email = await API.verifyResetPassword(actionCode);
        if (!email) {
            NotificationManager.error(errors.INVALID_ACTION_CODE, errors.ERROR_GENERIC_MESSAGE);
            navigate(RoutesPath.FORGOT_PASSWORD);
        } else {
            setEmail(email);
            setEmailState(email ? ResetPasswordState.OK : ResetPasswordState.ERROR);
        }
    };

    if (emailState === ResetPasswordState.WAITING) {
        // Chargement pendant que verifyActionCode valide avec le serveur que le code est bon.
        return <ComponentLoading/>;
    } else if (emailState === ResetPasswordState.OK) {
        // Toutes les données sont correctes, l'utilisateur peut réinitialiser son mot de passe
        return <ComponentResetPassword actionCode={actionCode} email={email}/>;
    } else {
        return <></>;
    }
}

import React from "react";
import { PasswordStrengthType } from "../types/PasswordStrengthTypes";
import * as Regex from "../utils/RegexValidator";

/**
 * Ceci est le composant pour montrer la force d'un mot de passe
 */
export class PasswordStrength extends React.Component<
  PasswordStrengthType,
  PasswordStrengthType,
  any
> {

  public state: PasswordStrengthType = {
    backgroundColor: "",
  };

  constructor(props: PasswordStrengthType) {
    super(props);
    this.analyze = this.analyze.bind(this);
  }
  private elementExist(param: any): boolean {
    return param !== null && param;
  }

  /**
   * 
   * La méthode change la couleur du contour de la zone de texte selon la sécurité du mot de passe entré
   *TODO il faut l'intégrer dans le changement de mot de passe pour dire si le mot de passe est assez sécurisé
   * 
   * @param event  
   * 
   */
  analyze(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.elementExist(event?.target?.value)) {
      if (Regex.strongRegex.test(event.target.value)) {
        this.setState({ backgroundColor: "#0F9D58" });
      } /*else if (Regex.mediumRegex.test(event.target.value)) {
        this.setState({ backgroundColor: "#F4B400" });
      }*/ else {
        this.setState({ backgroundColor: "#DB4437" });
      }
    } else {
      this.setState({ backgroundColor: "#DB4437" });
    }
  }

  render() {
    console.log(this.state);
    return (
      <div style={{ backgroundColor: this.state.backgroundColor }}>
        <p>
          <label htmlFor="password">Password: </label>
        </p>
        <p>
          <input type="text" name="password" onChange={this.analyze} />
        </p>
      </div>
    );
  }
}

import React from 'react';

class ErrorCodes {
  getErrorMessage = code => {
    let message = 'Error';
    switch (code) {
      case 10:
        message = 'Email ili lozinka nisu uneseni';
        break;
      case 11:
        message = 'Token nije poslan';
        break;
      case 12:
        message = 'Pozivnica nije poslana';
        break;
      case 13:
        message = 'Krivi token ili tvrtka';
        break;
      case 14:
        message = 'e-mail pozivnice nije poslan';
        break;
      case 15:
        message = 'Vozilo nije uneseno';
        break;
      case 16:
        message = 'Nadnevak nije poslan';
        break;
      case 17:
        message = 'Kilometri nisu poslani';
        break;
      case 20:
        message = 'Kriva lozinka';
        break;
      case 21:
        message = 'Token nije valjan';
        break;
      case 22:
        message = 'Broj pozivnice nije valjan';
        break;
      case 50:
        message = 'Korisnik nije registriran';
        break;
      case 53:
        message = 'Nedozvoljen pristup';
        break;
      case 52:
        message = 'Tvrtka s tim imenom već postoji';
        break;
      case 500:
        message = 'Dogodila se greška na serveru, pokušajte kasnije';
        break;
      case 200:
        message = 'Uspiješno provedeno';
        break;
      default:
        message = 'Dogodila se pogreška';
        break;
    }
    return message;
  };
}

export default ErrorCodes;

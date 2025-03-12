php
if ($_SERVER[REQUEST_METHOD] === POST) {
    $name = trim($_POST[name]);
    $email = trim($_POST[email]);
    $message = trim($_POST[message]);

    if (empty($name)  empty($email)  empty($message)) {
        echo json_encode([success = false, message = Bitte fülle alle Felder aus.]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([success = false, message = Ungültige E-Mail-Adresse.]);
        exit;
    }

    $empfaenger = kontakt@simon-raaf.de;
    $betreff = Neue Nachricht von $name;
    $headers = From $emailrnReply-To $emailrnContent-Type textplain; charset=UTF-8;

    $mailText = Name $namenE-Mail $emailnnNachrichtn$message;

    if (mail($empfaenger, $betreff, $mailText, $headers)) {
        echo json_encode([success = true, message = Nachricht wurde gesendet!]);
    } else {
        echo json_encode([success = false, message = Fehler beim Senden der Nachricht.]);
    }
} else {
    echo json_encode([success = false, message = Ungültige Anfrage.]);
}


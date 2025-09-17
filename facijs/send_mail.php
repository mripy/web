<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $documento = $_POST['documento'];
    $fechaNacimiento = $_POST['fechaNacimiento'];
    $edad = $_POST['edad'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $ajuste = $_POST['ajuste'];
    $barrio = $_POST['barrio'];
    $direccion = $_POST['direccion'];
    $departamento = $_POST['departamento'];
    $municipio = $_POST['municipio'];
    $descripcion = $_POST['descripcion'];
    $intencion = $_POST['intencion'];

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'consultorio_cty@facijs.edu.py'; // Reemplaza con tu dirección de correo de Outlook
        $mail->Password = 'srfw vgkj sllh iini'; // Reemplaza con tu contraseña de Outlook
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Configuración de codificación de caracteres
        $mail->CharSet = 'UTF-8';

        $mail->setFrom('consultorio_cty@facijs.edu.py', 'Consultorio Jurídico');
        
        
        if ($sede == 'curuguaty') {
            
        $mail->addAddress('orleugim@gmail.com');
        $mail->addAddress('lucreciocabrera@gmail.com');
        $mail->addAddress('lu.cabrera@facijs.edu.py');
        $mail->addAddress('liryzsant@gmail.com');
        $mail->addAddress('lirissantacruz@facijs.edu.py');
        $mail->addAddress('victorelautentico1982@gmail.com');
        $mail->addAddress('victormartinez@facijs.edu.py');
        $mail->addAddress('mariajonez685@gmail.com');
        $mail->addAddress('mariatrinidad@facijs.edu.py');
        $mail->addAddress('hugovmujica@gmail.com');
        $mail->addAddress('ha.valdes@facijs.edu.py');

        } else {
            
            $mail->addAddress('orleugim@gmail.com');
            $mail->addAddress('galeanofernandezmiriangraciela@gmail.com');
            $mail->addAddress('mg.galeano@facijs.edu.py');
            $mail->addAddress('nilsonquintana02@gmail.com');
            $mail->addAddress('iberolex_guillermo@hotmail.com');
        }
        
        


        $mail->isHTML(true);
        $mail->Subject = 'Nueva Solicitud de Asesoría';
        $mail->Body = "
            <h1>Nueva Solicitud de Asesoría</h1>
            <p><strong>Nombre y apellido:</strong> $nombre</p>
            <p><strong>Número de documento:</strong> $documento</p>
            <p><strong>Fecha de nacimiento:</strong> $fechaNacimiento</p>
            <p><strong>Edad:</strong> $edad</p>
            <p><strong>Teléfono/celular:</strong> $telefono</p>
            <p><strong>Correo electrónico:</strong> $email</p>
            <p><strong>Ajuste razonable requerido:</strong> $ajuste</p>
            <p><strong>Barrio:</strong> $barrio</p>
            <p><strong>Dirección:</strong> $direccion</p>
            <p><strong>Departamento:</strong> $departamento</p>
            <p><strong>Municipio:</strong> $municipio</p>
            <p><strong>Descripción de los hechos:</strong></p>
            <p>$descripcion</p>
            <p><strong>Intención de la consulta (Pretensiones):</strong></p>
            <p>$intencion</p>
        ";

        $mail->send();
        echo 'Solicitud enviada correctamente';
    } catch (Exception $e) {
        echo "Error al enviar el correo: {$mail->ErrorInfo}";
    }
}
?>

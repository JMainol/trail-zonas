<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Recoger datos (FormData)
$data = $_POST;

if (empty($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'No data received']);
    exit;
}

$to = "info@selva-amazonas.com";
$subject = "Nuevo mensaje de contacto - Amazonas Jungle";

// Recoger campos (saneamiento básico)
$nombre = htmlspecialchars(trim($data['nombre'] ?? 'Sin nombre'));
$email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$profesion = htmlspecialchars(trim($data['profesion'] ?? 'No especificada'));
$web = htmlspecialchars(trim($data['web'] ?? '-'));
$instagram = htmlspecialchars(trim($data['instagram'] ?? '-'));
$plataforma = htmlspecialchars(trim($data['plataforma'] ?? '-'));
$conociste = htmlspecialchars(trim($data['conociste'] ?? '-'));
$interes = htmlspecialchars(trim($data['interes'] ?? '-'));
$mensaje = htmlspecialchars(trim($data['mensaje'] ?? ''));

// Si el correo no es válido, detenemos el script
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Dirección de correo no válida']);
    exit;
}

// Construir el cuerpo del correo en texto plano
$body = "Has recibido un nuevo mensaje desde el formulario web de Amazonas Jungle:\n\n";
$body .= "Nombre: $nombre\n";
$body .= "Email: $email\n";
$body .= "Profesión: $profesion\n";
$body .= "Web: $web\n";
$body .= "Instagram: $instagram\n";
$body .= "Otra plataforma: $plataforma\n";
$body .= "Cómo nos conoció: $conociste\n";
$body .= "Interés principal: $interes\n\n";
$body .= "Mensaje:\n$mensaje\n";

// Cabeceras del correo. 
// From DEBE ser del dominio para evitar que sea marcado como spam.
$headers = "From: info@selva-amazonas.com\r\n"; 
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Usamos la función nativa mail() de PHP. En servidores cPanel funciona usando el MTA local de inmediato.
if(mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al intentar enviar el correo desde el servidor']);
}
?>

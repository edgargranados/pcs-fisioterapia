<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    pcs_json(405, ['ok' => false, 'error' => 'server']);
}

if (!pcs_same_origin()) {
    pcs_json(403, ['ok' => false, 'error' => 'server']);
}

if (!pcs_rate_limit('cita:' . pcs_client_ip(), 5, 3600)) {
    pcs_json(429, ['ok' => false, 'error' => 'rate']);
}

$raw = file_get_contents('php://input', false, null, 0, 8000);
if ($raw === false || $raw === '') {
    pcs_json(400, ['ok' => false, 'error' => 'name']);
}

try {
    $body = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    pcs_json(400, ['ok' => false, 'error' => 'name']);
}

if (!is_array($body)) {
    pcs_json(400, ['ok' => false, 'error' => 'name']);
}

$company = $body['company'] ?? '';
if (is_string($company) && trim($company) !== '') {
    pcs_json(200, ['ok' => true]);
}

$parsed = pcs_parse_lead($body);
if ($parsed['ok'] !== true) {
    pcs_json(400, ['ok' => false, 'error' => $parsed['error']]);
}

$lead = $parsed['lead'];

try {
    $statement = pcs_db()->prepare(
        'INSERT INTO leads (name, phone, email, locale, page) VALUES (:name, :phone, :email, :locale, :page)'
    );
    $statement->execute([
        ':name' => $lead['name'],
        ':phone' => $lead['phone'],
        ':email' => $lead['email'],
        ':locale' => $lead['locale'],
        ':page' => $lead['page'],
    ]);
} catch (Throwable) {
    pcs_json(500, ['ok' => false, 'error' => 'server']);
}

pcs_json(200, [
    'ok' => true,
    'whatsapp' => pcs_whatsapp($lead['locale'], $lead['name']),
]);

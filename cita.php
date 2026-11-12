<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    pcs_json(405, ['ok' => false, 'error' => 'server']);
}

if (!pcs_same_origin()) {
    pcs_json(403, ['ok' => false, 'error' => 'server']);
}

if (!pcs_rate_limit('cita:' . pcs_client_ip(), 80, 3600)) {
    pcs_json(429, ['ok' => false, 'error' => 'rate']);
}

$raw = file_get_contents('php://input', false, null, 0, 16000);
if ($raw === false || $raw === '') {
    pcs_json(400, ['ok' => false, 'error' => 'lead']);
}

try {
    $body = json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    pcs_json(400, ['ok' => false, 'error' => 'lead']);
}

if (!is_array($body)) {
    pcs_json(400, ['ok' => false, 'error' => 'lead']);
}

$company = $body['company'] ?? '';
if (is_string($company) && trim($company) !== '') {
    pcs_json(200, ['ok' => true]);
}

$step = $body['step'] ?? '';
if (!in_array($step, ['preference', 'name', 'phone', 'email'], true)) {
    pcs_json(400, ['ok' => false, 'error' => 'lead']);
}

if (($body['consent'] ?? null) !== true) {
    pcs_json(400, ['ok' => false, 'error' => 'consent']);
}

$locale = $body['locale'] ?? null;
if ($locale !== 'ca' && $locale !== 'es') {
    pcs_json(400, ['ok' => false, 'error' => 'locale']);
}

$page = pcs_clean_page($body['page'] ?? null);
$hasAttempt = (isset($body['id']) && $body['id'] !== '' && $body['id'] !== null)
    || (isset($body['token']) && is_string($body['token']) && $body['token'] !== '');
$updating = $step !== 'preference' || $hasAttempt;

try {
    $db = pcs_db();
    pcs_ensure_attribution($db);
    pcs_ensure_wizard($db);

    if (!$updating) {
        $preference = pcs_parse_preference($body['preference'] ?? null);
        if ($preference === null) {
            pcs_json(400, ['ok' => false, 'error' => 'preference']);
        }
        if (!pcs_rate_limit('cita-new:' . pcs_client_ip(), 12, 3600)) {
            pcs_json(429, ['ok' => false, 'error' => 'rate']);
        }
        $token = pcs_new_resume_token();
        $attribution = pcs_parse_attribution($body);
        $columns = ['name', 'phone', 'email', 'locale', 'page', 'preference', 'status', 'resume_token'];
        $params = [
            ':name' => null,
            ':phone' => null,
            ':email' => null,
            ':locale' => $locale,
            ':page' => $page,
            ':preference' => $preference,
            ':status' => 'partial',
            ':resume_token' => $token['hash'],
        ];
        foreach ($attribution as $key => $value) {
            if (preg_match('/^[a-z0-9_]+$/', (string) $key) !== 1) {
                continue;
            }
            $columns[] = $key;
            $params[':' . $key] = $value;
        }
        $names = implode(', ', $columns);
        $holders = implode(', ', array_map(static fn (string $column): string => ':' . $column, $columns));
        $statement = $db->prepare("INSERT INTO leads ({$names}) VALUES ({$holders})");
        $statement->execute($params);
        pcs_json(200, [
            'ok' => true,
            'id' => (int) $db->lastInsertId(),
            'token' => $token['token'],
        ]);
    }

    $loaded = pcs_lead_for_update($db, $body);
    if ($loaded['ok'] !== true) {
        pcs_json(400, ['ok' => false, 'error' => 'lead']);
    }
    $lead = $loaded['lead'];
    $id = (int) $loaded['id'];

    if ($step === 'preference') {
        $preference = pcs_parse_preference($body['preference'] ?? null);
        if ($preference === null) {
            pcs_json(400, ['ok' => false, 'error' => 'preference']);
        }
        $update = $db->prepare('UPDATE leads SET preference = :preference, locale = :locale, page = :page WHERE id = :id');
        $update->execute([
            ':preference' => $preference,
            ':locale' => $locale,
            ':page' => $page,
            ':id' => $id,
        ]);
        pcs_json(200, ['ok' => true, 'id' => $id]);
    }

    if ($step === 'name') {
        if (pcs_parse_preference($lead['preference'] ?? null) === null) {
            pcs_json(400, ['ok' => false, 'error' => 'preference']);
        }
        $name = pcs_valid_name($body['name'] ?? null);
        if ($name === null) {
            pcs_json(400, ['ok' => false, 'error' => 'name']);
        }
        $update = $db->prepare('UPDATE leads SET name = :name, locale = :locale, page = :page WHERE id = :id');
        $update->execute([
            ':name' => $name,
            ':locale' => $locale,
            ':page' => $page,
            ':id' => $id,
        ]);
        pcs_json(200, ['ok' => true, 'id' => $id]);
    }

    if ($step === 'phone') {
        if (pcs_lead_text($lead['name'] ?? null) === '') {
            pcs_json(400, ['ok' => false, 'error' => 'name']);
        }
        $phone = pcs_normalize_phone((string) ($body['phone'] ?? ''));
        if ($phone === null) {
            pcs_json(400, ['ok' => false, 'error' => 'phone']);
        }
        $update = $db->prepare('UPDATE leads SET phone = :phone, locale = :locale, page = :page WHERE id = :id');
        $update->execute([
            ':phone' => $phone,
            ':locale' => $locale,
            ':page' => $page,
            ':id' => $id,
        ]);
        pcs_json(200, ['ok' => true, 'id' => $id]);
    }

    if (pcs_lead_text($lead['name'] ?? null) === '') {
        pcs_json(400, ['ok' => false, 'error' => 'name']);
    }
    if (pcs_lead_text($lead['phone'] ?? null) === '') {
        pcs_json(400, ['ok' => false, 'error' => 'phone']);
    }
    $email = pcs_parse_email_field($body['email'] ?? null);
    if ($email['ok'] !== true) {
        pcs_json(400, ['ok' => false, 'error' => 'email']);
    }
    $update = $db->prepare("UPDATE leads SET email = :email, status = 'complete', locale = :locale, page = :page WHERE id = :id");
    $update->execute([
        ':email' => $email['email'],
        ':locale' => $locale,
        ':page' => $page,
        ':id' => $id,
    ]);
    pcs_json(200, [
        'ok' => true,
        'id' => $id,
        'whatsapp' => pcs_whatsapp($locale, pcs_lead_text($lead['name'] ?? null)),
    ]);
} catch (Throwable) {
    pcs_json(500, ['ok' => false, 'error' => 'server']);
}

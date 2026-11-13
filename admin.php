<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

date_default_timezone_set('Europe/Madrid');

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_name('pcs_admin');
session_start();

if (empty($_SESSION['csrf']) || !is_string($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}

$config = pcs_config();
$hash = (string) ($config['admin_password_hash'] ?? '');
$error = '';
$signedIn = ($_SESSION['admin'] ?? false) === true;

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $token = (string) ($_POST['csrf'] ?? '');
    $csrf = (string) $_SESSION['csrf'];
    if ($token === '' || !hash_equals($csrf, $token)) {
        $error = 'La sesión ha caducado. Vuelve a intentarlo.';
    } elseif (isset($_POST['logout'])) {
        $_SESSION = [];
        session_destroy();
        header('Location: /admin.php', true, 303);
        exit;
    } elseif ($signedIn) {
        try {
            $result = pcs_crm_action(pcs_db(), $_POST);
            if (($result['ajax'] ?? false) === true) {
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['ok' => $result['error'] === ''], JSON_UNESCAPED_UNICODE);
                exit;
            }
            if ($result['error'] !== '') {
                $_SESSION['flash_error'] = $result['error'];
            }
            if ($result['ok'] !== '') {
                $_SESSION['flash_ok'] = $result['ok'];
            }
            pcs_admin_redirect($result['query']);
        } catch (Throwable) {
            $error = 'No se ha podido guardar el cambio.';
        }
    } elseif (!pcs_rate_limit('admin:' . pcs_client_ip(), 8, 15 * 60)) {
        $error = 'Demasiados intentos. Espera un cuarto de hora.';
    } elseif ($hash === '' && isset($_POST['create_password'])) {
        $password = (string) ($_POST['password'] ?? '');
        $confirm = (string) ($_POST['confirm'] ?? '');
        if (strlen($password) < 8) {
            $error = 'Usa al menos 8 caracteres.';
        } elseif ($password !== $confirm) {
            $error = 'Las dos contraseñas no coinciden.';
        } else {
            $config['admin_password_hash'] = password_hash($password, PASSWORD_DEFAULT);
            if (!pcs_save_config($config)) {
                $error = 'No se ha podido guardar la contraseña.';
            } else {
                session_regenerate_id(true);
                $_SESSION['admin'] = true;
                $_SESSION['csrf'] = bin2hex(random_bytes(16));
                header('Location: /admin.php', true, 303);
                exit;
            }
        }
    } elseif ($hash === '' || password_verify((string) ($_POST['password'] ?? ''), $hash) !== true) {
        $error = 'Contraseña incorrecta.';
    } else {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
        header('Location: /admin.php', true, 303);
        exit;
    }
}

$signedIn = ($_SESSION['admin'] ?? false) === true;
$flashError = (string) ($_SESSION['flash_error'] ?? '');
$flashOk = (string) ($_SESSION['flash_ok'] ?? '');
unset($_SESSION['flash_error'], $_SESSION['flash_ok']);

$stages = [];
$leadsByStage = [];
$notes = [];
$events = [];
$openLead = null;
$dbError = '';
$activeStage = 0;

if ($signedIn) {
    try {
        $db = pcs_db();
        pcs_ensure_crm($db);
        $stages = pcs_crm_stages($db);
        $activeStage = pcs_crm_active_stage($stages, (int) ($_GET['stage'] ?? 0));
        $leadRows = $db->query(
            'SELECT l.id, l.name, l.phone, l.email, l.locale, l.page, l.preference, l.status, l.stage_id, l.created_at,
                    l.referrer, l.landing_url, l.utm_source, l.utm_medium, l.utm_campaign, l.utm_term, l.utm_content,
                    l.gclid, l.fbclid, l.gbraid, l.wbraid, l.msclkid, l.ttclid,
                    (SELECT COUNT(*) FROM lead_notes n WHERE n.lead_id = l.id) AS note_count
             FROM leads l
             ORDER BY l.sort_order ASC, l.created_at DESC, l.id DESC'
        )->fetchAll();
        foreach ($stages as $stage) {
            $leadsByStage[(int) $stage['id']] = [];
        }
        $fallback = $stages[0]['id'] ?? 0;
        foreach ($leadRows as $lead) {
            $stageId = (int) ($lead['stage_id'] ?? 0);
            if (!isset($leadsByStage[$stageId])) {
                $stageId = (int) $fallback;
            }
            $leadsByStage[$stageId][] = $lead;
            if ((int) ($_GET['lead'] ?? 0) === (int) $lead['id']) {
                $openLead = $lead;
            }
        }
        if ($openLead !== null) {
            $noteStmt = $db->prepare('SELECT id, body, created_at FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC, id DESC');
            $noteStmt->execute([(int) $openLead['id']]);
            $notes = $noteStmt->fetchAll();
            $eventStmt = $db->prepare('SELECT id, kind, detail, created_at FROM lead_events WHERE lead_id = ? ORDER BY created_at DESC, id DESC');
            $eventStmt->execute([(int) $openLead['id']]);
            $events = $eventStmt->fetchAll();
        }
    } catch (Throwable) {
        $dbError = 'No se ha podido leer la base de datos. Revisa config.local.php y que schema.sql esté importado.';
    }
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function pcs_admin_url(array $query): string
{
    $clean = [];
    foreach ($query as $key => $value) {
        if ($value === null || $value === '' || $value === 0) {
            continue;
        }
        $clean[$key] = $value;
    }
    return $clean === [] ? '/admin.php' : '/admin.php?' . http_build_query($clean);
}

function pcs_admin_redirect(array $query): void
{
    header('Location: ' . pcs_admin_url($query), true, 303);
    exit;
}

function pcs_crm_stages(PDO $db): array
{
    return $db->query('SELECT id, name, position FROM stages ORDER BY position ASC, id ASC')->fetchAll();
}

function pcs_crm_active_stage(array $stages, int $requested): int
{
    foreach ($stages as $stage) {
        if ((int) $stage['id'] === $requested) {
            return $requested;
        }
    }
    return (int) ($stages[0]['id'] ?? 0);
}

function pcs_crm_reindex(PDO $db, array $ids): void
{
    $stmt = $db->prepare('UPDATE stages SET position = ? WHERE id = ?');
    foreach (array_values($ids) as $position => $id) {
        $stmt->execute([$position, (int) $id]);
    }
}

function pcs_crm_label(string $value): ?string
{
    $value = preg_replace('/\s+/u', ' ', trim($value)) ?? '';
    if ($value === '' || mb_strlen($value) > 40) {
        return null;
    }
    if (preg_match('/^[\\p{L}\\p{N}][\\p{L}\\p{N}\\s.\\-]*$/u', $value) !== 1) {
        return null;
    }
    return $value;
}

function pcs_place_lead(PDO $db, int $stageId, int $leadId, int $beforeId, bool $atEnd): void
{
    $rows = $db->prepare('SELECT id FROM leads WHERE stage_id = ? AND id <> ? ORDER BY sort_order ASC, created_at DESC, id DESC');
    $rows->execute([$stageId, $leadId]);
    $ids = array_map(static fn (mixed $id): int => (int) $id, $rows->fetchAll(PDO::FETCH_COLUMN));
    $index = $beforeId > 0 ? array_search($beforeId, $ids, true) : false;
    if ($index === false) {
        if ($atEnd) {
            $ids[] = $leadId;
        } else {
            array_unshift($ids, $leadId);
        }
    } else {
        array_splice($ids, (int) $index, 0, [$leadId]);
    }
    $update = $db->prepare('UPDATE leads SET stage_id = ?, sort_order = ? WHERE id = ?');
    foreach ($ids as $order => $id) {
        $update->execute([$stageId, (int) $order, (int) $id]);
    }
}

function pcs_log_event(PDO $db, int $leadId, string $kind, string $detail): void
{
    $detail = trim($detail);
    if (mb_strlen($detail) > 500) {
        $detail = mb_substr($detail, 0, 500);
    }
    $db->prepare('INSERT INTO lead_events (lead_id, kind, detail) VALUES (?, ?, ?)')->execute([
        $leadId,
        $kind,
        $detail === '' ? null : $detail,
    ]);
}

function pcs_crm_action(PDO $db, array $post): array
{
    pcs_ensure_crm($db);
    $action = (string) ($post['action'] ?? '');
    $stageId = (int) ($post['stage_id'] ?? 0);
    $leadId = (int) ($post['lead_id'] ?? 0);
    $back = [
        'stage' => (int) ($post['back_stage'] ?? 0),
        'lead' => (int) ($post['back_lead'] ?? 0),
    ];
    $stages = pcs_crm_stages($db);
    $known = [];
    foreach ($stages as $stage) {
        $known[(int) $stage['id']] = $stage;
    }
    $fail = static function (string $message) use ($back): array {
        return ['error' => $message, 'ok' => '', 'query' => $back];
    };

    if ($action === 'create_stage') {
        $name = pcs_crm_label((string) ($post['name'] ?? ''));
        if ($name === null) {
            return $fail('Escribe un nombre de etapa de hasta 40 caracteres.');
        }
        if (count($stages) >= 12) {
            return $fail('Puedes tener hasta 12 etapas.');
        }
        foreach ($stages as $stage) {
            if (mb_strtolower((string) $stage['name']) === mb_strtolower($name)) {
                return $fail('Ya existe una etapa con ese nombre.');
            }
        }
        $insert = $db->prepare('INSERT INTO stages (name, position) VALUES (?, ?)');
        $insert->execute([$name, count($stages)]);
        return ['error' => '', 'ok' => 'Etapa creada.', 'query' => ['stage' => (int) $db->lastInsertId()]];
    }

    if ($action === 'rename_stage') {
        $name = pcs_crm_label((string) ($post['name'] ?? ''));
        if (!isset($known[$stageId]) || $name === null) {
            return $fail('No se ha podido renombrar la etapa.');
        }
        foreach ($stages as $stage) {
            if ((int) $stage['id'] !== $stageId && mb_strtolower((string) $stage['name']) === mb_strtolower($name)) {
                return $fail('Ya existe una etapa con ese nombre.');
            }
        }
        $update = $db->prepare('UPDATE stages SET name = ? WHERE id = ?');
        $update->execute([$name, $stageId]);
        $back['stage'] = $stageId;
        return ['error' => '', 'ok' => 'Nombre actualizado.', 'query' => $back];
    }

    if ($action === 'move_stage') {
        if (!isset($known[$stageId])) {
            return $fail('No se ha encontrado la etapa.');
        }
        $ids = array_map(static fn (array $stage): int => (int) $stage['id'], $stages);
        $index = array_search($stageId, $ids, true);
        $next = $index + ((int) ($post['direction'] ?? 0) === 1 ? 1 : -1);
        if ($index === false || $next < 0 || $next >= count($ids)) {
            return ['error' => '', 'ok' => '', 'query' => ['stage' => $stageId]];
        }
        $swap = $ids[$next];
        $ids[$next] = $ids[$index];
        $ids[$index] = $swap;
        pcs_crm_reindex($db, $ids);
        return ['error' => '', 'ok' => '', 'query' => ['stage' => $stageId, 'lead' => $back['lead']]];
    }

    if ($action === 'delete_stage') {
        if (!isset($known[$stageId])) {
            return $fail('No se ha encontrado la etapa.');
        }
        if (count($stages) < 2) {
            return $fail('Tiene que quedar al menos una etapa.');
        }
        $ids = array_map(static fn (array $stage): int => (int) $stage['id'], $stages);
        $index = (int) array_search($stageId, $ids, true);
        $target = $ids[$index - 1] ?? $ids[$index + 1];
        $moving = $db->prepare('SELECT id FROM leads WHERE stage_id = ?');
        $moving->execute([$stageId]);
        $movingIds = array_map(static fn (mixed $id): int => (int) $id, $moving->fetchAll(PDO::FETCH_COLUMN));
        $fromName = (string) $known[$stageId]['name'];
        $toName = (string) ($known[$target]['name'] ?? '');
        $move = $db->prepare('UPDATE leads SET stage_id = ? WHERE stage_id = ?');
        $move->execute([$target, $stageId]);
        foreach ($movingIds as $movingId) {
            pcs_log_event($db, $movingId, 'stage', $fromName . ' → ' . $toName);
        }
        $moved = count($movingIds);
        $db->prepare('DELETE FROM stages WHERE id = ?')->execute([$stageId]);
        pcs_crm_reindex($db, array_values(array_filter($ids, static fn (int $id): bool => $id !== $stageId)));
        $ok = $moved > 0 ? 'Etapa eliminada. Los leads han pasado a la etapa de al lado.' : 'Etapa eliminada.';
        return ['error' => '', 'ok' => $ok, 'query' => ['stage' => $target]];
    }

    if ($action === 'move_lead') {
        if ($leadId < 1 || !isset($known[$stageId])) {
            return $fail('No se ha podido mover el lead.');
        }
        $exists = $db->prepare('SELECT stage_id FROM leads WHERE id = ?');
        $exists->execute([$leadId]);
        $currentStage = $exists->fetchColumn();
        if ($currentStage === false) {
            return $fail('Ese lead ya no está.');
        }
        if ((int) $currentStage !== $stageId) {
            $fromName = (string) ($known[(int) $currentStage]['name'] ?? 'Sin etapa');
            pcs_log_event($db, $leadId, 'stage', $fromName . ' → ' . (string) $known[$stageId]['name']);
        }
        $beforeId = (int) ($post['before_id'] ?? 0);
        pcs_place_lead($db, $stageId, $leadId, $beforeId, (string) ($post['at'] ?? '') === 'end');
        $keep = (string) ($post['keep_lead'] ?? '') === '1';
        return [
            'error' => '',
            'ok' => '',
            'query' => [
                'stage' => $keep ? $stageId : (int) ($post['back_stage'] ?? $stageId),
                'lead' => $keep ? $leadId : 0,
            ],
        ];
    }

    if ($action === 'add_note') {
        $body = trim((string) ($post['body'] ?? ''));
        $body = preg_replace("/\r\n?/", "\n", $body) ?? '';
        if ($body === '' || mb_strlen($body) > 2000) {
            return $fail('La nota tiene que tener entre 1 y 2000 caracteres.');
        }
        $exists = $db->prepare('SELECT stage_id FROM leads WHERE id = ?');
        $exists->execute([$leadId]);
        $leadStage = $exists->fetchColumn();
        if ($leadStage === false) {
            return $fail('Ese lead ya no está.');
        }
        $db->prepare('INSERT INTO lead_notes (lead_id, body) VALUES (?, ?)')->execute([$leadId, $body]);
        return [
            'error' => '',
            'ok' => 'Nota guardada.',
            'query' => ['stage' => (int) $leadStage, 'lead' => $leadId],
        ];
    }

    if ($action === 'log_touch') {
        $kind = (string) ($post['kind'] ?? '');
        $ajax = (string) ($post['ajax'] ?? '') === '1';
        if ($leadId < 1 || ($kind !== 'call' && $kind !== 'whatsapp')) {
            return ['error' => 'No se ha podido registrar.', 'ok' => '', 'query' => $back, 'ajax' => $ajax];
        }
        $exists = $db->prepare('SELECT id FROM leads WHERE id = ?');
        $exists->execute([$leadId]);
        if ($exists->fetchColumn() === false) {
            return ['error' => 'Ese lead ya no está.', 'ok' => '', 'query' => $back, 'ajax' => $ajax];
        }
        pcs_log_event($db, $leadId, $kind, '');
        return ['error' => '', 'ok' => '', 'query' => ['stage' => (int) ($post['back_stage'] ?? 0), 'lead' => $leadId], 'ajax' => $ajax];
    }

    if ($action === 'update_lead') {
        $field = (string) ($post['field'] ?? '');
        $value = trim(str_replace(["\r", "\n"], ' ', (string) ($post['value'] ?? '')));
        $labels = ['name' => 'el nombre', 'email' => 'el email', 'phone' => 'el teléfono'];
        if (!isset($labels[$field])) {
            return $fail('No se ha podido guardar el dato.');
        }
        if ($field === 'name' && mb_strlen($value) > 80) {
            return $fail('El nombre puede tener hasta 80 caracteres.');
        }
        if ($field === 'email' && ($value !== '' && filter_var($value, FILTER_VALIDATE_EMAIL) === false || mb_strlen($value) > 120)) {
            return $fail('El email no es válido.');
        }
        if ($field === 'phone' && ($value !== '' && preg_match('/^[0-9+().\\s-]{1,20}$/', $value) !== 1)) {
            return $fail('El teléfono no es válido.');
        }
        $column = $field === 'name' ? 'name' : ($field === 'email' ? 'email' : 'phone');
        $current = $db->prepare('SELECT ' . $column . ', stage_id FROM leads WHERE id = ?');
        $current->execute([$leadId]);
        $row = $current->fetch();
        if ($row === false) {
            return $fail('Ese lead ya no está.');
        }
        $previous = trim((string) ($row[$column] ?? ''));
        if ($previous !== $value) {
            $db->prepare('UPDATE leads SET ' . $column . ' = ? WHERE id = ?')->execute([$value === '' ? null : $value, $leadId]);
            pcs_log_event($db, $leadId, 'edit', $labels[$field]);
        }
        return [
            'error' => '',
            'ok' => '',
            'query' => ['stage' => (int) ($row['stage_id'] ?? $post['back_stage'] ?? 0), 'lead' => $leadId],
        ];
    }

    if ($action === 'delete_lead') {
        if ($leadId < 1) {
            return $fail('No se ha podido eliminar el lead.');
        }
        $exists = $db->prepare('SELECT stage_id FROM leads WHERE id = ?');
        $exists->execute([$leadId]);
        $leadStage = $exists->fetchColumn();
        if ($leadStage === false) {
            return $fail('Ese lead ya no está.');
        }
        $db->prepare('DELETE FROM lead_notes WHERE lead_id = ?')->execute([$leadId]);
        $db->prepare('DELETE FROM lead_events WHERE lead_id = ?')->execute([$leadId]);
        $db->prepare('DELETE FROM leads WHERE id = ?')->execute([$leadId]);
        return [
            'error' => '',
            'ok' => 'Lead eliminado.',
            'query' => ['stage' => (int) ($post['back_stage'] ?? $leadStage)],
        ];
    }

    return $fail('Acción no reconocida.');
}

function pcs_when(string $value): string
{
    try {
        $date = new DateTimeImmutable($value);
    } catch (Throwable) {
        return $value;
    }
    $months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return $date->format('j') . '-' . $months[(int) $date->format('n') - 1];
}

function pcs_day_heading(string $value): string
{
    try {
        $date = new DateTimeImmutable($value);
    } catch (Throwable) {
        return $value;
    }
    $today = new DateTimeImmutable('today');
    $day = $date->setTime(0, 0);
    if ($day == $today) {
        return 'Hoy';
    }
    if ($day == $today->modify('-1 day')) {
        return 'Ayer';
    }
    return pcs_when($value);
}

function pcs_ago(string $value): string
{
    try {
        $date = new DateTimeImmutable($value);
    } catch (Throwable) {
        return $value;
    }
    $now = new DateTimeImmutable();
    $diff = $now->getTimestamp() - $date->getTimestamp();
    if ($diff < 60) {
        return 'ahora';
    }
    if ($date->format('Y-m-d') === $now->format('Y-m-d')) {
        if ($diff < 3600) {
            return 'hace ' . intdiv($diff, 60) . ' min';
        }
        $hours = intdiv($diff, 3600);
        return 'hace ' . $hours . ' h';
    }
    $yesterday = $now->modify('-1 day')->format('Y-m-d');
    if ($date->format('Y-m-d') === $yesterday) {
        return 'ayer';
    }
    return pcs_when($value);
}

function pcs_activity_icon(string $kind, int $size = 16): string
{
    $paths = [
        'call' => '<path d="M8 3h2l1 4-2 1a11 11 0 0 0 6 6l1-2 4 1v2a2 2 0 0 1-2 2A15 15 0 0 1 6 5a2 2 0 0 1 2-2z"/>',
        'whatsapp' => '<path d="M5 18l1-3a8 8 0 1 1 3 3z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/>',
        'stage' => '<path d="M5 4h9l-1 4 1 4H5z"/><path d="M5 4v16"/>',
        'edit' => '<path d="M4 20h4l10-10-4-4L4 16z"/><path d="M12 6l4 4"/>',
        'created' => '<circle cx="12" cy="8" r="3"/><path d="M6 19c1.5-3 3.5-4 6-4s4.5 1 6 4"/>',
        'note' => '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4M9 12h6M9 16h6"/>',
    ];
    $path = $paths[$kind] ?? $paths['note'];
    return '<svg viewBox="0 0 24 24" width="' . $size . '" height="' . $size . '" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' . $path . '</svg>';
}

function pcs_preference_label(mixed $value): string
{
    return $value === 'morning' ? 'Mañanas' : ($value === 'afternoon' ? 'Tardes' : '');
}

function pcs_phone_href(string $phone): string
{
    $digits = preg_replace('/\D/', '', $phone) ?? '';
    return $digits === '' ? '' : 'tel:+' . $digits;
}

function pcs_origin_label(array $lead): string
{
    $source = trim((string) ($lead['utm_source'] ?? ''));
    $medium = trim((string) ($lead['utm_medium'] ?? ''));
    if ($source !== '') {
        return $medium !== '' ? $source . ' · ' . $medium : $source;
    }
    $host = parse_url((string) ($lead['referrer'] ?? ''), PHP_URL_HOST);
    if (is_string($host) && $host !== '') {
        return $host;
    }
    return 'Directo';
}

function pcs_lead_whatsapp(string $phone, string $name): string
{
    $digits = preg_replace('/\D/', '', $phone) ?? '';
    if ($digits === '') {
        return '';
    }
    $safe = mb_substr(str_replace(["\r", "\n"], ' ', $name), 0, 80);
    return 'https://wa.me/' . $digits . '?text=' . rawurlencode("Hola {$safe}, soy Pol de PCS Fisioterapia.");
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Leads · PCS Fisioterapia</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; font: 16px/1.45 system-ui, sans-serif; background: #f4efe6; color: #1c211c; }
    a { color: #0a7b71; }
    button, input, select, textarea { font: inherit; color: inherit; }
    button { cursor: pointer; }
    .gate { max-width: 28rem; margin: 0 auto; padding: 48px 20px; }
    .gate h1 { font-size: 2rem; font-weight: 560; letter-spacing: -0.03em; }
    .card, .lead, .note, .composer, .column { background: #fff; border: 1px solid #e4dccf; border-radius: 18px; }
    .card { padding: 20px; }
    label { display: block; font-size: 0.85rem; margin-bottom: 6px; }
    input, select, textarea { width: 100%; border: 1px solid #d5cbbd; border-radius: 12px; background: #fff; padding: 10px 12px; }
    input, select { min-height: 44px; }
    textarea { min-height: 96px; resize: vertical; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; border: 0; border-radius: 999px; padding: 0 16px; background: #0a7b71; color: #f6f3ec; text-decoration: none; }
    .btn.ghost { background: #fff; color: #1c211c; border: 1px solid #d5cbbd; }
    .btn.danger { background: transparent; color: #8d2b2b; }
    .btn.small { min-height: 36px; padding: 0 12px; font-size: 0.85rem; }
    .error { color: #8d2b2b; }
    .ok { color: #0a7b71; }
    .top { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; background: rgba(244, 239, 230, 0.94); backdrop-filter: blur(10px); border-bottom: 1px solid #e4dccf; }
    .top h1 { margin: 0; font-size: 1.45rem; font-weight: 560; letter-spacing: -0.03em; }
    .brand { margin: 0; font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: #0a7b71; }
    .wrap { padding: 14px 16px 48px; }
    .toolbar { display: grid; gap: 10px; margin-bottom: 12px; }
    .new-stage { display: flex; gap: 8px; }
    .new-stage input { flex: 1; }
    .pills { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin: 0 -16px 12px; padding-left: 16px; padding-right: 16px; }
    .pills a { flex: 0 0 auto; display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px; border-radius: 999px; border: 1px solid #d5cbbd; background: #fff; color: #1c211c; text-decoration: none; }
    .pills a.is-on { background: #0a7b71; border-color: #0a7b71; color: #f6f3ec; }
    .pills span { font-size: 0.8rem; opacity: 0.8; }
    .board { display: block; }
    .column { display: none; padding: 14px; background: var(--stage, #e7f1ef); border-top: 4px solid var(--stage-line, #0a7b71); }
    .column.is-current { display: block; }
    .column-head { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
    .stage-title { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .count { display: inline-grid; place-items: center; min-width: 1.55rem; height: 1.55rem; padding: 0 5px; border-radius: 999px; background: #fff; color: #0a7b71; font-size: 0.78rem; font-weight: 650; line-height: 1; }
    .icon-btn { width: 36px; height: 36px; flex: 0 0 36px; border-radius: 999px; border: 1px solid #d5cbbd; background: #fff; display: inline-flex; align-items: center; justify-content: center; padding: 0; color: #1c211c; }
    .icon-btn[aria-expanded="true"] { background: #e5f4f2; border-color: #0a7b71; color: #0a7b71; }
    .edit { display: none; }
    .edit.is-open { display: grid; }
    .column h2 { margin: 0; font-size: 1.15rem; }
    .muted { color: #5e675e; font-size: 0.85rem; }
    details summary { cursor: pointer; color: #0a7b71; font-size: 0.85rem; }
    .edit.is-open { gap: 8px; margin-top: 10px; }
    .row { display: flex; gap: 8px; }
    .lead { padding: 10px 12px; margin-top: 8px; flex: 0 0 auto; background: #fff; }
    .lead h3 { margin: 0; font-size: 1rem; line-height: 1.25; }
    .lead-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .lead-main { display: block; min-width: 0; color: inherit; text-decoration: none; }
    .lead-main:hover h3 { color: #0a7b71; }
    .drag { display: none; }
    .event-kind { margin: 6px 0 0; font-weight: 600; }
    .meta { margin: 2px 0 0; color: #5e675e; font-size: 0.78rem; line-height: 1.3; }
    .quick { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .quick .btn { flex: 1 1 auto; min-height: 32px; padding: 0 8px; font-size: 0.8rem; white-space: nowrap; }
    .drawer .quick .btn { flex: 0 0 40px; width: 40px; min-height: 40px; padding: 0; }
    .quick [data-move] { flex: 0 0 auto; background: #dff3f1; color: #08685f; border-color: #8fcfc8; }
    .move { display: none; margin-top: 8px; }
    .move.is-open { display: block; }
    .move label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .tag { display: inline-flex; align-items: center; min-height: 24px; margin: 8px 6px 0 0; padding: 0 8px; border-radius: 999px; background: #e5f4f2; color: #0a7b71; font-size: 0.78rem; }
    .tag.warn { background: #f3e6cf; color: #6a4b16; }
    .empty { margin: 14px 0 0; color: #5e675e; }
    .flash { margin: 0 0 12px; }
    .backdrop { position: fixed; inset: 0; background: rgba(28, 33, 28, 0.46); z-index: 20; }
    .drawer { position: fixed; z-index: 21; inset: 0; overflow: auto; background: #f4efe6; padding: 16px 16px 40px; }
    .drawer-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .drawer h2 { margin: 0; font-size: 1.8rem; letter-spacing: -0.03em; }
    .sheet { display: grid; gap: 28px; margin-top: 18px; }
    .prop { margin-top: 16px; }
    .prop-label { margin: 0 0 2px; font-size: 0.78rem; font-weight: 650; }
    .prop-value { display: block; width: 100%; margin: 0; padding: 0; border: 0; background: transparent; text-align: left; font: inherit; color: inherit; cursor: text; }
    .prop-value.is-empty { color: #8a918a; }
    .prop-name { margin-top: 12px; }
    .prop-form input { display: block; width: 100%; margin: 0; padding: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; min-height: 0; outline: none; font: inherit; }
    .prop-name .prop-value, .prop-name .prop-form input { font-size: 1.8rem; font-weight: 560; letter-spacing: -0.03em; line-height: 1.15; }
    .prop-static { margin: 0; }
    .sheet-side { min-width: 0; }
    .history { margin-top: 28px; }
    .day { margin: 16px 0 8px; color: #8a918a; font-size: 0.8rem; }
    .activity { list-style: none; margin: 0; padding: 0; }
    .activity li { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; gap: 12px; align-items: stretch; }
    .rail { display: flex; flex-direction: column; align-items: center; }
    .activity-icon { width: 32px; height: 32px; flex: none; display: grid; place-items: center; border-radius: 10px; background: #fff; border: 1px solid #e4dccf; color: #0a7b71; }
    .rail .line { width: 2px; flex: 1; min-height: 16px; margin-top: 4px; background: #e4dccf; }
    .activity li:last-child .line { display: none; }
    .activity strong { display: block; margin-top: 5px; font-size: 0.95rem; }
    .activity .sub { margin: 2px 0 12px; color: #5e675e; font-size: 0.85rem; white-space: pre-wrap; }
    .activity time { margin-top: 6px; color: #8a918a; font-size: 0.78rem; white-space: nowrap; }
    .stage-picks { display: flex; flex-wrap: wrap; gap: 8px; }
    .stage-picks button.is-on { background: #1c211c; }
    .drawer h3 { margin: 18px 0 8px; font-size: 0.95rem; }
    .log { list-style: none; margin: 4px 0 0; padding: 0; }
    .log li { display: grid; grid-template-columns: 3.4rem minmax(0, 1fr); gap: 8px; align-items: baseline; padding: 5px 0; border-top: 1px solid #e4dccf; font-size: 0.9rem; line-height: 1.35; }
    .log time { color: #5e675e; font-size: 0.78rem; }
    .log p { margin: 0; white-space: pre-wrap; }
    .composer { padding: 12px; margin-top: 8px; }
    .column.over { outline: 2px dashed #0a7b71; outline-offset: 3px; }
    .slot { height: 76px; margin-top: 8px; border: 2px dashed #0a7b71; border-radius: 16px; background: rgba(10, 123, 113, 0.14); }
    .lead.is-dragging { opacity: 0.4; }
    .danger-row { margin-top: 28px; }
    .confirm { position: fixed; inset: 0; z-index: 40; display: grid; place-items: center; padding: 20px; background: rgba(28, 33, 28, 0.46); }
    .confirm[hidden] { display: none; }
    .confirm-card { width: min(24rem, 100%); background: #fff; border-radius: 18px; padding: 24px; }
    .confirm-card h2 { margin: 0; font-size: 1.4rem; letter-spacing: -0.03em; }
    .confirm-card p { margin: 10px 0 0; }
    .confirm-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
    @media (min-width: 900px) {
      body.app { height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
      body.app .top { flex: none; }
      body.app .wrap { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow: hidden; padding: 16px 24px 12px; }
      .toolbar { flex: none; grid-template-columns: minmax(0, 1fr) 320px; align-items: center; }
      .pills { display: none; }
      .board { flex: 1 1 auto; min-height: 0; display: flex; gap: 12px; align-items: stretch; overflow-x: auto; overflow-y: hidden; }
      .column, .column.is-current { display: flex; flex-direction: column; width: 320px; flex: 0 0 320px; height: auto; max-height: 100%; min-height: 0; padding: 0; overflow: hidden; }
      .column-head { flex: none; padding: 14px 14px 8px; }
      .edit.is-open { flex: none; margin: 0 14px 4px; }
      .column-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 0 14px 14px; }
      .drag { display: grid; place-items: center; width: 28px; height: 36px; cursor: grab; color: #5e675e; user-select: none; }
      .quick [data-move] { display: none; }
      .drawer { inset: 0 0 0 auto; width: min(960px, calc(100vw - 48px)); padding: 36px 40px 56px; box-shadow: -16px 0 40px rgba(28, 33, 28, 0.16); }
      .sheet { grid-template-columns: minmax(200px, 0.62fr) minmax(300px, 1.38fr); gap: 48px; align-items: start; }
    }
  </style>
</head>
<body<?= $signedIn ? ' class="app"' : '' ?>>
<?php if ($hash === ''): ?>
  <main class="gate">
    <p class="brand">PCS Fisioterapia</p>
    <h1>Contraseña del panel</h1>
    <form method="post" class="card">
      <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
      <input type="hidden" name="create_password" value="1">
      <p>Elige la contraseña de este panel. Solo se pide esta vez.</p>
      <label for="password">Contraseña</label>
      <p><input id="password" name="password" type="password" autocomplete="new-password" minlength="8" required></p>
      <label for="confirm">Repítela</label>
      <p><input id="confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required></p>
      <?php if ($error !== ''): ?><p class="error"><?= h($error) ?></p><?php endif; ?>
      <button class="btn" type="submit">Guardar y entrar</button>
    </form>
  </main>
<?php elseif (!$signedIn): ?>
  <main class="gate">
    <p class="brand">PCS Fisioterapia</p>
    <h1>Leads</h1>
    <form method="post" class="card">
      <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
      <label for="password">Contraseña</label>
      <p><input id="password" name="password" type="password" autocomplete="current-password" required></p>
      <?php if ($error !== ''): ?><p class="error"><?= h($error) ?></p><?php endif; ?>
      <button class="btn" type="submit">Entrar</button>
    </form>
  </main>
<?php else: ?>
  <header class="top">
    <div>
      <p class="brand">PCS Fisioterapia</p>
      <h1>Leads</h1>
    </div>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
      <button class="btn ghost" type="submit" name="logout" value="1">Salir</button>
    </form>
  </header>
  <main class="wrap">
    <?php if ($error !== ''): ?><p class="flash error"><?= h($error) ?></p><?php endif; ?>
    <?php if ($flashError !== ''): ?><p class="flash error"><?= h($flashError) ?></p><?php endif; ?>
    <?php if ($flashOk !== ''): ?><p class="flash ok"><?= h($flashOk) ?></p><?php endif; ?>
    <?php if ($dbError !== ''): ?>
      <p class="error"><?= h($dbError) ?></p>
    <?php else: ?>
      <div class="toolbar">
        <input id="filter" type="search" placeholder="Buscar nombre o teléfono" autocomplete="off" enterkeyhint="search">
        <form method="post" class="new-stage">
          <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
          <input type="hidden" name="action" value="create_stage">
          <input type="hidden" name="back_stage" value="<?= (int) $activeStage ?>">
          <label class="sr" for="new-stage" style="position:absolute;left:-999px">Nueva etapa</label>
          <input id="new-stage" name="name" maxlength="40" placeholder="Nueva etapa" required>
          <button class="btn" type="submit">Crear</button>
        </form>
      </div>
      <nav class="pills" aria-label="Etapas">
        <?php foreach ($stages as $stage): ?>
          <?php $stageId = (int) $stage['id']; ?>
          <a class="<?= $stageId === $activeStage ? 'is-on' : '' ?>" href="<?= h(pcs_admin_url(['stage' => $stageId])) ?>">
            <?= h((string) $stage['name']) ?>
            <span><?= count($leadsByStage[$stageId] ?? []) ?></span>
          </a>
        <?php endforeach; ?>
      </nav>
      <div class="board">
        <?php foreach ($stages as $index => $stage): ?>
          <?php
            $stageId = (int) $stage['id'];
            $columnLeads = $leadsByStage[$stageId] ?? [];
            $targetName = (string) (($stages[$index - 1]['name'] ?? null) ?: ($stages[$index + 1]['name'] ?? ''));
            $deleteMessage = $targetName === ''
                ? '¿Eliminar esta etapa?'
                : 'Los leads de esta etapa pasarán a ' . $targetName . '. ¿Eliminarla?';
            $stageTones = [
                ['#e5f3f1', '#0a7b71'],
                ['#f6efe4', '#b8883d'],
                ['#e8eef8', '#5d7eae'],
                ['#f7eee9', '#c06a4a'],
                ['#eef4e8', '#6d8f52'],
                ['#f3eef6', '#8d6a9a'],
                ['#e7f4f6', '#3d8f9a'],
                ['#f8f0e4', '#a67c2d'],
            ];
            $stageTone = $stageTones[$stageId % count($stageTones)];
          ?>
          <section class="column<?= $stageId === $activeStage ? ' is-current' : '' ?>" data-stage="<?= $stageId ?>" style="--stage: <?= $stageTone[0] ?>; --stage-line: <?= $stageTone[1] ?>">
            <div class="column-head">
              <div class="stage-title">
                <?php $leadCount = count($columnLeads); ?>
                <span class="count" aria-label="<?= $leadCount ?> <?= $leadCount === 1 ? 'lead' : 'leads' ?>"><?= $leadCount ?></span>
                <h2><?= h((string) $stage['name']) ?></h2>
              </div>
              <button type="button" class="icon-btn" data-edit-stage aria-expanded="false" aria-controls="stage-edit-<?= $stageId ?>" aria-label="Editar etapa">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"></path>
                  <path d="M13.5 6.5l3 3"></path>
                </svg>
              </button>
            </div>
            <div class="edit" id="stage-edit-<?= $stageId ?>">
                <form method="post" class="row">
                  <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
                  <input type="hidden" name="action" value="rename_stage">
                  <input type="hidden" name="stage_id" value="<?= $stageId ?>">
                  <input type="hidden" name="back_stage" value="<?= $stageId ?>">
                  <input name="name" value="<?= h((string) $stage['name']) ?>" maxlength="40" aria-label="Nombre de la etapa" required>
                  <button class="btn small" type="submit">Guardar</button>
                </form>
                <div class="row">
                  <form method="post">
                    <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
                    <input type="hidden" name="action" value="move_stage">
                    <input type="hidden" name="stage_id" value="<?= $stageId ?>">
                    <input type="hidden" name="direction" value="-1">
                    <button class="btn ghost small" type="submit" <?= $index === 0 ? 'disabled' : '' ?>>Mover a la izquierda</button>
                  </form>
                  <form method="post">
                    <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
                    <input type="hidden" name="action" value="move_stage">
                    <input type="hidden" name="stage_id" value="<?= $stageId ?>">
                    <input type="hidden" name="direction" value="1">
                    <button class="btn ghost small" type="submit" <?= $index === count($stages) - 1 ? 'disabled' : '' ?>>Mover a la derecha</button>
                  </form>
                </div>
                <form method="post" onsubmit="return confirm(<?= h(json_encode($deleteMessage, JSON_UNESCAPED_UNICODE)) ?>)">
                  <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
                  <input type="hidden" name="action" value="delete_stage">
                  <input type="hidden" name="stage_id" value="<?= $stageId ?>">
                  <button class="btn danger small" type="submit">Eliminar etapa</button>
                </form>
              </div>
            <div class="column-body">
            <?php if ($columnLeads === []): ?>
              <p class="empty">Esta etapa está vacía.</p>
            <?php endif; ?>
            <?php foreach ($columnLeads as $lead): ?>
              <?php
                $id = (int) $lead['id'];
                $rawName = trim((string) ($lead['name'] ?? ''));
                $rawPhone = (string) ($lead['phone'] ?? '');
                $displayName = $rawName !== '' ? $rawName : 'Sin nombre';
                $preferenceLabel = pcs_preference_label($lead['preference'] ?? '');
                $partial = ($lead['status'] ?? '') === 'partial';
                $phoneHref = pcs_phone_href($rawPhone);
                $whatsapp = pcs_lead_whatsapp($rawPhone, $rawName);
                $search = mb_strtolower($displayName . ' ' . $rawPhone . ' ' . $preferenceLabel . ' ' . (string) ($lead['utm_source'] ?? '') . ' ' . (string) ($lead['utm_campaign'] ?? '') . ' ' . (string) ($lead['referrer'] ?? ''));
              ?>
              <article class="lead" data-lead="<?= $id ?>" data-search="<?= h($search) ?>">
                <div class="lead-top">
                  <a class="lead-main" draggable="false" href="<?= h(pcs_admin_url(['stage' => $stageId, 'lead' => $id])) ?>">
                    <h3><?= h($displayName) ?></h3>
                    <p class="meta"><?= h(pcs_when((string) $lead['created_at'])) ?> · <?= (int) $lead['note_count'] ?> <?= (int) $lead['note_count'] === 1 ? 'nota' : 'notas' ?><?php if ($preferenceLabel !== ''): ?> · <?= h($preferenceLabel) ?><?php endif; ?><?php if ($partial): ?> · Incompleta<?php endif; ?> · <?= h(pcs_origin_label($lead)) ?></p>
                  </a>
                  <span class="drag" title="Arrastrar a otra etapa">⠿</span>
                </div>
                <div class="quick">
                  <button type="button" class="btn ghost small" data-move aria-expanded="false" aria-controls="move-<?= $id ?>">Mover</button>
                  <?php if ($phoneHref !== ''): ?><a class="btn ghost small" draggable="false" data-touch="call" data-lead="<?= $id ?>" href="<?= h($phoneHref) ?>">Llamar</a><?php endif; ?>
                  <?php if ($whatsapp !== ''): ?><a class="btn ghost small" draggable="false" data-touch="whatsapp" data-lead="<?= $id ?>" href="<?= h($whatsapp) ?>" target="_blank" rel="noreferrer">WhatsApp</a><?php endif; ?>
                </div>
                <form method="post" class="move" id="move-<?= $id ?>">
                  <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
                  <input type="hidden" name="action" value="move_lead">
                  <input type="hidden" name="lead_id" value="<?= $id ?>">
                  <input type="hidden" name="back_stage" value="<?= $stageId ?>">
                  <label for="stage-<?= $id ?>">Etapa</label>
                  <select id="stage-<?= $id ?>" name="stage_id" onchange="this.form.submit()">
                    <?php foreach ($stages as $option): ?>
                      <option value="<?= (int) $option['id'] ?>" <?= (int) $option['id'] === $stageId ? 'selected' : '' ?>><?= h((string) $option['name']) ?></option>
                    <?php endforeach; ?>
                  </select>
                </form>
              </article>
            <?php endforeach; ?>
            </div>
          </section>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </main>
  <?php if ($openLead !== null): ?>
    <?php
      $openId = (int) $openLead['id'];
      $openStage = (int) ($openLead['stage_id'] ?? $activeStage);
      $openName = trim((string) ($openLead['name'] ?? ''));
      $openPhone = trim((string) ($openLead['phone'] ?? ''));
      $openEmail = trim((string) ($openLead['email'] ?? ''));
      $openPreference = pcs_preference_label($openLead['preference'] ?? '');
      $openPartial = ($openLead['status'] ?? '') === 'partial';
      $phoneHref = pcs_phone_href($openPhone);
      $whatsapp = pcs_lead_whatsapp($openPhone, $openName);
    ?>
    <a class="backdrop" href="<?= h(pcs_admin_url(['stage' => $activeStage])) ?>" aria-label="Cerrar ficha"></a>
    <section class="drawer" role="dialog" aria-modal="true" aria-labelledby="lead-title">
      <div class="drawer-top">
        <a class="btn ghost small" href="<?= h(pcs_admin_url(['stage' => $activeStage])) ?>">Cerrar</a>
      </div>
      <div class="sheet">
        <div>
          <?php
            $editable = [
                ['name', 'Nombre', $openName, 'Sin nombre', 'text', 80, true],
                ['email', 'Email', $openEmail, 'Añadir email', 'email', 120, false],
                ['phone', 'Teléfono', $openPhone, 'Añadir teléfono', 'tel', 20, false],
            ];
          ?>
          <?php foreach ($editable as [$field, $label, $value, $empty, $type, $max, $isName]): ?>
            <div class="prop<?= $isName ? ' prop-name' : '' ?>">
              <?php if (!$isName): ?><p class="prop-label"><?= h($label) ?></p><?php endif; ?>
              <button type="button" class="prop-value<?= $value === '' ? ' is-empty' : '' ?>" <?= $isName ? 'id="lead-title"' : '' ?> data-edit-field data-value="<?= h($value) ?>"><?= h($value !== '' ? $value : $empty) ?></button>
              <form method="post" class="prop-form" hidden>
                <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
                <input type="hidden" name="action" value="update_lead">
                <input type="hidden" name="field" value="<?= h($field) ?>">
                <input type="hidden" name="lead_id" value="<?= $openId ?>">
                <input type="hidden" name="back_stage" value="<?= (int) $openStage ?>">
                <input type="hidden" name="back_lead" value="<?= $openId ?>">
                <label class="sr" for="edit-<?= h($field) ?>" style="position:absolute;left:-999px"><?= h($label) ?></label>
                <input id="edit-<?= h($field) ?>" name="value" type="<?= h($type) ?>" maxlength="<?= (int) $max ?>" value="<?= h($value) ?>" autocomplete="off">
              </form>
            </div>
          <?php endforeach; ?>
          <div class="quick">
            <?php if ($phoneHref !== ''): ?><a class="btn" data-touch="call" data-lead="<?= $openId ?>" href="<?= h($phoneHref) ?>" aria-label="Llamar" title="Llamar"><?= pcs_activity_icon('call', 18) ?></a><?php endif; ?>
            <?php if ($whatsapp !== ''): ?><a class="btn ghost" data-touch="whatsapp" data-lead="<?= $openId ?>" href="<?= h($whatsapp) ?>" target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp"><?= pcs_activity_icon('whatsapp', 18) ?></a><?php endif; ?>
          </div>
          <div class="prop">
            <p class="prop-label">Franja</p>
            <p class="prop-static"><?= h($openPreference !== '' ? $openPreference : 'Sin franja') ?></p>
          </div>
          <div class="prop">
            <p class="prop-label">Estado</p>
            <p class="prop-static"><?= $openPartial ? 'Solicitud incompleta' : 'Solicitud completa' ?></p>
          </div>
          <div class="prop">
            <p class="prop-label">Se registró</p>
            <p class="prop-static"><?= h(pcs_when((string) $openLead['created_at'])) ?> · <?= h(pcs_origin_label($openLead) === 'Directo' ? 'canal directo' : pcs_origin_label($openLead)) ?></p>
          </div>
        </div>
        <div class="sheet-side">
          <h3>Etapa</h3>
          <div class="stage-picks">
            <?php foreach ($stages as $option): ?>
              <form method="post">
                <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
                <input type="hidden" name="action" value="move_lead">
                <input type="hidden" name="lead_id" value="<?= $openId ?>">
                <input type="hidden" name="stage_id" value="<?= (int) $option['id'] ?>">
                <input type="hidden" name="keep_lead" value="1">
                <button class="btn small<?= (int) $option['id'] === $openStage ? ' is-on' : ' ghost' ?>" type="submit"><?= h((string) $option['name']) ?></button>
              </form>
            <?php endforeach; ?>
          </div>
          <h3>Notas</h3>
          <form method="post" class="composer">
            <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
            <input type="hidden" name="action" value="add_note">
            <input type="hidden" name="lead_id" value="<?= $openId ?>">
            <label for="note-body">Añadir nota</label>
            <textarea id="note-body" name="body" maxlength="2000" required placeholder="Qué has hablado, cuándo vuelve, qué hay que mirar…"></textarea>
            <p><button class="btn" type="submit">Guardar nota</button></p>
          </form>
        </div>
      </div>
      <section class="history">
        <h3>Historial</h3>
        <?php
          $timeline = [[
              'at' => (string) $openLead['created_at'],
              'kind' => 'created',
              'detail' => pcs_origin_label($openLead),
          ]];
          foreach ($notes as $note) {
              $timeline[] = ['at' => (string) $note['created_at'], 'kind' => 'note', 'detail' => (string) $note['body']];
          }
          foreach ($events as $event) {
              if ((string) $event['kind'] === 'note') {
                  continue;
              }
              $timeline[] = [
                  'at' => (string) $event['created_at'],
                  'kind' => (string) $event['kind'],
                  'detail' => (string) ($event['detail'] ?? ''),
              ];
          }
          usort($timeline, static function (array $a, array $b): int {
              return strcmp($b['at'], $a['at']);
          });
          $groups = [];
          foreach ($timeline as $item) {
              $groups[pcs_day_heading((string) $item['at'])][] = $item;
          }
        ?>
        <?php foreach ($groups as $day => $items): ?>
          <p class="day"><?= h($day) ?></p>
          <ol class="activity">
            <?php foreach ($items as $item): ?>
              <?php
                $kind = (string) $item['kind'];
                $detail = trim((string) $item['detail']);
                $title = $kind;
                $sub = '';
                if ($kind === 'created') {
                    $title = 'Se registró';
                    $sub = $detail === '' || $detail === 'Directo' ? 'canal directo' : $detail;
                } elseif ($kind === 'stage') {
                    $title = 'Cambió de etapa';
                    $sub = $detail;
                } elseif ($kind === 'note') {
                    $title = 'Nota';
                    $sub = $detail;
                } elseif ($kind === 'call') {
                    $title = 'Se ha llamado';
                } elseif ($kind === 'whatsapp') {
                    $title = 'Se ha enviado WhatsApp';
                } elseif ($kind === 'edit') {
                    $title = 'Cambió ' . $detail;
                }
              ?>
              <li>
                <div class="rail">
                  <span class="activity-icon"><?= pcs_activity_icon($kind) ?></span>
                  <span class="line"></span>
                </div>
                <div>
                  <strong><?= h($title) ?></strong>
                  <?php if ($sub !== ''): ?><p class="sub"><?= nl2br(h($sub)) ?></p><?php endif; ?>
                </div>
                <time datetime="<?= h((string) $item['at']) ?>"><?= h(pcs_ago((string) $item['at'])) ?></time>
              </li>
            <?php endforeach; ?>
          </ol>
        <?php endforeach; ?>
      </section>
      <div class="danger-row">
        <button type="button" class="btn danger" data-ask-delete>Eliminar lead</button>
      </div>
      <div class="confirm" hidden>
        <div class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <h2 id="delete-title">¿Eliminar este lead?</h2>
          <p>Se borrarán los datos de <?= h($openName !== '' ? $openName : 'este lead') ?>, las notas y el historial. No se puede deshacer.</p>
          <form method="post" class="confirm-actions">
            <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
            <input type="hidden" name="action" value="delete_lead">
            <input type="hidden" name="lead_id" value="<?= $openId ?>">
            <input type="hidden" name="back_stage" value="<?= (int) $openStage ?>">
            <button type="button" class="btn ghost" data-cancel-delete>Cancelar</button>
            <button class="btn danger" type="submit">Eliminar</button>
          </form>
        </div>
      </div>
    </section>
  <?php endif; ?>
  <script>
    const filter = document.getElementById("filter");
    if (filter) {
      filter.addEventListener("input", () => {
        const needle = filter.value.trim().toLowerCase();
        document.querySelectorAll("[data-search]").forEach((card) => {
          const haystack = card.getAttribute("data-search") || "";
          card.hidden = needle !== "" && !haystack.includes(needle);
        });
      });
    }
    document.querySelectorAll("[data-edit-stage]").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = document.getElementById(button.getAttribute("aria-controls") || "");
        if (!panel) return;
        const open = !panel.classList.contains("is-open");
        document.querySelectorAll(".edit.is-open").forEach((el) => el.classList.remove("is-open"));
        document.querySelectorAll("[data-edit-stage]").forEach((el) => el.setAttribute("aria-expanded", "false"));
        if (open) {
          panel.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
    document.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => {
        const form = document.getElementById(button.getAttribute("aria-controls") || "");
        if (!form) return;
        const open = !form.classList.contains("is-open");
        document.querySelectorAll(".move.is-open").forEach((el) => el.classList.remove("is-open"));
        document.querySelectorAll("[data-move]").forEach((el) => el.setAttribute("aria-expanded", "false"));
        if (open) {
          form.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
          form.querySelector("select")?.focus();
        }
      });
    });
    document.querySelectorAll("[data-lead]").forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("a, button, input, select, textarea, label, .drag")) return;
        const link = card.querySelector(".lead-main");
        if (link) window.location.href = link.href;
      });
    });
    document.querySelectorAll("[data-touch]").forEach((link) => {
      link.addEventListener("click", () => {
        const params = new URLSearchParams();
        params.set("csrf", document.querySelector("input[name=csrf]")?.value || "");
        params.set("action", "log_touch");
        params.set("ajax", "1");
        params.set("lead_id", link.getAttribute("data-lead") || "");
        params.set("kind", link.getAttribute("data-touch") || "");
        if (navigator.sendBeacon) navigator.sendBeacon("/admin.php", params);
      });
    });
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    if (desktop) {
      const leadIdFrom = (transfer) => {
        const custom = transfer.getData("application/x-pcs-lead");
        const plain = transfer.getData("text/plain");
        const value = custom || plain;
        return /^\d+$/.test(value) ? value : "";
      };
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.setAttribute("aria-hidden", "true");
      const followingId = (node) => {
        let next = node.nextElementSibling;
        while (next && !(next instanceof Element && next.matches("[data-lead]"))) next = next.nextElementSibling;
        return next instanceof Element ? next.getAttribute("data-lead") || "" : "";
      };
      const placeSlot = (column, y) => {
        const body = column.querySelector(".column-body");
        if (!body) return;
        const cards = [...body.querySelectorAll(".lead")].filter((card) => !card.classList.contains("is-dragging"));
        let before = null;
        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          if (y < rect.top + rect.height / 2) {
            before = card;
            break;
          }
        }
        if (before) body.insertBefore(slot, before);
        else body.appendChild(slot);
      };
      document.querySelectorAll("[data-lead]").forEach((card) => {
        card.draggable = true;
        card.addEventListener("dragstart", (event) => {
          if (event.target instanceof Element && event.target.closest("button, input, select, textarea, .quick")) {
            event.preventDefault();
            return;
          }
          const id = card.getAttribute("data-lead") || "";
          event.dataTransfer.setData("application/x-pcs-lead", id);
          event.dataTransfer.setData("text/plain", id);
          event.dataTransfer.effectAllowed = "move";
          card.classList.add("is-dragging");
        });
      });
      document.addEventListener("dragend", () => {
        slot.remove();
        document.querySelectorAll(".is-dragging").forEach((card) => card.classList.remove("is-dragging"));
        document.querySelectorAll(".column.over").forEach((column) => column.classList.remove("over"));
      });
      document.querySelectorAll("[data-stage]").forEach((column) => {
        column.addEventListener("dragover", (event) => {
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
          column.classList.add("over");
          placeSlot(column, event.clientY);
        });
        column.addEventListener("dragleave", (event) => {
          if (event.relatedTarget instanceof Node && column.contains(event.relatedTarget)) return;
          column.classList.remove("over");
        });
        column.addEventListener("drop", (event) => {
          event.preventDefault();
          column.classList.remove("over");
          const leadId = leadIdFrom(event.dataTransfer);
          if (!leadId || !slot.isConnected) return;
          const beforeId = followingId(slot);
          const card = document.querySelector('[data-lead="' + leadId + '"]');
          if (card && column.contains(card) && followingId(card) === beforeId) {
            slot.remove();
            return;
          }
          slot.remove();
          const form = document.createElement("form");
          form.method = "post";
          const fields = {
            csrf: document.querySelector("input[name=csrf]")?.value || "",
            action: "move_lead",
            lead_id: leadId,
            stage_id: column.getAttribute("data-stage") || "",
            back_stage: column.getAttribute("data-stage") || "",
            before_id: beforeId,
            at: beforeId ? "" : "end",
          };
          Object.entries(fields).forEach(([name, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
          });
          document.body.appendChild(form);
          form.submit();
        });
      });
    }
    const askDelete = document.querySelector("[data-ask-delete]");
    const confirmDelete = document.querySelector(".confirm");
    if (askDelete && confirmDelete) {
      const closeDelete = () => {
        confirmDelete.hidden = true;
      };
      askDelete.addEventListener("click", () => {
        confirmDelete.hidden = false;
        confirmDelete.querySelector("[data-cancel-delete]")?.focus();
      });
      confirmDelete.addEventListener("click", (event) => {
        if (event.target === confirmDelete) closeDelete();
      });
      confirmDelete.querySelector("[data-cancel-delete]")?.addEventListener("click", closeDelete);
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !confirmDelete.hidden) {
          event.preventDefault();
          closeDelete();
        }
      });
    }
    document.querySelectorAll("[data-edit-field]").forEach((button) => {
      const form = button.parentElement?.querySelector("form");
      const input = form?.querySelector("input[name=value]");
      if (!form || !input) return;
      let skip = false;
      let saving = false;
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", () => {
        button.hidden = true;
        form.hidden = false;
        setTimeout(() => {
          input.focus();
          input.select();
        }, 0);
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          input.blur();
          return;
        }
        if (event.key !== "Escape") return;
        skip = true;
        input.value = button.getAttribute("data-value") || "";
        form.hidden = true;
        button.hidden = false;
        button.focus();
      });
      input.addEventListener("blur", () => {
        if (skip || saving) {
          skip = false;
          return;
        }
        if (input.value.trim() === (button.getAttribute("data-value") || "")) {
          form.hidden = true;
          button.hidden = false;
          return;
        }
        saving = true;
        form.submit();
      });
    });
  </script>
<?php endif; ?>
</body>
</html>

<?php
declare(strict_types=1);

if (basename((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === 'lib.php') {
    http_response_code(404);
    exit;
}

function pcs_config_path(): string
{
    $candidates = [
        dirname(__DIR__) . '/config.local.php',
        __DIR__ . '/config.local.php',
    ];
    foreach ($candidates as $path) {
        if (is_file($path)) {
            return $path;
        }
    }
    return $candidates[0];
}

function pcs_config(): array
{
    $path = pcs_config_path();
    if (!is_file($path)) {
        return [];
    }
    $config = include $path;
    return is_array($config) ? $config : [];
}

function pcs_save_config(array $config): bool
{
    $path = pcs_config_path();
    $php = "<?php\ndeclare(strict_types=1);\nreturn " . var_export($config, true) . ";\n";
    return file_put_contents($path, $php) !== false;
}

function pcs_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $config = pcs_config();
    $host = (string) ($config['db_host'] ?? '');
    $name = (string) ($config['db_name'] ?? '');
    $user = (string) ($config['db_user'] ?? '');
    $pass = (string) ($config['db_pass'] ?? '');
    $port = (int) ($config['db_port'] ?? 3306);
    if ($host === '' || $name === '' || $user === '') {
        throw new RuntimeException('database not configured');
    }
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    try {
        $pdo->exec("SET time_zone = 'Europe/Madrid'");
    } catch (Throwable) {
        try {
            $pdo->exec("SET time_zone = '+01:00'");
        } catch (Throwable) {
        }
    }
    return $pdo;
}

function pcs_client_ip(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0';
}

function pcs_rate_limit(string $bucket, int $max, int $window): bool
{
    $dir = sys_get_temp_dir() . '/pcs-fisioterapia-rate';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        return true;
    }
    $file = $dir . '/' . hash('sha256', $bucket) . '.json';
    $now = time();
    $handle = fopen($file, 'c+');
    if ($handle === false) {
        return true;
    }
    try {
        if (!flock($handle, LOCK_EX)) {
            return true;
        }
        $raw = stream_get_contents($handle);
        $decoded = json_decode($raw === false ? '' : $raw, true);
        $hits = [];
        if (is_array($decoded)) {
            foreach ($decoded as $stamp) {
                if (is_int($stamp) && $stamp > $now - $window) {
                    $hits[] = $stamp;
                }
            }
        }
        if (count($hits) >= $max) {
            return false;
        }
        $hits[] = $now;
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($hits));
        fflush($handle);
        return true;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function pcs_same_origin(): bool
{
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    $host = preg_replace('/:\d+$/', '', $host) ?? $host;
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin === '') {
        return false;
    }
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    return $originHost !== '' && $originHost === $host;
}

function pcs_json(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function pcs_normalize_phone(string $value): ?string
{
    $digits = preg_replace('/[^\d+]/', '', $value) ?? '';
    if (str_starts_with($digits, '+')) {
        $digits = substr($digits, 1);
    }
    if (str_starts_with($digits, '00')) {
        $digits = substr($digits, 2);
    }
    if (preg_match('/^[6-9]\d{8}$/', $digits) === 1) {
        $digits = '34' . $digits;
    }
    if (preg_match('/^34[6-9]\d{8}$/', $digits) !== 1) {
        return null;
    }
    return '+' . $digits;
}

function pcs_valid_name(mixed $value): ?string
{
    $name = preg_replace('/\s+/u', ' ', trim((string) ($value ?? ''))) ?? '';
    if (mb_strlen($name) < 2 || mb_strlen($name) > 80 || preg_match("/^[\\p{L}][\\p{L}\\s.'’\\-]*$/u", $name) !== 1) {
        return null;
    }
    return $name;
}

function pcs_parse_email_field(mixed $value): array
{
    $emailRaw = strtolower(trim((string) ($value ?? '')));
    if ($emailRaw === '') {
        return ['ok' => true, 'email' => null];
    }
    if (strlen($emailRaw) > 120 || filter_var($emailRaw, FILTER_VALIDATE_EMAIL) === false) {
        return ['ok' => false, 'error' => 'email'];
    }
    return ['ok' => true, 'email' => $emailRaw];
}

function pcs_clean_page(mixed $page): ?string
{
    if (!is_string($page) || strlen($page) > 180 || preg_match('#^/[a-z0-9/-]*$#', $page) !== 1) {
        return null;
    }
    return $page;
}

function pcs_parse_preference(mixed $value): ?string
{
    return $value === 'morning' || $value === 'afternoon' ? $value : null;
}

function pcs_parse_lead(array $body): array
{
    if (($body['consent'] ?? null) !== true) {
        return ['ok' => false, 'error' => 'consent'];
    }
    $locale = $body['locale'] ?? null;
    if ($locale !== 'ca' && $locale !== 'es') {
        return ['ok' => false, 'error' => 'locale'];
    }
    $name = pcs_valid_name($body['name'] ?? null);
    if ($name === null) {
        return ['ok' => false, 'error' => 'name'];
    }
    $phone = pcs_normalize_phone((string) ($body['phone'] ?? ''));
    if ($phone === null) {
        return ['ok' => false, 'error' => 'phone'];
    }
    $email = pcs_parse_email_field($body['email'] ?? null);
    if ($email['ok'] !== true) {
        return ['ok' => false, 'error' => 'email'];
    }
    return [
        'ok' => true,
        'lead' => [
            'name' => $name,
            'phone' => $phone,
            'email' => $email['email'],
            'locale' => $locale,
            'page' => pcs_clean_page($body['page'] ?? null),
        ],
    ];
}

function pcs_new_resume_token(): array
{
    $token = bin2hex(random_bytes(32));
    return ['token' => $token, 'hash' => hash('sha256', $token)];
}

function pcs_lead_text(mixed $value): string
{
    return trim((string) ($value ?? ''));
}

function pcs_lead_for_update(PDO $db, array $body): array
{
    $raw = $body['id'] ?? null;
    $token = $body['token'] ?? null;
    $id = is_int($raw) ? $raw : (is_string($raw) && preg_match('/^[1-9]\d*$/', $raw) === 1 ? (int) $raw : 0);
    if ($id < 1 || $id > 1000000000 || !is_string($token) || preg_match('/^[a-f0-9]{64}$/', $token) !== 1) {
        return ['ok' => false, 'error' => 'lead'];
    }
    $statement = $db->prepare('SELECT id, name, phone, preference, resume_token FROM leads WHERE id = :id');
    $statement->execute([':id' => $id]);
    $row = $statement->fetch();
    $stored = is_array($row) ? (string) ($row['resume_token'] ?? '') : '';
    $hash = hash('sha256', $token);
    if (!is_array($row) || strlen($stored) !== 64 || !hash_equals($stored, $hash)) {
        return ['ok' => false, 'error' => 'lead'];
    }
    return ['ok' => true, 'lead' => $row, 'id' => $id, 'token' => $token];
}

function pcs_tracking_text(mixed $value, int $max): ?string
{
    if (!is_string($value)) {
        return null;
    }
    $value = trim((string) (preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? ''));
    if ($value === '') {
        return null;
    }
    if (mb_strlen($value) > $max) {
        $value = mb_substr($value, 0, $max);
    }
    return $value;
}

function pcs_parse_attribution(array $body): array
{
    $landing = pcs_tracking_text($body['landing_url'] ?? null, 500);
    if ($landing === null || !str_starts_with($landing, '/') || str_starts_with($landing, '//') || str_contains($landing, '://')) {
        $landing = null;
    }
    $referrer = null;
    $referrerRaw = pcs_tracking_text($body['referrer'] ?? null, 500);
    if ($referrerRaw !== null && preg_match('#^https?://#i', $referrerRaw) === 1) {
        $parts = parse_url($referrerRaw);
        if (is_array($parts) && isset($parts['host']) && is_string($parts['host']) && $parts['host'] !== '') {
            $scheme = strtolower((string) ($parts['scheme'] ?? 'https')) === 'http' ? 'http' : 'https';
            $referrer = $scheme . '://' . $parts['host'];
            if (isset($parts['port'])) {
                $referrer .= ':' . (int) $parts['port'];
            }
            $referrer .= ($parts['path'] ?? '') . (isset($parts['query']) ? '?' . $parts['query'] : '');
            $referrer = pcs_tracking_text($referrer, 500);
        }
    }
    $fields = [
        'utm_source' => 120,
        'utm_medium' => 120,
        'utm_campaign' => 180,
        'utm_term' => 180,
        'utm_content' => 180,
        'gclid' => 200,
        'fbclid' => 200,
        'gbraid' => 200,
        'wbraid' => 200,
        'msclkid' => 200,
        'ttclid' => 200,
    ];
    $attribution = [
        'referrer' => $referrer,
        'landing_url' => $landing,
    ];
    foreach ($fields as $name => $max) {
        $attribution[$name] = pcs_tracking_text($body[$name] ?? null, $max);
    }
    return $attribution;
}

function pcs_ensure_attribution(PDO $db): void
{
    $columns = [
        'referrer' => 'VARCHAR(500) NULL',
        'landing_url' => 'VARCHAR(500) NULL',
        'utm_source' => 'VARCHAR(120) NULL',
        'utm_medium' => 'VARCHAR(120) NULL',
        'utm_campaign' => 'VARCHAR(180) NULL',
        'utm_term' => 'VARCHAR(180) NULL',
        'utm_content' => 'VARCHAR(180) NULL',
        'gclid' => 'VARCHAR(200) NULL',
        'fbclid' => 'VARCHAR(200) NULL',
        'gbraid' => 'VARCHAR(200) NULL',
        'wbraid' => 'VARCHAR(200) NULL',
        'msclkid' => 'VARCHAR(200) NULL',
        'ttclid' => 'VARCHAR(200) NULL',
    ];
    $existing = [];
    foreach ($db->query('SHOW COLUMNS FROM `leads`')->fetchAll() as $row) {
        $existing[(string) ($row['Field'] ?? '')] = true;
    }
    foreach ($columns as $name => $definition) {
        if (!isset($existing[$name])) {
            $db->exec('ALTER TABLE leads ADD COLUMN `' . $name . '` ' . $definition);
        }
    }
}

function pcs_column_exists(PDO $db, string $table, string $column): bool
{
    if (preg_match('/^[A-Za-z0-9_]+$/', $table) !== 1 || preg_match('/^[A-Za-z0-9_]+$/', $column) !== 1) {
        return false;
    }
    foreach ($db->query('SHOW COLUMNS FROM `' . $table . '`')->fetchAll() as $row) {
        if (($row['Field'] ?? '') === $column) {
            return true;
        }
    }
    return false;
}

function pcs_make_nullable(PDO $db, string $column, string $fallback): void
{
    if (preg_match('/^[A-Za-z0-9_]+$/', $column) !== 1) {
        return;
    }
    $meta = null;
    foreach ($db->query('SHOW COLUMNS FROM `leads`')->fetchAll() as $row) {
        if (($row['Field'] ?? '') === $column) {
            $meta = $row;
            break;
        }
    }
    if ($meta === null || strtoupper((string) ($meta['Null'] ?? '')) === 'YES') {
        return;
    }
    $type = strtolower((string) ($meta['Type'] ?? ''));
    if (preg_match('/^(varchar|char)\(\d+\)$/', $type) !== 1) {
        $type = $fallback;
    }
    $db->exec('ALTER TABLE `leads` MODIFY `' . $column . '` ' . $type . ' NULL');
}

function pcs_ensure_wizard(PDO $db): void
{
    if (!pcs_column_exists($db, 'leads', 'preference')) {
        $db->exec('ALTER TABLE leads ADD COLUMN preference VARCHAR(16) NULL');
    }
    if (!pcs_column_exists($db, 'leads', 'status')) {
        $db->exec("ALTER TABLE leads ADD COLUMN status VARCHAR(16) NOT NULL DEFAULT 'complete'");
    }
    if (!pcs_column_exists($db, 'leads', 'resume_token')) {
        $db->exec('ALTER TABLE leads ADD COLUMN resume_token VARCHAR(64) NULL');
    }
    pcs_make_nullable($db, 'name', 'varchar(80)');
    pcs_make_nullable($db, 'phone', 'varchar(20)');
}

function pcs_ensure_crm(PDO $db): void
{
    $db->exec(
        'CREATE TABLE IF NOT EXISTS stages (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(40) NOT NULL,
            position INT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY stages_position_idx (position)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    $db->exec(
        'CREATE TABLE IF NOT EXISTS lead_notes (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            lead_id BIGINT UNSIGNED NOT NULL,
            body VARCHAR(2000) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY lead_notes_lead_idx (lead_id, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    if (!pcs_column_exists($db, 'leads', 'stage_id')) {
        $db->exec('ALTER TABLE leads ADD COLUMN stage_id INT UNSIGNED NULL, ADD KEY leads_stage_idx (stage_id)');
    }
    pcs_ensure_attribution($db);
    pcs_ensure_wizard($db);
    $count = (int) $db->query('SELECT COUNT(*) FROM stages')->fetchColumn();
    if ($count === 0) {
        $seed = ['Nuevo', 'Contactado', 'Cita', 'Seguimiento', 'Cerrado'];
        $insert = $db->prepare('INSERT INTO stages (name, position) VALUES (?, ?)');
        foreach ($seed as $position => $name) {
            $insert->execute([$name, $position]);
        }
    }
    $first = $db->query('SELECT id FROM stages ORDER BY position ASC, id ASC LIMIT 1')->fetchColumn();
    if ($first !== false) {
        $assign = $db->prepare('UPDATE leads SET stage_id = ? WHERE stage_id IS NULL');
        $assign->execute([(int) $first]);
    }
}

function pcs_whatsapp(string $locale, string $name): string
{
    // Número público de la consulta: +34 672 12 04 39.
    $digits = '34672120439';
    $safe = mb_substr(str_replace(["\r", "\n"], ' ', $name), 0, 80);
    $text = $locale === 'ca'
        ? "Hola Pol, sóc {$safe}. Acabo de demanar hora a pcsfisioterapia.com."
        : "Hola Pol, soy {$safe}. Acabo de pedir cita en pcsfisioterapia.com.";
    return 'https://wa.me/' . $digits . '?text=' . rawurlencode($text);
}

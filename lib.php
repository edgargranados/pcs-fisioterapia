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

function pcs_json(int $status, array $body): void
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

function pcs_parse_lead(array $body): array
{
    if (($body['consent'] ?? null) !== true) {
        return ['ok' => false, 'error' => 'consent'];
    }
    $locale = $body['locale'] ?? null;
    if ($locale !== 'ca' && $locale !== 'es') {
        return ['ok' => false, 'error' => 'locale'];
    }
    $name = preg_replace('/\s+/u', ' ', trim((string) ($body['name'] ?? ''))) ?? '';
    if (mb_strlen($name) < 2 || mb_strlen($name) > 80 || preg_match("/^[\\p{L}][\\p{L}\\s.'’\\-]*$/u", $name) !== 1) {
        return ['ok' => false, 'error' => 'name'];
    }
    $phone = pcs_normalize_phone((string) ($body['phone'] ?? ''));
    if ($phone === null) {
        return ['ok' => false, 'error' => 'phone'];
    }
    $emailRaw = strtolower(trim((string) ($body['email'] ?? '')));
    $email = null;
    if ($emailRaw !== '') {
        if (strlen($emailRaw) > 120 || filter_var($emailRaw, FILTER_VALIDATE_EMAIL) === false) {
            return ['ok' => false, 'error' => 'email'];
        }
        $email = $emailRaw;
    }
    $page = $body['page'] ?? null;
    $cleanPage = null;
    if (is_string($page) && strlen($page) <= 180 && preg_match('#^/[a-z0-9/-]*$#', $page) === 1) {
        $cleanPage = $page;
    }
    return [
        'ok' => true,
        'lead' => [
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'locale' => $locale,
            'page' => $cleanPage,
        ],
    ];
}

function pcs_whatsapp(string $locale, string $name): string
{
    $digits = preg_replace('/\D/', '', (string) (pcs_config()['whatsapp'] ?? '')) ?? '';
    if (str_starts_with($digits, '00')) {
        $digits = substr($digits, 2);
    }
    if (preg_match('/^[6-9]\d{8}$/', $digits) === 1) {
        $digits = '34' . $digits;
    }
    if (preg_match('/^34[6-9]\d{8}$/', $digits) !== 1) {
        return '';
    }
    $safe = mb_substr(str_replace(["\r", "\n"], ' ', $name), 0, 80);
    $text = $locale === 'ca'
        ? "Hola Pol, sóc {$safe}. Acabo de demanar hora a pcsfisioterapia.com."
        : "Hola Pol, soy {$safe}. Acabo de pedir cita en pcsfisioterapia.com.";
    return 'https://wa.me/' . $digits . '?text=' . rawurlencode($text);
}

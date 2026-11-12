<?php
declare(strict_types=1);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(404);
    exit;
}

$token = (string) ($_SERVER['HTTP_X_SETUP_TOKEN'] ?? '');
if (!hash_equals('c79b9c5e8cd18117f1d83f7c1c71f7ac38258e6ff5519679', $token)) {
    http_response_code(404);
    exit;
}

$body = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo '{"ok":false,"error":"body"}';
    exit;
}

$config = [
    'db_host' => (string) ($body['db_host'] ?? ''),
    'db_name' => (string) ($body['db_name'] ?? ''),
    'db_user' => (string) ($body['db_user'] ?? ''),
    'db_pass' => (string) ($body['db_pass'] ?? ''),
    'db_port' => 3306,
    'whatsapp' => (string) ($body['whatsapp'] ?? ''),
    'admin_password_hash' => (string) ($body['admin_password_hash'] ?? ''),
];

if ($config['db_host'] === '' || $config['db_name'] === '' || $config['db_user'] === '' || $config['db_pass'] === '') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo '{"ok":false,"error":"fields"}';
    exit;
}

$php = "<?php\ndeclare(strict_types=1);\nreturn " . var_export($config, true) . ";\n";
$candidates = [
    dirname(__DIR__) . '/config.local.php',
    __DIR__ . '/config.local.php',
];
$written = '';
$tried = [];
foreach ($candidates as $path) {
    $dir = dirname($path);
    if (!is_dir($dir) || !is_writable($dir)) {
        $tried[] = is_dir($dir) ? 'locked' : 'missing';
        continue;
    }
    if (file_put_contents($path, $php) === false) {
        $tried[] = 'failed';
        continue;
    }
    $written = $path;
    break;
}

$result = [
    'ok' => $written !== '',
    'place' => $written === '' ? '' : ($written === $candidates[0] ? 'home' : 'www'),
    'tried' => $tried,
];

if ($written !== '') {
    try {
        $pdo = new PDO(
            'mysql:host=' . $config['db_host'] . ';port=3306;dbname=' . $config['db_name'] . ';charset=utf8mb4',
            $config['db_user'],
            $config['db_pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS leads (
              id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(80) NOT NULL,
              phone VARCHAR(20) NOT NULL,
              email VARCHAR(120) NULL,
              locale VARCHAR(2) NOT NULL,
              page VARCHAR(180) NULL,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              KEY leads_created_at_idx (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
        $pdo->beginTransaction();
        $pdo->prepare('INSERT INTO leads (name, phone, email, locale, page) VALUES (?, ?, NULL, ?, ?)')
            ->execute(['Prueba', '600000000', 'ca', '/']);
        $id = $pdo->lastInsertId();
        $pdo->prepare('DELETE FROM leads WHERE id = ?')->execute([$id]);
        $pdo->commit();
        $result['database'] = true;
    } catch (Throwable $e) {
        if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        $result['database'] = false;
        $result['sqlstate'] = (string) $e->getCode();
    }
}

header('Content-Type: application/json');
echo json_encode($result);

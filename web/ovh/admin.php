<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

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
    } elseif (!pcs_rate_limit('admin:' . pcs_client_ip(), 8, 15 * 60)) {
        $error = 'Demasiados intentos. Espera un cuarto de hora.';
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
$leads = [];
$dbError = '';
if ($signedIn) {
    try {
        $leads = pcs_db()->query(
            'SELECT id, name, phone, email, locale, page, created_at FROM leads ORDER BY created_at DESC LIMIT 200'
        )->fetchAll();
    } catch (Throwable) {
        $dbError = 'No se ha podido leer la base de datos. Revisa config.local.php y que schema.sql esté importado.';
    }
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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
  <title>Citas · PCS Fisioterapia</title>
  <style>
    body { margin: 0; font: 16px/1.5 system-ui, sans-serif; background: #f6f3ec; color: #1c211c; }
    main { max-width: 960px; margin: 0 auto; padding: 32px 20px 64px; }
    h1 { font-weight: 500; font-size: 2rem; }
    form, .card { background: white; border: 1px solid #ddd4c6; border-radius: 16px; padding: 20px; }
    input { width: 100%; box-sizing: border-box; height: 44px; border-radius: 10px; border: 1px solid #ccc; padding: 0 12px; }
    button { height: 44px; border: 0; border-radius: 999px; padding: 0 18px; background: #1e4636; color: white; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
    .error { color: #8d2b2b; }
    a { color: #1e4636; }
  </style>
</head>
<body>
<main>
  <h1>Solicitudes de cita</h1>
  <?php if ($hash === ''): ?>
    <p>Falta la contraseña del panel. Crea <code>config.local.php</code> a partir de <code>config.sample.php</code> y pon <code>admin_password_hash</code>.</p>
  <?php elseif (!$signedIn): ?>
    <form method="post" class="card">
      <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
      <label for="password">Contraseña</label>
      <p><input id="password" name="password" type="password" autocomplete="current-password" required></p>
      <?php if ($error !== ''): ?><p class="error"><?= h($error) ?></p><?php endif; ?>
      <button type="submit">Entrar</button>
    </form>
  <?php else: ?>
    <form method="post">
      <input type="hidden" name="csrf" value="<?= h((string) $_SESSION['csrf']) ?>">
      <button type="submit" name="logout" value="1">Salir</button>
    </form>
    <?php if ($dbError !== ''): ?>
      <p class="error"><?= h($dbError) ?></p>
    <?php elseif ($leads === []): ?>
      <p>Todavía no hay solicitudes.</p>
    <?php else: ?>
      <table>
        <thead>
          <tr><th>Fecha</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Idioma</th><th>Página</th></tr>
        </thead>
        <tbody>
          <?php foreach ($leads as $lead): ?>
            <tr>
              <td><?= h((string) $lead['created_at']) ?></td>
              <td><?= h((string) $lead['name']) ?></td>
              <td><a href="tel:<?= h((string) $lead['phone']) ?>"><?= h((string) $lead['phone']) ?></a></td>
              <td><?= h((string) ($lead['email'] ?? '')) ?></td>
              <td><?= h((string) $lead['locale']) ?></td>
              <td><?= h((string) ($lead['page'] ?? '')) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  <?php endif; ?>
</main>
</body>
</html>

<?php
/**
 * Copia este archivo a config.local.php y rellena los datos de la base
 * MySQL del plan Starter de OVH. config.local.php no se sube a git.
 *
 * El hash de la contraseña del panel se genera en tu ordenador:
 *   php -r "echo password_hash('tu-clave', PASSWORD_DEFAULT), PHP_EOL;"
 */
return [
    'db_host' => 'xxxxx.mysql.db',
    'db_name' => 'xxxxx',
    'db_user' => 'xxxxx',
    'db_pass' => '',
    'db_port' => 3306,
    'whatsapp' => '',
    'admin_password_hash' => '',
];

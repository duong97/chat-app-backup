// Set the current environment to true in the env object
var currentEnv = process.env.NODE_ENV || 'development';
exports.appName = "Chat app";
exports.env = {
    production: false,
    staging: false,
    test: false,
    development: false
};
exports.env[currentEnv] = true;
exports.log = {
    path: __dirname + "/var/log/app_#{currentEnv}.log"
};
exports.server = {
    port: 9600,
    // In staging and production, listen loopback. nginx listens on the network.
    ip: '127.0.0.1'
};
if (currentEnv != 'production' && currentEnv != 'staging') {
    exports.enableTests = true;
    // Listen on all IPs in dev/test (for testing from other machines)
    exports.server.ip = '0.0.0.0';
};
exports.db = {
    URL: "postgres://postgres@localhost/chatapp"
};
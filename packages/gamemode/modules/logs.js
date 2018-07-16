var DB = require('./db');

module.exports = {
    Init: function() {
        DB.Handle.query('CREATE TABLE IF NOT EXISTS `logs` (`id` int(11) NOT NULL,`text` varchar(1024) NOT NULL,`type` int(11) NOT NULL,`time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=latin1;', function () {} );
        DB.Handle.query('ALTER TABLE `logs` ADD PRIMARY KEY (`id`);', function () {} );
        DB.Handle.query('ALTER TABLE `logs` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;', function () {} );
    },
    Insert: function (text, type = 0) {
        DB.Handle.query("INSERT INTO logs(text,type) VALUES (?,?)", [text, type], function (e) { if(e) return console.log(e) } );
    }
}
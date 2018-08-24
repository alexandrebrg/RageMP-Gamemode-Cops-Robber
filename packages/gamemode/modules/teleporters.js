const DB = require('./db');
const Labels = require('./labels')

let Teleporters = [];

function loadTP() {
    DB.Handle.query(`SELECT * FROM server_teleporters`, function(e, result){
        if(e) return console.log(e);
        result.forEach(item => {
            i = Teleporters.length;
            Teleporters[i] = mp.markers.new(1, new mp.Vector3(item.from_x, item.from_y, item.from_z-1), 3, {
                color: [255,0,0, 125],
                dimension: item.from_dimension
            });
            T = Teleporters[i]
            T.to = new mp.Vector3(item.to_x, item.to_y, item.to_z);
            T.to_dimension = item.to_dimension;
            T.to_angle = item.to_angle;
            T.veh = item.veh;
            T.teleporter = true;
            T.faction = result.faction;
            Labels.createLabelOffline(item.name, new mp.Vector3(item.from_x, item.from_y, item.from_z), item.from_dimension)
            
            if(item.reverse) {
                // REVERSE
                i = Teleporters.length;
                Teleporters[i] = mp.markers.new(1, new mp.Vector3(item.to_x, item.to_y, item.to_z-1), 3, {
                    color: [255,0,0,125],
                    dimension: item.to_dimension
                });
                T = Teleporters[i];
                T.to = new mp.Vector3(item.from_x, item.from_y, item.from_z);
                T.to_dimension = item.from_dimension;
                T.veh = item.veh;
                T.teleporter = true;
                T.faction = result.faction;
                Labels.createLabelOffline(item.name, new mp.Vector3(item.to_x, item.to_y, item.to_z), item.to_dimension)

            }

            
        });

    });  
}

module.exports.Init = function() {
    DB.Handle.query(`CREATE TABLE IF NOT EXISTS server_teleporters (
        id int NOT NULL,
        name varchar(24) NOT NULL,
        from_x float NOT NULL,
        from_y float NOT NULL,
        from_z float NOT NULL,
        from_angle float NOT NULL,
        from_dimension int NOT NULL,
        to_x float NOT NULL,
        to_y float NOT NULL,
        to_z float NOT NULL,
        to_dimension int NULL,
        to_angle float NULL,
        veh int NOT NULL DEFAULT 0,
        reverse int NOT NULL DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`, function() { } );
    DB.Handle.query("ALTER TABLE `server_teleporters` ADD PRIMARY KEY (`id`);", function() { } );
    DB.Handle.query("ALTER TABLE `server_teleporters` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;", function() { } );
    loadTP();
}

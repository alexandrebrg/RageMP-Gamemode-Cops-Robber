const Config = require('../data/config.json')


class GamePOI {

    constructor(position, scale = 1, options = {}) {
        this.position = position;
        this.scale = scale;
        this.options = options;
    }
    /**
     * Initiate marker
     */
    createMarker(markerType = 1, argumentse = {}) {
        this.markerType = 1;
        this.markerArguments = argumentse;
        this.marker = mp.markers.new( markerType, {x: this.position.x, y: this.position.y, z: this.position.z -1}, this.scale, this.markerArguments);

        for(var obj in this.options) {
            this.marker[obj] = this.options[obj];
        }
    }
    
    /**
     * Create colshape
     */
    createColshape(shape, autoActivate = false, action, ...args) {
        this.colshapeShape = shape;
        switch(shape) {
            case "sphere":
                this.colshape = mp.colshapes.newSphere(this.position.x, this.position.y, this.position.z-1, this.scale);
                break;
            case "tube":
                this.colshapeHeight = args[0];
                this.colshape = mp.colshapes.newTube(this.position.x, this.position.y, this.position.z-1, this.scale, this.colshapeHeight);
                break;

            case "rectangle":
                this.colshapeWidth = args[0];
                this.colshapeHeight = args[1];
                this.colshape = mp.colshapes.newRectangle(this.position.x, this.position.y, this.colshapeWidth, this.colshapeHeight);
                break;
            
            case "circle":
            default:
                this.colshape = mp.colshapes.newCircle(this.position.x, this.position.y, this.scale-0.5);
                shape !== "circle" ? console.log("Colshape not valid!") : true;
                break;
        }
        for(var obj in this.options) {
            this.colshape[obj] = this.options[obj];
        }
        this.colshape.autoActivate = autoActivate;
        this.colshape.action = action;
        if(this.marker)
            this.colshape.markerID = this.marker.id;
    }

    /**
     * Create Label for it
     */
    createBlip(blipID, blipColor, blipText, dimension = Config.defaultDimension) {
        this.blipID = blipID;
        this.blipColor = blipColor;
        this.blipText = blipText;
        this.blip = mp.blips.new(this.blipID, this.position, {
            dimension: dimension,
            color: this.blipColor,
            name: this.blipText
        });

    }
}
    
module.exports = GamePOI;

mp.events.add("playerEnterColshape", (player, shape) => {
    player.colshapeTimeout = setTimeout(() => player.colshapeTimeout = false, 5000);
    if(shape.autoActivate && !player.colshapeTimeout) 
        return mp.events.call(shape.action, player, shape.markerID);
});

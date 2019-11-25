﻿import * as extend from 'extend';
import {SystemBoard, byteValueMap, ConfigQueue, ConfigRequest, BodyCommands, PumpCommands, SystemCommands, CircuitCommands, FeatureCommands, ChemistryCommands, EquipmentIds, EquipmentIdRange, HeaterCommands, ScheduleCommands} from './SystemBoard';
import {PoolSystem, Body, Pump, sys, ConfigVersion, Heater, Schedule, EggTimer} from '../Equipment';
import {Protocol, Outbound, Message, Response} from '../comms/messages/Messages';
import {state, ChlorinatorState, CommsState, State} from '../State';
import {logger} from '../../logger/Logger';
import {conn} from '../comms/Comms';
export class EasyTouchBoard extends SystemBoard {
    constructor(system: PoolSystem) {
        super(system);
        this.equipmentIds.features = new EquipmentIdRange(() => {return sys.equipment.maxCircuits + 1;}, () => {return this.equipmentIds.features.start + sys.equipment.maxFeatures + 3;});
        this.equipmentIds.virtualCircuits = new EquipmentIdRange(() => { return 128;}, () => {return 136;});
        this.valueMaps.circuitNames = new byteValueMap([
            [0, {name: 'notused', desc: 'Not Used'}],
            [1, {name: 'aerator', desc: 'Aerator'}],
            [2, {name: 'airblower', desc: 'Air Blower'}],
            [3, {name: 'aux1', desc: 'AUX 1'}],
            [4, {name: 'aux2', desc: 'AUX 2'}],
            [5, {name: 'aux3', desc: 'AUX 3'}],
            [6, {name: 'aux4', desc: 'AUX 4'}],
            [7, {name: 'aux5', desc: 'AUX 5'}],
            [8, {name: 'aux6', desc: 'AUX 6'}],
            [9, {name: 'aux7', desc: 'AUX 7'}],
            [10, {name: 'aux8', desc: 'AUX 8'}],
            [11, {name: 'aux9', desc: 'AUX 9'}],
            [12, {name: 'auk10', desc: 'AUX 10'}],
            [13, {name: 'backwash', desc: 'Backwash'}],
            [14, {name: 'backlight', desc: 'Back Light'}],
            [15, {name: 'bbqlight', desc: 'BBQ Light'}],
            [16, {name: 'beachlight', desc: 'Beach Light'}],
            [17, {name: 'boosterpump', desc: 'Booster Pump'}],
            [18, {name: 'buglight', desc: 'But Light'}],
            [19, {name: 'cabanalts', desc: 'Cabana Lights'}],
            [20, {name: 'chem.feeder', desc: 'Chemical Feeder'}],
            [21, {name: 'chlorinator', desc: 'Chlorinator'}],
            [22, {name: 'cleaner', desc: 'Cleaner'}],
            [23, {name: 'colorwheel', desc: 'Color Wheel'}],
            [24, {name: 'decklight', desc: 'Deck Light'}],
            [25, {name: 'drainline', desc: 'Drain Line'}],
            [26, {name: 'drivelight', desc: 'Drive Light'}],
            [27, {name: 'edgepump', desc: 'Edge Pump'}],
            [28, {name: 'entrylight', desc: 'Entry Light'}],
            [29, {name: 'fan', desc: 'Fan'}],
            [30, {name: 'fiberoptic', desc: 'Fiber Optic'}],
            [31, {name: 'fiberworks', desc: 'Fiber Works'}],
            [32, {name: 'fillline', desc: 'Fill Line'}],
            [33, {name: 'floorclnr', desc: 'Floor CLeaner'}],
            [34, {name: 'fogger', desc: 'Fogger'}],
            [35, {name: 'fountain', desc: 'Fountain'}],
            [36, {name: 'fountain1', desc: 'Fountain 1'}],
            [37, {name: 'fountain2', desc: 'Fountain 2'}],
            [38, {name: 'fountain3', desc: 'Fountain 3'}],
            [39, {name: 'fountains', desc: 'Fountains'}],
            [40, {name: 'frontlight', desc: 'DFront Light'}],
            [41, {name: 'gardenlts', desc: 'Garden Lights'}],
            [42, {name: 'gazebolts', desc: 'Gazebo Lights'}],
            [43, {name: 'highspeed', desc: 'High Speed'}],
            [44, {name: 'hi-temp', desc: 'Hi-Temp'}],
            [45, {name: 'houselight', desc: 'House Light'}],
            [46, {name: 'jets', desc: 'Jets'}],
            [47, {name: 'lights', desc: 'Lights'}],
            [48, {name: 'lowspeed', desc: 'Low Speed'}],
            [49, {name: 'lo-temp', desc: 'Lo-Temp'}],
            [50, {name: 'malibults', desc: 'Malibu Lights'}],
            [51, {name: 'mist', desc: 'Mist'}],
            [52, {name: 'music', desc: 'Music'}],
            [53, {name: 'notused', desc: 'Not Used'}],
            [54, {name: 'ozonator', desc: 'Ozonator'}],
            [55, {name: 'pathlightn', desc: 'Path Lights'}],
            [56, {name: 'patiolts', desc: 'Patio Lights'}],
            [57, {name: 'perimeterl', desc: 'Permiter Light'}],
            [58, {name: 'pg2000', desc: 'PG2000'}],
            [59, {name: 'pondlight', desc: 'Pond Light'}],
            [60, {name: 'poolpump', desc: 'Pool Pump'}],
            [61, {name: 'pool', desc: 'Pool'}],
            [62, {name: 'poolhigh', desc: 'Pool High'}],
            [63, {name: 'poollight', desc: 'Pool Light'}],
            [64, {name: 'poollow', desc: 'Pool Low'}],
            [65, {name: 'sam', desc: 'SAM'}],
            [66, {name: 'poolsam1', desc: 'Pool SAM 1'}],
            [67, {name: 'poolsam2', desc: 'Pool SAM 2'}],
            [68, {name: 'poolsam3', desc: 'Pool SAM 3'}],
            [69, {name: 'securitylt', desc: 'Security Light'}],
            [70, {name: 'slide', desc: 'Slide'}],
            [71, {name: 'solar', desc: 'Solar'}],
            [72, {name: 'spa', desc: 'Spa'}],
            [73, {name: 'spahigh', desc: 'Spa High'}],
            [74, {name: 'spalight', desc: 'Spa Light'}],
            [75, {name: 'spalow', desc: 'Spa Low'}],
            [76, {name: 'spasal', desc: 'Spa SAL'}],
            [77, {name: 'spasam', desc: 'Spa SAM'}],
            [78, {name: 'spawtrfll', desc: 'Spa Waterfall'}],
            [79, {name: 'spillway', desc: 'Spillway'}],
            [80, {name: 'sprinklers', desc: 'Sprinklers'}],
            [81, {name: 'stream', desc: 'Stream'}],
            [82, {name: 'statuelt', desc: 'Statue Light'}],
            [83, {name: 'swimjets', desc: 'Swim Jets'}],
            [84, {name: 'wtrfeature', desc: 'Water Feature'}],
            [85, {name: 'wtrfeatlt', desc: 'Water Feature Light'}],
            [86, {name: 'waterfall', desc: 'Waterfall'}],
            [87, {name: 'waterfall1', desc: 'Waterfall 1'}],
            [88, {name: 'waterfall2', desc: 'Waterfall 2'}],
            [89, {name: 'waterfall3', desc: 'Waterfall 3'}],
            [90, {name: 'whirlpool', desc: 'Whirlpool'}],
            [91, {name: 'wtrflght', desc: 'Waterfall Light'}],
            [92, {name: 'yardlight', desc: 'Yard Light'}],
            [93, {name: 'auxextra', desc: 'AUX EXTRA'}],
            [94, {name: 'feature1', desc: 'Feature 1'}],
            [95, {name: 'feature2', desc: 'Feature 2'}],
            [96, {name: 'feature3', desc: 'Feature 3'}],
            [97, {name: 'feature4', desc: 'Feature 4'}],
            [98, {name: 'feature5', desc: 'Feature 5'}],
            [99, {name: 'feature6', desc: 'Feature 6'}],
            [100, {name: 'feature7', desc: 'Feature 7'}],
            [101, {name: 'feature8', desc: 'Feature 8'}]
        ]);
        this.valueMaps.circuitFunctions = new byteValueMap([
            [0, {name: 'generic', desc: 'Generic'}],
            [1, {name: 'spa', desc: 'Spa'}],
            [2, {name: 'pool', desc: 'Pool'}],
            [5, {name: 'mastercleaner', desc: 'Master Cleaner'}],
            [7, {name: 'light', desc: 'Light'}],
            [9, {name: 'samlight', desc: 'SAM Light'}],
            [10, {name: 'sallight', desc: 'SAL Light'}],
            [11, {name: 'photongen', desc: 'Photon Gen'}],
            [12, {name: 'colorwheel', desc: 'Color Wheer'}],
            [13, {name: 'valve', desc: 'Valve'}],
            [14, {name: 'spillway', desc: 'Spillway'}],
            [15, {name: 'floorcleaner', desc: 'Floor Cleaner'}],
            [16, {name: 'intellibrite', desc: 'Intellibrite'}],
            [17, {name: 'magicstream', desc: 'Magicstream'}],
            [19, {name: 'notused', desc: 'Not Used'}]
        ]);
        this.valueMaps.virtualCircuits = new byteValueMap([
            [128, {name: 'solar', desc: 'Solar'}],
            [129, {name: 'heater', desc: 'Either Heater'}],
            [130, {name: 'poolHeater', desc: 'Pool Heater'}],
            [131, {name: 'spaHeater', desc: 'Spa Heater'}],
            [132, {name: 'freeze', desc: 'Freeze'}],
            [133, {name: 'heatBoost', desc: 'Heat Boost'}],
            [134, {name: 'heatEnable', desc: 'Heat Enable'}],
            [135, {name: 'pumpSpeedUp', desc: 'Pump Speed +'}],
            [136, {name: 'pumpSpeedDown', desc: 'Pump Speed -'}],
            [255, {name: 'notused', desc: 'NOT USED'}]
        ]);
        this.valueMaps.pumpTypes = new byteValueMap([
            [0, {name: 'none', desc: 'No pump'}],
            [1, {name: 'vf', desc: 'Intelliflo VF'}],
            [2, {name: 'ds', desc: 'Two-Speed'}],
            [64, {name: 'vsf', desc: 'Intelliflo VSF'}],
            [128, {name: 'vs', desc: 'Intelliflo VS'}],
            [169, {name: 'vs+svrs', desc: 'IntelliFlo VS+SVRS'}]
        ]);
        this.valueMaps.lightThemes = new byteValueMap([
            [0, {name: 'white', desc: 'White'}],
            [2, {name: 'lightgreen', desc: 'Light Green'}],
            [4, {name: 'green', desc: 'Green'}],
            [6, {name: 'cyan', desc: 'Cyan'}],
            [8, {name: 'blue', desc: 'Blue'}],
            [10, {name: 'lavender', desc: 'Lavender'}],
            [12, {name: 'magenta', desc: 'Magenta'}],
            [14, {name: 'lightmagenta', desc: 'Light Magenta'}],
            [128, {name: 'colorsync', desc: 'Color Sync'}],
            [144, {name: 'colorswim', desc: 'Color Swim'}],
            [160, {name: 'colorset', desc: 'Color Set'}],
            [177, {name: 'party', desc: 'Party'}],
            [178, {name: 'romance', desc: 'Romance'}],
            [179, {name: 'caribbean', desc: 'Caribbean'}],
            [180, {name: 'american', desc: 'American'}],
            [181, {name: 'sunset', desc: 'Sunset'}],
            [182, {name: 'royal', desc: 'Royal'}],
            [190, {name: 'save', desc: 'Save'}],
            [191, {name: 'recall', desc: 'Recall'}],
            [193, {name: 'blue', desc: 'Blue'}],
            [194, {name: 'green', desc: 'Green'}],
            [195, {name: 'red', desc: 'Red'}],
            [196, {name: 'white', desc: 'White'}],
            [197, {name: 'magenta', desc: 'Magenta'}],
            [208, {name: 'thumper', desc: 'Thumper'}],
            [209, {name: 'hold', desc: 'Hold'}],
            [210, {name: 'reset', desc: 'Reset'}],
            [211, {name: 'mode', desc: 'Mode'}],
            [254, {name: 'unknown', desc: 'unknown'}],
            [255, {name: 'none', desc: 'None'}]
        ]);
        this.valueMaps.lightColors = new byteValueMap([
            [0, {name: 'white', desc: 'White'}],
            [2, {name: 'lightgreen', desc: 'Light Green'}],
            [4, {name: 'green', desc: 'Green'}],
            [6, {name: 'cyan', desc: 'Cyan'}],
            [8, {name: 'blue', desc: 'Blue'}],
            [10, {name: 'lavender', desc: 'Lavender'}],
            [12, {name: 'magenta', desc: 'Magenta'}],
            [14, {name: 'lightmagenta', desc: 'Light Magenta'}]
        ]);
        this.valueMaps.heatModes = new byteValueMap([
            [0, {name: 'off', desc: 'Off'}],
            [1, {name: 'heater', desc: 'Heater'}],
            [2, {name: 'solarpref', desc: 'Solar Preferred'}],
            [3, {name: 'solar', desc: 'Solar Only'}]
        ]);
        this.valueMaps.heaterTypes = new byteValueMap([
            [0, {name: 'none', desc: 'No Heater'}],
            [1, {name: 'gas', desc: 'Gas Heater'}],
            [2, {name: 'solar', desc: 'Solar Heater'}],
            [3, {name: 'heatpump', desc: 'Heat Pump'}],
            [4, {name: 'ultratemp', desc: 'Ultratemp'}],
            [5, {name: 'hybrid', desc: 'hybrid'}]
        ]);
        this.valueMaps.scheduleDays = new byteValueMap([
            [1, {name: 'sun', desc: 'Sunday', dow: 1}],
            [2, {name: 'mon', desc: 'Monday', dow: 2}],
            [4, {name: 'tue', desc: 'Tuesday', dow: 4}],
            [8, {name: 'wed', desc: 'Wednesday', dow: 8}],
            [16, {name: 'thu', desc: 'Thursday', dow: 16}],
            [32, {name: 'fri', desc: 'Friday', dow: 32}],
            [64, {name: 'sat', desc: 'Saturday', dow: 64}]
        ]);
        this.valueMaps.scheduleTypes = new byteValueMap([
            [0, {name: 'repeat', desc: 'Repeats'}],
            [128, {name: 'runonce', desc: 'Run Once'}]
        ]);
        // RG - is this used in schedules?  It doesn't return correct results with scheduleDays.toArray()
        this.valueMaps.scheduleDays.transform = function(byte) {
            let days = [];
            let b = byte & 0x007F;
            for (let bit = 7; bit >= 0; bit--) {
                if ((byte & 1 << (bit - 1)) > 0) days.push(extend(true, {}, this.get((byte & 1 << (bit - 1)))));
            }
            return {val: b, days: days};
        };
        this.valueMaps.lightThemes.transform = function(byte) {return extend(true, {val: byte}, this.get(byte) || this.get(255));};
    }
    public bodies: TouchBodyCommands=new TouchBodyCommands(this);
    public system: TouchSystemCommands=new TouchSystemCommands(this);
    public circuits: TouchCircuitCommands=new TouchCircuitCommands(this);
    public features: TouchFeatureCommands=new TouchFeatureCommands(this);
    public chemistry: TouchChemistryCommands=new TouchChemistryCommands(this);
    public pumps: TouchPumpCommands=new TouchPumpCommands(this);
    public heaters: TouchHeaterCommands=new TouchHeaterCommands(this);
    public schedules: TouchScheduleCommands = new TouchScheduleCommands(this);
    protected _configQueue: TouchConfigQueue=new TouchConfigQueue();

    public requestConfiguration(ver?: ConfigVersion) {
        if (typeof ver !== 'undefined') {
            if (sys.configVersion.equipment !== ver.equipment) {
                sys.configVersion.equipment = ver.equipment;
                this._configQueue.queueChanges();
            }
        }
        else {
            this._configQueue.queueChanges();
        }
    }
    public checkConfiguration() {
        // app updates lastUpdated upon startup -- how to get it to request config since this will be <5 mins.
        if (typeof sys.configVersion.equipment === 'undefined' || (new Date().valueOf() - sys.configVersion.lastUpdated.valueOf()) / 1000 / 60 > 5) {
            this.requestConfiguration();
        }
    }
    public stopAsync() {this._configQueue.close();}
}
export class TouchConfigRequest extends ConfigRequest {
    constructor(setcat: number, items?: number[], oncomplete?: Function) {
        super();
        this.setcategory = setcat;
        setcat === GetTouchConfigCategories.version ?
            this.category = TouchConfigCategories.version :
            this.category = setcat & 63;
        if (typeof items !== 'undefined') this.items.push(...items);
        this.oncomplete = oncomplete;
    }
    public category: TouchConfigCategories;
    public setcategory: GetTouchConfigCategories;
}
export class TouchConfigQueue extends ConfigQueue {
    protected _configQueueTimer: NodeJS.Timeout;
    protected queueRange(cat: number, start: number, end: number) {
        let req = new TouchConfigRequest(cat, []);
        req.fillRange(start, end);
        this.push(req);
    }
    protected queueItems(cat: number, items?: number[]) {this.push(new TouchConfigRequest(cat, items));}
    public queueChanges() {
        this.reset();
        if (conn.mockPort) {
            logger.info(`Skipping Controller Init because MockPort enabled.`);
        } else {
            logger.info(`Requesting ${sys.controllerType} configuration`);
            this.queueItems(GetTouchConfigCategories.dateTime, [0]);
            this.queueItems(GetTouchConfigCategories.heatTemperature, [0]);
            this.queueItems(GetTouchConfigCategories.solarHeatPump, [0]);
            this.queueRange(GetTouchConfigCategories.customNames, 0, sys.equipment.maxCustomNames - 1);
            this.queueRange(GetTouchConfigCategories.circuits, 1, sys.board.equipmentIds.features.end);
            this.queueRange(GetTouchConfigCategories.schedules, 1, sys.equipment.maxSchedules);
            this.queueItems(GetTouchConfigCategories.delays, [0]);
            this.queueItems(GetTouchConfigCategories.settings, [0]);
            this.queueItems(GetTouchConfigCategories.intellifloSpaSideRemotes, [0]);
            this.queueItems(GetTouchConfigCategories.is4is10, [0]);
            this.queueItems(GetTouchConfigCategories.spaSideRemote, [0]);
            this.queueItems(GetTouchConfigCategories.valves, [0]);
            this.queueItems(GetTouchConfigCategories.lightGroupPositions);
            this.queueItems(GetTouchConfigCategories.highSpeedCircuits, [0]);
            this.queueRange(GetTouchConfigCategories.pumpConfig, 1, sys.equipment.maxPumps);
            // todo: add chlor or other commands not asked for by screenlogic if there is no remote/indoor panel present
        }
        if (this.remainingItems > 0) {
            var self = this;
            setTimeout(() => {self.processNext();}, 50);
        } else state.status = 1;
        state.emitControllerChange();
    }
    // TODO: RKS -- Investigate why this is needed.  Me thinks that there really is no difference once the whole thing is optimized.  With a little
    // bit of work I'll bet we can eliminate these extension objects altogether.
    public processNext(msg?: Outbound) {
        if (this.closed) return;
        let self = this;
        if (typeof msg !== "undefined" && msg !== null)
            if (!msg.failed) {
                // Remove all references to future items. We got it so we don't need it again.
                this.removeItem(msg.action, msg.payload[0]);
                if (this.curr && this.curr.isComplete) {
                    if (!this.curr.failed) {
                        // Call the identified callback.  This may add additional items.
                        if (typeof this.curr.oncomplete === 'function') {
                            this.curr.oncomplete(this.curr);
                            this.curr.oncomplete = undefined;
                        }
                    }
                }

            } else this.curr.failed = true;
        if (!this.curr && this.queue.length > 0) this.curr = this.queue.shift();
        if (!this.curr) {
            // There never was anything for us to do. We will likely never get here.
            state.status = 1;
            state.emitControllerChange();
            return;
        } else {
            state.status = sys.board.valueMaps.controllerStatus.transform(2, this.percent);
        }
        // Shift to the next config queue item.
        logger.silly(
            `Config Queue Completed... ${this.percent}% (${this.remainingItems} remaining)`
        );
        while (
            this.queue.length > 0 && this.curr.isComplete
        ) {
            this.curr = this.queue.shift() || null;
        }
        let itm = 0;
        if (this.curr && !this.curr.isComplete) {
            itm = this.curr.items.shift();
            const out: Outbound = new Outbound(
                Protocol.Broadcast,
                Message.pluginAddress,
                16,
                this.curr.setcategory,
                [itm],
                3,
                new Response(
                    16,
                    15,
                    this.curr.category,
                    [itm],
                    undefined,
                    function(msgOut) {self.processNext(msgOut);})
            );
            setTimeout(() => conn.queueSendMessage(out), 50);
        } else {
            // Now that we are done check the configuration a final time.  If we have anything outstanding
            // it will get picked up.
            state.status = 1;
            this.curr = null;
            sys.configVersion.lastUpdated = new Date();
            // set a timer for 15 mins; if we don't get the config request it again.  This most likely happens if there is no other indoor/outdoor remotes or ScreenLogic.
            this._configQueueTimer = setTimeout(() => sys.board.checkConfiguration(), 15 * 60 * 1000);
            logger.info(`EasyTouch system config complete.`);
        }
        // Notify all the clients of our processing status.
        state.emitControllerChange();
    }
}
export class TouchScheduleCommands extends ScheduleCommands{
    public setSchedule(sched: Schedule | EggTimer, obj?: any){
        super.setSchedule(sched, obj);
        let msgs: Outbound[] = this.createSchedConfigMessages(sched);
        for (let i = 0; i <= msgs.length; i++) {
            conn.queueSendMessage(msgs[i]);
        }
    }

    public createSchedConfigMessages(sched: Schedule | EggTimer): Outbound[]{
        // delete sched 1
        // [ 255, 0, 255], [165, 33, 16, 33, 145, 7], [1, 0, 0, 0, 0, 0, 0], [1, 144]

        const setSchedConfig = Outbound.createMessage(145, [sched.id, 0, 0, 0, 0, 0, 0], 2, new Response(16, Message.pluginAddress, 1, [145]));
        if (sched.circuit === 0){
            // delete - take defaults
        }
        else {
            if (sched instanceof EggTimer){
                setSchedConfig.payload[1] = sched.circuit;
                setSchedConfig.payload[2] = 25;
                setSchedConfig.payload[4] = Math.floor(sched.runTime);
                setSchedConfig.payload[5] = sched.runTime - (setSchedConfig.payload[4] * 60);
            } 
            else if (sched instanceof Schedule){
                setSchedConfig.payload[1] = sched.circuit;
                setSchedConfig.payload[2] = Math.floor(sched.startTime / 60);
                setSchedConfig.payload[3] = sched.startTime - (setSchedConfig.payload[2] * 60);
                setSchedConfig.payload[4] = Math.floor(sched.endTime / 60);
                setSchedConfig.payload[5] = sched.endTime - (setSchedConfig.payload[4] * 60);
                setSchedConfig.payload[6] = sched.scheduleDays;
                if (sched.runOnce) setSchedConfig.payload[6] = setSchedConfig.payload[6] | 0x80; 
            }
        }
        const schedConfigRequest = Outbound.createMessage(209, [sched.id], 2, new Response(16, Message.pluginAddress, 17, [sched.id]));
        
        return [setSchedConfig, schedConfigRequest];
    }
}
// todo: this can be implemented as a bytevaluemap
export enum TouchConfigCategories {
    dateTime=5,
    heatTemperature=8,
    customNames=10,
    circuits=11,
    schedules=17,
    spaSideRemote=22,
    pumpStatus=23,
    pumpConfig=24,
    intellichlor=25,
    valves=29,
    highSpeedCircuits=30,
    is4is10=32,
    solarHeatPump=34,
    delays=35,
    lightGroupPositions=39,
    circuitGroups=41,
    settings=40,
    version=252
}
export enum GetTouchConfigCategories {
    dateTime=197,
    heatTemperature=200,
    customNames=202,
    circuits=203,
    schedules=209,
    spaSideRemote=214,
    pumpStatus=215,
    pumpConfig=216,
    intellichlor=217,
    valves=221,
    highSpeedCircuits=222,
    is4is10=224,
    intellifloSpaSideRemotes=225,
    solarHeatPump=226,
    delays=227,
    lightGroupPositions=231,
    settings=232,
    circuitGroups=233,
    version=253
}
class TouchSystemCommands extends SystemCommands {
    public cancelDelay() {
        let out = Outbound.createMessage(131, [0], 3, new Response(Message.pluginAddress, 16, 1, [131], null, function(msg) {
            if (!msg.failed) {
                // todo: track delay status?
                state.delay = 0;
            }
        }));
        conn.queueSendMessage(out);
    }
    public setDateTime(obj: any){
        let {hour = state.time.hours, 
            min = state.time.minutes, 
            date = state.time.date, 
            month = state.time.month, 
            year = state.time.year, 
            dst = sys.general.options.adjustDST ? 1 : 0, 
            dow = state.time.dayOfWeek } = obj;
        // dow= day of week as expressed as [0=Sunday, 1=Monday, 2=Tuesday, 4=Wednesday, 8=Thursday, 16=Friday, 32=Saturday] and DST = 0(manually adjst for DST) or 1(automatically adjust DST)
        // [165,33,16,34,133,8],[13,10,16,29,8,19,0,0],[1,228]
        // [165,33,16,33,133,6],[1,30,16,1,2,2019,9,151
        // [165,33,34,16,1,1],[133],[1,127]
        const out = new Outbound(
            Protocol.Broadcast,
            Message.pluginAddress,
            16,
            133,
            [hour, min, dow, date, month, year, 0, dst],
            3,
            new Response(16, Message.pluginAddress, 1, [133], null, function(msg) {
                if (!msg.failed) {
                    state.time.hours = hour;
                    state.time.minutes = min;
                    state.time.date = date;
                    state.time.year = year;
                    sys.general.options.adjustDST = dst === 1 ? true : false;
                    state.emitControllerChange();
                }
            })
        );
        conn.queueSendMessage(out);
    }

}
class TouchBodyCommands extends BodyCommands {
    public setHeatMode(body: Body, mode: number) {
        //  [16,34,136,4],[POOL HEAT Temp,SPA HEAT Temp,Heat Mode,0,2,56]
        // The mapping below is no longer required.
        //switch (mode) {
        //    case 3:
        //        mode = 1;
        //        break;
        //    case 21:
        //        mode = 2;
        //        break;
        //    case 5:
        //        mode = 3;
        //        break;
        //    case 0:
        //        break;
        //}
        const body1 = sys.bodies.getItemById(1);
        const body2 = sys.bodies.getItemById(2);
        const temp1 = body1.setPoint || 100;
        const temp2 = body2.setPoint || 100;
        let mode1 = body1.heatMode;
        let mode2 = body2.heatMode;
        body.id === 1 ? mode1 = mode : mode2 = mode;
        let out = new Outbound(
            Protocol.Broadcast,
            Message.pluginAddress,
            16,
            136,
            [temp1, temp2, mode2 << 2 | mode1, 0],
            3,
            new Response(16, Message.pluginAddress, 1, [136], null, function(msg) {
                if (!msg.failed) {
                    body.heatMode = mode;
                    state.temps.bodies.getItemById(body.id).heatMode = mode;
                    state.temps.emitEquipmentChange();
                }
            })
        );
        conn.queueSendMessage(out);
    }
    public setHeatSetpoint(body: Body, setPoint: number) {
        const self = this;
        // [16,34,136,4],[POOL HEAT Temp,SPA HEAT Temp,Heat Mode,0,2,56]
        // 165,33,16,34,136,4,89,99,7,0,2,71  Request
        // 165,33,34,16,1,1,136,1,130  Controller Response
        const tempUnits = state.temps.units;
        switch (tempUnits) {
            case 0: // fahrenheit
                if (setPoint < 40 || setPoint > 104) {
                    logger.warn(`Setpoint of ${setPoint} is outside acceptable range.`);
                    return;
                }
                break;
            case 1: // celcius
                if (setPoint < 4 || setPoint > 40) {
                    logger.warn(
                        `Setpoint of ${setPoint} is outside of acceptable range.`
                    );
                    return;
                }
                break;
        }
        const body1 = sys.bodies.getItemById(1);
        const body2 = sys.bodies.getItemById(2);
        let temp1 = body1.setPoint || 100;
        let temp2 = body2.setPoint || 100;
        body.id === 1 ? temp1 = setPoint : temp2 = setPoint;
        const mode1 = body1.heatMode;
        const mode2 = body2.heatMode;
        const out = new Outbound(
            Protocol.Broadcast,
            Message.pluginAddress,
            16,
            136,
            [temp1, temp2, mode2 << 2 | mode1, 0],
            3,
            new Response(16, Message.pluginAddress, 1, [136], null, function(msg) {
                if (!msg.failed) {
                    body.setPoint = setPoint;
                    state.temps.bodies.getItemById(body.id).setPoint = setPoint;
                    state.temps.emitEquipmentChange();
                }
            })
        );
        conn.queueSendMessage(out);
    }
}
class TouchCircuitCommands extends CircuitCommands {
    public getLightThemes(type: number): any[] {
        switch (type) {
            case 16: // Intellibrite
            case 8: // Magicstream
                return sys.board.valueMaps.lightThemes.toArray();
            default:
                return [];
        }
    }
    public setCircuitState(id: number, val: boolean) {
        let cstate = state.circuits.getInterfaceById(id);
        let out = Outbound.createMessage(134, [id, val ? 1 : 0], 3, new Response(Message.pluginAddress, 16, 1, [134], null, function(msg) {
            if (!msg.failed) {
                cstate.isOn = true;
                state.emitEquipmentChanges();
            }
        }));
        conn.queueSendMessage(out);
    }
    public toggleCircuitState(id: number) {
        let cstate = state.circuits.getInterfaceById(id);
        this.setCircuitState(id, !cstate.isOn);
    }
    public setLightTheme(id: number, theme: number) {
        // Re-route this as we cannot set individual circuit themes in *Touch.
        this.setIntelliBriteTheme(theme);
    }
    public setIntelliBriteTheme(theme: number) {
        let out = Outbound.createMessage(96, [theme, 0], 3, new Response(Message.pluginAddress, 16, 1, [96], null, function(msg) {
            if (!msg.failed) {
                state.intellibrite.lightingTheme = sys.intellibrite.lightingTheme = theme;
                for (let i = 0; i < sys.intellibrite.circuits.length; i++) {
                    let c = sys.intellibrite.circuits.getItemByIndex(i);
                    let cstate = state.circuits.getItemById(c.circuit);
                    let circuit = sys.circuits.getInterfaceById(c.circuit);
                    cstate.lightingTheme = circuit.lightingTheme = theme;
                }
                state.emitEquipmentChanges();
            }
        }));
        // Turn on the circuit if it is not on.
        for (let i = 0; i < sys.intellibrite.circuits.length; i++) {
            let c = sys.intellibrite.circuits.getItemByIndex(i);
            let cstate = state.circuits.getItemById(c.circuit);
            if (!cstate.isOn) sys.board.circuits.setCircuitState(c.circuit, true);
        }
        // Let everyone know we turned these on.  The theme messages will come later.
        state.emitEquipmentChanges();
    }
}
class TouchFeatureCommands extends FeatureCommands {
    // todo: remove this in favor of setCircuitState only?
    public setFeatureState(id: number, val: boolean) {
        // Route this to the circuit state since this is the same call
        // and the interface takes care of it all.
        this.board.circuits.setCircuitState(id, val);
    }
    public toggleFeatureState(id: number) {
        // Route this to the circuit state since this is the same call
        // and the interface takes care of it all.
        this.board.circuits.toggleCircuitState(id);
    }
}
class TouchChemistryCommands extends ChemistryCommands {
    public setChlor(cstate: ChlorinatorState, poolSetpoint: number = cstate.poolSetpoint, spaSetpoint: number = cstate.spaSetpoint, superChlorHours: number = cstate.superChlorHours, superChlor: boolean = cstate.superChlor) {
        // There is only one message here so setChlor can handle every chlorinator function.  The other methods in the base object are just for ease of use.  They
        // all map here unless overridden.
        let out = new Outbound(Protocol.Broadcast, Message.pluginAddress, 16, 153, [(spaSetpoint << 1) + 1, poolSetpoint, superChlorHours > 0 ? superChlorHours + 128 : 0, 0, 0, 0, 0, 0, 0, 0], 3, new Response(16, Message.pluginAddress, 1, [153], null, function(msg) {
            if (!msg.failed) {
                let chlor = sys.chlorinators.getItemById(cstate.id);
                cstate.poolSetpoint = chlor.poolSetpoint = poolSetpoint;
                cstate.spaSetpoint = chlor.spaSetpoint = spaSetpoint;
                cstate.superChlorHours = chlor.superChlorHours = superChlorHours;
                cstate.superChlor = chlor.superChlor = superChlor;
                state.emitEquipmentChanges();
            }
        }));
        conn.queueSendMessage(out);
    }
}
class TouchPumpCommands extends PumpCommands {
    public setPump(pump: Pump, obj?: any) {
        super.setPump(pump, obj);
        let msgs: Outbound[] = this.createPumpConfigMessages(pump);
        for (let i = 0; i <= msgs.length; i++) {
            conn.queueSendMessage(msgs[i]);
        }
    }
    private createPumpConfigMessages(pump: Pump): Outbound[] {
        // [165,33,16,34,155,46],[1,128,0,2,0,16,12,6,7,1,9,4,11,11,3,128,8,0,2,18,2,3,128,8,196,184,232,152,188,238,232,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[9,75]
        const setPumpConfig = Outbound.createMessage(155, [pump.id, pump.type, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2, new Response(16, Message.pluginAddress, 1, [155]));
        if (pump.type === 128) {
            // vs
            setPumpConfig.payload[2] = pump.primingTime || 0;
            setPumpConfig.payload[21] = Math.floor(pump.primingSpeed / 256) || 3;
            setPumpConfig.payload[30] =
                pump.primingSpeed - Math.floor(pump.primingSpeed / 256) * 256 || 232;
            for (let i = 1; i <= 8; i++) {
                let circ = pump.circuits.getItemById(i);
                setPumpConfig.payload[i * 2 + 3] = circ.circuit || 0;
                setPumpConfig.payload[i * 2 + 4] = Math.floor(circ.speed / 256) || 3;
                setPumpConfig.payload[i + 21] =
                    (circ.speed - (setPumpConfig.payload[i * 2 + 4] * 256)) || 232;
            }
        }
        else if (pump.type === 64)
            // vsf
            for (let i = 1; i <= 8; i++) {
                let circ = pump.circuits.getItemById(i);
                setPumpConfig.payload[i * 2 + 3] = circ.circuit || 0;
                if (circ.units === 0)
                    // gpm
                    setPumpConfig.payload[i * 2 + 4] = circ.flow || 30;
                else {
                    // rpm
                    setPumpConfig.payload[4] =
                        setPumpConfig.payload[4] << i - 1; // set rpm/gpm flag
                    setPumpConfig.payload[i * 2 + 4] = Math.floor(circ.speed / 256) || 3;
                    setPumpConfig.payload[i + 21] =
                    circ.speed - ((setPumpConfig.payload[i * 2 + 4] * 256)) || 232;
                }
            }
        else if (pump.type >= 1 && pump.type < 64) {
            // vf
            setPumpConfig.payload[1] = pump.backgroundCircuit || 6;
            setPumpConfig.payload[3] = pump.turnovers || 2;
            const body = sys.bodies.getItemById(1, sys.equipment.maxBodies >= 1);
            setPumpConfig.payload[2] = body.capacity / 1000 || 15;
            setPumpConfig.payload[21] = pump.manualFilterGPM || 30;
            setPumpConfig.payload[22] = pump.primingSpeed || 55;
            setPumpConfig.payload[23] =
                pump.primingTime | pump.maxSystemTime << 4 || 5;
            setPumpConfig.payload[24] = pump.maxPressureIncrease || 10;
            setPumpConfig.payload[25] = pump.backwashFlow || 60;
            setPumpConfig.payload[26] = pump.backwashTime || 5;
            setPumpConfig.payload[27] = pump.rinseTime || 1;
            setPumpConfig.payload[28] = pump.vacuumFlow || 50;
            setPumpConfig.payload[30] = pump.vacuumTime || 10;
            for (let i = 1; i <= 8; i++) {
                let circ = pump.circuits.getItemById(i);
                setPumpConfig.payload[i * 2 + 3] = circ.circuit || 0;
                setPumpConfig.payload[i * 2 + 4] = circ.flow || 15;
            }
        }
        const pumpConfigRequest = Outbound.createMessage(216, [pump.id], 2, new Response(16, Message.pluginAddress, 24, [pump.id]));
        return [setPumpConfig, pumpConfigRequest];
    }
/*     public setType(pump: Pump, pumpType: number) {
        pump.type = pumpType;
        // pump.circuits.clear(); // reset circuits
        this.setPump(pump);
        let spump = state.pumps.getItemById(pump.id, true);
        spump.type = pump.type;
        spump.status = 0;
    } */
}
class TouchHeaterCommands extends HeaterCommands {
    public updateHeaterServices(heater: Heater) {
        if (heater.isActive || heater.type !== 1) {
            if (heater.type === 3) {
                this.board.valueMaps.heatModes = new byteValueMap([
                    [0, {name: 'off', desc: 'Off'}],
                    [1, {name: 'heater', desc: 'Heater'}],
                    [2, {name: 'heatpump', desc: 'Heat Pump Only'}],
                    [3, {name: 'heatpumppref', desc: 'Heat Pump Preferred'}]
                ]);
                this.board.valueMaps.heatSources = new byteValueMap([
                    [0, {name: 'off', desc: 'No Heater'}],
                    [3, {name: 'heater', desc: 'Heater'}],
                    [5, {name: 'heatpump', desc: 'Heat Pump Only'}],
                    [21, {name: 'heatpumppref', desc: 'Heat Pump Preferred'}],
                    [32, {name: 'nochange', desc: 'No Change'}]
                ]);
            }
            else if (heater.type === 2) {
                this.board.valueMaps.heatModes = new byteValueMap([
                    [0, {name: 'off', desc: 'Off'}],
                    [1, {name: 'heater', desc: 'Heater'}],
                    [2, {name: 'solar', desc: 'Solar Only'}],
                    [3, {name: 'solarpref', desc: 'Solar Preferred'}]
                ]);
                // todo = verify these; don't think they are correct.
                this.board.valueMaps.heatSources = new byteValueMap([
                    [0, {name: 'off', desc: 'No Heater'}],
                    [3, {name: 'heater', desc: 'Heater'}],
                    [5, {name: 'solar', desc: 'Solar Only'}],
                    [21, {name: 'solarpref', desc: 'Solar Preferred'}],
                    [32, {name: 'nochange', desc: 'No Change'}]
                ]);
            }
        }
        else {
            this.board.valueMaps.heatModes = new byteValueMap([
                [0, {name: 'off', desc: 'Off'}],
                [1, {name: 'heater', desc: 'Heater'}]
            ]);
            // todo = verify these; don't think they are correct.
            this.board.valueMaps.heatSources = new byteValueMap([
                [0, {name: 'off', desc: 'No Heater'}],
                [3, {name: 'heater', desc: 'Heater'}],
                [32, {name: 'nochange', desc: 'No Change'}]
            ]);
        }
    }
}
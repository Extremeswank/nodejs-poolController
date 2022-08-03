import { sys } from "../../../../controller/Equipment";
import { logger } from "../../../../logger/Logger";
import { ControllerType } from "../../../../controller/Constants";
import { Outbound, Protocol } from "../Messages";
import { mockPump } from "./status/MockPump";


export class MessagesMock {
  constructor() { }

  public process(outboundMsg: Outbound) {


    return this.generateInbound(outboundMsg);

  }

  private generateInbound(outboundMsg: Outbound): number[] {
    switch (outboundMsg.protocol) {
      /* case Protocol.Broadcast:
          outboundMsg.processBroadcast();
          break;
      case Protocol.IntelliValve:
          IntelliValveStateMessage.process(outboundMsg);
          break;
      case Protocol.IntelliChem:
          IntelliChemStateMessage.process(outboundMsg);
          break; */
      case Protocol.Pump:
          if ((outboundMsg.source >= 96 && outboundMsg.source <= 111) || (outboundMsg.dest >= 96 && outboundMsg.dest <= 111))
              return mockPump.convertOutbound(outboundMsg);
          // else
          //     outboundMsg.processBroadcast();
          break;
      /* case Protocol.Heater:
          HeaterStateMessage.process(outboundMsg);
          break;
      case Protocol.Chlorinator:
          ChlorinatorStateMessage.process(outboundMsg);
          break;
      case Protocol.Hayward:
          PumpStateMessage.processHayward(outboundMsg);
          break; */
      default:
          logger.debug(`Unprocessed Message ${outboundMsg.toPacket()}`)
          break;
  }
  }
}
export var messagesMock = new MessagesMock();
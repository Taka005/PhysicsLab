import { EngineBase } from "./EngineBase";
import { EngineOption } from "./types";

export class Engine extends EngineBase {
  public static readonly DEFAULT_ID_LENGTH: number  = 12;

  public isStarted: boolean = false;

  public isTrackingMode: boolean = false;

  public isDynamicTrackingMode: boolean = false;

  public playBackSpeed: number;

  public trackingInterval: number;

  public trackingLimit: number;

  public worldSize: number;

  private trackingCount: number = 0;

  constructor(option: EngineOption) {
    super(option);

    this.playBackSpeed = option.playBackSpeed ?? 1;
    this.trackingInterval = option.trackingInterval ?? 1000;
    this.trackingLimit = option.trackingLimit ?? 100;
    this.worldSize = option.worldSize ?? 1000;
  }
}